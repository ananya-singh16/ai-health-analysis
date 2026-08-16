import { AnalysisRecord, TumorClass, FocusRegion, ModelMetrics } from "../types";
import { storageService } from "./storage";

export interface PredictParams {
  image: string; // data URL or base64
  patientId?: string;
  patientName?: string;
  sampleType?: TumorClass;
  fileName?: string;
  fileSize?: string;
  fileDimensions?: string;
}

export interface PredictResponse {
  id: string;
  patient_id: string;
  prediction: TumorClass;
  confidence: number;
  class_probabilities: {
    "Glioma": number;
    "Meningioma": number;
    "Pituitary": number;
    "No Tumor": number;
    [key: string]: number;
  };
  inference_time_ms: number;
  model_version: string;
  is_demo: boolean;
  timestamp: string;
  gradcam: {
    heatmap_ready: boolean;
    target_layer: string;
    focus_region: FocusRegion;
    colormap_recommended?: "JET" | "VIRIDIS" | "INFERNO" | "COOLWARM";
    note?: string;
  };
  disclaimer: string;
}

export const apiService = {
  /**
   * Run brain MRI tumor classification inference
   * Calls /api/predict on the server, which interfaces with external ML service or provides deterministic demo inference
   */
  async predict(params: PredictParams): Promise<AnalysisRecord> {
    const settings = storageService.getSettings();
    let responseData: PredictResponse;

    try {
      const response = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: params.image,
          patientId: params.patientId,
          isDemo: settings.demoMode,
          sampleType: params.sampleType,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      responseData = await response.json();
    } catch (err) {
      console.warn("Direct /api/predict call failed, generating simulated client-side inference:", err);
      // Fallback deterministic simulation if network/server is momentarily restarting
      const pred: TumorClass = params.sampleType || "Glioma";
      const conf = pred === "No Tumor" ? 0.98 : (pred === "Pituitary" ? 0.96 : (pred === "Meningioma" ? 0.91 : 0.94));
      
      const probs = {
        "Glioma": pred === "Glioma" ? conf : 0.04,
        "Meningioma": pred === "Meningioma" ? conf : 0.03,
        "Pituitary": pred === "Pituitary" ? conf : 0.02,
        "No Tumor": pred === "No Tumor" ? conf : 0.01
      };
      // Normalize
      const sum = Object.values(probs).reduce((a, b) => a + b, 0);
      Object.keys(probs).forEach(k => { probs[k as keyof typeof probs] = Number((probs[k as keyof typeof probs] / sum).toFixed(3)); });

      responseData = {
        id: `SCAN-${Math.floor(1000 + Math.random() * 9000)}-${new Date().getFullYear()}`,
        patient_id: params.patientId || "PT-2026-101",
        prediction: pred,
        confidence: conf,
        class_probabilities: probs,
        inference_time_ms: 145,
        model_version: "NeuroScan-ResNet50-GradCAMv2",
        is_demo: true,
        timestamp: new Date().toISOString(),
        gradcam: {
          heatmap_ready: true,
          target_layer: "layer4.2.conv3 (Residual Stage)",
          focus_region: pred === "Meningioma" 
            ? { x: 0.33, y: 0.36, radius: 0.16, intensity: 0.89, quadrant: "Left Frontal Convexity" }
            : pred === "Pituitary"
            ? { x: 0.50, y: 0.59, radius: 0.13, intensity: 0.96, quadrant: "Central Sellar Region" }
            : pred === "No Tumor"
            ? { x: 0.50, y: 0.50, radius: 0.05, intensity: 0.10, quadrant: "Normal Ventricular Symmetrical" }
            : { x: 0.62, y: 0.40, radius: 0.20, intensity: 0.94, quadrant: "Right Temporoparietal" },
          colormap_recommended: "JET",
          note: "DEMO PLACEHOLDER — Highlighted gradient activation regions are simulated for demonstration."
        },
        disclaimer: "DEMO RESULT — For educational/research purposes only."
      };
    }

    // Lookup patient name if available
    let patientName = params.patientName || "Anonymous Patient";
    if (params.patientId) {
      const p = storageService.getPatientById(params.patientId);
      if (p) patientName = p.fullName;
    }

    // Form final AnalysisRecord
    const record: AnalysisRecord = {
      id: responseData.id,
      patientId: responseData.patient_id,
      patientName: patientName,
      date: responseData.timestamp,
      imageUrl: params.image,
      fileName: params.fileName || "brain_mri_scan.png",
      fileSize: params.fileSize || "2.4 MB",
      fileDimensions: params.fileDimensions || "512 x 512 px",
      prediction: responseData.prediction,
      confidence: responseData.confidence,
      classProbabilities: responseData.class_probabilities,
      inferenceTimeMs: responseData.inference_time_ms,
      modelVersion: responseData.model_version,
      isDemo: responseData.is_demo,
      gradcam: responseData.gradcam,
      status: "Completed"
    };

    // Auto generate educational draft report
    if (settings.autoGenerateReport) {
      try {
        const report = await this.generateReport({
          prediction: record.prediction,
          confidence: record.confidence,
          probabilities: record.classProbabilities,
          patientInfo: {
            patientId: record.patientId,
            patientName: record.patientName,
          },
          focusRegion: record.gradcam.focus_region
        });
        record.generatedReport = report.report_text;
      } catch (e) {
        console.warn("Auto report draft skipped:", e);
      }
    }

    // Save to storage
    storageService.saveAnalysis(record);
    storageService.addNotification({
      title: "Analysis Complete",
      message: `Brain scan analyzed: ${record.prediction} (${(record.confidence * 100).toFixed(1)}% confidence).`,
      type: "success",
      link: `/history`
    });

    return record;
  },

  /**
   * Generate educational draft radiology synthesis
   */
  async generateReport(params: {
    prediction: TumorClass;
    confidence: number;
    probabilities: Record<string, number>;
    patientInfo?: Record<string, any>;
    focusRegion?: FocusRegion;
  }): Promise<{ report_text: string; source: string }> {
    try {
      const res = await fetch("/api/generate-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn("Failed to call /api/generate-report:", e);
    }

    return {
      report_text: `### Summary of AI Findings\nThe CNN deep learning classifier predicted **${params.prediction}** with **${(params.confidence * 100).toFixed(1)}%** confidence.\n\n### Educational Findings\n- Activation localized around ${params.focusRegion?.quadrant || "Frontoparietal cortex"}.\n- Saliency pattern highlights hyperintense contrast/edema regions.\n\n---\n⚠️ *DISCLAIMER: For educational/research purposes only.*`,
      source: "Local Structured Template"
    };
  },

  /**
   * Fetch model specs & baseline metrics
   */
  async fetchModelInfo(): Promise<any> {
    try {
      const res = await fetch("/api/model-info");
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn("Failed to fetch model info from server:", e);
    }

    return {
      model_name: "NeuroScan ResNet-50 Classifier",
      framework: "PyTorch / TensorFlow / Keras Compatible",
      dataset: "Brain MRI Classification Dataset",
      metrics: {
        accuracy: "Not configured",
        precision: "Not configured",
        recall: "Not configured",
        f1_score: "Not configured"
      }
    };
  }
};
