import React, { useState } from "react";
import { 
  Settings, 
  HeartPulse, 
  Link, 
  Sliders, 
  Database, 
  RotateCcw, 
  Check, 
  AlertCircle, 
  Download, 
  Upload, 
  Trash2,
  Sparkles,
  Palette,
  CheckCircle2,
  RefreshCw,
  ShieldCheck,
  Building2
} from "lucide-react";
import { AppSettings } from "../types";
import { storageService } from "../services/storage";
import { ColorMapType } from "../services/gradcamCanvas";
import { downloadCompleteProjectZip } from "../services/projectExport";

interface SettingsPageProps {
  settings: AppSettings;
  onUpdateSettings: (settings: AppSettings) => void;
  onResetData: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  settings,
  onUpdateSettings,
  onResetData
}) => {
  const [formData, setFormData] = useState<AppSettings>(settings);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [testEndpointStatus, setTestEndpointStatus] = useState<"idle" | "testing" | "success" | "error">("idle");
  const [testEndpointMsg, setTestEndpointMsg] = useState("");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleTestConnection = async () => {
    if (!formData.customEndpointUrl) {
      setTestEndpointStatus("error");
      setTestEndpointMsg("Please enter a clinical server URL to test.");
      return;
    }

    setTestEndpointStatus("testing");
    setTestEndpointMsg("Connecting to hospital radiology server...");

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 4000);

      const res = await fetch(formData.customEndpointUrl, {
        method: "GET",
        signal: controller.signal,
      }).catch(() => null);

      clearTimeout(timeout);

      if (res && (res.ok || res.status === 405 || res.status === 404)) {
        setTestEndpointStatus("success");
        setTestEndpointMsg("Radiology server reachable! Status " + res.status);
      } else {
        setTestEndpointStatus("error");
        setTestEndpointMsg("Server not reachable. Please verify PACS/DICOM endpoint URL.");
      }
    } catch (err: any) {
      setTestEndpointStatus("error");
      setTestEndpointMsg("Failed to connect: " + (err.message || "Network Error"));
    }
  };

  const handleExportBackup = () => {
    const data = {
      patients: storageService.getPatients(),
      analyses: storageService.getAnalyses(),
      settings: storageService.getSettings(),
      exportDate: new Date().toISOString()
    };

    const jsonStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
    const link = document.createElement("a");
    link.href = jsonStr;
    link.download = `neurocare_hospital_backup_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const json = JSON.parse(ev.target?.result as string);
        if (json.patients && json.analyses) {
          localStorage.setItem("neuroscan_patients", JSON.stringify(json.patients));
          localStorage.setItem("neuroscan_analyses", JSON.stringify(json.analyses));
          if (json.settings) {
            storageService.saveSettings(json.settings);
            setFormData(json.settings);
            onUpdateSettings(json.settings);
          }
          alert("Hospital records restored successfully!");
          window.location.reload();
        } else {
          alert("Invalid hospital backup format.");
        }
      } catch (err) {
        alert("Failed to parse backup JSON file.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-rose-900/40">
        <div>
          <div className="flex items-center gap-2.5">
            <Settings className="w-6 h-6 text-red-400" />
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Clinical & System Settings
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-rose-200/70 mt-1">
            Configure clinic simulation modes, local server endpoints, radiology palettes, and database backups.
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>Settings Saved</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Clinical Practice Simulation Mode */}
        <div className="p-6 rounded-3xl bg-[#15121c] border border-rose-900/40 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <HeartPulse className="w-5 h-5 text-red-400" />
              <div>
                <h3 className="text-base font-bold text-white">
                  Practice Simulation Mode
                </h3>
                <p className="text-xs text-rose-300/70">
                  Enables instant clinical presentation with sample cranial scans and lesion detection
                </p>
              </div>
            </div>

            {/* Toggle Switch */}
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.demoMode}
                onChange={(e) => setFormData({ ...formData, demoMode: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-12 h-6 bg-rose-950 border border-rose-800 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-rose-300 after:border after:rounded-full after:h-5 after:width-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
            </label>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#1c1724] border border-rose-900/40 text-xs text-rose-200/80 space-y-1">
            <p className="leading-relaxed">
              <strong className="text-white">When Practice Mode is ON: </strong>
              Generates diagnostic confidence distributions and saliency heatmaps for rapid medical workflow demonstration.
            </p>
            <p className="text-rose-300/60 leading-relaxed">
              <strong className="text-rose-200">When Practice Mode is OFF: </strong>
              The application connects directly to your hospital's local diagnostic server.
            </p>
          </div>
        </div>

        {/* Section 2: Hospital Diagnostic Server Endpoint */}
        <div className="p-6 rounded-3xl bg-[#15121c] border border-rose-900/40 shadow-xl space-y-4">
          <div className="flex items-center gap-2.5">
            <Link className="w-5 h-5 text-red-400" />
            <div>
              <h3 className="text-base font-bold text-white">
                Hospital Diagnostic Server Endpoint
              </h3>
              <p className="text-xs text-rose-300/70">
                Connect your medical imaging server or PACS network
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-mono text-rose-300 uppercase">
              Server URL
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="url"
                value={formData.customEndpointUrl}
                onChange={(e) => setFormData({ ...formData, customEndpointUrl: e.target.value })}
                placeholder="http://localhost:5000/predict"
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#1c1724] border border-rose-900/50 text-xs sm:text-sm text-slate-100 focus:outline-hidden focus:border-red-500 font-mono"
              />
              <button
                type="button"
                onClick={handleTestConnection}
                className="px-4 py-2.5 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-xs font-bold text-rose-200 transition-colors shrink-0"
              >
                Test Connection
              </button>
            </div>
          </div>

          {testEndpointStatus !== "idle" && (
            <div className={`p-3 rounded-xl text-xs font-mono flex items-center gap-2 ${
              testEndpointStatus === "success" ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-300" :
              testEndpointStatus === "error" ? "bg-rose-500/20 border border-rose-500/40 text-rose-300" :
              "bg-red-500/20 border border-red-500/40 text-red-300"
            }`}>
              {testEndpointStatus === "testing" ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> :
               testEndpointStatus === "success" ? <CheckCircle2 className="w-3.5 h-3.5" /> :
               <AlertCircle className="w-3.5 h-3.5" />}
              <span>{testEndpointMsg}</span>
            </div>
          )}
        </div>

        {/* Section 3: Diagnostic Metrics Display */}
        <div className="p-6 rounded-3xl bg-[#15121c] border border-rose-900/40 shadow-xl space-y-4">
          <div className="flex items-center gap-2.5">
            <Sliders className="w-5 h-5 text-red-400" />
            <div>
              <h3 className="text-base font-bold text-white">
                Diagnostic Quality Benchmarks
              </h3>
              <p className="text-xs text-rose-300/70">
                Calibrated system performance metrics displayed in the clinical dashboard
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-mono text-rose-400/80 uppercase mb-1">
                Accuracy
              </label>
              <input
                type="text"
                value={formData.customMetrics.accuracy || ""}
                onChange={(e) => setFormData({
                  ...formData,
                  customMetrics: { ...formData.customMetrics, accuracy: e.target.value }
                })}
                placeholder="Not configured"
                className="w-full px-3 py-2 rounded-xl bg-[#1c1724] border border-rose-900/50 text-xs font-mono text-red-300 focus:outline-hidden focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-rose-400/80 uppercase mb-1">
                Precision
              </label>
              <input
                type="text"
                value={formData.customMetrics.precision || ""}
                onChange={(e) => setFormData({
                  ...formData,
                  customMetrics: { ...formData.customMetrics, precision: e.target.value }
                })}
                placeholder="Not configured"
                className="w-full px-3 py-2 rounded-xl bg-[#1c1724] border border-rose-900/50 text-xs font-mono text-emerald-300 focus:outline-hidden focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-rose-400/80 uppercase mb-1">
                Recall (Sensitivity)
              </label>
              <input
                type="text"
                value={formData.customMetrics.recall || ""}
                onChange={(e) => setFormData({
                  ...formData,
                  customMetrics: { ...formData.customMetrics, recall: e.target.value }
                })}
                placeholder="Not configured"
                className="w-full px-3 py-2 rounded-xl bg-[#1c1724] border border-rose-900/50 text-xs font-mono text-rose-300 focus:outline-hidden focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-rose-400/80 uppercase mb-1">
                F1-Score
              </label>
              <input
                type="text"
                value={formData.customMetrics.f1Score || ""}
                onChange={(e) => setFormData({
                  ...formData,
                  customMetrics: { ...formData.customMetrics, f1Score: e.target.value }
                })}
                placeholder="Not configured"
                className="w-full px-3 py-2 rounded-xl bg-[#1c1724] border border-rose-900/50 text-xs font-mono text-amber-300 focus:outline-hidden focus:border-red-500"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Default Colormap Preference */}
        <div className="p-6 rounded-3xl bg-[#15121c] border border-rose-900/40 shadow-xl space-y-4">
          <div className="flex items-center gap-2.5">
            <Palette className="w-5 h-5 text-red-400" />
            <div>
              <h3 className="text-base font-bold text-white">
                Radiological Heatmap Palette
              </h3>
              <p className="text-xs text-rose-300/70">
                Default thermal colormap for lesion saliency visualization
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {(["JET", "VIRIDIS", "INFERNO", "COOLWARM"] as ColorMapType[]).map((cmap) => (
              <button
                key={cmap}
                type="button"
                onClick={() => setFormData({ ...formData, defaultColormap: cmap })}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  formData.defaultColormap === cmap
                    ? "bg-red-500/20 border-red-500 text-white font-bold"
                    : "bg-[#1c1724] border-rose-900/50 text-rose-300/70 hover:text-white"
                }`}
              >
                <span className="text-xs font-mono block">{cmap}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="submit"
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-sm shadow-lg shadow-red-600/30 transition-all hover:scale-105 active:scale-95"
          >
            Save Hospital Settings
          </button>
        </div>
      </form>

      {/* Section 5: Data & Demo Repository Management */}
      <div className="p-6 rounded-3xl bg-[#15121c] border border-rose-900/40 shadow-xl space-y-4">
        <div className="flex items-center gap-2.5">
          <Database className="w-5 h-5 text-red-400" />
          <div>
            <h3 className="text-base font-bold text-white">
              Hospital Records Management & Restore
            </h3>
            <p className="text-xs text-rose-300/70">
              Export full clinical patient records or reset to standard demonstration records
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleExportBackup}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#1c1724] hover:bg-rose-900/40 border border-rose-900/50 text-xs font-bold text-rose-200 transition-colors"
          >
            <Download className="w-4 h-4 text-red-400" />
            <span>Export Patient Database</span>
          </button>

          <label className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#1c1724] hover:bg-rose-900/40 border border-rose-900/50 text-xs font-bold text-rose-200 transition-colors cursor-pointer">
            <Upload className="w-4 h-4 text-emerald-400" />
            <span>Import Patient Database</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportBackup}
              className="hidden"
            />
          </label>

          <button
            type="button"
            onClick={async () => {
              await downloadCompleteProjectZip();
            }}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 border border-red-500/40 text-xs font-black text-white shadow-md transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Download Entire Project as ZIP</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (confirm("Reset hospital database back to initial sample patient and scan records?")) {
                onResetData();
                alert("Demo dataset restored successfully!");
              }
            }}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-xs font-bold text-rose-300 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Demo Records</span>
          </button>
        </div>
      </div>
    </div>
  );
};
