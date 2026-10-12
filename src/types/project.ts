export interface ProjectDocument {
  id: string;
  name: string;
  type: 'cahier_des_charges' | 'cr_reunion' | 'specs' | 'note_cadrage' | 'contrat' | 'autre';
  fileFormat: string;
  size: string;
  content: string;
  dateAdded: string;
  active: boolean;
  tags: string[];
}

export interface RiskItem {
  id: string;
  title: string;
  category: 'Technique' | 'Humain' | 'Calendrier' | 'Budget' | 'Gouvernance';
  probability: number; // 1 to 5
  impact: number; // 1 to 5
  score?: number; // p * i
  mitigation: string;
  owner?: string;
  status?: 'Ouvert' | 'Sous contrôle' | 'Résolu';
}

export interface Milestone {
  id: string;
  title: string;
  phase: 'Cadrage' | 'Conception' | 'Développement' | 'Recette' | 'Déploiement' | 'Clôture';
  targetDate: string;
  deliverables: string;
  status: 'A venir' | 'En cours' | 'Valide' | 'En retard';
  progress?: number;
}

export interface RaciItem {
  activity: string;
  cdp: 'R' | 'A' | 'C' | 'I';
  sponsor: 'R' | 'A' | 'C' | 'I';
  po: 'R' | 'A' | 'C' | 'I';
  leadTech: 'R' | 'A' | 'C' | 'I';
  equipeDev: 'R' | 'A' | 'C' | 'I';
  metier: 'R' | 'A' | 'C' | 'I';
  qa: 'R' | 'A' | 'C' | 'I';
}

export interface ProjectAudit {
  projectTitle: string;
  executiveSummary: string;
  projectStatus: 'VERT' | 'JAUNE' | 'ROUGE';
  statusJustification: string;
  estimatedDuration: string;
  keyObjectives: string[];
  scope: {
    inScope: string[];
    outOfScope: string[];
  };
  topRisks: RiskItem[];
  criticalMilestones: Milestone[];
  recommendations: string[];
  missingInformation: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  skillBadge?: string;
  artifactSnippet?: {
    title: string;
    type: string;
  };
}

export interface SkillAction {
  id: string;
  title: string;
  desc: string;
  iconName: string;
  prompt: string;
  artifactType?: 'charter' | 'raci' | 'risks' | 'flash_report' | 'agile_backlog' | 'wbs';
}
