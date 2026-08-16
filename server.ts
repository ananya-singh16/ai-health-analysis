import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Body parser
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Lazy initialize Gemini client if API key is provided
let genAIClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!genAIClient && process.env.GEMINI_API_KEY) {
    try {
      genAIClient = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    } catch (e) {
      console.warn("Failed to initialize Google GenAI SDK:", e);
    }
  }
  return genAIClient;
}

// ----------------------------------------------------
// Health Check Endpoint
// ----------------------------------------------------
app.get("/api/health", (req, res) => {
  res.json({
    status: "online",
    service: "NeuroScan AI Inference Engine",
    version: "2.1.0-research",
    demo_mode: !process.env.ML_MODEL_ENDPOINT,
    ml_endpoint_connected: !!process.env.ML_MODEL_ENDPOINT,
    gemini_enabled: !!process.env.GEMINI_API_KEY,
    disclaimer: "For educational and research purposes only. Not a medical diagnostic device."
  });
});

// ----------------------------------------------------
// Model Information Endpoint
// ----------------------------------------------------
app.get("/api/model-info", (req, res) => {
  res.json({
    model_name: "NeuroScan ResNet-50 / CNN Backbone",
    framework: "PyTorch / TensorFlow / Keras Compatible",
    input_resolution: "224 x 224 x 3 (Grayscale converted to RGB)",
    preprocessing: [
      "Brain MRI Skull Stripping & Noise Reduction (Gaussian Filter)",
      "Intensity Normalization (Z-score standard deviation)",
      "Data Augmentation (Random Rotation ±15°, Horizontal Flip, Elastic Deform)",
      "CLAHE (Contrast Limited Adaptive Histogram Equalization)"
    ],
    classes: [
      { id: "Glioma", name: "Glioma", description: "Primary brain tumor arising from glial cells (astrocytomas, oligodendrogliomas, glioblastomas)." },
      { id: "Meningioma", name: "Meningioma", description: "Typically benign, slow-growing tumor arising from the meninges wrapping the brain and spinal cord." },
      { id: "Pituitary", name: "Pituitary Tumor", description: "Abnormal growth in the pituitary gland at the base of the brain, typically adenomas." },
      { id: "No Tumor", name: "No Tumor (Normal)", description: "Normal brain anatomy showing clear ventricles, grey/white matter differentiation without focal space-occupying lesions." }
    ],
    dataset: "Brain MRI Classification Dataset (Kaggle / Figshare / TCGA-LGG)",
    metrics: {
      accuracy: "Not configured",
      precision: "Not configured",
      recall: "Not configured",
      f1_score: "Not configured",
      status: "Placeholder metrics — connect real trained model weights"
    }
  });
});

// ----------------------------------------------------
// ML Model Inference Endpoint (/api/predict)
// ----------------------------------------------------
app.post("/api/predict", async (req, res) => {
  try {
    const { image, patientId, isDemo = true, sampleType } = req.body;

    if (!image) {
      return res.status(400).json({ error: "No MRI image data provided" });
    }

    // Check if external ML model server URL is configured (e.g. Python FastAPI)
    const customEndpoint = process.env.ML_MODEL_ENDPOINT;
    if (customEndpoint && !isDemo) {
      try {
        const mlResponse = await fetch(customEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image, patient_id: patientId }),
        });

        if (mlResponse.ok) {
          const mlData = await mlResponse.json();
          return res.json({
            ...mlData,
            is_demo: false,
            timestamp: new Date().toISOString()
          });
        }
      } catch (err) {
        console.warn("External ML endpoint failed, falling back to simulation:", err);
      }
    }

    // ----------------------------------------------------
    // DEMO / SIMULATION INFERENCE ENGINE
    // Deterministic or Sample-Guided for robust presentation
    // ----------------------------------------------------
    let predictedClass: "Glioma" | "Meningioma" | "Pituitary" | "No Tumor" = "Glioma";
    let confidence = 0.94;
    let probabilities: Record<string, number> = {};
    let focusRegion = { x: 0.58, y: 0.42, radius: 0.18, intensity: 0.92, quadrant: "Right Frontoparietal" };

    if (sampleType === "Meningioma") {
      predictedClass = "Meningioma";
      confidence = 0.91;
      probabilities = {
        "Meningioma": 0.91,
        "Glioma": 0.05,
        "Pituitary": 0.02,
        "No Tumor": 0.02
      };
      focusRegion = { x: 0.32, y: 0.35, radius: 0.15, intensity: 0.89, quadrant: "Left Parasagittal Convexity" };
    } else if (sampleType === "Pituitary") {
      predictedClass = "Pituitary";
      confidence = 0.96;
      probabilities = {
        "Pituitary": 0.96,
        "Meningioma": 0.02,
        "Glioma": 0.01,
        "No Tumor": 0.01
      };
      focusRegion = { x: 0.50, y: 0.58, radius: 0.12, intensity: 0.95, quadrant: "Sellar / Suprasellar Region" };
    } else if (sampleType === "No Tumor" || sampleType === "Normal") {
      predictedClass = "No Tumor";
      confidence = 0.98;
      probabilities = {
        "No Tumor": 0.98,
        "Glioma": 0.01,
        "Meningioma": 0.005,
        "Pituitary": 0.005
      };
      focusRegion = { x: 0.50, y: 0.50, radius: 0.05, intensity: 0.15, quadrant: "Normal Ventricular Symmetrical" };
    } else {
      // Default sample / custom uploaded file
      predictedClass = "Glioma";
      confidence = 0.93;
      probabilities = {
        "Glioma": 0.93,
        "Meningioma": 0.04,
        "Pituitary": 0.02,
        "No Tumor": 0.01
      };
      focusRegion = { x: 0.62, y: 0.38, radius: 0.20, intensity: 0.94, quadrant: "Right Temporoparietal" };
    }

    const scanId = `NS-${Math.floor(1000 + Math.random() * 9000)}-${new Date().getFullYear()}`;

    // Synthetic inference latency simulation (120ms to 240ms)
    const inferenceTime = Math.floor(120 + Math.random() * 110);

    return res.json({
      id: scanId,
      patient_id: patientId || "PT-DEMO-001",
      prediction: predictedClass,
      confidence: confidence,
      class_probabilities: probabilities,
      inference_time_ms: inferenceTime,
      model_version: "NeuroScan-ResNet50-GradCAMv2",
      is_demo: true,
      timestamp: new Date().toISOString(),
      gradcam: {
        heatmap_ready: true,
        target_layer: "layer4.2.conv3 (Bottleneck Residual Stage)",
        focus_region: focusRegion,
        colormap_recommended: "JET",
        note: "DEMO PLACEHOLDER — Highlighted gradient activation regions are simulated for demonstration. Connect your trained PyTorch/TensorFlow model for real Grad-CAM generation."
      },
      disclaimer: "DEMO RESULT — For educational/research purposes only. This tool does not replace professional medical diagnosis."
    });
  } catch (error) {
    console.error("Error in /api/predict:", error);
    res.status(500).json({ error: "Failed to process MRI scan analysis" });
  }
});

// ----------------------------------------------------
// AI Educational Radiologist Synthesis Report Endpoint
// ----------------------------------------------------
app.post("/api/generate-report", async (req, res) => {
  try {
    const { prediction, confidence, probabilities, patientInfo, focusRegion } = req.body;

    const ai = getGenAI();
    if (ai && process.env.GEMINI_API_KEY) {
      try {
        const prompt = `You are an academic radiology AI assistant providing an EDUCATIONAL and RESEARCH report on an automated MRI classification output.
Target Predicted Class: ${prediction}
Confidence: ${(confidence * 100).toFixed(1)}%
Class Probabilities: ${JSON.stringify(probabilities)}
Focus Region: ${focusRegion?.quadrant || "Central Cerebral"}
Patient Demographics (Anonymized): Age ${patientInfo?.age || "N/A"}, Gender ${patientInfo?.gender || "N/A"}, Symptoms: ${patientInfo?.symptoms || "None reported"}

Generate a structured academic summary with the following sections in clean Markdown:
1. **Summary of AI Findings** (Brief 2-sentence clinical interpretation of the classification)
2. **Key Imaging Features Observed** (3 concise bullet points explaining what visual features typical for ${prediction} in MRI imaging such as T1/T2 signal, mass effect, or boundary definition)
3. **Differential Considerations** (Alternative classifications considered in probability distribution)
4. **Educational Next Steps & Recommendations** (Academic follow-up imaging suggestions e.g., Contrast-enhanced T1w, FLAIR, Spectroscopy)

Mandatory Rule: End with the sentence: "⚠️ DISCLAIMER: This report is generated strictly for educational and engineering research purposes. It is NOT a clinical diagnosis."`;

        const response = await ai.models.generateContent({
          model: "gemini-3.7-flash",
          contents: prompt,
        });

        if (response && response.text) {
          return res.json({
            report_text: response.text,
            source: "Gemini-3.7-Flash Educational Assistant",
            generated_at: new Date().toISOString()
          });
        }
      } catch (err) {
        console.warn("Gemini report generation failed, using fallback structured draft:", err);
      }
    }

    // Fallback structured high quality academic report template
    const reportFallback = `### Summary of AI Findings
The deep convolutional neural network model classified this brain MRI scan as **${prediction}** with an estimated softmax confidence of **${(confidence * 100).toFixed(1)}%**. The feature activation maps predominantly localize intensity gradients within the **${focusRegion?.quadrant || "Frontoparietal region"}**.

### Key Imaging Features Associated with ${prediction}
- **Signal Characteristics**: Hypo-to-isointense on T1-weighted sequences, hyperintense on T2/FLAIR with localized surrounding vasogenic edema patterns.
- **Morphology & Margins**: Mass effect observed with architectural distortion of adjacent sulcal spaces and white matter tracts.
- **Localization**: High Grad-CAM gradient salience in the ${focusRegion?.quadrant || "designated anatomical focus area"}.

### Differential Considerations
- Secondary class probability: ${probabilities ? Object.entries(probabilities).filter(([k]) => k !== prediction).map(([k, v]) => `${k} (${((v as number) * 100).toFixed(1)}%)`).join(', ') : 'None significant'}.

### Research & Follow-Up Protocols
- Correlate with volumetric multi-parametric MRI (Post-contrast T1+Gd, DWI/ADC mapping, MR Perfusion).
- Formal radiological review required prior to any clinical evaluation.

---
⚠️ *DISCLAIMER: This report is generated strictly for educational and engineering research purposes. It is NOT a clinical diagnosis.*`;

    res.json({
      report_text: reportFallback,
      source: "NeuroScan Built-in Structured Educational Engine",
      generated_at: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error in /api/generate-report:", error);
    res.status(500).json({ error: "Failed to generate report" });
  }
});

// ----------------------------------------------------
// Complete Project ZIP Download API Endpoint
// ----------------------------------------------------
app.get(["/api/download-zip", "/api/export-project"], async (req, res) => {
  try {
    const fs = await import("fs/promises");
    const JSZip = (await import("jszip")).default;
    const zip = new JSZip();

    async function addFolderToZip(dirPath: string, zipFolder: any) {
      const entries = await fs.readdir(dirPath, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);
        if (
          entry.name === "node_modules" ||
          entry.name === ".git" ||
          entry.name === "dist" ||
          entry.name === ".turbo" ||
          entry.name.endsWith(".log")
        ) {
          continue;
        }

        if (entry.isDirectory()) {
          const subFolder = zipFolder.folder(entry.name);
          await addFolderToZip(fullPath, subFolder);
        } else if (entry.isFile()) {
          const content = await fs.readFile(fullPath);
          zipFolder.file(entry.name, content);
        }
      }
    }

    const projectRoot = process.cwd();
    await addFolderToZip(projectRoot, zip);

    const zipBuffer = await zip.generateAsync({
      type: "nodebuffer",
      compression: "DEFLATE",
      compressionOptions: { level: 9 }
    });

    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", 'attachment; filename="neurocare-health-portal-full-project.zip"');
    res.setHeader("Content-Length", zipBuffer.length);
    return res.send(zipBuffer);
  } catch (err: any) {
    console.error("Error generating project ZIP on server:", err);
    res.status(500).json({ error: "Failed to generate project ZIP archive", details: err?.message });
  }
});

// ----------------------------------------------------
// Vite Middleware / Static Server
// ----------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`NeuroScan AI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
