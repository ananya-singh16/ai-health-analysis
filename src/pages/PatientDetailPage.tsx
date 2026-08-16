import React, { useState, useEffect } from "react";
import { 
  User, 
  ArrowLeft, 
  HeartPulse, 
  Calendar, 
  FileText, 
  Activity, 
  Clock, 
  CheckCircle2, 
  Trash2, 
  Edit3, 
  AlertCircle,
  Phone,
  ChevronRight,
  CreditCard,
  Printer,
  ShieldCheck
} from "lucide-react";
import { Patient, AnalysisRecord } from "../types";
import { storageService } from "../services/storage";

interface PatientDetailPageProps {
  patientId: string;
  onNavigate: (route: string) => void;
}

export const PatientDetailPage: React.FC<PatientDetailPageProps> = ({
  patientId,
  onNavigate
}) => {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [patientScans, setPatientScans] = useState<AnalysisRecord[]>([]);

  useEffect(() => {
    const p = storageService.getPatientById(patientId);
    if (p) {
      setPatient(p);
      const allScans = storageService.getAnalyses();
      const linked = allScans.filter(s => s.patientId === patientId);
      setPatientScans(linked);
    }
  }, [patientId]);

  if (!patient) {
    return (
      <div className="p-12 text-center space-y-4 max-w-md mx-auto">
        <AlertCircle className="w-12 h-12 text-rose-400 mx-auto" />
        <h3 className="text-lg font-bold text-white">Patient Record Not Found</h3>
        <p className="text-xs text-rose-300/70">
          The requested patient ID <span className="font-mono text-red-400">"{patientId}"</span> does not exist in the hospital registry.
        </p>
        <button
          type="button"
          onClick={() => onNavigate("/patients")}
          className="px-4 py-2 rounded-xl bg-rose-950/60 border border-rose-800 text-xs text-rose-200 font-bold hover:bg-rose-900"
        >
          Return to Patients Directory
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-rose-900/40">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onNavigate("/patients")}
            className="p-2 rounded-xl bg-[#1c1724] border border-rose-900/50 text-rose-300 hover:text-white hover:bg-rose-900/40 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {patient.fullName}
            </h1>
            <p className="text-xs font-mono text-red-400">
              Health Record ID: {patient.id} • Registered {new Date(patient.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onNavigate("/appointments")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-200 font-bold text-xs sm:text-sm transition-colors"
          >
            <Calendar className="w-4 h-4 text-red-400" />
            <span>Book Visit</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate(`/analyze?patientId=${patient.id}`)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-xs sm:text-sm shadow-md shadow-red-600/30 transition-all hover:scale-[1.02] self-start sm:self-auto"
          >
            <HeartPulse className="w-4 h-4" />
            <span>Perform Cranial Scan</span>
          </button>
        </div>
      </div>

      {/* Patient Profile Card & Info Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Demographics & Digital Card */}
        <div className="lg:col-span-1 space-y-5">
          {/* Digital Health ID Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-red-950 via-[#220e1c] to-[#140b12] border-2 border-red-500/40 shadow-2xl text-white space-y-4 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HeartPulse className="w-5 h-5 text-red-400" />
                <span className="font-extrabold text-xs tracking-wider font-mono text-red-300">
                  NEUROCARE HEALTH ID
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-red-500/20 text-red-200 border border-red-500/30">
                ACTIVE
              </span>
            </div>

            <div className="pt-2">
              <h3 className="text-xl font-black text-white">{patient.fullName}</h3>
              <p className="text-xs font-mono text-rose-300/80">{patient.id}</p>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-rose-900/40 text-xs font-mono">
              <div>
                <span className="text-[10px] text-rose-400/60 block">AGE</span>
                <span className="font-bold">{patient.age} yrs</span>
              </div>
              <div>
                <span className="text-[10px] text-rose-400/60 block">GENDER</span>
                <span className="font-bold">{patient.gender}</span>
              </div>
              <div>
                <span className="text-[10px] text-rose-400/60 block">BLOOD</span>
                <span className="font-bold text-red-400">{patient.bloodGroup || "O+"}</span>
              </div>
            </div>

            <div className="text-[11px] text-rose-200/80 pt-2">
              <p>Doctor: <strong className="text-white">{patient.referringPhysician}</strong></p>
              <p>Emergency: <span className="font-mono text-rose-300">{patient.contactPhone || "+1 (555) 911-0000"}</span></p>
            </div>
          </div>

          {/* Clinical Notes Card */}
          <div className="p-6 rounded-3xl bg-[#15121c] border border-rose-900/40 shadow-xl space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-300 font-mono">
              Medical History & Symptoms
            </h4>
            <p className="text-xs text-rose-200/80 leading-relaxed bg-black/40 p-3 rounded-2xl border border-rose-950">
              {patient.medicalHistory}
            </p>

            {patient.notes && (
              <div className="pt-2">
                <span className="text-[11px] font-bold text-rose-300 uppercase block font-mono">Specialist Notes</span>
                <p className="text-xs text-rose-300/70 mt-1">{patient.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Longitudinal Cranial Scan History */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-[#15121c] border border-rose-900/40 shadow-xl space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-red-400" />
              <h3 className="text-base font-bold text-white">
                Cranial Diagnostic Examination Timeline
              </h3>
            </div>
            <span className="text-xs font-mono text-rose-300 bg-rose-950/60 px-3 py-1 rounded-full border border-rose-800">
              {patientScans.length} Scans Archived
            </span>
          </div>

          {patientScans.length === 0 ? (
            <div className="p-12 text-center border-2 border-dashed border-rose-900/40 rounded-3xl space-y-3">
              <HeartPulse className="w-10 h-10 text-rose-500/40 mx-auto" />
              <p className="text-xs text-rose-200/60">
                No cranial MRI scans have been evaluated for this patient yet.
              </p>
              <button
                type="button"
                onClick={() => onNavigate(`/analyze?patientId=${patient.id}`)}
                className="px-4 py-2 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs shadow-md"
              >
                Perform First Scan
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {patientScans.map((scan) => {
                const badgeColor = 
                  scan.prediction === "Glioma" ? "text-rose-300 bg-rose-500/20 border-rose-500/40" :
                  scan.prediction === "Meningioma" ? "text-amber-300 bg-amber-500/20 border-amber-500/40" :
                  scan.prediction === "Pituitary" ? "text-cyan-300 bg-cyan-500/20 border-cyan-500/40" :
                  "text-emerald-300 bg-emerald-500/20 border-emerald-500/40";

                return (
                  <div
                    key={scan.id}
                    className="p-4 rounded-2xl bg-[#1c1724] border border-rose-900/40 hover:border-rose-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-black border border-rose-900/60 overflow-hidden shrink-0">
                        <img
                          src={scan.imageUrl}
                          alt="Scan slice"
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs text-white">{scan.id}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${badgeColor}`}>
                            {scan.prediction}
                          </span>
                        </div>
                        <p className="text-[11px] text-rose-300/70 mt-0.5">
                          Confidence: <strong className="text-red-400 font-mono">{(scan.confidence * 100).toFixed(1)}%</strong> • {new Date(scan.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onNavigate(`/history/${scan.id}`)}
                      className="px-3.5 py-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-xs font-bold text-rose-200 border border-rose-800 flex items-center justify-center gap-1.5 self-start sm:self-auto transition-colors"
                    >
                      <span>View Report</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
