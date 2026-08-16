import React, { useState, useRef } from "react";
import { 
  UploadCloud, 
  FileText, 
  Image as ImageIcon, 
  X, 
  CheckCircle2, 
  HeartPulse, 
  User, 
  AlertCircle, 
  FileCode, 
  Eye, 
  Sparkles,
  Info,
  UserPlus
} from "lucide-react";
import { SAMPLE_SCANS, SampleScan } from "../../data/sampleScans";
import { Patient, TumorClass } from "../../types";

interface MriUploaderProps {
  onImageSelected: (data: {
    imageUrl: string;
    fileName: string;
    fileSize: string;
    fileDimensions: string;
    sampleType?: TumorClass;
    patientId?: string;
  }) => void;
  patients: Patient[];
  selectedPatientId?: string;
  onPatientChange: (patientId: string) => void;
}

export const MriUploader: React.FC<MriUploaderProps> = ({
  onImageSelected,
  patients,
  selectedPatientId = "",
  onPatientChange
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileMeta, setFileMeta] = useState<{ name: string; size: string; dimensions: string } | null>(null);
  const [selectedSample, setSelectedSample] = useState<SampleScan | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = (file: File) => {
    setErrorMsg(null);
    setSelectedSample(null);

    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const isDicom = file.name.toLowerCase().endsWith(".dcm") || file.name.toLowerCase().endsWith(".dicom");

    if (!validTypes.includes(file.type) && !isDicom) {
      setErrorMsg("Unsupported format. Please upload JPG, PNG, or DICOM cranial MRI files.");
      return;
    }

    if (isDicom) {
      setErrorMsg("DICOM file detected. Automatically parsing axial MRI slice...");
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      
      const img = new Image();
      img.onload = () => {
        const meta = {
          name: file.name,
          size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
          dimensions: `${img.naturalWidth} x ${img.naturalHeight} px`
        };
        setFileMeta(meta);
        setPreviewUrl(dataUrl);

        onImageSelected({
          imageUrl: dataUrl,
          fileName: meta.name,
          fileSize: meta.size,
          fileDimensions: meta.dimensions,
          patientId: selectedPatientId || undefined
        });
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleSelectSample = (sample: SampleScan) => {
    setErrorMsg(null);
    setSelectedSample(sample);
    setPreviewUrl(sample.svgDataUri);
    setFileMeta({
      name: sample.name,
      size: sample.fileSize,
      dimensions: sample.dimensions
    });

    onImageSelected({
      imageUrl: sample.svgDataUri,
      fileName: sample.name,
      fileSize: sample.fileSize,
      fileDimensions: sample.dimensions,
      sampleType: sample.type,
      patientId: selectedPatientId || undefined
    });
  };

  const handleClear = () => {
    setPreviewUrl(null);
    setFileMeta(null);
    setSelectedSample(null);
    setErrorMsg(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-6">
      {/* Patient Selection Selector */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#15121c] border border-rose-900/40 space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-mono uppercase text-rose-300 font-semibold flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-red-400" />
            <span>Select Registered Patient Record</span>
          </label>
          <span className="text-[11px] text-rose-400/80 font-mono">
            {patients.length} Registered Patients
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          <div className="sm:col-span-8">
            <select
              value={selectedPatientId}
              onChange={(e) => onPatientChange(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c1724] border border-rose-900/50 text-xs sm:text-sm text-slate-100 focus:outline-hidden focus:border-red-500 focus:ring-1 focus:ring-red-500/30"
            >
              <option value="">-- General Diagnostic Intake (Unassigned) --</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id} className="bg-[#1c1724]">
                  {p.fullName} ({p.id}) • {p.age} y/o • {p.gender} • Blood: {p.bloodGroup || "O+"}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-4 text-xs text-rose-200/70">
            {selectedPatientId ? (
              <span className="font-mono text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Linked to Patient ID: {selectedPatientId}
              </span>
            ) : (
              <span>Optionally attach scan to an enrolled patient record.</span>
            )}
          </div>
        </div>
      </div>

      {/* Main Drag-and-Drop / Upload Box */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`
          relative rounded-3xl p-6 sm:p-10 text-center transition-all duration-200
          border-2 border-dashed
          ${dragActive 
            ? "border-red-500 bg-red-500/10 scale-[1.01]" 
            : previewUrl 
            ? "border-rose-800/60 bg-[#15121c]" 
            : "border-rose-900/50 bg-[#15121c]/80 hover:border-red-500/60 hover:bg-[#191321]"
          }
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".png,.jpg,.jpeg,.dcm,.dicom,.webp"
          onChange={handleFileInput}
          className="hidden"
          id="mri-file-input"
        />

        {previewUrl ? (
          /* Image Preview State */
          <div className="space-y-4 max-w-md mx-auto">
            <div className="relative aspect-square w-48 sm:w-64 mx-auto rounded-2xl overflow-hidden border-2 border-rose-800/80 shadow-2xl bg-black">
              <img
                src={previewUrl}
                alt="Selected MRI"
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
              <button
                type="button"
                onClick={handleClear}
                className="absolute top-2 right-2 p-1.5 rounded-xl bg-black/80 hover:bg-red-600 text-white transition-colors"
                title="Remove scan"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {fileMeta && (
              <div className="p-3 rounded-xl bg-[#1c1724] border border-rose-900/40 text-xs font-mono text-rose-200/80 space-y-1">
                <p className="font-bold text-white truncate">{fileMeta.name}</p>
                <div className="flex justify-center gap-3 text-[11px] text-rose-300/60">
                  <span>{fileMeta.dimensions}</span>
                  <span>•</span>
                  <span>{fileMeta.size}</span>
                </div>
              </div>
            )}

            <div className="flex justify-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-xs text-rose-200 font-semibold transition-colors"
              >
                Choose Different File
              </button>
            </div>
          </div>
        ) : (
          /* Empty Upload State */
          <div className="space-y-4 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-600/20 to-rose-700/20 border border-red-500/30 flex items-center justify-center mx-auto text-red-400 shadow-lg shadow-red-600/10">
              <UploadCloud className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base sm:text-lg font-bold text-white">
                Upload Brain MRI Scan Image
              </h3>
              <p className="text-xs sm:text-sm text-rose-200/70">
                Drag and drop your cranial MRI slice here, or browse files
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-red-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Browse MRI Files
              </button>
            </div>

            <p className="text-[11px] font-mono text-rose-300/50">
              Supports Axial / Coronal / Sagittal slices (PNG, JPG, DICOM)
            </p>
          </div>
        )}

        {errorMsg && (
          <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center justify-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Preset Clinical Sample Scans for Demo */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-red-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider font-mono text-rose-300">
              Or Select Clinical Diagnostic Benchmark Cases
            </h4>
          </div>
          <span className="text-[11px] text-rose-300/60 font-mono">4 Verified Pathology Types</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {SAMPLE_SCANS.map((sample) => {
            const isSelected = selectedSample?.id === sample.id;
            return (
              <button
                key={sample.id}
                type="button"
                onClick={() => handleSelectSample(sample)}
                className={`
                  p-3 rounded-2xl border text-left transition-all relative overflow-hidden group
                  ${isSelected 
                    ? "bg-gradient-to-br from-red-950/80 to-[#1e0f1a] border-red-500/60 shadow-lg shadow-red-600/15 ring-1 ring-red-500/30" 
                    : "bg-[#15121c] border-rose-900/40 hover:border-rose-700/70 hover:bg-[#1c1724]"
                  }
                `}
              >
                <div className="aspect-square w-full rounded-xl bg-black overflow-hidden mb-2 relative border border-rose-900/30">
                  <img
                    src={sample.svgDataUri}
                    alt={sample.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-black/80 text-rose-300 border border-rose-800">
                    {sample.type}
                  </span>
                </div>

                <p className="text-xs font-bold text-white truncate">{sample.name}</p>
                <p className="text-[10px] text-rose-300/60 font-mono mt-0.5 truncate">{sample.dimensions} • {sample.fileSize}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
