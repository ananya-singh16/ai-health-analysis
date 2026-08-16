import React from "react";
import { 
  HeartPulse, 
  BookOpen, 
  Layers, 
  AlertTriangle, 
  ShieldCheck, 
  Activity, 
  HelpCircle, 
  PhoneCall, 
  ArrowRight,
  Eye,
  Crosshair,
  FileText,
  Stethoscope
} from "lucide-react";

interface HealthGuidePageProps {
  onNavigate: (route: string) => void;
}

export const HealthGuidePage: React.FC<HealthGuidePageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-10 max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-rose-950 via-[#1a0f18] to-[#12080f] border border-rose-800/40 shadow-2xl text-white space-y-4">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-300 w-fit text-xs font-mono font-bold">
          <BookOpen className="w-3.5 h-3.5" />
          <span>CLINICAL EDUCATION & RADIOLOGY REFERENCE</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
          Brain Health & Cranial Diagnostic Guide
        </h1>
        <p className="text-sm sm:text-base text-rose-200/80 max-w-3xl leading-relaxed">
          Comprehensive medical overview of intracranial lesions, diagnostic MRI sequences, red flag symptoms, and clinical triage pathways.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => onNavigate("/analyze")}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs shadow-lg shadow-red-600/30 transition-all"
          >
            <HeartPulse className="w-4 h-4" />
            <span>Perform Cranial Scan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onNavigate("/appointments")}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-rose-900/60 hover:bg-rose-800 border border-rose-700 text-rose-200 font-bold text-xs transition-colors"
          >
            <Stethoscope className="w-4 h-4" />
            <span>Consult a Specialist</span>
          </button>
        </div>
      </div>

      {/* 4 Tumor Categories Guide */}
      <section className="space-y-4">
        <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-red-400" />
          <span>Primary Cranial Diagnostic Categories</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Glioma */}
          <div className="p-6 rounded-3xl bg-[#15121c] border border-rose-900/40 hover:border-red-500/50 transition-all shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-mono font-bold">
                INTRA-AXIAL LESION
              </span>
              <span className="text-xs text-rose-400 font-mono">High Priority</span>
            </div>
            <h3 className="text-lg font-bold text-white">Glioma (Astrocytoma / GBM)</h3>
            <p className="text-xs sm:text-sm text-rose-200/80 leading-relaxed">
              Arises from glial cells (astrocytes, oligodendrocytes) within the brain parenchyma. Frequently exhibits infiltrative margins, central necrosis, and significant surrounding vasogenic edema with local mass effect.
            </p>
            <div className="p-3 rounded-xl bg-black/40 border border-rose-950 text-xs text-rose-300/90 font-mono space-y-1">
              <div><strong>MRI Characteristic:</strong> T2/FLAIR hyperintensity, peripheral ring enhancement on T1+C.</div>
              <div><strong>Primary Triage:</strong> Immediate Neurosurgical Oncology evaluation & steroid protocol if edematous.</div>
            </div>
          </div>

          {/* Meningioma */}
          <div className="p-6 rounded-3xl bg-[#15121c] border border-rose-900/40 hover:border-amber-500/50 transition-all shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-mono font-bold">
                EXTRA-AXIAL LESION
              </span>
              <span className="text-xs text-amber-400 font-mono">Typically Benign (WHO Grade I)</span>
            </div>
            <h3 className="text-lg font-bold text-white">Meningioma</h3>
            <p className="text-xs sm:text-sm text-rose-200/80 leading-relaxed">
              Arises from the arachnoid cap cells of the meninges. Characterized by a broad dural attachment ("dural tail"), distinct cortical cleavage plane, and compression rather than direct parenchymal invasion.
            </p>
            <div className="p-3 rounded-xl bg-black/40 border border-rose-950 text-xs text-rose-300/90 font-mono space-y-1">
              <div><strong>MRI Characteristic:</strong> Intense homogeneous contrast enhancement, dural tail sign.</div>
              <div><strong>Primary Triage:</strong> Watch-and-wait surveillance for small asymptomatic lesions or microsurgical resection.</div>
            </div>
          </div>

          {/* Pituitary Tumor */}
          <div className="p-6 rounded-3xl bg-[#15121c] border border-rose-900/40 hover:border-cyan-500/50 transition-all shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-bold">
                SELLAR / SUPRASELLAR
              </span>
              <span className="text-xs text-cyan-400 font-mono">Endocrine & Visual Impact</span>
            </div>
            <h3 className="text-lg font-bold text-white">Pituitary Adenoma</h3>
            <p className="text-xs sm:text-sm text-rose-200/80 leading-relaxed">
              Arises within the sella turcica. When extending superiorly, it compresses the optic chiasm causing bitemporal hemianopsia and hormonal dysregulation (prolactinoma, Cushing's, acromegaly).
            </p>
            <div className="p-3 rounded-xl bg-black/40 border border-rose-950 text-xs text-rose-300/90 font-mono space-y-1">
              <div><strong>MRI Characteristic:</strong> Sellar enlargement, suprasellar extension, waist at diaphragmatic notch.</div>
              <div><strong>Primary Triage:</strong> Endocrine hormone panel, formal perimetry, and transsphenoidal surgery.</div>
            </div>
          </div>

          {/* Normal Brain */}
          <div className="p-6 rounded-3xl bg-[#15121c] border border-rose-900/40 hover:border-emerald-500/50 transition-all shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold">
                PHYSIOLOGICAL BASELINE
              </span>
              <span className="text-xs text-emerald-400 font-mono">Normal Cranial Parenchyma</span>
            </div>
            <h3 className="text-lg font-bold text-white">Normal Brain MRI</h3>
            <p className="text-xs sm:text-sm text-rose-200/80 leading-relaxed">
              Displays symmetric bilateral cerebral and cerebellar hemispheres, normal ventricular dimensions, preserved grey-white matter contrast, and midline pineal and pituitary glands without focal lesions.
            </p>
            <div className="p-3 rounded-xl bg-black/40 border border-rose-950 text-xs text-rose-300/90 font-mono space-y-1">
              <div><strong>MRI Characteristic:</strong> No abnormal mass effect, midline shift, or pathologic enhancement.</div>
              <div><strong>Primary Triage:</strong> Patient reassurance, routine lifestyle maintenance.</div>
            </div>
          </div>
        </div>
      </section>

      {/* Red Flag Neurological Symptoms */}
      <section className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-red-950/50 via-[#1a0f18] to-rose-950/50 border-2 border-red-500/30 shadow-2xl space-y-4">
        <div className="flex items-center gap-2.5 text-red-400">
          <AlertTriangle className="w-6 h-6 shrink-0" />
          <h2 className="text-xl font-black text-white">When to Seek Emergency Medical Attention</h2>
        </div>

        <p className="text-xs sm:text-sm text-rose-200/90 leading-relaxed">
          If you or a patient experience any of the following acute neurological symptoms, call emergency services (911) or proceed immediately to the nearest emergency trauma center:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2 text-xs">
          <div className="p-3.5 rounded-2xl bg-black/40 border border-red-900/40 space-y-1">
            <h4 className="font-bold text-red-300">1. Thunderclap Headache</h4>
            <p className="text-rose-200/70">Sudden, severe "worst headache of life", particularly with morning vomiting or positional worsening.</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-black/40 border border-red-900/40 space-y-1">
            <h4 className="font-bold text-red-300">2. New Onset Adult Seizures</h4>
            <p className="text-rose-200/70">First-time convulsive or focal seizures in individuals without a prior epilepsy diagnosis.</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-black/40 border border-red-900/40 space-y-1">
            <h4 className="font-bold text-red-300">3. Sudden Focal Deficits</h4>
            <p className="text-rose-200/70">Unilateral arm/leg weakness, facial droop, slurred speech (dysphasia), or sudden ataxia.</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-black/40 border border-red-900/40 space-y-1">
            <h4 className="font-bold text-red-300">4. Acute Vision Changes</h4>
            <p className="text-rose-200/70">Rapid loss of peripheral vision (bitemporal hemianopsia), double vision (diplopia), or papilledema.</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-black/40 border border-red-900/40 space-y-1">
            <h4 className="font-bold text-red-300">5. Cognitive/Behavioral Shift</h4>
            <p className="text-rose-200/70">Rapid personality shifts, progressive apathy, severe memory deficits, or altered consciousness.</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-black/40 border border-red-900/40 space-y-1">
            <h4 className="font-bold text-red-300">6. Emergency Hotline</h4>
            <p className="text-rose-200/70">Emergency Care: <strong>911</strong><br />Hospital Triage: <strong>(800) 555-CRANIAL</strong></p>
          </div>
        </div>
      </section>
    </div>
  );
};
