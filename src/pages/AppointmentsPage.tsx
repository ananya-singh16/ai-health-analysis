import React, { useState, useEffect } from "react";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Stethoscope, 
  User, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  Video, 
  Building2, 
  FileText, 
  ChevronRight, 
  HeartPulse, 
  Phone, 
  ShieldCheck, 
  Search,
  Filter,
  ArrowRight
} from "lucide-react";
import { Appointment, Patient, RegisteredUser } from "../types";
import { storageService } from "../services/storage";

interface AppointmentsPageProps {
  onNavigate: (route: string) => void;
}

export const AppointmentsPage: React.FC<AppointmentsPageProps> = ({ onNavigate }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<RegisteredUser[]>([]);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [filterType, setFilterType] = useState<string>("All");

  // Booking Form State
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("2026-08-28");
  const [timeSlot, setTimeSlot] = useState("10:00 AM - 10:45 AM");
  const [appointmentType, setAppointmentType] = useState<"In-Person Clinic" | "Telehealth Video" | "Emergency Consult">("In-Person Clinic");
  const [reason, setReason] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const aptList = storageService.getAppointments();
    setAppointments(aptList);

    const ptList = storageService.getPatients();
    setPatients(ptList);
    if (ptList.length > 0 && !selectedPatientId) {
      setSelectedPatientId(ptList[0].id);
    }

    const allUsers = storageService.getRegisteredUsers();
    const docList = allUsers.filter(u => u.role === "Doctor" || u.role === "Radiologist");
    setDoctors(docList);
    if (docList.length > 0 && !selectedDoctorId) {
      setSelectedDoctorId(docList[0].id);
    }
  };

  const handleBookAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    const patient = patients.find(p => p.id === selectedPatientId) || patients[0];
    const doctor = doctors.find(d => d.id === selectedDoctorId) || doctors[0];

    storageService.saveAppointment({
      patientId: patient ? patient.id : "PT-2026-NEW",
      patientName: patient ? patient.fullName : "Registered Patient",
      doctorId: doctor ? doctor.id : "DOC-001",
      doctorName: doctor ? doctor.fullName : "Dr. Catherine Hayes, MD",
      specialty: doctor?.department || "Neurology & Cranial Care",
      department: "Clinical Neurology",
      appointmentDate,
      timeSlot,
      type: appointmentType,
      status: "Confirmed",
      reason: reason || "Cranial Health Diagnostic Follow-up & Review",
      doctorNotes: "Initial consultation intake recorded."
    });

    setShowBookingModal(false);
    setReason("");
    loadData();
  };

  const filteredAppointments = appointments.filter(apt => {
    if (filterType === "All") return true;
    return apt.type === filterType;
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-rose-900/30">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20">
              <CalendarIcon className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Specialist Consultations & Appointments
              </h1>
              <p className="text-xs sm:text-sm text-rose-200/70 mt-0.5">
                Schedule clinical consultations with neurologists, neurosurgeons, and neuroradiologists.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowBookingModal(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-red-600/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span>Book Consultation</span>
        </button>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-[#15121c] border border-rose-900/40 shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-rose-300 font-semibold">Confirmed Visits</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white">
            {appointments.filter(a => a.status === "Confirmed").length}
          </p>
          <p className="text-[11px] text-rose-200/60">Scheduled in-person and telehealth consultations</p>
        </div>

        <div className="p-5 rounded-3xl bg-[#15121c] border border-rose-900/40 shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-rose-300 font-semibold">Available Specialists</span>
            <div className="p-1.5 rounded-lg bg-red-500/10 text-red-400">
              <Stethoscope className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white">{doctors.length || 2}</p>
          <p className="text-[11px] text-rose-200/60">Attending Neurologists & Surgeons on duty</p>
        </div>

        <div className="p-5 rounded-3xl bg-[#15121c] border border-rose-900/40 shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-rose-300 font-semibold">Clinical Department</span>
            <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-lg font-bold text-white truncate">Cranial Health Pavilion</p>
          <p className="text-[11px] text-rose-200/60">Direct triage: (800) 555-CRANIAL</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 p-1 rounded-2xl bg-[#141219] border border-rose-900/30">
          {["All", "In-Person Clinic", "Telehealth Video", "Emergency Consult"].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setFilterType(type)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                filterType === type
                  ? "bg-red-600 text-white shadow-xs"
                  : "text-rose-200/70 hover:text-white"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <span className="text-xs text-rose-300/80 font-mono">
          Showing {filteredAppointments.length} Appointments
        </span>
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {filteredAppointments.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-[#15121c] border border-rose-900/30 space-y-3">
            <CalendarIcon className="w-10 h-10 text-rose-500/50 mx-auto" />
            <h4 className="text-base font-bold text-white">No Appointments Found</h4>
            <p className="text-xs text-rose-200/60 max-w-sm mx-auto">
              No appointments match the selected filter. Click "Book Consultation" to schedule a specialist review.
            </p>
          </div>
        ) : (
          filteredAppointments.map((apt) => {
            const isTelehealth = apt.type === "Telehealth Video";

            return (
              <div
                key={apt.id}
                className="p-5 sm:p-6 rounded-3xl bg-[#15121c] border border-rose-900/40 hover:border-rose-700/60 transition-all shadow-xl space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-rose-900/30">
                  <div className="flex items-center gap-3.5">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-white shadow-sm ${
                      isTelehealth
                        ? "bg-gradient-to-br from-indigo-600 to-rose-700"
                        : "bg-gradient-to-br from-red-600 to-rose-700"
                    }`}>
                      {isTelehealth ? <Video className="w-6 h-6" /> : <Stethoscope className="w-6 h-6" />}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base sm:text-lg font-extrabold text-white">
                          {apt.patientName}
                        </h3>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold uppercase">
                          {apt.type}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold uppercase">
                          {apt.status}
                        </span>
                      </div>
                      <p className="text-xs text-rose-200/70 font-mono mt-0.5">
                        Consultation ID: {apt.id} • Specialist: <strong className="text-rose-200">{apt.doctorName}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <div className="flex items-center sm:justify-end gap-1.5 text-xs text-white font-bold">
                      <CalendarIcon className="w-4 h-4 text-red-400" />
                      <span>{apt.appointmentDate}</span>
                    </div>
                    <div className="flex items-center sm:justify-end gap-1.5 text-xs text-rose-300/80 font-mono mt-0.5">
                      <Clock className="w-3.5 h-3.5 text-rose-400" />
                      <span>{apt.timeSlot}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase tracking-wider font-mono text-rose-400/70 block">
                      Consultation Objective / Symptoms
                    </span>
                    <p className="text-slate-200 font-medium">{apt.reason || "Cranial MRI Diagnostic Evaluation"}</p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] uppercase tracking-wider font-mono text-rose-400/70 block">
                      Doctor Clinical Note
                    </span>
                    <p className="text-rose-200/80 italic">{apt.doctorNotes || "Awaiting clinical examination."}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-rose-900/30">
                  <div className="text-xs text-rose-300/70 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-red-400" />
                    <span>Specialty: {apt.specialty}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {apt.scanId && (
                      <button
                        type="button"
                        onClick={() => onNavigate(`/history/${apt.scanId}`)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-200 text-xs font-semibold"
                      >
                        <HeartPulse className="w-3.5 h-3.5 text-red-400" />
                        <span>View Linked MRI Scan</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => onNavigate("/analyze")}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-sm"
                    >
                      <span>Upload New Scan</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Booking Consultation Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-[#15121c] border-2 border-rose-800 shadow-2xl text-white space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-rose-900/40">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-red-500/10 text-red-400">
                  <CalendarIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Book Specialist Consultation</h3>
                  <p className="text-xs text-rose-200/70">Schedule a hospital clinic visit or telehealth session.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowBookingModal(false)}
                className="text-rose-400 hover:text-white text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleBookAppointment} className="space-y-4">
              {/* Select Patient */}
              <div className="space-y-1.5">
                <label className="block text-xs font-mono uppercase text-rose-300 font-semibold">
                  Select Patient *
                </label>
                <select
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#1c1724] border border-rose-900/50 text-xs sm:text-sm text-slate-100 focus:outline-hidden focus:border-red-500"
                >
                  {patients.map(p => (
                    <option key={p.id} value={p.id} className="bg-[#1c1724]">
                      {p.fullName} ({p.id}) - {p.bloodGroup || "O+"}
                    </option>
                  ))}
                </select>
              </div>

              {/* Select Specialist */}
              <div className="space-y-1.5">
                <label className="block text-xs font-mono uppercase text-rose-300 font-semibold">
                  Consulting Specialist *
                </label>
                <select
                  value={selectedDoctorId}
                  onChange={(e) => setSelectedDoctorId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#1c1724] border border-rose-900/50 text-xs sm:text-sm text-slate-100 focus:outline-hidden focus:border-red-500"
                >
                  {doctors.map(d => (
                    <option key={d.id} value={d.id} className="bg-[#1c1724]">
                      {d.fullName} - {d.department}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date & Time Slot */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-xs font-mono uppercase text-rose-300 font-semibold">
                    Appointment Date
                  </label>
                  <input
                    type="date"
                    required
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#1c1724] border border-rose-900/50 text-xs text-slate-100 focus:outline-hidden focus:border-red-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-mono uppercase text-rose-300 font-semibold">
                    Time Slot
                  </label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#1c1724] border border-rose-900/50 text-xs text-slate-100 focus:outline-hidden focus:border-red-500"
                  >
                    <option value="09:00 AM - 09:45 AM" className="bg-[#1c1724]">09:00 AM - 09:45 AM</option>
                    <option value="10:00 AM - 10:45 AM" className="bg-[#1c1724]">10:00 AM - 10:45 AM</option>
                    <option value="11:30 AM - 12:15 PM" className="bg-[#1c1724]">11:30 AM - 12:15 PM</option>
                    <option value="02:00 PM - 02:45 PM" className="bg-[#1c1724]">02:00 PM - 02:45 PM</option>
                    <option value="04:00 PM - 04:45 PM" className="bg-[#1c1724]">04:00 PM - 04:45 PM</option>
                  </select>
                </div>
              </div>

              {/* Consultation Type */}
              <div className="space-y-1.5">
                <label className="block text-xs font-mono uppercase text-rose-300 font-semibold">
                  Consultation Format
                </label>
                <select
                  value={appointmentType}
                  onChange={(e) => setAppointmentType(e.target.value as any)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#1c1724] border border-rose-900/50 text-xs sm:text-sm text-slate-100 focus:outline-hidden focus:border-red-500"
                >
                  <option value="In-Person Clinic" className="bg-[#1c1724]">In-Person Hospital Visit (Suite 400)</option>
                  <option value="Telehealth Video" className="bg-[#1c1724]">Telehealth Secure Video Consult</option>
                  <option value="Emergency Consult" className="bg-[#1c1724]">Priority Urgent Review</option>
                </select>
              </div>

              {/* Reason */}
              <div className="space-y-1.5">
                <label className="block text-xs font-mono uppercase text-rose-300 font-semibold">
                  Chief Complaint / Reason for Visit
                </label>
                <textarea
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Follow-up after cranial MRI scan, persistent headaches, visual field review..."
                  className="w-full p-3 rounded-xl bg-[#1c1724] border border-rose-900/50 text-xs sm:text-sm text-slate-100 placeholder-rose-200/30 focus:outline-hidden focus:border-red-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-rose-900/40">
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-xs shadow-md shadow-red-600/30"
                >
                  Confirm Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
