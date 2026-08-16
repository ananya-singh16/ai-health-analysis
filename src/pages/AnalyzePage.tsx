import React, { useState, useEffect } from "react";
import { 
  HeartPulse, 
  Sparkles, 
  ArrowLeft, 
  RotateCcw, 
  FileText, 
  Layers, 
  AlertCircle,
  CheckCircle2,
  Calendar
} from "lucide-react";
import { MriUploader } from "../components/analysis/MriUploader";
import { ProcessingPipeline } from "../components/analysis/ProcessingPipeline";
import { ProbabilityDistribution } from "../components/analysis/ProbabilityDistribution";
import { GradCamViewer } from "../components/analysis/GradCamViewer";
import { ReportSummary } from "../components/analysis/ReportSummary";
import { AnalysisRecord, Patient, TumorClass, AppSettings } from "../types";
import { storageService } from "../services/storage";
import { apiService } from "../services/api";
import { DemoBadge } from "../components/common/DemoBadge";

interface AnalyzePageProps {
  onNavigate: (route: string) => void;
  settings: AppSettings;
  presetScanId?: string;
}

export const AnalyzePage: React.FC<AnalyzePageProps> = ({
  onNavigate,
  settings,
  presetScanId
}) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");

  // Scan state
  const [uploadedScanData, setUploadedScanData] = useState<{
    imageUrl: string;
    fileName: string;
    fileSize: string;
    fileDimensions: string;
    sampleType?: TumorClass;
    patientId?: string;
  } | null>(null);

  // Flow stages: "upload" | "processing" | "results"
  const [flowStage, setFlowStage] = useState<"upload" | "processing" | "results">("upload");
  const [analysisResult, setAnalysisResult] = useState<AnalysisRecord | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setPatients(storageService.getPatients());
  }, []);

  const handleScanSelected = (data: {
    imageUrl: string;
    fileName: string;
    fileSize: string;
    fileDimensions: string;
    sampleType?: TumorClass;
    patientId?: string;
  }) => {
    setUploadedScanData(data);
    setErrorMessage(null);
  };

  const handleStartAnalysis = async () => {
    if (!uploadedScanData) {
      setErrorMessage("Please upload or select an MRI scan before starting the diagnostic evaluation.");
      return;
    }

    setErrorMessage(null);
    setFlowStage("processing");

    try {
      // Execute diagnostic assessment via API service
      const result = await apiService.predict({
        image: uploadedScanData.imageUrl,
        fileName: uploadedScanData.fileName,
        fileSize: uploadedScanData.fileSize,
        fileDimensions: uploadedScanData.fileDimensions,
        sampleType: uploadedScanData.sampleType,
        patientId: selectedPatientId || undefined,
      });

      setAnalysisResult(result);
    } catch (err: any) {
      console.error("Diagnostic scan failed:", err);
      setErrorMessage("Diagnostic assessment could not be completed. Please try again.");
      setFlowStage("upload");
    }
  };

  const handlePipelineAnimationComplete = () => {
    setFlowStage("results");
  };

  const handleReset = () => {
    setFlowStage("upload");
    setUploadedScanData(null);
    setAnalysisResult(null);
    setErrorMessage(null);
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-rose-900/40">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Cranial MRI Diagnostic Evaluation
            </h1>
            <DemoBadge label="DIAGNOSTIC SUITE" size="sm" />
          </div>
          <p className="text-xs sm:text-sm text-rose-200/70 mt-1">
            Upload axial, sagittal, or coronal cranial MRI scans for focal lesion localization, tissue classification, and structured reporting.
          </p>
        </div>

        {flowStage === "results" && (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate("/appointments")}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-xs sm:text-sm text-rose-200 font-bold transition-colors"
            >
              <Calendar className="w-4 h-4 text-red-400" />
              <span>Book Specialist Consult</span>
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>New Diagnostic Scan</span>
            </button>
          </div>
        )}
      </div>

      {/* Stage 1: Upload View */}
      {flowStage === "upload" && (
        <div className="space-y-6">
          <MriUploader
            onImageSelected={handleScanSelected}
            patients={patients}
            selectedPatientId={selectedPatientId}
            onPatientChange={setSelectedPatientId}
          />

          {errorMessage && (
            <div className="flex items-center gap-2.5 p-4 rounded-2xl bg-red-500/15 border border-red-500/30 text-rose-300 text-xs sm:text-sm font-medium">
              <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Analyze Action Bar */}
          {uploadedScanData && (
            <div className="p-6 rounded-3xl bg-[#15121c] border-2 border-red-500/40 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in zoom-in-98 duration-200">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-red-600 to-rose-700 text-white shadow-md shadow-red-600/30">
                  <HeartPulse className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-white">
                    Cranial Scan Ready for Diagnostic Assessment
                  </h4>
                  <p className="text-xs text-rose-300/70 font-mono">
                    {uploadedScanData.fileName} • {uploadedScanData.fileDimensions}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleStartAnalysis}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-sm sm:text-base shadow-xl shadow-red-600/30 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
              >
                <HeartPulse className="w-5 h-5" />
                <span>Begin Cranial Assessment</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Stage 2: Processing View */}
      {flowStage === "processing" && (
        <div className="py-8">
          <ProcessingPipeline
            imageUrl={uploadedScanData?.imageUrl || ""}
            onComplete={handlePipelineAnimationComplete}
          />
        </div>
      )}

      {/* Stage 3: Results View */}
      {flowStage === "results" && analysisResult && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Probability Distribution & Stats */}
          <ProbabilityDistribution
            prediction={analysisResult.prediction}
            confidence={analysisResult.confidence}
            probabilities={analysisResult.classProbabilities}
            scanId={analysisResult.id}
            timestamp={analysisResult.date}
            inferenceTimeMs={analysisResult.inferenceTimeMs}
            modelVersion={analysisResult.modelVersion}
            isDemo={analysisResult.isDemo}
          />

          {/* Focal Lesion Saliency Heatmap Viewer */}
          <GradCamViewer
            imageUrl={analysisResult.imageUrl}
            gradcam={analysisResult.gradcam}
            prediction={analysisResult.prediction}
            isDemo={analysisResult.isDemo}
          />

          {/* Clinical Findings & Report Summary */}
          <ReportSummary
            analysis={analysisResult}
            onSaveNotes={(notes) => {
              const updated = { ...analysisResult, clinicalNotes: notes };
              storageService.saveAnalysis(updated);
              setAnalysisResult(updated);
            }}
          />
        </div>
      )}
    </div>
  );
};
