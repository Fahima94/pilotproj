import React, { useState } from 'react';
import { ProjectDocument } from '../types/project';
import { 
  FileText, 
  Trash2, 
  Eye, 
  CheckCircle, 
  Circle, 
  Search, 
  Plus, 
  FolderOpen, 
  FileCode, 
  Copy, 
  Check,
  Tag,
  Calendar,
  Layers
} from 'lucide-react';

interface DocumentsManagerProps {
  documents: ProjectDocument[];
  onToggleActive: (id: string) => void;
  onDeleteDocument: (id: string) => void;
  onOpenUpload: () => void;
  onOpenSampleModal: () => void;
}

export const DocumentsManager: React.FC<DocumentsManagerProps> = ({
  documents,
  onToggleActive,
  onDeleteDocument,
  onOpenUpload,
  onOpenSampleModal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [previewDoc, setPreviewDoc] = useState<ProjectDocument | null>(null);
  const [copied, setCopied] = useState(false);

  const filteredDocs = documents.filter(
    (d) =>
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const activeCount = documents.filter((d) => d.active).length;

  const handleCopyPreview = () => {
    if (!previewDoc) return;
    navigator.clipboard.writeText(previewDoc.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getFormatBadge = (format: string) => {
    switch (format.toLowerCase()) {
      case 'markdown':
        return 'bg-blue-500/10 text-blue-300 border-blue-500/30';
      case 'pdf':
        return 'bg-rose-500/10 text-rose-300 border-rose-500/30';
      case 'texte':
      case 'txt':
        return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center space-x-2">
            <FileText className="w-5 h-5 text-indigo-400" />
            <span>Gestionnaire Documentaire du Projet</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {documents.length} document{documents.length > 1 ? 's' : ''} au total ({activeCount} actif{activeCount > 1 ? 's' : ''} dans la mémoire de l'Agent IA).
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onOpenSampleModal}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center space-x-1.5 transition"
          >
            <FolderOpen className="w-3.5 h-3.5 text-slate-400" />
            <span>Exemples types</span>
          </button>

          <button
            onClick={onOpenUpload}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 text-white flex items-center space-x-1.5 shadow-sm transition"
          >
            <Plus className="w-3.5 h-3.5 text-white" />
            <span>Ajouter / Importer document</span>
          </button>
        </div>
      </div>

      {/* Search & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-slate-900/60 border border-slate-800 p-3 rounded-xl">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Rechercher par nom, mot-clé ou tag..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950/80 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="text-xs text-slate-400 flex items-center space-x-2">
          <span>Seuls les documents cochés sont injectés dans le prompt de l'Agent.</span>
        </div>
      </div>

      {/* Documents Grid / List */}
      {filteredDocs.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
          <FileText className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-sm font-semibold text-white">Aucun document trouvé</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Importez vos cahiers des charges, comptes-rendus ou notes de cadrage pour alimenter l'Agent Chef de Projet.
          </p>
          <button
            onClick={onOpenUpload}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-600 text-white hover:bg-indigo-500 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Ajouter mon premier document</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocs.map((doc) => {
            const wordCount = doc.content.split(/\s+/).filter(Boolean).length;
            return (
              <div
                key={doc.id}
                className={`p-4 rounded-xl border transition-all flex flex-col justify-between space-y-3 ${
                  doc.active
                    ? 'bg-slate-900/90 border-indigo-500/40 shadow-sm shadow-indigo-500/5'
                    : 'bg-slate-900/40 border-slate-800 opacity-75'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <button
                      onClick={() => onToggleActive(doc.id)}
                      className="flex items-center space-x-2 text-left group"
                      title={doc.active ? 'Désactiver du contexte IA' : 'Activer dans le contexte IA'}
                    >
                      {doc.active ? (
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-600 shrink-0 group-hover:text-slate-400" />
                      )}
                      <span className="text-xs font-bold text-white group-hover:text-indigo-300 transition truncate max-w-[190px]">
                        {doc.name}
                      </span>
                    </button>

                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${getFormatBadge(doc.fileFormat)}`}>
                      {doc.fileFormat}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 line-clamp-3 leading-relaxed">
                    {doc.content.slice(0, 150)}...
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
                  <div className="flex items-center space-x-2">
                    <span>{wordCount} mots</span>
                    <span>•</span>
                    <span>{doc.size}</span>
                  </div>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => setPreviewDoc(doc)}
                      className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition"
                      title="Lire le document"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteDocument(doc.id)}
                      className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
                      title="Supprimer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Document Reader Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-indigo-400" />
                <h3 className="font-semibold text-white text-sm truncate max-w-md">
                  {previewDoc.name}
                </h3>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleCopyPreview}
                  className="px-2.5 py-1 rounded-md text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center space-x-1"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copié' : 'Copier'}</span>
                </button>
                <button
                  onClick={() => setPreviewDoc(null)}
                  className="text-slate-400 hover:text-white text-xs px-2 py-1"
                >
                  Fermer
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed select-text bg-slate-950/50">
              {previewDoc.content}
            </div>

            <div className="p-3 border-t border-slate-800 bg-slate-900/90 text-right text-xs text-slate-400">
              {previewDoc.content.length} caractères • {previewDoc.content.split(/\s+/).filter(Boolean).length} mots
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
