import React, { useState, useEffect } from "react";
import { ArrowLeft, RotateCcw, AlertCircle, FileText, User, Calendar, HeartPulse } from "lucide-react";
import { AnalysisRecord, AppSettings } from "../types";
import { storageService } from "../services/storage";
import { ProbabilityDistribution } from "../components/analysis/ProbabilityDistribution";
import { GradCamViewer } from "../components/analysis/GradCamViewer";
import { ReportSummary } from "../components/analysis/ReportSummary";

interface ResultsDetailPageProps {
  scanId: string;
  onNavigate: (route: string) => void;
  settings: AppSettings;
}

export const ResultsDetailPage: React.FC<ResultsDetailPageProps> = ({
  scanId,
  onNavigate,
  settings
}) => {
  const [analysis, setAnalysis] = useState<AnalysisRecord | null>(null);

  useEffect(() => {
    const record = storageService.getAnalysisById(scanId);
    if (record) {
      setAnalysis(record);
    }
  }, [scanId]);

  if (!analysis) {
    return (
      <div className="p-12 text-center space-y-4 max-w-md mx-auto">
        <AlertCircle className="w-12 h-12 text-rose-400 mx-auto" />
        <h3 className="text-lg font-bold text-white">Cranial Scan Record Not Found</h3>
        <p className="text-xs text-rose-300/70">
          The requested scan ID <span className="font-mono text-red-400">"{scanId}"</span> was not found in the local medical archives.
        </p>
        <button
          type="button"
          onClick={() => onNavigate("/history")}
          className="px-4 py-2 rounded-xl bg-rose-950/60 border border-rose-800 text-xs text-rose-200 font-bold hover:bg-rose-900"
        >
          Return to Diagnostic Archives
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Back Button & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-rose-900/40">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onNavigate("/history")}
            className="p-2 rounded-xl bg-[#1c1724] border border-rose-900/50 text-rose-300 hover:text-white hover:bg-rose-900/40 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              Scan Record: <span className="font-mono text-red-400">{analysis.id}</span>
            </h1>
            <p className="text-xs text-rose-200/70">
              Patient: <strong className="text-white">{analysis.patientName}</strong> ({analysis.patientId}) • Scanned {new Date(analysis.date).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => onNavigate("/appointments")}
            className="px-3.5 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-xs text-rose-200 font-bold transition-colors"
          >
            <Calendar className="w-3.5 h-3.5 inline mr-1.5 text-red-400" />
            <span>Book Consult</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate("/analyze")}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-xs shadow-md transition-all"
          >
            <HeartPulse className="w-3.5 h-3.5 inline mr-1.5" />
            <span>New Scan</span>
          </button>
        </div>
      </div>

      {/* Results Components */}
      <ProbabilityDistribution
        prediction={analysis.prediction}
        confidence={analysis.confidence}
        probabilities={analysis.classProbabilities}
        scanId={analysis.id}
        timestamp={analysis.date}
        inferenceTimeMs={analysis.inferenceTimeMs}
        modelVersion={analysis.modelVersion}
        isDemo={analysis.isDemo}
      />

      <GradCamViewer
        imageUrl={analysis.imageUrl}
        gradcam={analysis.gradcam}
        prediction={analysis.prediction}
        isDemo={analysis.isDemo}
      />

      <ReportSummary
        analysis={analysis}
        onSaveNotes={(notes) => {
          const updated = { ...analysis, clinicalNotes: notes };
          storageService.saveAnalysis(updated);
          setAnalysis(updated);
        }}
      />
    </div>
  );
};
