export type TumorClass = "Glioma" | "Meningioma" | "Pituitary" | "No Tumor";

export type UserRole = "Patient" | "Doctor" | "Radiologist" | "Nurse" | "Admin";

export interface ClassProbabilities {
  "Glioma": number;
  "Meningioma": number;
  "Pituitary": number;
  "No Tumor": number;
  [key: string]: number;
}

export interface FocusRegion {
  x: number; // 0.0 - 1.0 normalized coordinates
  y: number; // 0.0 - 1.0 normalized coordinates
  radius: number; // 0.0 - 1.0
  intensity: number; // 0.0 - 1.0
  quadrant: string;
}

export interface GradCamData {
  heatmap_ready: boolean;
  target_layer?: string;
  focus_region: FocusRegion;
  colormap_recommended?: "JET" | "VIRIDIS" | "INFERNO" | "COOLWARM";
  note?: string;
  custom_heatmap_url?: string;
}

export interface AnalysisRecord {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  imageUrl: string;
  fileName?: string;
  fileSize?: string;
  fileDimensions?: string;
  prediction: TumorClass;
  confidence: number;
  classProbabilities: ClassProbabilities;
  inferenceTimeMs: number;
  modelVersion: string;
  isDemo: boolean;
  gradcam: GradCamData;
  clinicalNotes?: string;
  generatedReport?: string;
  status: "Completed" | "Pending Review" | "Flagged";
}

export interface RegisteredUser {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  gender: "Male" | "Female" | "Other";
  dateOfBirth?: string;
  bloodGroup?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  address?: string;
  medicalHistory?: string;
  allergies?: string;
  department?: string;
  licenseNumber?: string;
  nationalHealthId?: string;
  registeredAt: string;
  notes?: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  department: string;
  appointmentDate: string;
  timeSlot: string;
  type: "In-Person Clinic" | "Telehealth Video" | "Emergency Consult";
  status: "Confirmed" | "Scheduled" | "Completed" | "Cancelled";
  reason: string;
  scanId?: string;
  prescriptions?: string;
  doctorNotes?: string;
  createdAt: string;
}

export interface Patient {
  id: string;
  fullName: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  contact: string;
  contactPhone?: string;
  email?: string;
  bloodGroup?: string;
  nationalHealthId?: string;
  dateOfBirth?: string;
  address?: string;
  allergies?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  medicalHistory: string;
  symptoms?: string;
  previousDiagnosis?: string;
  doctorConsulted?: string;
  referringPhysician?: string;
  appointmentType?: "Online" | "Offline";
  appointmentDate?: string;
  notes: string;
  createdAt: string;
  scanCount?: number;
  scanIds?: string[];
}

export interface ModelMetrics {
  accuracy: string;
  precision: string;
  recall: string;
  f1_score: string;
  sensitivity?: string;
  specificity?: string;
  status?: string;
}

export interface AppSettings {
  demoMode: boolean;
  customEndpointUrl: string;
  defaultColormap: "JET" | "VIRIDIS" | "INFERNO" | "COOLWARM";
  confidenceThreshold: number;
  customMetrics: ModelMetrics;
  autoGenerateReport: boolean;
  clinicName?: string;
  clinicAddress?: string;
  emergencyHotline?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: "info" | "success" | "warning" | "error";
  link?: string;
}
