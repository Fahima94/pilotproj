/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { DocumentsManager } from './components/DocumentsManager';
import { RiskMatrixView } from './components/RiskMatrixView';
import { GanttMilestonesView } from './components/GanttMilestonesView';
import { RaciMatrixView } from './components/RaciMatrixView';
import { AgentChatView } from './components/AgentChatView';
import { ScienceSkillsView } from './components/ScienceSkillsView';
import { SlideDeckStudioView } from './components/SlideDeckStudioView';
import { MeetingRecorderModal } from './components/MeetingRecorderModal';
import { ArtifactModal } from './components/ArtifactModal';
import { UploadModal } from './components/UploadModal';
import { SamplePacksModal } from './components/SamplePacksModal';
import { ExportPdfModal } from './components/ExportPdfModal';
import { ProjectControlCenterView } from './components/ProjectControlCenterView';
import { SkillMarkdownBuilderView } from './components/SkillMarkdownBuilderView';
import { TicketsManagerView, DEFAULT_TICKETS, ProjectTicket } from './components/TicketsManagerView';
import { QaTestPlanView } from './components/QaTestPlanView';
import { EvolutiveSpecificationsView } from './components/EvolutiveSpecificationsView';
import { HorizonsDataVisualizerView } from './components/HorizonsDataVisualizerView';
import { SAMPLE_PROJECT_PACKS, SampleProjectPack } from './data/sampleProjects';
import { ProjectDocument, ProjectAudit, RiskItem, ChatMessage } from './types/project';

// Firebase imports
import { 
  auth, 
  googleProvider, 
  signInWithPopup, 
  signOut, 
  db, 
  handleFirestoreError, 
  OperationType 
} from './firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, setDoc, getDoc, collection, getDocs } from 'firebase/firestore';

const INITIAL_PACK = SAMPLE_PROJECT_PACKS.find((p) => p.id === 'pack-digital-ia') || SAMPLE_PROJECT_PACKS[0];

export default function App() {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [isSavingFirestore, setIsSavingFirestore] = useState<boolean>(false);

  const [currentPackId, setCurrentPackId] = useState<string>(INITIAL_PACK.id);
  const [documents, setDocuments] = useState<ProjectDocument[]>(INITIAL_PACK.documents);
  const [audit, setAudit] = useState<ProjectAudit>(INITIAL_PACK.prebuiltAudit);
  const [tickets, setTickets] = useState<ProjectTicket[]>(DEFAULT_TICKETS);
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Multi-Turn Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      role: 'assistant',
      content: `👋 **Bonjour ! Je suis votre Agent Skill Chef de Projet & Product Owner.**

Ce workspace est configuré pour piloter l'ensemble de **votre prochain projet d'entreprise** :
- **Dossier actif :** "${INITIAL_PACK.prebuiltAudit.projectTitle}"
- **Météo actuelle :** 🟢 ${INITIAL_PACK.prebuiltAudit.projectStatus} (${INITIAL_PACK.prebuiltAudit.statusJustification})
- **Rôles spécialisés :** Chef de Projet PMP / Senior, Directeur Technique & Architecte, Product Owner & Delivery Lead, Directeur R&D Scientifique.
- **Fonctionnalités prêtes à l'emploi :** Diagnostic et audit documentaire, Tour de Contrôle 360° (Sécu, RGPD, Finance, Comm, Data), Rédacteur de SKILL.md, Gestion au Ticket (INVEST), Matrice des Risques 5x5, Planning & Jalons, Gouvernance RACI, et **Export PDF complet** téléchargeable pour vos parties prenantes et votre COPIL.

Importez vos documents (cahier des charges, comptes rendus, spécifications, transcriptions) pour personnaliser l'analyse en temps réel. Que souhaitez-vous analyser ?`,
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  // Loading states
  const [isAuditing, setIsAuditing] = useState<boolean>(false);
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);
  const [isAiRiskGenerating, setIsAiRiskGenerating] = useState<boolean>(false);

  // Modals
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [showSampleModal, setShowSampleModal] = useState<boolean>(false);
  const [showMeetingRecorderModal, setShowMeetingRecorderModal] = useState<boolean>(false);
  const [showExportPdfModal, setShowExportPdfModal] = useState<boolean>(false);
  const [activeArtifactType, setActiveArtifactType] = useState<
    'charter' | 'raci' | 'risks' | 'flash_report' | 'agile_backlog' | 'wbs' | null
  >(null);

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        // Save user profile to Firestore
        try {
          const userRef = doc(db, 'users', user.uid);
          await setDoc(userRef, {
            uid: user.uid,
            email: user.email || '',
            displayName: user.displayName || '',
            photoURL: user.photoURL || '',
            createdAt: new Date().toISOString(),
          }, { merge: true });
        } catch (err) {
          handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}`);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error('Erreur connexion Google Auth:', err);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Erreur déconnexion:', err);
    }
  };

  // Sync to Firestore when user changes or audit updates
  const syncProjectToFirestore = async (projectData: ProjectAudit, docs: ProjectDocument[]) => {
    if (!currentUser) return;
    setIsSavingFirestore(true);
    try {
      const projectId = currentPackId;
      const projRef = doc(db, 'projects', projectId);
      await setDoc(projRef, {
        id: projectId,
        userId: currentUser.uid,
        title: projectData.projectTitle,
        executiveSummary: projectData.executiveSummary || '',
        projectStatus: projectData.projectStatus,
        statusJustification: projectData.statusJustification || '',
        estimatedDuration: projectData.estimatedDuration || '',
        updatedAt: new Date().toISOString(),
      }, { merge: true });

      // Save documents in subcollection
      for (const d of docs.slice(0, 5)) {
        const docRef = doc(db, 'projects', projectId, 'documents', d.id);
        await setDoc(docRef, {
          id: d.id,
          projectId,
          userId: currentUser.uid,
          name: d.name,
          type: d.type,
          fileFormat: d.fileFormat,
          size: d.size,
          content: d.content.slice(0, 45000),
          createdAt: d.dateAdded,
        }, { merge: true });
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `projects/${currentPackId}`);
    } finally {
      setIsSavingFirestore(false);
    }
  };

  const activeDocuments = documents.filter((d) => d.active);

  const getCombinedDocumentText = () => {
    return activeDocuments
      .map(
        (doc, i) =>
          `### FICHIER ${i + 1}: ${doc.name} (${doc.fileFormat})\n${doc.content}`
      )
      .join('\n\n---\n\n');
  };

  // Switch project pack
  const handleSelectPack = (pack: SampleProjectPack) => {
    setCurrentPackId(pack.id);
    setDocuments(pack.documents);
    setAudit(pack.prebuiltAudit);
    setMessages([
      {
        id: `msg-pack-${Date.now()}`,
        role: 'assistant',
        content: `📁 **Nouveau dossier chargé : "${pack.name}"**\n\nJ'ai actualisé le contexte avec les ${pack.documents.length} documents de ce projet. La météo globale est estimée à **${pack.prebuiltAudit.projectStatus}**. Que souhaitez-vous analyser ?`,
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      },
    ]);

    if (currentUser) {
      syncProjectToFirestore(pack.prebuiltAudit, pack.documents);
    }
  };

  // Start fresh blank project for real enterprise use
  const handleStartBlankProject = () => {
    const blankId = `proj-${Date.now()}`;
    setCurrentPackId(blankId);
    setDocuments([]);
    const blankAudit: ProjectAudit = {
      projectTitle: 'Mon Nouveau Projet Entreprise',
      executiveSummary: 'Espace de pilotage vierge prêt pour votre initiative d’entreprise. Importez vos documents de cadrage, spécifications techniques, comptes rendus et notes pour générer automatiquement l’audit et les livrables.',
      projectStatus: 'VERT',
      statusJustification: 'Projet nouvellement initialisé, en attente de vos documents réels.',
      estimatedDuration: 'À définir',
      keyObjectives: [
        'Définir les objectifs SMART et le cadrage du projet',
        'Cartographier les parties prenantes et la gouvernance RACI',
        'Sécuriser l’architecture et établir le découpage au ticket INVEST'
      ],
      scope: {
        inScope: ['Cadrage des besoins', 'Découpage du backlog en tickets'],
        outOfScope: []
      },
      topRisks: [],
      criticalMilestones: [],
      recommendations: ['Importez votre premier document ou note de cadrage pour activer l’analyse IA.'],
      missingInformation: ['Documents de cadrage initiaux']
    };
    setAudit(blankAudit);
    setActiveTab('documents');
    setMessages([
      {
        id: `msg-blank-${Date.now()}`,
        role: 'assistant',
        content: `🚀 **Espace projet vierge initialisé !**\n\nCet espace est 100% prêt pour **votre prochain projet professionnel**.\n\n👉 **Étape 1 :** Cliquez sur **Ajouter un document** (glisser-déposer de fichier ou copier-coller de texte) pour alimenter le dossier.\n👉 **Étape 2 :** Lancez l'audit pour obtenir la météo, la matrice des risques 5x5, les tickets INVEST et les spécifications SKILL.md.`,
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      }
    ]);
    if (currentUser) {
      syncProjectToFirestore(blankAudit, []);
    }
  };

  // Toggle active document for context
  const handleToggleActiveDoc = (id: string) => {
    setDocuments((prev) =>
      prev.map((d) => (d.id === id ? { ...d, active: !d.active } : d))
    );
  };

  // Delete document
  const handleDeleteDoc = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  // Add document
  const handleAddDocument = (newDoc: ProjectDocument) => {
    const updated = [newDoc, ...documents];
    setDocuments(updated);
    if (currentUser) {
      syncProjectToFirestore(audit, updated);
    }
  };

  // Update existing document
  const handleUpdateDocument = (updatedDoc: ProjectDocument) => {
    const updated = documents.map((d) => (d.id === updatedDoc.id ? updatedDoc : d));
    setDocuments(updated);
    if (currentUser) {
      syncProjectToFirestore(audit, updated);
    }
  };

  // Run full Deep Audit via Gemini
  const handleRunAudit = async () => {
    if (activeDocuments.length === 0) return;
    setIsAuditing(true);
    try {
      const res = await fetch('/api/pm/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documents: activeDocuments }),
      });
      const data = await res.json();
      if (data && data.projectTitle) {
        setAudit(data);
        setActiveTab('dashboard');

        if (currentUser) {
          syncProjectToFirestore(data, documents);
        }

        setMessages((prev) => [
          ...prev,
          {
            id: `msg-audit-${Date.now()}`,
            role: 'assistant',
            content: `🔍 **Audit documentaire finalisé avec succès !**\n\n- Titre : **${data.projectTitle}**\n- Météo projet : **${data.projectStatus}**\n- Risques critiques : **${data.topRisks?.length || 0}**\n- Jalons clés : **${data.criticalMilestones?.length || 0}**\n\nLe tableau de bord, la météo et les matrices ont été actualisés.`,
            timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
            skillBadge: 'Audit & Diagnostic',
          },
        ]);
      }
    } catch (err) {
      console.error('Erreur audit:', err);
    } finally {
      setIsAuditing(false);
    }
  };

  // Send message to Gemini Chatbot with Roles and Search Grounding
  const handleSendMessage = async (
    content: string, 
    options?: { skillBadge?: string; roleType?: string; model?: string; searchGrounding?: boolean }
  ) => {
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      skillBadge: options?.skillBadge,
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setIsChatLoading(true);

    try {
      const res = await fetch('/api/pm/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          documentContext: getCombinedDocumentText(),
          roleType: options?.roleType || 'pmp',
          model: options?.model || 'gemini-3.8-flash',
          enableSearchGrounding: options?.searchGrounding || false,
        }),
      });
      const data = await res.json();
      const reply = data.reply || "Désolé, aucune réponse n'a été renvoyée.";

      const botMsg: any = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: reply,
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        skillBadge: options?.skillBadge,
        searchGrounding: data.searchGrounding,
        modelUsed: data.modelUsed,
      };

      setMessages((prev) => [...prev, botMsg]);

      // Save message to Firestore if authenticated
      if (currentUser) {
        try {
          const msgRef = doc(db, 'projects', currentPackId, 'messages', botMsg.id);
          await setDoc(msgRef, {
            id: botMsg.id,
            projectId: currentPackId,
            userId: currentUser.uid,
            role: 'assistant',
            content: reply.slice(0, 24000),
            roleType: options?.roleType || 'pmp',
            timestamp: botMsg.timestamp,
          });
        } catch (fErr) {
          console.warn('Sauvegarde message Firestore optionnelle:', fErr);
        }
      }
    } catch (err: any) {
      console.error('Erreur chat:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-err-${Date.now()}`,
          role: 'assistant',
          content: "⚠️ Erreur lors de la communication avec le Chatbot Gemini.",
          timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Ask agent from other views
  const handleAskAgent = (prompt: string, skill: string = 'Chef de Projet') => {
    setActiveTab('chat');
    handleSendMessage(prompt, { skillBadge: skill });
  };

  // Add manual risk
  const handleAddRisk = (risk: RiskItem) => {
    setAudit((prev) => {
      const updated = {
        ...prev,
        topRisks: [risk, ...prev.topRisks],
      };
      if (currentUser) {
        syncProjectToFirestore(updated, documents);
      }
      return updated;
    });
  };

  // Request AI risks reevaluation
  const handleRequestAiRisks = async () => {
    setIsAiRiskGenerating(true);
    setActiveTab('chat');
    handleSendMessage(
      "Effectue une réévaluation complète des risques de ce projet à partir de l'ensemble des documents actifs. Liste les 5 risques les plus critiques avec leur scoring (P 1-5 x I 1-5), déclencheur et plan de contingence.",
      { skillBadge: 'Matrice des Risques 5x5' }
    );
    setIsAiRiskGenerating(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        documentCount={documents.length}
        activeDocCount={activeDocuments.length}
        audit={audit}
        onOpenUpload={() => setShowUploadModal(true)}
        onRunAudit={handleRunAudit}
        isAuditing={isAuditing}
        onOpenSampleModal={() => setShowSampleModal(true)}
        onOpenMeetingRecorder={() => setShowMeetingRecorderModal(true)}
        currentUser={currentUser}
        onLogin={handleLogin}
        onLogout={handleLogout}
        isLoggingIn={isLoggingIn}
        isSavingFirestore={isSavingFirestore}
        onOpenExportPdf={() => setShowExportPdfModal(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <DashboardView
            audit={audit}
            documents={documents}
            onNavigateTab={setActiveTab}
            onOpenArtifact={(type) => setActiveArtifactType(type)}
            onAskAgent={handleAskAgent}
            onOpenExportPdf={() => setShowExportPdfModal(true)}
          />
        )}

        {activeTab === 'control' && (
          <ProjectControlCenterView
            audit={audit}
            documents={documents}
            onOpenExportPdf={() => setShowExportPdfModal(true)}
            onNavigateTab={setActiveTab}
            onAskAgent={handleAskAgent}
            onSaveToDocuments={handleAddDocument}
          />
        )}

        {activeTab === 'qa' && (
          <QaTestPlanView
            audit={audit}
            onAskAgent={handleAskAgent}
          />
        )}

        {activeTab === 'specs' && (
          <EvolutiveSpecificationsView
            audit={audit}
            documents={documents}
            onSaveToDocuments={handleAddDocument}
            onAskAgent={handleAskAgent}
          />
        )}

        {activeTab === 'analytics' && (
          <HorizonsDataVisualizerView
            audit={audit}
            tickets={tickets}
            onNavigateTab={setActiveTab}
            onAskAgent={handleAskAgent}
          />
        )}

        {activeTab === 'skills' && (
          <SkillMarkdownBuilderView
            audit={audit}
            documents={documents}
            onAskAgent={handleAskAgent}
          />
        )}

        {activeTab === 'tickets' && (
          <TicketsManagerView
            audit={audit}
            documents={documents}
            onAskAgent={handleAskAgent}
            tickets={tickets}
            onUpdateTickets={setTickets}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'slides' && (
          <SlideDeckStudioView
            documentContext={getCombinedDocumentText()}
            onAskAgent={handleAskAgent}
          />
        )}

        {activeTab === 'chat' && (
          <AgentChatView
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isChatLoading}
            onClearChat={() => setMessages([])}
            activeDocuments={activeDocuments}
          />
        )}

        {activeTab === 'science' && (
          <ScienceSkillsView
            onInjectDocument={handleAddDocument}
            onAskAgentWithContext={handleAskAgent}
          />
        )}

        {activeTab === 'documents' && (
          <DocumentsManager
            documents={documents}
            onToggleActive={handleToggleActiveDoc}
            onDeleteDocument={handleDeleteDoc}
            onOpenUpload={() => setShowUploadModal(true)}
            onOpenSampleModal={() => setShowSampleModal(true)}
            onUpdateDocument={handleUpdateDocument}
            onCreateDocument={handleAddDocument}
          />
        )}

        {activeTab === 'risks' && (
          <RiskMatrixView
            risks={audit.topRisks || []}
            onAddRisk={handleAddRisk}
            onRequestAiRisks={handleRequestAiRisks}
            isAiGenerating={isAiRiskGenerating}
          />
        )}

        {activeTab === 'milestones' && (
          <GanttMilestonesView
            milestones={audit.criticalMilestones || []}
            onAskAgent={handleAskAgent}
            onRequestWbsArtifact={() => setActiveArtifactType('wbs')}
          />
        )}

        {activeTab === 'raci' && (
          <RaciMatrixView
            onRequestRaciArtifact={() => setActiveArtifactType('raci')}
          />
        )}
      </main>

      {/* Modals */}
      {showUploadModal && (
        <UploadModal
          onClose={() => setShowUploadModal(false)}
          onAddDocument={handleAddDocument}
        />
      )}

      {showMeetingRecorderModal && (
        <MeetingRecorderModal
          onClose={() => setShowMeetingRecorderModal(false)}
          onAddDocument={handleAddDocument}
        />
      )}

      {showSampleModal && (
        <SamplePacksModal
          onClose={() => setShowSampleModal(false)}
          onSelectPack={handleSelectPack}
          onStartBlankProject={handleStartBlankProject}
          currentPackId={currentPackId}
        />
      )}

      {showExportPdfModal && (
        <ExportPdfModal
          audit={audit}
          documents={documents}
          onClose={() => setShowExportPdfModal(false)}
        />
      )}

      {activeArtifactType && (
        <ArtifactModal
          artifactType={activeArtifactType}
          onClose={() => setActiveArtifactType(null)}
          documentContext={getCombinedDocumentText()}
        />
      )}
    </div>
  );
}
