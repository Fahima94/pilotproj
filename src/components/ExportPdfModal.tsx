import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import { 
  FileDown, 
  Printer, 
  X, 
  Check, 
  ShieldAlert, 
  CalendarClock, 
  CheckCircle2, 
  AlertTriangle, 
  Target,
  Sliders,
  Sparkles,
  Layers
} from 'lucide-react';
import { ProjectAudit, ProjectDocument } from '../types/project';

interface ExportPdfModalProps {
  audit: ProjectAudit;
  documents: ProjectDocument[];
  onClose: () => void;
}

export const ExportPdfModal: React.FC<ExportPdfModalProps> = ({
  audit,
  documents,
  onClose,
}) => {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [includeRecommendations, setIncludeRecommendations] = useState(true);
  const [includeScope, setIncludeScope] = useState(true);
  const [includeMilestones, setIncludeMilestones] = useState(true);

  // Generate downloadable PDF using jsPDF
  const generatePdfFile = () => {
    setIsGeneratingPdf(true);
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 14;
      const contentWidth = pageWidth - margin * 2;
      let y = 18;

      // Color palette
      const primaryColor: [number, number, number] = [30, 41, 59]; // slate-800
      const accentBlue: [number, number, number] = [37, 99, 235]; // blue-600
      const textDark: [number, number, number] = [15, 23, 42]; // slate-900
      const textMuted: [number, number, number] = [100, 116, 139]; // slate-500

      // Helper for page break check
      const checkPageBreak = (neededHeight: number) => {
        if (y + neededHeight > doc.internal.pageSize.getHeight() - 15) {
          doc.addPage();
          y = 18;
          // Add small running header on continuation pages
          doc.setFontSize(8);
          doc.setTextColor(...textMuted);
          doc.text(`Rapport Exécutif — ${audit.projectTitle}`, margin, y);
          doc.setDrawColor(226, 232, 240);
          doc.line(margin, y + 2, margin + contentWidth, y + 2);
          y += 10;
        }
      };

      // Header Banner
      doc.setFillColor(15, 23, 42); // slate-950
      doc.roundedRect(margin, y, contentWidth, 24, 3, 3, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.text('RAPPORT EXÉCUTIF DU PROJET — COPIL & PARTIES PRENANTES', margin + 6, y + 9);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(203, 213, 225); // slate-300
      const exportDate = new Date().toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });
      doc.text(`Émis le : ${exportDate}  •  Durée prévisionnelle : ${audit.estimatedDuration}`, margin + 6, y + 17);

      y += 30;

      // Project Title & Status
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.setTextColor(...textDark);
      doc.text(audit.projectTitle, margin, y);
      y += 7;

      // Weather status badge
      let statusRgb: [number, number, number] = [16, 185, 129]; // emerald
      if (audit.projectStatus === 'JAUNE') statusRgb = [245, 158, 11]; // amber
      if (audit.projectStatus === 'ROUGE') statusRgb = [239, 68, 68]; // rose

      doc.setFillColor(...statusRgb);
      doc.roundedRect(margin, y - 4, 38, 7, 2, 2, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text(`MÉTÉO : ${audit.projectStatus}`, margin + 4, y + 1);

      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8.5);
      doc.setTextColor(...textMuted);
      const justificationLines = doc.splitTextToSize(audit.statusJustification, contentWidth - 45);
      doc.text(justificationLines, margin + 43, y + 1);
      y += Math.max(10, justificationLines.length * 4.5 + 4);

      // Section: Key Indicators (KPIs)
      checkPageBreak(25);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(...accentBlue);
      doc.text('INDICATEURS CLÉS DE PILOTAGE (KPIS)', margin, y);
      y += 5;

      const kpiCardWidth = (contentWidth - 9) / 4;
      const kpiCardHeight = 15;
      
      const criticalRisksCount = audit.topRisks.filter(r => (r.score || (r.probability * r.impact)) >= 15).length;
      const activeDocsCount = documents.filter(d => d.active).length;

      // KPI 1: Weather Status
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(margin, y, kpiCardWidth, kpiCardHeight, 2, 2, 'FD');
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(...textMuted);
      doc.text('STATUT GLOBAL', margin + 3, y + 4.5);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(...statusRgb);
      doc.text(audit.projectStatus, margin + 3, y + 10.5);

      // KPI 2: Critical Risks
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(margin + kpiCardWidth + 3, y, kpiCardWidth, kpiCardHeight, 2, 2, 'FD');
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(...textMuted);
      doc.text('RISQUES CRITIQUES', margin + kpiCardWidth + 6, y + 4.5);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(225, 29, 72);
      doc.text(`${criticalRisksCount} / ${audit.topRisks.length}`, margin + kpiCardWidth + 6, y + 10.5);

      // KPI 3: Milestones
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(margin + (kpiCardWidth + 3) * 2, y, kpiCardWidth, kpiCardHeight, 2, 2, 'FD');
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(...textMuted);
      doc.text('JALONS CLÉS', margin + (kpiCardWidth + 3) * 2 + 3, y + 4.5);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(...accentBlue);
      doc.text(`${audit.criticalMilestones?.length || 0} jalons`, margin + (kpiCardWidth + 3) * 2 + 3, y + 10.5);

      // KPI 4: Documents Corpus
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(margin + (kpiCardWidth + 3) * 3, y, kpiCardWidth, kpiCardHeight, 2, 2, 'FD');
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(...textMuted);
      doc.text('DOCUMENTS ANALYSÉS', margin + (kpiCardWidth + 3) * 3 + 3, y + 4.5);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(79, 70, 229);
      doc.text(`${activeDocsCount} fichier(s)`, margin + (kpiCardWidth + 3) * 3 + 3, y + 10.5);

      y += kpiCardHeight + 7;

      // Section 1: Executive Summary
      checkPageBreak(25);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(...accentBlue);
      doc.text('1. SYNTHÈSE EXÉCUTIVE', margin, y);
      y += 5;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(51, 65, 85);
      const summaryLines = doc.splitTextToSize(audit.executiveSummary, contentWidth);
      doc.text(summaryLines, margin, y);
      y += summaryLines.length * 4.5 + 6;

      // Section 2: SMART Objectives
      checkPageBreak(30);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(...accentBlue);
      doc.text('2. OBJECTIFS STRATÉGIQUES (SMART)', margin, y);
      y += 5;

      audit.keyObjectives.forEach((obj) => {
        checkPageBreak(10);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(16, 185, 129);
        doc.text('✓', margin + 2, y);

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(51, 65, 85);
        const objLines = doc.splitTextToSize(obj, contentWidth - 8);
        doc.text(objLines, margin + 8, y);
        y += objLines.length * 4.2 + 2;
      });
      y += 4;

      // Section 3: Scope (In Scope vs Out of Scope)
      if (includeScope && (audit.scope.inScope.length > 0 || audit.scope.outOfScope.length > 0)) {
        checkPageBreak(35);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(...accentBlue);
        doc.text('3. PÉRIMÈTRE DU PROJET (SCOPE)', margin, y);
        y += 6;

        const halfWidth = (contentWidth - 6) / 2;

        // In Scope box header
        doc.setFillColor(240, 253, 244);
        doc.roundedRect(margin, y, halfWidth, 6, 1, 1, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(22, 101, 52);
        doc.text('IN SCOPE (Périmètre Inclus)', margin + 3, y + 4.2);

        // Out of Scope box header
        doc.setFillColor(255, 241, 242);
        doc.roundedRect(margin + halfWidth + 6, y, halfWidth, 6, 1, 1, 'F');
        doc.setTextColor(159, 18, 57);
        doc.text('OUT OF SCOPE (Exclus / Phase 2)', margin + halfWidth + 9, y + 4.2);
        y += 8;

        const startY = y;
        let leftY = startY;
        audit.scope.inScope.forEach((item) => {
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(8);
          doc.setTextColor(51, 65, 85);
          const lines = doc.splitTextToSize(`• ${item}`, halfWidth - 4);
          doc.text(lines, margin + 2, leftY);
          leftY += lines.length * 4 + 1.5;
        });

        let rightY = startY;
        audit.scope.outOfScope.forEach((item) => {
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(8);
          doc.setTextColor(51, 65, 85);
          const lines = doc.splitTextToSize(`• ${item}`, halfWidth - 4);
          doc.text(lines, margin + halfWidth + 8, rightY);
          rightY += lines.length * 4 + 1.5;
        });

        y = Math.max(leftY, rightY) + 6;
      }

      // Section 4: Critical Risks Registry (MANDATORY per prompt)
      checkPageBreak(40);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(...accentBlue);
      doc.text('4. MATRICE DES RISQUES MAJEURS & MITIGATION', margin, y);
      y += 6;

      // Table Header for Risks
      doc.setFillColor(241, 245, 249);
      doc.rect(margin, y, contentWidth, 7, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(71, 85, 105);
      doc.text('RÉF / RISQUE', margin + 2, y + 4.5);
      doc.text('CATÉGORIE', margin + 55, y + 4.5);
      doc.text('SCORE (PxI)', margin + 85, y + 4.5);
      doc.text('PLAN D’ATTÉNUATION (MITIGATION)', margin + 112, y + 4.5);
      y += 8;

      audit.topRisks.forEach((risk) => {
        checkPageBreak(18);
        const score = risk.score || risk.probability * risk.impact;
        let scoreColor: [number, number, number] = [16, 185, 129];
        if (score >= 15) scoreColor = [225, 29, 72];
        else if (score >= 8) scoreColor = [217, 119, 6];

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(...textDark);
        const titleLines = doc.splitTextToSize(`${risk.id} : ${risk.title}`, 50);
        doc.text(titleLines, margin + 2, y + 3.5);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(...textMuted);
        doc.text(risk.category, margin + 55, y + 3.5);

        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...scoreColor);
        doc.text(`${score}/25 (P${risk.probability} x I${risk.impact})`, margin + 85, y + 3.5);

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(51, 65, 85);
        const mitLines = doc.splitTextToSize(risk.mitigation, contentWidth - 114);
        doc.text(mitLines, margin + 112, y + 3.5);

        const rowHeight = Math.max(titleLines.length * 4, mitLines.length * 4) + 4;
        doc.setDrawColor(241, 245, 249);
        doc.line(margin, y + rowHeight - 1, margin + contentWidth, y + rowHeight - 1);
        y += rowHeight;
      });
      y += 6;

      // Section 5: Key Milestones (Planning)
      if (includeMilestones && audit.criticalMilestones && audit.criticalMilestones.length > 0) {
        checkPageBreak(35);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(...accentBlue);
        doc.text('5. JALONS CLÉS DU PLANNING', margin, y);
        y += 6;

        audit.criticalMilestones.forEach((m) => {
          checkPageBreak(12);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(8.5);
          doc.setTextColor(...textDark);
          doc.text(`[${m.phase}] ${m.title}`, margin + 2, y);

          doc.setFont('helvetica', 'bold');
          doc.setTextColor(...accentBlue);
          doc.text(m.targetDate, margin + 110, y);

          doc.setFont('helvetica', 'normal');
          doc.setFontSize(7.5);
          doc.setTextColor(...textMuted);
          doc.text(`Livrables : ${m.deliverables}`, margin + 2, y + 4);
          y += 9;
        });
        y += 4;
      }

      // Section 6: Recommendations
      if (includeRecommendations && audit.recommendations && audit.recommendations.length > 0) {
        checkPageBreak(30);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(...accentBlue);
        doc.text('6. RECOMMANDATIONS & DÉCISIONS REQUISES DU COPIL', margin, y);
        y += 6;

        audit.recommendations.forEach((rec, idx) => {
          checkPageBreak(10);
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(8.5);
          doc.setTextColor(51, 65, 85);
          const recLines = doc.splitTextToSize(`${idx + 1}. ${rec}`, contentWidth - 4);
          doc.text(recLines, margin + 2, y);
          y += recLines.length * 4.2 + 2;
        });
      }

      // Add page numbers on all pages
      const totalPages = doc.internal.pages.length - 1;
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(7.5);
        doc.setTextColor(...textMuted);
        doc.text(
          `Page ${i} sur ${totalPages}  •  Document Confidentiel — Comité de Direction  •  Chef de Projet IA`,
          margin,
          doc.internal.pageSize.getHeight() - 8
        );
      }

      // Trigger automatic file download
      const sanitizedFilename = `Rapport_COPIL_${audit.projectTitle.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`;
      doc.save(sanitizedFilename);
    } catch (err) {
      console.error('Erreur génération PDF:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Browser print to PDF option
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-600 flex items-center justify-center text-white shadow-md">
              <FileDown className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">
                Exporter le Tableau de Bord en PDF
              </h3>
              <p className="text-xs text-slate-400">
                Rapport exécutif imprimable et téléchargeable pour les parties prenantes et le COPIL
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={generatePdfFile}
              disabled={isGeneratingPdf}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-indigo-600/20 transition disabled:opacity-50"
            >
              <FileDown className="w-4 h-4" />
              <span>{isGeneratingPdf ? 'Génération du PDF...' : 'Télécharger le PDF (.pdf)'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs flex items-center space-x-1.5 border border-slate-700 transition"
              title="Ouvrir la boîte d'impression du navigateur"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Imprimer</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Customization Options Bar */}
        <div className="px-5 py-3 border-b border-slate-800/80 bg-slate-950/40 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-4">
            <span className="text-slate-400 font-medium flex items-center space-x-1">
              <Sliders className="w-3.5 h-3.5 text-indigo-400" />
              <span>Sections incluses :</span>
            </span>

            <label className="flex items-center space-x-1.5 text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={includeScope}
                onChange={(e) => setIncludeScope(e.target.checked)}
                className="rounded border-slate-700 text-indigo-600 focus:ring-0"
              />
              <span>Périmètre (In/Out)</span>
            </label>

            <label className="flex items-center space-x-1.5 text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={includeMilestones}
                onChange={(e) => setIncludeMilestones(e.target.checked)}
                className="rounded border-slate-700 text-indigo-600 focus:ring-0"
              />
              <span>Jalons Clés</span>
            </label>

            <label className="flex items-center space-x-1.5 text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={includeRecommendations}
                onChange={(e) => setIncludeRecommendations(e.target.checked)}
                className="rounded border-slate-700 text-indigo-600 focus:ring-0"
              />
              <span>Recommandations</span>
            </label>
          </div>

          <span className="text-[11px] text-slate-500">
            Format normalisé A4 • {audit.topRisks.length} risques inclus
          </span>
        </div>

        {/* Live Report Preview Area (Print-ready document styling) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-950 select-text">
          <div className="max-w-3xl mx-auto bg-white text-slate-900 rounded-xl p-8 sm:p-10 shadow-2xl space-y-6 text-xs leading-relaxed">
            {/* Header Document */}
            <div className="border-b border-slate-200 pb-5 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-widest text-blue-600">
                  Rapport de Pilotage & Gouvernance — COPIL
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                  {audit.projectTitle}
                </h1>
                <p className="text-xs text-slate-500">
                  Durée estimée : <strong>{audit.estimatedDuration}</strong> • Date d'émission :{' '}
                  {new Date().toLocaleDateString('fr-FR')}
                </p>
              </div>

              {/* Weather Status Pill */}
              <div className="shrink-0">
                <div
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center space-x-1.5 border ${
                    audit.projectStatus === 'VERT'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                      : audit.projectStatus === 'JAUNE'
                      ? 'bg-amber-50 text-amber-700 border-amber-300'
                      : 'bg-rose-50 text-rose-700 border-rose-300'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      audit.projectStatus === 'VERT'
                        ? 'bg-emerald-500'
                        : audit.projectStatus === 'JAUNE'
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                  />
                  <span>Météo : {audit.projectStatus}</span>
                </div>
              </div>
            </div>

            {/* Status Justification */}
            {audit.statusJustification && (
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 text-xs">
                <strong>Justification de la météo :</strong> {audit.statusJustification}
              </div>
            )}

            {/* Key Indicators (KPIs) Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 space-y-1">
                <div className="text-[10px] uppercase font-bold text-slate-500">Météo Projet</div>
                <div className="text-sm font-bold text-slate-900 flex items-center space-x-1.5">
                  <span className={`w-2 h-2 rounded-full ${audit.projectStatus === 'VERT' ? 'bg-emerald-500' : audit.projectStatus === 'JAUNE' ? 'bg-amber-500' : 'bg-rose-500'}`} />
                  <span>{audit.projectStatus}</span>
                </div>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 space-y-1">
                <div className="text-[10px] uppercase font-bold text-slate-500">Risques Critiques</div>
                <div className="text-sm font-bold text-rose-600">
                  {audit.topRisks.filter(r => (r.score || (r.probability * r.impact)) >= 15).length} / {audit.topRisks.length}
                </div>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 space-y-1">
                <div className="text-[10px] uppercase font-bold text-slate-500">Jalons Planifiés</div>
                <div className="text-sm font-bold text-blue-600">
                  {audit.criticalMilestones?.length || 0} jalons
                </div>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 space-y-1">
                <div className="text-[10px] uppercase font-bold text-slate-500">Corpus Documents</div>
                <div className="text-sm font-bold text-indigo-600">
                  {documents.filter(d => d.active).length} actif(s)
                </div>
              </div>
            </div>

            {/* Executive Summary */}
            <div className="space-y-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-blue-700 border-b border-slate-200 pb-1">
                1. Synthèse Exécutive
              </h2>
              <p className="text-slate-700 leading-relaxed text-justify">
                {audit.executiveSummary}
              </p>
            </div>

            {/* SMART Objectives */}
            <div className="space-y-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-blue-700 border-b border-slate-200 pb-1">
                2. Objectifs Stratégiques & SMART
              </h2>
              <ul className="space-y-1.5">
                {audit.keyObjectives.map((obj, i) => (
                  <li key={i} className="flex items-start space-x-2 text-slate-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Scope (In / Out) */}
            {includeScope && (
              <div className="space-y-2">
                <h2 className="text-xs font-bold uppercase tracking-wider text-blue-700 border-b border-slate-200 pb-1">
                  3. Périmètre (Scope In / Out)
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-1">
                    <div className="font-bold">In Scope (Inclus)</div>
                    <ul className="space-y-1 text-[11px] list-disc list-inside">
                      {audit.scope.inScope.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-900 space-y-1">
                    <div className="font-bold">Out of Scope (Exclus / Phase 2)</div>
                    <ul className="space-y-1 text-[11px] list-disc list-inside">
                      {audit.scope.outOfScope.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Critical Risks Table (MANDATORY) */}
            <div className="space-y-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-blue-700 border-b border-slate-200 pb-1">
                4. Registre des Risques Prioritaires ({audit.topRisks.length})
              </h2>
              <table className="w-full text-left border-collapse text-[11px]">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-300">
                    <th className="p-2">Risque</th>
                    <th className="p-2">Catégorie</th>
                    <th className="p-2 text-center">Score (PxI)</th>
                    <th className="p-2">Plan d'atténuation (Mitigation)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {audit.topRisks.map((risk) => {
                    const score = risk.score || risk.probability * risk.impact;
                    return (
                      <tr key={risk.id} className="hover:bg-slate-50">
                        <td className="p-2 font-semibold text-slate-900 align-top">
                          {risk.id} : {risk.title}
                        </td>
                        <td className="p-2 text-slate-600 align-top">{risk.category}</td>
                        <td className="p-2 text-center align-top font-bold text-rose-600">
                          {score}/25
                        </td>
                        <td className="p-2 text-slate-700 align-top">{risk.mitigation}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Critical Milestones */}
            {includeMilestones && audit.criticalMilestones && (
              <div className="space-y-2">
                <h2 className="text-xs font-bold uppercase tracking-wider text-blue-700 border-b border-slate-200 pb-1">
                  5. Jalons Clés & Livrables
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  {audit.criticalMilestones.map((m) => (
                    <div
                      key={m.id}
                      className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 flex justify-between items-center"
                    >
                      <div>
                        <div className="font-bold text-slate-900">
                          [{m.phase}] {m.title}
                        </div>
                        <div className="text-slate-500 text-[10px]">{m.deliverables}</div>
                      </div>
                      <div className="font-semibold text-blue-600 text-right shrink-0 ml-2">
                        {m.targetDate}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {includeRecommendations && audit.recommendations && (
              <div className="space-y-2">
                <h2 className="text-xs font-bold uppercase tracking-wider text-blue-700 border-b border-slate-200 pb-1">
                  6. Recommandations Méthodologiques
                </h2>
                <ul className="space-y-1.5 text-slate-700">
                  {audit.recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <span className="font-bold text-blue-600">{i + 1}.</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Document Footer */}
            <div className="pt-6 border-t border-slate-200 text-[10px] text-slate-400 flex justify-between items-center">
              <span>Document Confidentiel — Usage Interne & Parties Prenantes</span>
              <span>Généré par Chef de Projet IA</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
