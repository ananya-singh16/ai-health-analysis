import React, { useState } from "react";
import { 
  FileText, 
  Printer, 
  Download, 
  Copy, 
  Check, 
  Save, 
  HeartPulse, 
  ShieldAlert, 
  User, 
  Calendar,
  Layers,
  Building2
} from "lucide-react";
import { AnalysisRecord } from "../../types";

interface ReportSummaryProps {
  analysis: AnalysisRecord;
  onSaveNotes?: (notes: string) => void;
}

export const ReportSummary: React.FC<ReportSummaryProps> = ({
  analysis,
  onSaveNotes
}) => {
  const [copied, setCopied] = useState(false);
  const [customNotes, setCustomNotes] = useState(analysis.clinicalNotes || "");
  const [notesSaved, setNotesSaved] = useState(false);

  const handleCopyReport = () => {
    const text = `NEUROCARE HEALTH — CLINICAL RADIOLOGY REPORT
Scan ID: ${analysis.id}
Date: ${new Date(analysis.date).toLocaleDateString()}
Patient ID: ${analysis.patientId} (${analysis.patientName})
Diagnostic Finding: ${analysis.prediction} (${(analysis.confidence * 100).toFixed(1)}%)
Evaluation Suite: ${analysis.modelVersion}

${analysis.generatedReport || "Diagnostic Assessment: Primary classification " + analysis.prediction}

Attending Physician Notes:
${customNotes}

DISCLAIMER: For educational/research purposes only. This tool does not replace professional medical diagnosis.`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSaveNotes = () => {
    if (onSaveNotes) {
      onSaveNotes(customNotes);
      setNotesSaved(true);
      setTimeout(() => setNotesSaved(false), 2000);
    }
  };

  return (
    <div className="rounded-3xl bg-[#15121c] border border-rose-900/40 p-5 sm:p-6 shadow-xl space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-rose-900/30">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-red-400" />
            <h3 className="text-base font-bold text-white">
              Cranial Diagnostic Findings & Medical Report
            </h3>
          </div>
          <p className="text-xs text-rose-200/70 mt-0.5">
            Structured clinical assessment with doctor's addendum and printable medical record
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto no-print">
          <button
            type="button"
            onClick={handleCopyReport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-xs text-rose-200 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied!" : "Copy Report"}</span>
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs shadow-md shadow-red-600/30 transition-all"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Printable Report Document Card */}
      <div className="p-6 rounded-2xl bg-black/50 border border-rose-900/40 text-slate-200 space-y-5 printable-card">
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-rose-900/40 text-xs">
          <div>
            <div className="flex items-center gap-2">
              <HeartPulse className="w-4 h-4 text-red-400" />
              <span className="font-extrabold text-sm text-red-400 tracking-wider font-mono">
                NEUROCARE CRANIAL HEALTH PAVILION
              </span>
            </div>
            <p className="text-[11px] text-rose-200/70">Department of Neuroradiology & Clinical Neurology</p>
          </div>

          <div className="flex flex-wrap gap-4 font-mono text-[11px] text-rose-200/80">
            <div>
              <span className="text-rose-400/60 block text-[10px]">SCAN ID</span>
              <span className="text-white font-bold">{analysis.id}</span>
            </div>
            <div>
              <span className="text-rose-400/60 block text-[10px]">DATE</span>
              <span className="text-white font-semibold">{new Date(analysis.date).toLocaleDateString()}</span>
            </div>
            <div>
              <span className="text-rose-400/60 block text-[10px]">PATIENT ID</span>
              <span className="text-red-300 font-bold">{analysis.patientId}</span>
            </div>
          </div>
        </div>

        {/* Structured Report Text */}
        <div className="text-xs sm:text-sm text-rose-100/90 leading-relaxed space-y-3 font-sans">
          {analysis.generatedReport ? (
            <div className="whitespace-pre-wrap space-y-2">
              {analysis.generatedReport}
            </div>
          ) : (
            <div className="space-y-2">
              <h4 className="font-bold text-white text-sm">Summary of Cranial Assessment</h4>
              <p className="text-rose-200">
                The input MRI scan was assessed as <strong className="text-red-400 font-semibold">{analysis.prediction}</strong> with an estimated confidence rating of <strong className="text-red-400 font-semibold">{(analysis.confidence * 100).toFixed(1)}%</strong>.
              </p>
            </div>
          )}
        </div>

        {/* Physician Addendum Notes */}
        <div className="pt-4 border-t border-rose-900/40 space-y-2 no-print">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-rose-300 uppercase tracking-wider font-mono">
              Attending Physician / Specialist Addendum Notes
            </label>
            {onSaveNotes && (
              <button
                type="button"
                onClick={handleSaveNotes}
                className="text-xs text-red-400 hover:text-red-300 font-bold flex items-center gap-1"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{notesSaved ? "Saved!" : "Save Notes"}</span>
              </button>
            )}
          </div>
          <textarea
            value={customNotes}
            onChange={(e) => setCustomNotes(e.target.value)}
            placeholder="Add clinical observations, medication instructions, differential notes, or surgical follow-up..."
            rows={3}
            className="w-full p-3 rounded-xl bg-[#1c1724] border border-rose-900/50 text-xs sm:text-sm text-slate-100 placeholder-rose-300/30 focus:outline-hidden focus:border-red-500"
          />
        </div>

        {/* Medical Advisory Notice */}
        <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/25 text-[11px] text-rose-200 leading-normal flex items-start gap-2">
          <ShieldAlert className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
          <p>
            <strong>Medical Notice:</strong> For educational/research purposes only. This tool does not replace professional medical diagnosis. Confirm all diagnostic decisions with a licensed healthcare specialist.
          </p>
        </div>
      </div>
    </div>
  );
};
