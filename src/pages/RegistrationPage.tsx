import React, { useState, useEffect } from "react";
import { 
  UserPlus, 
  ShieldCheck, 
  IdCard, 
  CheckCircle2, 
  HeartPulse, 
  Phone, 
  Mail, 
  Calendar, 
  MapPin, 
  FileText, 
  AlertCircle, 
  Download, 
  Printer, 
  User, 
  Stethoscope, 
  Building2, 
  BadgeCheck, 
  Sparkles,
  ArrowRight,
  RefreshCw,
  QrCode,
  Droplet
} from "lucide-react";
import { RegisteredUser, UserRole } from "../types";
import { storageService } from "../services/storage";

interface RegistrationPageProps {
  onNavigate: (route: string) => void;
}

export const RegistrationPage: React.FC<RegistrationPageProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<"patient" | "clinician" | "directory">("patient");
  const [users, setUsers] = useState<RegisteredUser[]>([]);
  const [currentUser, setCurrentUser] = useState<RegisteredUser | null>(null);
  const [showSuccessCard, setShowSuccessCard] = useState<RegisteredUser | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Form State for Patient Registration
  const [patientForm, setPatientForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    dateOfBirth: "1988-05-14",
    gender: "Female" as "Male" | "Female" | "Other",
    bloodGroup: "O+",
    emergencyContactName: "",
    emergencyContactPhone: "",
    address: "",
    medicalHistory: "",
    allergies: "No known drug allergies (NKDA)",
    notes: ""
  });

  // Form State for Clinician Registration
  const [clinicianForm, setClinicianForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "Doctor" as UserRole,
    department: "Neuroradiology & Neurology",
    licenseNumber: "",
    gender: "Male" as "Male" | "Female" | "Other",
    bloodGroup: "A+",
    address: "Medical Plaza, Suite 400",
    notes: ""
  });

  useEffect(() => {
    refreshUsers();
  }, []);

  const refreshUsers = () => {
    setUsers(storageService.getRegisteredUsers());
    setCurrentUser(storageService.getCurrentUser());
  };

  const handlePatientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!patientForm.fullName.trim()) {
      setFormError("Please enter the patient's full name before submitting.");
      return;
    }

    const newUser = storageService.registerUser({
      fullName: patientForm.fullName.trim(),
      email: patientForm.email.trim() || `${patientForm.fullName.toLowerCase().replace(/\s+/g, ".")}@patient-portal.org`,
      phone: patientForm.phone.trim() || "+1 (555) 000-0000",
      role: "Patient",
      gender: patientForm.gender,
      dateOfBirth: patientForm.dateOfBirth,
      bloodGroup: patientForm.bloodGroup,
      emergencyContactName: patientForm.emergencyContactName || "Family Emergency Contact",
      emergencyContactPhone: patientForm.emergencyContactPhone || "+1 (555) 999-0000",
      address: patientForm.address || "Clinical Care Patient Address",
      medicalHistory: patientForm.medicalHistory || "None documented upon enrollment",
      allergies: patientForm.allergies || "No known drug allergies",
      notes: patientForm.notes || "Registered via Patient Intake Portal"
    });

    refreshUsers();
    setShowSuccessCard(newUser);
    setFormError(null);
    // Reset form
    setPatientForm({
      fullName: "",
      email: "",
      phone: "",
      dateOfBirth: "1990-01-01",
      gender: "Female",
      bloodGroup: "O+",
      emergencyContactName: "",
      emergencyContactPhone: "",
      address: "",
      medicalHistory: "",
      allergies: "No known drug allergies (NKDA)",
      notes: ""
    });
  };

  const handleClinicianSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!clinicianForm.fullName.trim()) {
      setFormError("Please enter the clinician or staff member's full name.");
      return;
    }

    const newUser = storageService.registerUser({
      fullName: clinicianForm.fullName.trim(),
      email: clinicianForm.email.trim() || `${clinicianForm.fullName.toLowerCase().replace(/\s+/g, ".")}@neurocare-health.org`,
      phone: clinicianForm.phone.trim() || "+1 (555) 777-8888",
      role: clinicianForm.role,
      gender: clinicianForm.gender,
      bloodGroup: clinicianForm.bloodGroup,
      department: clinicianForm.department,
      licenseNumber: clinicianForm.licenseNumber || `LIC-${Math.floor(100000 + Math.random() * 900000)}`,
      address: clinicianForm.address,
      notes: clinicianForm.notes || "Attending medical staff member"
    });

    refreshUsers();
    setShowSuccessCard(newUser);
    setFormError(null);
    setClinicianForm({
      fullName: "",
      email: "",
      phone: "",
      role: "Doctor",
      department: "Neuroradiology & Neurology",
      licenseNumber: "",
      gender: "Male",
      bloodGroup: "A+",
      address: "Medical Plaza, Suite 400",
      notes: ""
    });
  };

  const handleSwitchAccount = (user: RegisteredUser) => {
    storageService.setCurrentUser(user);
    setCurrentUser(user);
  };

  const handlePrintCard = () => {
    window.print();
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-rose-900/30">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20">
              <UserPlus className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Patient & Staff Registration
              </h1>
              <p className="text-xs sm:text-sm text-rose-200/70 mt-0.5">
                Register new patients, doctors, and specialists to generate digital health credentials.
              </p>
            </div>
          </div>
        </div>

        {/* Active User Indicator */}
        {currentUser && (
          <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-rose-950/40 border border-rose-800/40 text-xs">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-red-500 to-rose-700 flex items-center justify-center font-bold text-white shadow-xs">
              {currentUser.role === "Doctor" || currentUser.role === "Radiologist" ? "Dr" : "Pt"}
            </div>
            <div>
              <span className="text-[10px] text-rose-300 font-mono uppercase block">Active Profile</span>
              <span className="text-slate-100 font-bold">{currentUser.fullName}</span>
            </div>
          </div>
        )}
      </div>

      {/* Success Health ID Card Modal / Banner */}
      {showSuccessCard && (
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-rose-950 via-[#1c0f16] to-[#12080f] border-2 border-red-500/40 shadow-2xl text-white space-y-6 animate-in fade-in zoom-in-95">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-rose-800/50 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold">
                  REGISTRATION COMPLETED
                </span>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-100">
                  Digital Health Card & Credentials Generated
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                type="button"
                onClick={handlePrintCard}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-900/60 hover:bg-rose-800 border border-rose-700 text-xs font-semibold text-rose-200 transition-colors"
              >
                <Printer className="w-4 h-4 text-rose-400" />
                <span>Print Card</span>
              </button>
              <button
                type="button"
                onClick={() => setShowSuccessCard(null)}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>

          {/* Digital Medical Card Visual */}
          <div className="max-w-md mx-auto p-6 rounded-3xl bg-gradient-to-br from-red-600 via-rose-700 to-rose-900 shadow-2xl border border-rose-400/30 text-white relative overflow-hidden printable-card">
            {/* Card Background Pattern */}
            <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-white/10 rounded-full blur-xl pointer-events-none"></div>

            <div className="flex items-center justify-between border-b border-white/20 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <HeartPulse className="w-5 h-5 text-white" />
                <span className="font-extrabold tracking-tight text-sm">NEUROCARE HEALTH</span>
              </div>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-white/20 text-white font-bold">
                {showSuccessCard.role.toUpperCase()} CARD
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-[10px] uppercase text-rose-200 block font-mono">Full Name</span>
                <h4 className="text-xl font-black tracking-tight">{showSuccessCard.fullName}</h4>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] uppercase text-rose-200 block font-mono">Health ID</span>
                  <span className="font-mono font-bold">{showSuccessCard.nationalHealthId || showSuccessCard.id}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-rose-200 block font-mono">Blood Group</span>
                  <span className="font-bold flex items-center gap-1">
                    <Droplet className="w-3 h-3 text-red-200" />
                    {showSuccessCard.bloodGroup || "O+"}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-rose-200 block font-mono">Contact Phone</span>
                  <span className="font-mono">{showSuccessCard.phone}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-rose-200 block font-mono">Registered Date</span>
                  <span>{new Date(showSuccessCard.registeredAt).toLocaleDateString()}</span>
                </div>
              </div>

              {showSuccessCard.role === "Doctor" && showSuccessCard.licenseNumber && (
                <div className="pt-2 border-t border-white/20 text-xs">
                  <span className="text-[10px] uppercase text-rose-200 block font-mono">Medical License No.</span>
                  <span className="font-mono font-bold">{showSuccessCard.licenseNumber}</span>
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between text-[10px] text-rose-100">
              <span>Emergency Hotline: 911 / (800) 555-CRANIAL</span>
              <QrCode className="w-6 h-6 opacity-80" />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => onNavigate("/analyze")}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs shadow-lg shadow-red-600/25"
            >
              <HeartPulse className="w-4 h-4" />
              <span>Proceed to MRI Analysis</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate("/appointments")}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-rose-900/60 hover:bg-rose-800 border border-rose-700 text-rose-200 font-bold text-xs"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Doctor Consultation</span>
            </button>
          </div>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#141219] border border-rose-900/30 max-w-md">
        <button
          type="button"
          onClick={() => { setActiveTab("patient"); setFormError(null); }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs transition-all ${
            activeTab === "patient"
              ? "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-red-600/20"
              : "text-rose-200/70 hover:text-white"
          }`}
        >
          <User className="w-4 h-4" />
          <span>Patient Registration</span>
        </button>

        <button
          type="button"
          onClick={() => { setActiveTab("clinician"); setFormError(null); }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs transition-all ${
            activeTab === "clinician"
              ? "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-red-600/20"
              : "text-rose-200/70 hover:text-white"
          }`}
        >
          <Stethoscope className="w-4 h-4" />
          <span>Doctor / Staff</span>
        </button>

        <button
          type="button"
          onClick={() => { setActiveTab("directory"); setFormError(null); }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs transition-all ${
            activeTab === "directory"
              ? "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-red-600/20"
              : "text-rose-200/70 hover:text-white"
          }`}
        >
          <IdCard className="w-4 h-4" />
          <span>Directory ({users.length})</span>
        </button>
      </div>

      {formError && (
        <div className="p-4 rounded-2xl bg-red-950/80 border border-red-500/50 flex items-center gap-3 text-red-200 text-xs sm:text-sm">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <p className="font-semibold">{formError}</p>
        </div>
      )}

      {/* Tab 1: Patient Registration Form */}
      {activeTab === "patient" && (
        <form onSubmit={handlePatientSubmit} className="p-6 sm:p-8 rounded-3xl bg-[#15121c] border border-rose-900/40 shadow-2xl space-y-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-rose-900/30">
            <div className="p-2 rounded-xl bg-red-500/10 text-red-400">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Patient Intake & Medical Profile</h3>
              <p className="text-xs text-rose-200/70">Enter patient biographical, emergency, and clinical intake history.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Full Name */}
            <div className="lg:col-span-2 space-y-1.5">
              <label className="block text-xs font-mono uppercase text-rose-300 font-semibold">
                Patient Full Name *
              </label>
              <input
                type="text"
                required
                value={patientForm.fullName}
                onChange={(e) => setPatientForm({ ...patientForm, fullName: e.target.value })}
                placeholder="e.g. Rachel Jenkins"
                className="w-full px-4 py-2.5 rounded-xl bg-[#1c1724] border border-rose-900/50 text-xs sm:text-sm text-slate-100 placeholder-rose-200/30 focus:outline-hidden focus:border-red-500 focus:ring-1 focus:ring-red-500/30"
              />
            </div>

            {/* Blood Group */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono uppercase text-rose-300 font-semibold">
                Blood Group
              </label>
              <select
                value={patientForm.bloodGroup}
                onChange={(e) => setPatientForm({ ...patientForm, bloodGroup: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#1c1724] border border-rose-900/50 text-xs sm:text-sm text-slate-100 focus:outline-hidden focus:border-red-500"
              >
                {["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"].map(bg => (
                  <option key={bg} value={bg} className="bg-[#1c1724]">{bg}</option>
                ))}
              </select>
            </div>

            {/* Date of Birth */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono uppercase text-rose-300 font-semibold">
                Date of Birth
              </label>
              <input
                type="date"
                value={patientForm.dateOfBirth}
                onChange={(e) => setPatientForm({ ...patientForm, dateOfBirth: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#1c1724] border border-rose-900/50 text-xs sm:text-sm text-slate-100 focus:outline-hidden focus:border-red-500"
              />
            </div>

            {/* Gender */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono uppercase text-rose-300 font-semibold">
                Gender
              </label>
              <select
                value={patientForm.gender}
                onChange={(e) => setPatientForm({ ...patientForm, gender: e.target.value as any })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#1c1724] border border-rose-900/50 text-xs sm:text-sm text-slate-100 focus:outline-hidden focus:border-red-500"
              >
                <option value="Female" className="bg-[#1c1724]">Female</option>
                <option value="Male" className="bg-[#1c1724]">Male</option>
                <option value="Other" className="bg-[#1c1724]">Other</option>
              </select>
            </div>

            {/* Phone Number */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono uppercase text-rose-300 font-semibold">
                Phone Number *
              </label>
              <input
                type="tel"
                value={patientForm.phone}
                onChange={(e) => setPatientForm({ ...patientForm, phone: e.target.value })}
                placeholder="+1 (555) 123-4567"
                className="w-full px-4 py-2.5 rounded-xl bg-[#1c1724] border border-rose-900/50 text-xs sm:text-sm text-slate-100 placeholder-rose-200/30 focus:outline-hidden focus:border-red-500"
              />
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono uppercase text-rose-300 font-semibold">
                Email Address
              </label>
              <input
                type="email"
                value={patientForm.email}
                onChange={(e) => setPatientForm({ ...patientForm, email: e.target.value })}
                placeholder="patient@example.org"
                className="w-full px-4 py-2.5 rounded-xl bg-[#1c1724] border border-rose-900/50 text-xs sm:text-sm text-slate-100 placeholder-rose-200/30 focus:outline-hidden focus:border-red-500"
              />
            </div>

            {/* Emergency Contact Name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono uppercase text-rose-300 font-semibold">
                Emergency Contact Name
              </label>
              <input
                type="text"
                value={patientForm.emergencyContactName}
                onChange={(e) => setPatientForm({ ...patientForm, emergencyContactName: e.target.value })}
                placeholder="e.g. John Jenkins (Spouse)"
                className="w-full px-4 py-2.5 rounded-xl bg-[#1c1724] border border-rose-900/50 text-xs sm:text-sm text-slate-100 placeholder-rose-200/30 focus:outline-hidden focus:border-red-500"
              />
            </div>

            {/* Emergency Contact Phone */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono uppercase text-rose-300 font-semibold">
                Emergency Contact Phone
              </label>
              <input
                type="tel"
                value={patientForm.emergencyContactPhone}
                onChange={(e) => setPatientForm({ ...patientForm, emergencyContactPhone: e.target.value })}
                placeholder="+1 (555) 987-6543"
                className="w-full px-4 py-2.5 rounded-xl bg-[#1c1724] border border-rose-900/50 text-xs sm:text-sm text-slate-100 placeholder-rose-200/30 focus:outline-hidden focus:border-red-500"
              />
            </div>

            {/* Address */}
            <div className="lg:col-span-3 space-y-1.5">
              <label className="block text-xs font-mono uppercase text-rose-300 font-semibold">
                Residential Address
              </label>
              <input
                type="text"
                value={patientForm.address}
                onChange={(e) => setPatientForm({ ...patientForm, address: e.target.value })}
                placeholder="Street address, City, State, Postal Code"
                className="w-full px-4 py-2.5 rounded-xl bg-[#1c1724] border border-rose-900/50 text-xs sm:text-sm text-slate-100 placeholder-rose-200/30 focus:outline-hidden focus:border-red-500"
              />
            </div>

            {/* Known Allergies */}
            <div className="lg:col-span-3 space-y-1.5">
              <label className="block text-xs font-mono uppercase text-rose-300 font-semibold">
                Known Drug Allergies
              </label>
              <input
                type="text"
                value={patientForm.allergies}
                onChange={(e) => setPatientForm({ ...patientForm, allergies: e.target.value })}
                placeholder="e.g. Penicillin, Iodine Contrast, Sulfa"
                className="w-full px-4 py-2.5 rounded-xl bg-[#1c1724] border border-rose-900/50 text-xs sm:text-sm text-slate-100 placeholder-rose-200/30 focus:outline-hidden focus:border-red-500"
              />
            </div>

            {/* Medical History */}
            <div className="lg:col-span-3 space-y-1.5">
              <label className="block text-xs font-mono uppercase text-rose-300 font-semibold">
                Medical & Neurological History
              </label>
              <textarea
                rows={3}
                value={patientForm.medicalHistory}
                onChange={(e) => setPatientForm({ ...patientForm, medicalHistory: e.target.value })}
                placeholder="Document prior diagnoses, headaches, seizure history, medications, or surgical interventions..."
                className="w-full p-3 rounded-xl bg-[#1c1724] border border-rose-900/50 text-xs sm:text-sm text-slate-100 placeholder-rose-200/30 focus:outline-hidden focus:border-red-500"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-rose-900/30">
            <p className="text-xs text-rose-300/80">
              <ShieldCheck className="w-4 h-4 inline text-red-400 mr-1" />
              Patient records are encrypted and saved to the local hospital database.
            </p>

            <button
              type="submit"
              className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-sm shadow-lg shadow-red-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <UserPlus className="w-4 h-4" />
              <span>Complete Patient Registration</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 2: Clinician / Staff Registration Form */}
      {activeTab === "clinician" && (
        <form onSubmit={handleClinicianSubmit} className="p-6 sm:p-8 rounded-3xl bg-[#15121c] border border-rose-900/40 shadow-2xl space-y-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-rose-900/30">
            <div className="p-2 rounded-xl bg-red-500/10 text-red-400">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Doctor & Specialist Enrollment</h3>
              <p className="text-xs text-rose-200/70">Register medical staff, neurologists, neurosurgeons, and radiologists.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Clinician Name */}
            <div className="lg:col-span-2 space-y-1.5">
              <label className="block text-xs font-mono uppercase text-rose-300 font-semibold">
                Doctor / Clinician Full Name *
              </label>
              <input
                type="text"
                required
                value={clinicianForm.fullName}
                onChange={(e) => setClinicianForm({ ...clinicianForm, fullName: e.target.value })}
                placeholder="e.g. Dr. Arthur Bennett, MD"
                className="w-full px-4 py-2.5 rounded-xl bg-[#1c1724] border border-rose-900/50 text-xs sm:text-sm text-slate-100 placeholder-rose-200/30 focus:outline-hidden focus:border-red-500"
              />
            </div>

            {/* Role */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono uppercase text-rose-300 font-semibold">
                Staff Role
              </label>
              <select
                value={clinicianForm.role}
                onChange={(e) => setClinicianForm({ ...clinicianForm, role: e.target.value as UserRole })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#1c1724] border border-rose-900/50 text-xs sm:text-sm text-slate-100 focus:outline-hidden focus:border-red-500"
              >
                <option value="Doctor" className="bg-[#1c1724]">Doctor / Neurologist</option>
                <option value="Radiologist" className="bg-[#1c1724]">Neuroradiologist</option>
                <option value="Nurse" className="bg-[#1c1724]">Nurse Practitioner</option>
                <option value="Admin" className="bg-[#1c1724]">Clinical Administrator</option>
              </select>
            </div>

            {/* Department */}
            <div className="lg:col-span-2 space-y-1.5">
              <label className="block text-xs font-mono uppercase text-rose-300 font-semibold">
                Department / Specialty
              </label>
              <input
                type="text"
                value={clinicianForm.department}
                onChange={(e) => setClinicianForm({ ...clinicianForm, department: e.target.value })}
                placeholder="e.g. Neurosurgical Oncology & Cranial Care"
                className="w-full px-4 py-2.5 rounded-xl bg-[#1c1724] border border-rose-900/50 text-xs sm:text-sm text-slate-100 placeholder-rose-200/30 focus:outline-hidden focus:border-red-500"
              />
            </div>

            {/* License Number */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono uppercase text-rose-300 font-semibold">
                Medical License ID
              </label>
              <input
                type="text"
                value={clinicianForm.licenseNumber}
                onChange={(e) => setClinicianForm({ ...clinicianForm, licenseNumber: e.target.value })}
                placeholder="e.g. MED-NR-99201"
                className="w-full px-4 py-2.5 rounded-xl bg-[#1c1724] border border-rose-900/50 text-xs sm:text-sm text-slate-100 placeholder-rose-200/30 focus:outline-hidden focus:border-red-500 font-mono"
              />
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono uppercase text-rose-300 font-semibold">
                Work Contact Phone
              </label>
              <input
                type="tel"
                value={clinicianForm.phone}
                onChange={(e) => setClinicianForm({ ...clinicianForm, phone: e.target.value })}
                placeholder="+1 (555) 444-5555"
                className="w-full px-4 py-2.5 rounded-xl bg-[#1c1724] border border-rose-900/50 text-xs sm:text-sm text-slate-100 placeholder-rose-200/30 focus:outline-hidden focus:border-red-500"
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono uppercase text-rose-300 font-semibold">
                Hospital Email
              </label>
              <input
                type="email"
                value={clinicianForm.email}
                onChange={(e) => setClinicianForm({ ...clinicianForm, email: e.target.value })}
                placeholder="doctor@neurocare-health.org"
                className="w-full px-4 py-2.5 rounded-xl bg-[#1c1724] border border-rose-900/50 text-xs sm:text-sm text-slate-100 placeholder-rose-200/30 focus:outline-hidden focus:border-red-500"
              />
            </div>

            {/* Office / Clinic Address */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono uppercase text-rose-300 font-semibold">
                Office / Clinic Location
              </label>
              <input
                type="text"
                value={clinicianForm.address}
                onChange={(e) => setClinicianForm({ ...clinicianForm, address: e.target.value })}
                placeholder="Medical Arts Plaza, Wing 3B"
                className="w-full px-4 py-2.5 rounded-xl bg-[#1c1724] border border-rose-900/50 text-xs sm:text-sm text-slate-100 placeholder-rose-200/30 focus:outline-hidden focus:border-red-500"
              />
            </div>

            {/* Notes */}
            <div className="lg:col-span-3 space-y-1.5">
              <label className="block text-xs font-mono uppercase text-rose-300 font-semibold">
                Clinical Qualifications & Focus Areas
              </label>
              <textarea
                rows={2}
                value={clinicianForm.notes}
                onChange={(e) => setClinicianForm({ ...clinicianForm, notes: e.target.value })}
                placeholder="Specialist in cranial MRI volumetric reviews, stereotactic biopsies, skull base lesions..."
                className="w-full p-3 rounded-xl bg-[#1c1724] border border-rose-900/50 text-xs sm:text-sm text-slate-100 placeholder-rose-200/30 focus:outline-hidden focus:border-red-500"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-rose-900/30">
            <p className="text-xs text-rose-300/80">
              <BadgeCheck className="w-4 h-4 inline text-red-400 mr-1" />
              Verified staff credentials are automatically authorized for diagnostic reviews.
            </p>

            <button
              type="submit"
              className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-sm shadow-lg shadow-red-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Stethoscope className="w-4 h-4" />
              <span>Enroll Healthcare Provider</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 3: Registered Directory & Profiles */}
      {activeTab === "directory" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Registered Users & Active Accounts</h3>
            <span className="text-xs font-mono text-rose-300 bg-rose-950/60 px-3 py-1 rounded-full border border-rose-800/40">
              {users.length} Active Records
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {users.map((u) => {
              const isCurrent = currentUser?.id === u.id;
              const isDoc = u.role === "Doctor" || u.role === "Radiologist";

              return (
                <div
                  key={u.id}
                  className={`p-5 rounded-3xl transition-all border ${
                    isCurrent
                      ? "bg-gradient-to-br from-rose-950/70 to-[#18111e] border-red-500/60 shadow-xl shadow-red-600/10"
                      : "bg-[#15121c] border-rose-900/40 hover:border-rose-700/60"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-white shadow-sm ${
                        isDoc ? "bg-gradient-to-br from-red-600 to-rose-700" : "bg-gradient-to-br from-rose-700 to-red-900"
                      }`}>
                        {isDoc ? <Stethoscope className="w-5 h-5" /> : <User className="w-5 h-5" />}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-sm sm:text-base text-white">{u.fullName}</h4>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                            isDoc ? "bg-red-500/20 text-red-300 border border-red-500/30" : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                          }`}>
                            {u.role}
                          </span>
                        </div>
                        <span className="text-xs text-rose-300/80 font-mono">{u.nationalHealthId || u.id}</span>
                      </div>
                    </div>

                    {isCurrent ? (
                      <span className="text-[11px] font-bold font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Active
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSwitchAccount(u)}
                        className="text-xs px-3 py-1 rounded-xl bg-rose-900/50 hover:bg-rose-800 border border-rose-700 text-rose-200 font-semibold transition-colors"
                      >
                        Switch To
                      </button>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-rose-900/30 grid grid-cols-2 gap-2 text-xs text-rose-200/80">
                    <div>
                      <span className="text-[10px] text-rose-400/60 block uppercase font-mono">Contact</span>
                      <span className="truncate block">{u.phone}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-rose-400/60 block uppercase font-mono">Blood Group</span>
                      <span className="font-bold text-red-300">{u.bloodGroup || "O+"}</span>
                    </div>
                    {u.department && (
                      <div className="col-span-2">
                        <span className="text-[10px] text-rose-400/60 block uppercase font-mono">Department</span>
                        <span className="truncate block text-slate-200">{u.department}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
