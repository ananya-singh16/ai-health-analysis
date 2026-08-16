import React, { useState, useEffect } from "react";
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  Trash2, 
  Edit3, 
  ChevronRight, 
  HeartPulse, 
  Calendar, 
  Activity, 
  FileText,
  User,
  Check,
  AlertTriangle,
  CreditCard,
  Download,
  FileSpreadsheet,
  Package,
  Table as TableIcon,
  LayoutGrid,
  Phone,
  Mail,
  Droplet,
  ShieldCheck,
  Stethoscope,
  Clock,
  Eye,
  AlertCircle,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Patient } from "../types";
import { storageService } from "../services/storage";
import { 
  exportPatientRecordsJSON, 
  exportPatientsCSV, 
  downloadCompleteProjectZip, 
  ExportProgress 
} from "../services/projectExport";
import { Modal } from "../components/common/Modal";

interface PatientsPageProps {
  onNavigate: (route: string) => void;
}

export const PatientsPage: React.FC<PatientsPageProps> = ({ onNavigate }) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [genderFilter, setGenderFilter] = useState("all");
  const [doctorFilter, setDoctorFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  
  // Selected Patient Quick Dossier Modal
  const [selectedPatientModal, setSelectedPatientModal] = useState<Patient | null>(null);

  // Add/Edit Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  
  // Project Export status state
  const [exportProgress, setExportProgress] = useState<ExportProgress | null>(null);
  const [exportSuccessMsg, setExportSuccessMsg] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<Partial<Patient>>({
    fullName: "",
    age: 45,
    gender: "Male",
    bloodGroup: "O+",
    contactPhone: "",
    email: "",
    nationalHealthId: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    allergies: "No known drug allergies (NKDA)",
    medicalHistory: "",
    referringPhysician: "Dr. Catherine Hayes, MD",
    notes: ""
  });

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = () => {
    setPatients(storageService.getPatients());
  };

  const handleOpenAddModal = () => {
    setEditingPatient(null);
    setFormData({
      fullName: "",
      age: 45,
      gender: "Male",
      bloodGroup: "O+",
      contactPhone: "+1 (555) 234-5678",
      email: "",
      nationalHealthId: `NHD-PAT-${Math.floor(10000 + Math.random() * 90000)}`,
      emergencyContactName: "Primary Emergency Contact",
      emergencyContactPhone: "+1 (555) 999-1234",
      allergies: "No known drug allergies (NKDA)",
      medicalHistory: "Referred for recurring episodic cranial headaches and dizziness.",
      referringPhysician: "Dr. Catherine Hayes, MD",
      notes: "Routine neurological intake candidate."
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (patient: Patient) => {
    setEditingPatient(patient);
    setFormData(patient);
    setIsModalOpen(true);
  };

  const handleSavePatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName?.trim()) return;

    if (editingPatient) {
      // Update
      const updated: Patient = {
        ...editingPatient,
        fullName: formData.fullName || editingPatient.fullName,
        age: Number(formData.age) || editingPatient.age,
        gender: (formData.gender as "Male" | "Female" | "Other") || editingPatient.gender,
        bloodGroup: formData.bloodGroup || editingPatient.bloodGroup,
        contactPhone: formData.contactPhone || editingPatient.contactPhone,
        email: formData.email || editingPatient.email,
        nationalHealthId: formData.nationalHealthId || editingPatient.nationalHealthId,
        emergencyContactName: formData.emergencyContactName || editingPatient.emergencyContactName,
        emergencyContactPhone: formData.emergencyContactPhone || editingPatient.emergencyContactPhone,
        allergies: formData.allergies || editingPatient.allergies,
        medicalHistory: formData.medicalHistory || editingPatient.medicalHistory,
        referringPhysician: formData.referringPhysician || editingPatient.referringPhysician,
        notes: formData.notes || editingPatient.notes
      };
      storageService.savePatient(updated);
    } else {
      // Create new
      const newId = `PAT-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
      const newPatient: Patient = {
        id: newId,
        fullName: formData.fullName || "Registered Patient",
        age: Number(formData.age) || 40,
        gender: (formData.gender as "Male" | "Female" | "Other") || "Other",
        bloodGroup: formData.bloodGroup || "O+",
        contact: formData.contactPhone || "+1 (555) 000-0000",
        contactPhone: formData.contactPhone || "+1 (555) 000-0000",
        email: formData.email || `${(formData.fullName || "patient").toLowerCase().replace(/\s+/g, ".")}@example.org`,
        nationalHealthId: formData.nationalHealthId || `NHD-PAT-${Math.floor(10000 + Math.random() * 90000)}`,
        emergencyContactName: formData.emergencyContactName || "Emergency Contact",
        emergencyContactPhone: formData.emergencyContactPhone || "+1 (555) 999-0000",
        allergies: formData.allergies || "No known drug allergies (NKDA)",
        medicalHistory: formData.medicalHistory || "None documented upon registration",
        referringPhysician: formData.referringPhysician || "Dr. Catherine Hayes, MD",
        notes: formData.notes || "Newly registered clinical patient",
        createdAt: new Date().toISOString(),
        scanIds: []
      };
      storageService.savePatient(newPatient);
    }

    loadPatients();
    setIsModalOpen(false);
  };

  const handleDeletePatient = (id: string, name: string) => {
    if (confirm(`Are you sure you want to permanently remove the patient health record for ${name} (${id})?`)) {
      storageService.deletePatient(id);
      loadPatients();
      if (selectedPatientModal?.id === id) {
        setSelectedPatientModal(null);
      }
    }
  };

  const handleDownloadProjectZip = async () => {
    setExportProgress({ status: "building", progress: 10, currentFile: "Preparing project archive..." });
    await downloadCompleteProjectZip((prog) => {
      setExportProgress(prog);
      if (prog.status === "ready") {
        setExportSuccessMsg("NeuroCare project repository downloaded as ZIP successfully!");
        setTimeout(() => setExportSuccessMsg(null), 5000);
      }
    });
  };

  const doctorList = Array.from(new Set(patients.map(p => p.referringPhysician || "Unassigned"))).filter(Boolean);

  const filteredPatients = patients.filter((p) => {
    const matchesSearch = 
      p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.nationalHealthId && p.nationalHealthId.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.referringPhysician && p.referringPhysician.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.medicalHistory && p.medicalHistory.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesGender = genderFilter === "all" || p.gender === genderFilter;
    const matchesDoctor = doctorFilter === "all" || p.referringPhysician === doctorFilter;

    return matchesSearch && matchesGender && matchesDoctor;
  });

  return (
    <div className="space-y-8">
      {/* Top Clinical Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-rose-900/40">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-600 to-rose-700 flex items-center justify-center text-white shadow-lg shadow-red-600/30">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
                Doctor's Patient Directory
                <span className="text-xs font-mono font-bold text-red-300 bg-red-500/20 px-2.5 py-0.5 rounded-full border border-red-500/30">
                  {patients.length} Registered
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-rose-200/70 mt-0.5">
                Comprehensive patient registry with permanent local persistence, medical histories, and cranial scan dossiers.
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Export JSON */}
          <button
            type="button"
            onClick={exportPatientRecordsJSON}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 border border-rose-800/60 text-rose-200 text-xs font-bold transition-all"
            title="Download full patient database as JSON"
          >
            <Download className="w-3.5 h-3.5 text-red-400" />
            <span>Export JSON</span>
          </button>

          {/* Export CSV */}
          <button
            type="button"
            onClick={exportPatientsCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 border border-rose-800/60 text-rose-200 text-xs font-bold transition-all"
            title="Export patient list to CSV Spreadsheet"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export CSV</span>
          </button>

          {/* Download Complete Project ZIP */}
          <button
            type="button"
            onClick={handleDownloadProjectZip}
            disabled={exportProgress?.status === "building" || exportProgress?.status === "zipping"}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-red-700 to-rose-700 hover:from-red-600 hover:to-rose-600 text-white text-xs font-black shadow-md shadow-red-700/25 transition-all disabled:opacity-50"
            title="Package and download the entire NeuroCare project codebase as a ZIP"
          >
            <Package className="w-3.5 h-3.5" />
            <span>
              {exportProgress?.status === "building" || exportProgress?.status === "zipping"
                ? `Packaging (${exportProgress.progress}%)`
                : "Download Project ZIP"}
            </span>
          </button>

          {/* Add Patient Button */}
          <button
            type="button"
            onClick={handleOpenAddModal}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-xs shadow-md shadow-red-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <UserPlus className="w-4 h-4" />
            <span>New Patient</span>
          </button>
        </div>
      </div>

      {/* Export Success Notification Banner */}
      {exportSuccessMsg && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs font-semibold flex items-center justify-between shadow-lg"
        >
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{exportSuccessMsg}</span>
          </div>
          <span className="text-[10px] text-emerald-300/80 font-mono">ZIP ARCHIVE READY</span>
        </motion.div>
      )}

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-3xl bg-[#15121c] border border-rose-900/40 flex flex-col md:flex-row items-center justify-between gap-3 shadow-xl">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-rose-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search patient, ID, doctor, diagnosis..."
            className="w-full pl-9 pr-4 py-2 bg-[#1c1724] border border-rose-900/50 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-rose-300/40 focus:outline-hidden focus:border-red-500 transition-all"
          />
        </div>

        {/* Doctor & Gender Filters */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Doctor Filter */}
          <div className="flex items-center gap-1.5 bg-[#1c1724] border border-rose-900/50 px-2.5 py-1.5 rounded-xl">
            <Stethoscope className="w-3.5 h-3.5 text-rose-400" />
            <select
              value={doctorFilter}
              onChange={(e) => setDoctorFilter(e.target.value)}
              className="bg-transparent text-xs text-slate-100 focus:outline-hidden"
            >
              <option value="all">All Attending Doctors</option>
              {doctorList.map(doc => (
                <option key={doc} value={doc}>{doc}</option>
              ))}
            </select>
          </div>

          {/* Gender Filter */}
          <div className="flex items-center gap-1.5 bg-[#1c1724] border border-rose-900/50 px-2.5 py-1.5 rounded-xl">
            <Filter className="w-3.5 h-3.5 text-rose-400" />
            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              className="bg-transparent text-xs text-slate-100 focus:outline-hidden"
            >
              <option value="all">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* View Toggle */}
          <div className="flex items-center p-1 rounded-xl bg-[#1c1724] border border-rose-900/50">
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === "table" ? "bg-red-600 text-white shadow-xs" : "text-rose-400 hover:text-white"
              }`}
              title="Doctor Table Triage View"
            >
              <TableIcon className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === "grid" ? "bg-red-600 text-white shadow-xs" : "text-rose-400 hover:text-white"
              }`}
              title="Clinical Cards Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content: Table or Grid */}
      {filteredPatients.length === 0 ? (
        <div className="p-16 text-center border-2 border-dashed border-rose-900/40 rounded-3xl bg-[#15121c]/50 space-y-3">
          <Users className="w-12 h-12 text-rose-500/40 mx-auto" />
          <h3 className="text-base font-bold text-white">No Patient Health Records Found</h3>
          <p className="text-xs text-rose-300/60 max-w-md mx-auto">
            No patient matching "{searchQuery}" was located. Enroll a new patient or clear the search query.
          </p>
          <button
            type="button"
            onClick={handleOpenAddModal}
            className="px-4 py-2 rounded-xl bg-rose-950/70 border border-rose-800 text-xs font-bold text-rose-200 hover:bg-rose-900"
          >
            Register Patient Now
          </button>
        </div>
      ) : viewMode === "table" ? (
        /* Doctor's Clinical Triage Table View */
        <div className="overflow-hidden rounded-3xl bg-[#15121c] border border-rose-900/40 shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#1c1524] text-rose-300/80 font-mono text-[11px] uppercase tracking-wider border-b border-rose-900/50">
                <tr>
                  <th className="py-3.5 px-4 font-bold">Patient & ID</th>
                  <th className="py-3.5 px-4 font-bold">Demographics</th>
                  <th className="py-3.5 px-4 font-bold">Blood Group</th>
                  <th className="py-3.5 px-4 font-bold">Emergency Contact</th>
                  <th className="py-3.5 px-4 font-bold">Attending Specialist</th>
                  <th className="py-3.5 px-4 font-bold">Clinical Notes</th>
                  <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rose-950/60 text-slate-100">
                {filteredPatients.map((patient, index) => (
                  <motion.tr
                    key={patient.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="hover:bg-rose-950/25 transition-colors group cursor-pointer"
                    onClick={() => setSelectedPatientModal(patient)}
                  >
                    {/* Patient Name & ID */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-red-600 to-rose-700 text-white font-black flex items-center justify-center text-xs shrink-0 shadow-xs">
                          {patient.fullName.charAt(0)}
                        </div>
                        <div>
                          <span className="font-bold text-white group-hover:text-red-300 transition-colors block text-xs sm:text-sm">
                            {patient.fullName}
                          </span>
                          <span className="font-mono text-[10px] text-rose-400/80">
                            {patient.nationalHealthId || patient.id}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Demographics */}
                    <td className="py-3.5 px-4 font-mono">
                      <span className="text-slate-200 font-semibold">{patient.age} yrs</span>
                      <span className="text-rose-400/70 block text-[11px]">{patient.gender}</span>
                    </td>

                    {/* Blood Group */}
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-500/15 border border-red-500/30 text-red-300 font-bold font-mono text-[11px]">
                        <Droplet className="w-3 h-3 text-red-400" />
                        {patient.bloodGroup || "O+"}
                      </span>
                    </td>

                    {/* Emergency Contact */}
                    <td className="py-3.5 px-4">
                      <div className="text-[11px]">
                        <span className="text-rose-200 block font-medium truncate max-w-[140px]">
                          {patient.emergencyContactName || "Emergency Contact"}
                        </span>
                        <span className="font-mono text-rose-400/70 text-[10px]">
                          {patient.emergencyContactPhone || patient.contactPhone || patient.contact}
                        </span>
                      </div>
                    </td>

                    {/* Doctor */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 text-[11px] text-rose-200 font-medium">
                        <Stethoscope className="w-3.5 h-3.5 text-red-400 shrink-0" />
                        <span className="truncate max-w-[150px]">{patient.referringPhysician || "Unassigned"}</span>
                      </div>
                    </td>

                    {/* Medical History Snippet */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="text-[11px] text-rose-200/70 truncate" title={patient.medicalHistory}>
                        {patient.medicalHistory || "None documented"}
                      </p>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedPatientModal(patient)}
                          className="p-1.5 rounded-lg bg-rose-950/50 hover:bg-rose-900 text-rose-300 hover:text-white transition-colors"
                          title="Quick Patient Overview"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onNavigate(`/patients/${patient.id}`)}
                          className="p-1.5 rounded-lg bg-rose-950/50 hover:bg-rose-900 text-red-400 hover:text-red-200 transition-colors"
                          title="Open Full Digital Health Card"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(patient)}
                          className="p-1.5 rounded-lg hover:bg-rose-900/50 text-rose-400 hover:text-white transition-colors"
                          title="Edit Patient Details"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeletePatient(patient.id, patient.fullName)}
                          className="p-1.5 rounded-lg hover:bg-red-500/20 text-rose-400 hover:text-red-400 transition-colors"
                          title="Delete Record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Clinical Cards Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPatients.map((patient, index) => {
            const scansCount = patient.scanIds?.length || 0;

            return (
              <motion.div
                key={patient.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.04 }}
                className="p-5 rounded-3xl bg-[#15121c] border border-rose-900/40 hover:border-red-500/50 transition-all shadow-xl flex flex-col justify-between space-y-4 group"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-700 text-white font-black flex items-center justify-center text-sm shadow-md shadow-red-600/25">
                        {patient.fullName.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-white group-hover:text-red-300 transition-colors text-sm sm:text-base">
                          {patient.fullName}
                        </h3>
                        <p className="text-[10px] font-mono text-rose-400/80">
                          {patient.nationalHealthId || patient.id}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(patient)}
                        className="p-1.5 rounded-xl text-rose-300 hover:text-white hover:bg-rose-900/40 transition-colors"
                        title="Edit Patient"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeletePatient(patient.id, patient.fullName)}
                        className="p-1.5 rounded-xl text-rose-300 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        title="Delete Patient"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Demographic Badges */}
                  <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                    <div className="p-2 rounded-xl bg-[#1c1724] border border-rose-900/40">
                      <span className="text-rose-400/60 text-[10px] block font-mono">DEMOGRAPHICS</span>
                      <span className="font-semibold text-slate-100">
                        {patient.age} yrs • {patient.gender}
                      </span>
                    </div>
                    <div className="p-2 rounded-xl bg-[#1c1724] border border-rose-900/40">
                      <span className="text-rose-400/60 text-[10px] block font-mono">BLOOD GROUP</span>
                      <span className="font-bold text-red-400 font-mono flex items-center gap-1">
                        <Droplet className="w-3 h-3" />
                        {patient.bloodGroup || "O+"}
                      </span>
                    </div>
                  </div>

                  {/* Medical History Snippet */}
                  <p className="text-xs text-rose-200/70 line-clamp-2 leading-relaxed bg-black/40 p-2.5 rounded-xl border border-rose-950">
                    <span className="font-semibold text-rose-100">Medical Notes: </span>
                    {patient.medicalHistory}
                  </p>
                </div>

                {/* Footer Controls */}
                <div className="pt-3 border-t border-rose-900/40 flex items-center justify-between">
                  <div className="text-[11px] text-rose-300/80 truncate max-w-[150px]">
                    Doctor: <strong className="text-white">{patient.referringPhysician}</strong>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedPatientModal(patient)}
                      className="px-2.5 py-1 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-[11px] font-bold text-rose-200 border border-rose-800"
                    >
                      Dossier
                    </button>
                    <button
                      type="button"
                      onClick={() => onNavigate(`/patients/${patient.id}`)}
                      className="flex items-center gap-1 text-xs font-bold text-red-400 hover:text-red-300"
                    >
                      <span>Card</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Quick Patient Dossier Modal */}
      {selectedPatientModal && (
        <Modal
          isOpen={!!selectedPatientModal}
          onClose={() => setSelectedPatientModal(null)}
          title={`Clinical Health Dossier: ${selectedPatientModal.fullName}`}
          subtitle={`Health ID: ${selectedPatientModal.nationalHealthId || selectedPatientModal.id} • Permanently Stored`}
          maxWidth="lg"
        >
          <div className="space-y-5 text-xs text-slate-200">
            {/* Top Stat Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 rounded-2xl bg-[#1c1724] border border-rose-900/40">
                <span className="text-[10px] text-rose-400 font-mono uppercase block">Age & Gender</span>
                <span className="font-bold text-white text-sm">{selectedPatientModal.age} yrs • {selectedPatientModal.gender}</span>
              </div>
              <div className="p-3 rounded-2xl bg-[#1c1724] border border-rose-900/40">
                <span className="text-[10px] text-rose-400 font-mono uppercase block">Blood Group</span>
                <span className="font-bold text-red-400 text-sm flex items-center gap-1">
                  <Droplet className="w-3.5 h-3.5" />
                  {selectedPatientModal.bloodGroup || "O+"}
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-[#1c1724] border border-rose-900/40">
                <span className="text-[10px] text-rose-400 font-mono uppercase block">Phone / Mobile</span>
                <span className="font-mono text-slate-100 font-bold">{selectedPatientModal.contactPhone || selectedPatientModal.contact}</span>
              </div>
              <div className="p-3 rounded-2xl bg-[#1c1724] border border-rose-900/40">
                <span className="text-[10px] text-rose-400 font-mono uppercase block">Attending Doctor</span>
                <span className="font-bold text-rose-200">{selectedPatientModal.referringPhysician}</span>
              </div>
            </div>

            {/* Emergency & Allergies */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-rose-950/30 border border-rose-900/40 space-y-1">
                <span className="text-[10px] font-bold text-red-300 font-mono uppercase flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  Emergency Contact
                </span>
                <p className="font-bold text-white">{selectedPatientModal.emergencyContactName || "Primary Family Contact"}</p>
                <p className="font-mono text-rose-300 text-[11px]">{selectedPatientModal.emergencyContactPhone || selectedPatientModal.contactPhone}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-900/40 space-y-1">
                <span className="text-[10px] font-bold text-amber-300 font-mono uppercase flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  Known Allergies
                </span>
                <p className="font-semibold text-slate-100">{selectedPatientModal.allergies || "No known drug allergies (NKDA)"}</p>
              </div>
            </div>

            {/* Medical History */}
            <div className="p-3.5 rounded-2xl bg-[#1c1724] border border-rose-900/40 space-y-1">
              <span className="text-[10px] font-bold text-rose-300 font-mono uppercase">Medical History & Complaints</span>
              <p className="text-rose-100/90 leading-relaxed">{selectedPatientModal.medicalHistory}</p>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-rose-900/40">
              <button
                type="button"
                onClick={() => {
                  setSelectedPatientModal(null);
                  handleOpenEditModal(selectedPatientModal);
                }}
                className="px-4 py-2 rounded-xl bg-rose-950/70 hover:bg-rose-900 text-rose-200 border border-rose-800 text-xs font-bold"
              >
                Edit Records
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onNavigate(`/patients/${selectedPatientModal.id}`)}
                  className="px-4 py-2 rounded-xl bg-rose-900/70 hover:bg-rose-800 text-white font-bold text-xs"
                >
                  Digital Health Card
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate(`/analyze?patientId=${selectedPatientModal.id}`)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 text-white font-black text-xs shadow-md"
                >
                  Perform MRI Scan
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Add / Edit Patient Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPatient ? "Edit Patient Health Record" : "Enroll New Patient"}
        subtitle="Clinical record will be permanently saved into the hospital database"
        maxWidth="lg"
      >
        <form onSubmit={handleSavePatient} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-rose-300 uppercase tracking-wider mb-1 font-mono">
              Full Legal Name *
            </label>
            <input
              type="text"
              required
              value={formData.fullName || ""}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="e.g. Eleanor Vance"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c1724] border border-rose-900/50 text-xs sm:text-sm text-slate-100 focus:outline-hidden focus:border-red-500"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-rose-300 uppercase tracking-wider mb-1 font-mono">
                Age
              </label>
              <input
                type="number"
                min={1}
                max={120}
                value={formData.age || 40}
                onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c1724] border border-rose-900/50 text-xs sm:text-sm text-slate-100 focus:outline-hidden focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-rose-300 uppercase tracking-wider mb-1 font-mono">
                Gender
              </label>
              <select
                value={formData.gender || "Male"}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c1724] border border-rose-900/50 text-xs sm:text-sm text-slate-100 focus:outline-hidden focus:border-red-500"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-rose-300 uppercase tracking-wider mb-1 font-mono">
                Blood Group
              </label>
              <select
                value={formData.bloodGroup || "O+"}
                onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c1724] border border-rose-900/50 text-xs sm:text-sm text-slate-100 focus:outline-hidden focus:border-red-500"
              >
                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-rose-300 uppercase tracking-wider mb-1 font-mono">
                Contact Phone
              </label>
              <input
                type="text"
                value={formData.contactPhone || ""}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                placeholder="+1 (555) 000-0000"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c1724] border border-rose-900/50 text-xs sm:text-sm text-slate-100 focus:outline-hidden focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-rose-300 uppercase tracking-wider mb-1 font-mono">
                Attending Specialist
              </label>
              <input
                type="text"
                value={formData.referringPhysician || ""}
                onChange={(e) => setFormData({ ...formData, referringPhysician: e.target.value })}
                placeholder="Dr. Catherine Hayes, MD"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c1724] border border-rose-900/50 text-xs sm:text-sm text-slate-100 focus:outline-hidden focus:border-red-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-rose-300 uppercase tracking-wider mb-1 font-mono">
                Emergency Contact Name & Relation
              </label>
              <input
                type="text"
                value={formData.emergencyContactName || ""}
                onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                placeholder="e.g. Thomas Vance (Spouse)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c1724] border border-rose-900/50 text-xs sm:text-sm text-slate-100 focus:outline-hidden focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-rose-300 uppercase tracking-wider mb-1 font-mono">
                Emergency Contact Phone
              </label>
              <input
                type="text"
                value={formData.emergencyContactPhone || ""}
                onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                placeholder="+1 (555) 999-0000"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c1724] border border-rose-900/50 text-xs sm:text-sm text-slate-100 focus:outline-hidden focus:border-red-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-rose-300 uppercase tracking-wider mb-1 font-mono">
              Allergies & Drug Reactions
            </label>
            <input
              type="text"
              value={formData.allergies || ""}
              onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
              placeholder="e.g. Penicillin, Sulfa drugs, NKDA"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c1724] border border-rose-900/50 text-xs sm:text-sm text-slate-100 focus:outline-hidden focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-rose-300 uppercase tracking-wider mb-1 font-mono">
              Medical History & Chief Symptoms
            </label>
            <textarea
              rows={3}
              value={formData.medicalHistory || ""}
              onChange={(e) => setFormData({ ...formData, medicalHistory: e.target.value })}
              placeholder="Presenting neurological symptoms, duration, prior trauma..."
              className="w-full p-3 rounded-xl bg-[#1c1724] border border-rose-900/50 text-xs sm:text-sm text-slate-100 focus:outline-hidden focus:border-red-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-rose-900/40">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-xs font-semibold text-rose-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs shadow-md transition-all"
            >
              {editingPatient ? "Save Changes" : "Save Record Permanently"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
