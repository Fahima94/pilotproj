import React, { useState, useRef, useEffect } from 'react';
import { 
  Mic, 
  Square, 
  Play, 
  Pause, 
  Upload, 
  RefreshCw, 
  X, 
  Check, 
  FileAudio, 
  Plus, 
  Sparkles,
  Volume2
} from 'lucide-react';
import { ProjectDocument } from '../types/project';

interface MeetingRecorderModalProps {
  onClose: () => void;
  onAddDocument: (doc: ProjectDocument) => void;
}

export const MeetingRecorderModal: React.FC<MeetingRecorderModalProps> = ({
  onClose,
  onAddDocument,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcript, setTranscript] = useState<string>('');
  const [meetingTitle, setMeetingTitle] = useState('CR_Reunion_Point_Equipe');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const startRecording = async () => {
    try {
      setErrorMsg(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start(250);
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.error(err);
      setErrorMsg("Impossible d'accéder au microphone. Veuillez vérifier les autorisations.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioBlob(file);
      setAudioUrl(URL.createObjectURL(file));
      setMeetingTitle(`Reunion_${file.name.replace(/\.[^/.]+$/, '')}`);
    }
  };

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = (reader.result as string).split(',')[1];
        resolve(base64data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const handleTranscribe = async () => {
    if (!audioBlob) return;
    setIsTranscribing(true);
    setErrorMsg(null);

    try {
      const base64 = await blobToBase64(audioBlob);
      const res = await fetch('/api/audio/transcribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audioBase64: base64,
          mimeType: audioBlob.type || 'audio/webm',
        }),
      });

      const data = await res.json();
      if (data.transcript) {
        setTranscript(data.transcript);
      } else {
        setErrorMsg("La transcription n'a pas retourné de résultat.");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg("Erreur lors de la transcription avec Gemini 3.5 Transcribe.");
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleInjectToProject = () => {
    if (!transcript) return;
    const doc: ProjectDocument = {
      id: `meet-${Date.now()}`,
      name: `${meetingTitle.trim() || 'Compte_Rendu_Reunion'}.md`,
      type: 'cr_reunion',
      fileFormat: 'Audio Transcrit',
      size: `${(transcript.length / 1024).toFixed(1)} Ko`,
      content: `# ${meetingTitle.trim()}\nDate : ${new Date().toLocaleDateString('fr-FR')}\nSource : Enregistrement Audio (gemini-3.5-transcribe)\n\n${transcript}`,
      dateAdded: new Date().toISOString().slice(0, 10),
      active: true,
      tags: ['Meet', 'Transcription', 'Audio', 'Gemini 3.5'],
    };

    onAddDocument(doc);
    onClose();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
              <Mic className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm sm:text-base">
                Enregistrer un Meet & Transcrire en Direct
              </h3>
              <p className="text-[11px] text-slate-400">
                Alimente le dossier de projet via le modèle audio <strong>gemini-3.5-transcribe</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5 text-xs">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              {errorMsg}
            </div>
          )}

          {/* Recording Console */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-6 text-center space-y-4">
            <div className="flex items-center justify-center">
              {isRecording ? (
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-rose-500/20 animate-ping absolute inset-0" />
                  <div className="w-20 h-20 rounded-full bg-rose-600 flex items-center justify-center text-white relative z-10 shadow-lg shadow-rose-600/30">
                    <Mic className="w-8 h-8 animate-pulse" />
                  </div>
                </div>
              ) : (
                <div className="w-20 h-20 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400">
                  <Mic className="w-8 h-8" />
                </div>
              )}
            </div>

            <div className="space-y-1">
              <div className="text-2xl font-mono font-bold text-white">
                {formatTime(recordingTime)}
              </div>
              <p className="text-slate-400 text-[11px]">
                {isRecording
                  ? 'Enregistrement de la réunion en cours... Parlez clairement.'
                  : audioBlob
                  ? 'Audio enregistré prêt pour la transcription'
                  : 'Cliquez sur Enregistrer pour capturer les échanges du Meet'}
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              {!isRecording ? (
                <button
                  type="button"
                  onClick={startRecording}
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold flex items-center space-x-2 shadow-md shadow-rose-600/20 transition"
                >
                  <Mic className="w-4 h-4" />
                  <span>Démarrer l'enregistrement</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={stopRecording}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold flex items-center space-x-2 border border-slate-700 shadow-md transition"
                >
                  <Square className="w-4 h-4 text-rose-400" />
                  <span>Arrêter l'enregistrement</span>
                </button>
              )}

              <label className="cursor-pointer px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium border border-slate-700 transition flex items-center space-x-2">
                <Upload className="w-4 h-4 text-slate-400" />
                <span>Importer un fichier audio</span>
                <input
                  type="file"
                  accept="audio/*"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </label>
            </div>

            {audioUrl && !isRecording && (
              <div className="pt-2">
                <audio controls src={audioUrl} className="w-full max-w-md mx-auto h-9" />
              </div>
            )}
          </div>

          {/* Transcription trigger */}
          {audioBlob && !isRecording && !transcript && (
            <div className="text-center">
              <button
                type="button"
                onClick={handleTranscribe}
                disabled={isTranscribing}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-teal-500 hover:from-indigo-500 text-white font-bold flex items-center justify-center space-x-2 shadow-lg shadow-indigo-600/20 transition disabled:opacity-50"
              >
                {isTranscribing ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4 text-cyan-200" />
                )}
                <span>
                  {isTranscribing
                    ? 'Transcription en cours via gemini-3.5-transcribe...'
                    : 'Transcrire & Générer le Compte-Rendu Automatique'}
                </span>
              </button>
            </div>
          )}

          {/* Transcript display */}
          {transcript && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-white">Nom du document à créer :</label>
                <span className="text-[10px] text-emerald-400 font-semibold flex items-center space-x-1">
                  <Check className="w-3 h-3" />
                  <span>Transcription terminée</span>
                </span>
              </div>

              <input
                type="text"
                value={meetingTitle}
                onChange={(e) => setMeetingTitle(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-medium focus:outline-none focus:border-indigo-500"
              />

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 max-h-60 overflow-y-auto font-mono text-[11px] text-slate-300 whitespace-pre-wrap leading-relaxed select-text">
                {transcript}
              </div>

              <button
                type="button"
                onClick={handleInjectToProject}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center justify-center space-x-2 shadow-md shadow-emerald-600/20 transition"
              >
                <Plus className="w-4 h-4" />
                <span>Injecter ce compte-rendu dans les documents du projet</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
