import { Patient, AnalysisRecord, AppSettings, NotificationItem, RegisteredUser, Appointment } from "../types";
import { SAMPLE_SCANS } from "../data/sampleScans";

const STORAGE_KEY_PATIENTS = "neurocare_patients_v2";
const STORAGE_KEY_ANALYSES = "neurocare_analyses_v2";
const STORAGE_KEY_SETTINGS = "neurocare_settings_v2";
const STORAGE_KEY_NOTIFS = "neurocare_notifications_v2";
const STORAGE_KEY_USERS = "neurocare_registered_users_v2";
const STORAGE_KEY_CURRENT_USER = "neurocare_current_user_v2";
const STORAGE_KEY_APPOINTMENTS = "neurocare_appointments_v2";

const DEFAULT_SETTINGS: AppSettings = {
  demoMode: true,
  customEndpointUrl: "",
  defaultColormap: "INFERNO",
  confidenceThreshold: 0.85,
  customMetrics: {
    accuracy: "96.4%",
    precision: "95.8%",
    recall: "96.1%",
    f1_score: "95.9%",
    sensitivity: "96.8%",
    specificity: "97.2%",
    status: "Verified Clinical Diagnostic Calibration"
  },
  autoGenerateReport: true,
  clinicName: "NeuroCare Cranial Diagnostic & Health Center",
  clinicAddress: "Suite 400, Neurological Care Pavilion, Medical Arts Plaza",
  emergencyHotline: "+1 (800) 555-CRANIAL / 911"
};

const SEED_USERS: RegisteredUser[] = [
  {
    id: "MED-DOC-001",
    fullName: "Dr. Catherine Hayes, MD",
    email: "c.hayes@neurocare-health.org",
    phone: "+1 (555) 345-6789",
    role: "Doctor",
    gender: "Female",
    dateOfBirth: "1980-04-12",
    bloodGroup: "O+",
    department: "Neuroradiology & Clinical Neurology",
    licenseNumber: "MED-NR-882910",
    nationalHealthId: "NHD-USA-00912",
    registeredAt: "2026-01-15T08:00:00.000Z",
    address: "742 Medical Center Blvd, Floor 4, Suite 402",
    notes: "Senior Attending Neuroradiologist, specialized in intra-axial lesion diagnosis and stereotactic scan evaluations."
  },
  {
    id: "MED-DOC-002",
    fullName: "Dr. Julian Sterling, MD, FACS",
    email: "j.sterling@neurocare-health.org",
    phone: "+1 (555) 456-7890",
    role: "Doctor",
    gender: "Male",
    dateOfBirth: "1976-11-23",
    bloodGroup: "A+",
    department: "Neurosurgery & Skull Base Surgery",
    licenseNumber: "MED-NS-774120",
    nationalHealthId: "NHD-USA-00843",
    registeredAt: "2026-01-18T09:30:00.000Z",
    address: "742 Medical Center Blvd, Surgical Wing Suite 210",
    notes: "Chief of Neurosurgical Oncology. Specializes in microsurgical tumor resection and skull base meningiomas."
  },
  {
    id: "MED-PAT-101",
    fullName: "Eleanor Vance",
    email: "e.vance@example.org",
    phone: "+1 (555) 234-8901",
    role: "Patient",
    gender: "Female",
    dateOfBirth: "1972-06-18",
    bloodGroup: "A+",
    emergencyContactName: "Thomas Vance (Spouse)",
    emergencyContactPhone: "+1 (555) 234-8902",
    address: "428 Whispering Pines Way, Apt 3B",
    medicalHistory: "Controlled hypertension on Lisinopril 10mg daily. Progressive tension headaches for 3 months with left-sided motor weakness.",
    allergies: "Penicillin (Mild urticaria)",
    nationalHealthId: "NHD-PAT-88019",
    registeredAt: "2026-08-10T09:30:00.000Z",
    notes: "Active diagnostic case. Scheduled for contrast follow-up MRI."
  },
  {
    id: "MED-PAT-102",
    fullName: "Marcus Thorne",
    email: "m.thorne@example.org",
    phone: "+1 (555) 456-7812",
    role: "Patient",
    gender: "Male",
    dateOfBirth: "1978-02-14",
    bloodGroup: "O-",
    emergencyContactName: "Elena Thorne (Sister)",
    emergencyContactPhone: "+1 (555) 456-7899",
    address: "105 Beacon Hill Road",
    medicalHistory: "No prior neurological history. New onset adult focal seizures with olfactory auras.",
    allergies: "No known drug allergies (NKDA)",
    nationalHealthId: "NHD-PAT-88020",
    registeredAt: "2026-08-11T14:15:00.000Z",
    notes: "Pre-surgical resection consultation booked."
  },
  {
    id: "MED-PAT-103",
    fullName: "Sarah Al-Mansoor",
    email: "s.almansoor@example.org",
    phone: "+1 (555) 678-9043",
    role: "Patient",
    gender: "Female",
    dateOfBirth: "1987-09-05",
    bloodGroup: "B+",
    emergencyContactName: "Farhan Al-Mansoor (Brother)",
    emergencyContactPhone: "+1 (555) 678-9000",
    address: "819 Meadowbrook Lane",
    medicalHistory: "Hyperprolactinemia, bitemporal visual field limitation, persistent fatigue.",
    allergies: "Sulfa drugs",
    nationalHealthId: "NHD-PAT-88021",
    registeredAt: "2026-08-12T11:00:00.000Z",
    notes: "Endocrine and neuro-ophthalmology monitoring required."
  }
];

const SEED_APPOINTMENTS: Appointment[] = [
  {
    id: "APT-2026-501",
    patientId: "PT-2026-101",
    patientName: "Eleanor Vance",
    doctorId: "MED-DOC-001",
    doctorName: "Dr. Catherine Hayes, MD",
    specialty: "Neuroradiology & Neurology",
    department: "Clinical Neurology",
    appointmentDate: "2026-08-18",
    timeSlot: "10:30 AM - 11:15 AM",
    type: "In-Person Clinic",
    status: "Confirmed",
    reason: "Cranial MRI Scan Review & Follow-up on Temporoparietal Lesion",
    scanId: "SCAN-2026-8801",
    doctorNotes: "Review axial T2 volumetric findings and discuss neurosurgical triage.",
    createdAt: "2026-08-10T10:00:00.000Z"
  },
  {
    id: "APT-2026-502",
    patientId: "PT-2026-102",
    patientName: "Marcus Thorne",
    doctorId: "MED-DOC-002",
    doctorName: "Dr. Julian Sterling, MD",
    specialty: "Neurosurgery & Skull Base",
    department: "Neurosurgery",
    appointmentDate: "2026-08-20",
    timeSlot: "02:00 PM - 02:45 PM",
    type: "Telehealth Video",
    status: "Scheduled",
    reason: "Pre-operative evaluation for parasagittal extra-axial mass",
    scanId: "SCAN-2026-8802",
    doctorNotes: "Review contrast-enhanced T1 imaging and surgical boundaries.",
    createdAt: "2026-08-11T15:00:00.000Z"
  },
  {
    id: "APT-2026-503",
    patientId: "PT-2026-103",
    patientName: "Sarah Al-Mansoor",
    doctorId: "MED-DOC-001",
    doctorName: "Dr. Catherine Hayes, MD",
    specialty: "Neuroradiology & Neurology",
    department: "Clinical Neurology",
    appointmentDate: "2026-08-22",
    timeSlot: "11:30 AM - 12:15 PM",
    type: "In-Person Clinic",
    status: "Scheduled",
    reason: "Sellar / Suprasellar mass monitoring and perimetry examination",
    scanId: "SCAN-2026-8803",
    doctorNotes: "Assess optic chiasm clearance and endocrine hormone profile.",
    createdAt: "2026-08-12T12:00:00.000Z"
  },
  {
    id: "APT-2026-504",
    patientId: "PT-2026-104",
    patientName: "David Chen",
    doctorId: "MED-DOC-001",
    doctorName: "Dr. Catherine Hayes, MD",
    specialty: "Neuroradiology & Neurology",
    department: "Clinical Neurology",
    appointmentDate: "2026-08-25",
    timeSlot: "09:00 AM - 09:30 AM",
    type: "In-Person Clinic",
    status: "Confirmed",
    reason: "Routine Neurological Wellness Checkup & Normal Baseline Review",
    scanId: "SCAN-2026-8804",
    doctorNotes: "Normal bilateral symmetry confirmed on MRI. Routine follow-up.",
    createdAt: "2026-08-14T09:00:00.000Z"
  }
];

const SEED_PATIENTS: Patient[] = [
  {
    id: "PT-2026-101",
    fullName: "Eleanor Vance",
    age: 54,
    gender: "Female",
    contact: "+1 (555) 234-8901",
    contactPhone: "+1 (555) 234-8901",
    email: "e.vance@example.org",
    bloodGroup: "A+",
    nationalHealthId: "NHD-PAT-88019",
    medicalHistory: "History of hypertension. Progressive tension headaches for 3 months, mild left-sided motor weakness reported over past 2 weeks.",
    symptoms: "Unilateral temporal headaches, morning nausea, episodic visual blurring in left visual field.",
    previousDiagnosis: "Suspected space occupying intracranial lesion.",
    doctorConsulted: "Dr. Catherine Hayes, MD (Neurology)",
    referringPhysician: "Dr. Catherine Hayes, MD",
    appointmentType: "Offline",
    appointmentDate: "2026-08-18",
    notes: "Requires contrast-enhanced volumetric MRI follow-up. Neurological baseline motor strength 4/5 left upper extremity.",
    createdAt: "2026-08-10T09:30:00.000Z",
    scanCount: 1
  },
  {
    id: "PT-2026-102",
    fullName: "Marcus Thorne",
    age: 48,
    gender: "Male",
    contact: "+1 (555) 456-7812",
    contactPhone: "+1 (555) 456-7812",
    email: "m.thorne@example.org",
    bloodGroup: "O-",
    nationalHealthId: "NHD-PAT-88020",
    medicalHistory: "No prior neurological history. Non-smoker.",
    symptoms: "Recurrent focal seizures originating in right frontal region, olfactory auras.",
    previousDiagnosis: "New onset adult focal epilepsy.",
    doctorConsulted: "Dr. Julian Sterling, MD (Neurosurgery)",
    referringPhysician: "Dr. Julian Sterling, MD",
    appointmentType: "Online",
    appointmentDate: "2026-08-20",
    notes: "Patient on Levetiracetam 500mg BID. Pre-surgical resection evaluation scan required.",
    createdAt: "2026-08-11T14:15:00.000Z",
    scanCount: 1
  },
  {
    id: "PT-2026-103",
    fullName: "Sarah Al-Mansoor",
    age: 39,
    gender: "Female",
    contact: "+1 (555) 678-9043",
    contactPhone: "+1 (555) 678-9043",
    email: "s.almansoor@example.org",
    bloodGroup: "B+",
    nationalHealthId: "NHD-PAT-88021",
    medicalHistory: "Endocrine irregularity, bitemporal hemianopsia on perimetry examination.",
    symptoms: "Progressive peripheral vision loss, persistent fatigue, galactorrhea.",
    previousDiagnosis: "Pituitary gland enlargement / Hyperprolactinemia.",
    doctorConsulted: "Dr. Catherine Hayes, MD (Neurology)",
    referringPhysician: "Dr. Catherine Hayes, MD",
    appointmentType: "Offline",
    appointmentDate: "2026-08-22",
    notes: "Visual fields charting confirms bitemporal superior quadrantanopia. Prolactin level elevated (142 ng/mL).",
    createdAt: "2026-08-12T11:00:00.000Z",
    scanCount: 1
  },
  {
    id: "PT-2026-104",
    fullName: "David Chen",
    age: 62,
    gender: "Male",
    contact: "+1 (555) 890-1234",
    contactPhone: "+1 (555) 890-1234",
    email: "d.chen@example.org",
    bloodGroup: "O+",
    nationalHealthId: "NHD-PAT-88022",
    medicalHistory: "Type 2 Diabetes Mellitus, Dyslipidemia. Routine neurological wellness checkup.",
    symptoms: "Occasional tension headaches, benign positional dizziness.",
    previousDiagnosis: "Normal baseline exam, vestibular migraine ruled out.",
    doctorConsulted: "Dr. Catherine Hayes, MD (Neurology)",
    referringPhysician: "Dr. Catherine Hayes, MD",
    appointmentType: "Offline",
    appointmentDate: "2026-08-25",
    notes: "Brain MRI requested to rule out secondary organic etiology. Symmetrical normal cranial anatomy.",
    createdAt: "2026-08-14T08:45:00.000Z",
    scanCount: 1
  },
  {
    id: "PT-2026-105",
    fullName: "Aisha Patel",
    age: 45,
    gender: "Female",
    contact: "+1 (555) 321-9876",
    contactPhone: "+1 (555) 321-9876",
    email: "a.patel@example.org",
    bloodGroup: "AB+",
    nationalHealthId: "NHD-PAT-88023",
    medicalHistory: "Mild asthma. Asymptomatic incidental finding during sinus CT.",
    symptoms: "Mild localized scalp tenderness near vertex, no neurological deficits.",
    previousDiagnosis: "Probable benign meningioma.",
    doctorConsulted: "Dr. Julian Sterling, MD (Neurosurgery)",
    referringPhysician: "Dr. Julian Sterling, MD",
    appointmentType: "Online",
    appointmentDate: "2026-08-29",
    notes: "Conservative watch-and-wait surveillance protocol. Serial MRI every 6 months.",
    createdAt: "2026-08-15T16:20:00.000Z",
    scanCount: 0
  }
];

const SEED_ANALYSES: AnalysisRecord[] = [
  {
    id: "SCAN-2026-8801",
    patientId: "PT-2026-101",
    patientName: "Eleanor Vance",
    date: "2026-08-14T10:15:00.000Z",
    imageUrl: SAMPLE_SCANS[0].svgDataUri,
    fileName: "vance_eleanor_t2_axial_001.png",
    fileSize: "2.4 MB",
    fileDimensions: "512 x 512 px",
    prediction: "Glioma",
    confidence: 0.94,
    classProbabilities: {
      "Glioma": 0.94,
      "Meningioma": 0.03,
      "Pituitary": 0.02,
      "No Tumor": 0.01
    },
    inferenceTimeMs: 142,
    modelVersion: "NeuroCare Diagnostic Suite v2.4",
    isDemo: true,
    gradcam: {
      heatmap_ready: true,
      focus_region: SAMPLE_SCANS[0].focusRegion,
      colormap_recommended: "INFERNO",
      note: "Primary focal intensity localized to the Right Temporoparietal cortex with prominent surrounding vasogenic edema."
    },
    clinicalNotes: "Hyperintense infiltrative focus in right temporoparietal lobe with surrounding edema. Urgent neurosurgical evaluation recommended.",
    generatedReport: "### Clinical Diagnostic Assessment\nThe automated cranial imaging analysis identified features highly characteristic of **Glioma (High-Grade Infiltrative Astrocytoma)** with an estimated confidence rating of **94.0%**.\n\n### Key Imaging Characteristics\n- Mass effect with effacement of surrounding cortical sulci.\n- Marked T2/FLAIR hyperintensity in the Right Temporoparietal cortex.\n- Central low attenuation necrotic core surrounded by peripheral vasogenic edema.\n\n### Clinical Recommendations\n1. Urgent Neurosurgical Oncology consultation.\n2. Contrast-enhanced volumetric MRI (3.0 Tesla) with magnetic resonance spectroscopy (MRS).\n3. Baseline dexamethasone administration if vasogenic edema symptoms progress.",
    status: "Completed"
  },
  {
    id: "SCAN-2026-8802",
    patientId: "PT-2026-102",
    patientName: "Marcus Thorne",
    date: "2026-08-13T15:40:00.000Z",
    imageUrl: SAMPLE_SCANS[1].svgDataUri,
    fileName: "thorne_marcus_contrast_t1_004.png",
    fileSize: "3.1 MB",
    fileDimensions: "512 x 512 px",
    prediction: "Meningioma",
    confidence: 0.91,
    classProbabilities: {
      "Meningioma": 0.91,
      "Glioma": 0.05,
      "Pituitary": 0.02,
      "No Tumor": 0.02
    },
    inferenceTimeMs: 165,
    modelVersion: "NeuroCare Diagnostic Suite v2.4",
    isDemo: true,
    gradcam: {
      heatmap_ready: true,
      focus_region: SAMPLE_SCANS[1].focusRegion,
      colormap_recommended: "INFERNO",
      note: "Focal intensity corresponds to the left parasagittal frontal convexity with broad dural base attachment."
    },
    clinicalNotes: "Homogeneous extra-axial mass with broad dural base along left frontal convexity.",
    generatedReport: "### Clinical Diagnostic Assessment\nThe automated cranial imaging analysis identified features characteristic of **Meningioma (Extra-Axial Dural Mass)** with an estimated confidence rating of **91.0%**.\n\n### Key Imaging Characteristics\n- Well-circumscribed extra-axial lesion along the left frontal convexity.\n- Characteristic dural tail sign along adjacent calvarial inner table.\n- Buckling of adjacent cortex without deep parenchymal infiltration.\n\n### Clinical Recommendations\n1. Surgical planning consultation with skull base neurosurgeon.\n2. MR angiography (MRA/MRV) to assess superior sagittal sinus patency.",
    status: "Completed"
  },
  {
    id: "SCAN-2026-8803",
    patientId: "PT-2026-103",
    patientName: "Sarah Al-Mansoor",
    date: "2026-08-12T11:20:00.000Z",
    imageUrl: SAMPLE_SCANS[2].svgDataUri,
    fileName: "almansoor_sarah_sella_coronal.png",
    fileSize: "2.8 MB",
    fileDimensions: "512 x 512 px",
    prediction: "Pituitary",
    confidence: 0.96,
    classProbabilities: {
      "Pituitary": 0.96,
      "Meningioma": 0.02,
      "Glioma": 0.01,
      "No Tumor": 0.01
    },
    inferenceTimeMs: 138,
    modelVersion: "NeuroCare Diagnostic Suite v2.4",
    isDemo: true,
    gradcam: {
      heatmap_ready: true,
      focus_region: SAMPLE_SCANS[2].focusRegion,
      colormap_recommended: "INFERNO"
    },
    clinicalNotes: "Sellar and suprasellar mass causing elevation of optic chiasm.",
    generatedReport: "### Clinical Diagnostic Assessment\nThe automated cranial imaging analysis identified features characteristic of **Pituitary Tumor (Macroadenoma)** with an estimated confidence rating of **96.0%**.\n\n### Key Imaging Characteristics\n- Expansile mass centered within the sella turcica extending suprasellar.\n- Elevation and compression of the optic chiasm at midline.\n- Distinct figure-of-eight waist sign at the diaphragmatic notch.\n\n### Clinical Recommendations\n1. Comprehensive neuro-endocrinology workup (PRL, GH, ACTH, TSH, Cortisol).\n2. Formal visual field perimetry (Humphrey Visual Field).\n3. Endonasal transsphenoidal surgical evaluation.",
    status: "Completed"
  },
  {
    id: "SCAN-2026-8804",
    patientId: "PT-2026-104",
    patientName: "David Chen",
    date: "2026-08-11T09:10:00.000Z",
    imageUrl: SAMPLE_SCANS[3].svgDataUri,
    fileName: "chen_david_normal_baseline.png",
    fileSize: "2.1 MB",
    fileDimensions: "512 x 512 px",
    prediction: "No Tumor",
    confidence: 0.98,
    classProbabilities: {
      "No Tumor": 0.98,
      "Glioma": 0.01,
      "Meningioma": 0.005,
      "Pituitary": 0.005
    },
    inferenceTimeMs: 125,
    modelVersion: "NeuroCare Diagnostic Suite v2.4",
    isDemo: true,
    gradcam: {
      heatmap_ready: true,
      focus_region: SAMPLE_SCANS[3].focusRegion,
      colormap_recommended: "INFERNO"
    },
    clinicalNotes: "Normal scan with age-appropriate brain parenchymal volume and symmetrical ventricles.",
    generatedReport: "### Clinical Diagnostic Assessment\nThe automated cranial imaging analysis identified **No Abnormal Tumor Mass (Normal Cranial Anatomy)** with **98.0%** confidence.\n\n### Key Imaging Characteristics\n- Symmetrical ventricular system with sharp frontal and occipital horns.\n- Intact grey-white matter differentiation.\n- No evidence of midline shift, mass effect, or pathological focal enhancement.\n\n### Clinical Recommendations\n1. Reassurance to patient; routine lifestyle maintenance.\n2. Repeat neuro-imaging only if new focal neurological deficits arise.",
    status: "Completed"
  }
];

const SEED_NOTIFS: NotificationItem[] = [
  {
    id: "notif-1",
    title: "Diagnostic Report Ready",
    message: "Cranial Scan SCAN-2026-8801 for Eleanor Vance is ready for clinical review.",
    timestamp: "10 mins ago",
    read: false,
    type: "success",
    link: "/history"
  },
  {
    id: "notif-2",
    title: "Upcoming Specialist Appointment",
    message: "Appointment confirmed with Dr. Catherine Hayes, MD for Eleanor Vance on Aug 18.",
    timestamp: "1 hour ago",
    read: false,
    type: "info",
    link: "/appointments"
  },
  {
    id: "notif-3",
    title: "Patient Record Registered",
    message: "New patient profile successfully registered with Digital Health ID.",
    timestamp: "3 hours ago",
    read: true,
    type: "success",
    link: "/register"
  }
];

export const storageService = {
  // User Registration & Authentication
  getRegisteredUsers(): RegisteredUser[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_USERS);
      if (!data) {
        localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(SEED_USERS));
        return SEED_USERS;
      }
      return JSON.parse(data);
    } catch {
      return SEED_USERS;
    }
  },

  getCurrentUser(): RegisteredUser {
    try {
      const data = localStorage.getItem(STORAGE_KEY_CURRENT_USER);
      if (!data) {
        const users = this.getRegisteredUsers();
        const defaultUser = users[0] || SEED_USERS[0];
        localStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify(defaultUser));
        return defaultUser;
      }
      return JSON.parse(data);
    } catch {
      return SEED_USERS[0];
    }
  },

  setCurrentUser(user: RegisteredUser): void {
    localStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify(user));
  },

  registerUser(userData: Omit<RegisteredUser, "id" | "registeredAt">): RegisteredUser {
    const users = this.getRegisteredUsers();
    const prefix = userData.role === "Doctor" ? "MED-DOC-" : userData.role === "Radiologist" ? "MED-RAD-" : "MED-PAT-";
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newId = `${prefix}${randomNum}`;

    const newUser: RegisteredUser = {
      ...userData,
      id: newId,
      registeredAt: new Date().toISOString(),
      nationalHealthId: userData.nationalHealthId || `NHD-${randomNum}-${Math.floor(100 + Math.random() * 900)}`
    };

    const updated = [newUser, ...users];
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(updated));

    // If patient, also add to Patients list for easy access in MRI analysis
    if (userData.role === "Patient") {
      const patientRecord: Patient = {
        id: `PT-${new Date().getFullYear()}-${randomNum.toString().slice(0, 3)}`,
        fullName: userData.fullName,
        age: userData.dateOfBirth ? Math.max(1, new Date().getFullYear() - new Date(userData.dateOfBirth).getFullYear()) : 40,
        gender: userData.gender,
        contact: userData.phone,
        contactPhone: userData.phone,
        email: userData.email,
        bloodGroup: userData.bloodGroup || "O+",
        nationalHealthId: newUser.nationalHealthId,
        dateOfBirth: userData.dateOfBirth,
        address: userData.address,
        allergies: userData.allergies || "No known drug allergies (NKDA)",
        emergencyContactName: userData.emergencyContactName,
        emergencyContactPhone: userData.emergencyContactPhone,
        medicalHistory: userData.medicalHistory || "None documented upon registration",
        symptoms: userData.notes || "Routine registration intake",
        doctorConsulted: "Dr. Catherine Hayes, MD",
        referringPhysician: "Dr. Catherine Hayes, MD",
        notes: userData.notes || "Newly registered health portal account",
        createdAt: new Date().toISOString(),
        scanCount: 0
      };
      this.savePatient(patientRecord);
    }

    // Set as current active user
    this.setCurrentUser(newUser);

    // Add notification
    this.addNotification({
      title: "New Account Registered",
      message: `${newUser.fullName} (${newUser.role}) successfully enrolled with Health ID: ${newUser.nationalHealthId || newUser.id}`,
      type: "success",
      link: "/register"
    });

    return newUser;
  },

  updateUser(user: RegisteredUser): RegisteredUser {
    const users = this.getRegisteredUsers();
    const idx = users.findIndex(u => u.id === user.id);
    let updated: RegisteredUser[];
    if (idx >= 0) {
      updated = [...users];
      updated[idx] = user;
    } else {
      updated = [user, ...users];
    }
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(updated));

    // If currently active, update active record too
    const current = this.getCurrentUser();
    if (current && current.id === user.id) {
      this.setCurrentUser(user);
    }
    return user;
  },

  deleteUser(id: string): boolean {
    const users = this.getRegisteredUsers();
    const filtered = users.filter(u => u.id !== id);
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(filtered));
    return true;
  },

  // Appointments
  getAppointments(): Appointment[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_APPOINTMENTS);
      if (!data) {
        localStorage.setItem(STORAGE_KEY_APPOINTMENTS, JSON.stringify(SEED_APPOINTMENTS));
        return SEED_APPOINTMENTS;
      }
      return JSON.parse(data);
    } catch {
      return SEED_APPOINTMENTS;
    }
  },

  saveAppointment(appointmentData: Omit<Appointment, "id" | "createdAt"> & { id?: string }): Appointment {
    const appointments = this.getAppointments();
    const id = appointmentData.id || `APT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newAppointment: Appointment = {
      ...appointmentData,
      id,
      createdAt: new Date().toISOString()
    };

    const existingIndex = appointments.findIndex(a => a.id === id);
    let updated: Appointment[];
    if (existingIndex >= 0) {
      updated = [...appointments];
      updated[existingIndex] = newAppointment;
    } else {
      updated = [newAppointment, ...appointments];
    }
    localStorage.setItem(STORAGE_KEY_APPOINTMENTS, JSON.stringify(updated));

    this.addNotification({
      title: "Appointment Booked",
      message: `Appointment scheduled for ${newAppointment.patientName} with ${newAppointment.doctorName} on ${newAppointment.appointmentDate}.`,
      type: "info",
      link: "/appointments"
    });

    return newAppointment;
  },

  deleteAppointment(id: string): boolean {
    const appointments = this.getAppointments();
    const filtered = appointments.filter(a => a.id !== id);
    localStorage.setItem(STORAGE_KEY_APPOINTMENTS, JSON.stringify(filtered));
    return true;
  },

  // Patients
  getPatients(): Patient[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_PATIENTS);
      if (!data) {
        localStorage.setItem(STORAGE_KEY_PATIENTS, JSON.stringify(SEED_PATIENTS));
        return SEED_PATIENTS;
      }
      return JSON.parse(data);
    } catch {
      return SEED_PATIENTS;
    }
  },

  getPatientById(id: string): Patient | undefined {
    const patients = this.getPatients();
    return patients.find(p => p.id === id);
  },

  savePatient(patient: Patient): Patient {
    const patients = this.getPatients();
    const existingIndex = patients.findIndex(p => p.id === patient.id);
    let updated: Patient[];
    if (existingIndex >= 0) {
      updated = [...patients];
      updated[existingIndex] = patient;
    } else {
      updated = [patient, ...patients];
    }
    localStorage.setItem(STORAGE_KEY_PATIENTS, JSON.stringify(updated));
    return patient;
  },

  deletePatient(id: string): boolean {
    const patients = this.getPatients();
    const filtered = patients.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEY_PATIENTS, JSON.stringify(filtered));
    return true;
  },

  // Analyses
  getAnalyses(): AnalysisRecord[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_ANALYSES);
      if (!data) {
        localStorage.setItem(STORAGE_KEY_ANALYSES, JSON.stringify(SEED_ANALYSES));
        return SEED_ANALYSES;
      }
      return JSON.parse(data);
    } catch {
      return SEED_ANALYSES;
    }
  },

  getAnalysisById(id: string): AnalysisRecord | undefined {
    const analyses = this.getAnalyses();
    return analyses.find(a => a.id === id);
  },

  saveAnalysis(analysis: AnalysisRecord): AnalysisRecord {
    const analyses = this.getAnalyses();
    const existingIndex = analyses.findIndex(a => a.id === analysis.id);
    let updated: AnalysisRecord[];
    if (existingIndex >= 0) {
      updated = [...analyses];
      updated[existingIndex] = analysis;
    } else {
      updated = [analysis, ...analyses];
    }
    localStorage.setItem(STORAGE_KEY_ANALYSES, JSON.stringify(updated));

    // Update patient scan count
    if (analysis.patientId) {
      const patient = this.getPatientById(analysis.patientId);
      if (patient) {
        patient.scanCount = (patient.scanCount || 0) + 1;
        this.savePatient(patient);
      }
    }

    this.addNotification({
      title: "Diagnostic Assessment Completed",
      message: `Cranial Scan ${analysis.id} for ${analysis.patientName} classified as ${analysis.prediction}.`,
      type: "success",
      link: `/history/${analysis.id}`
    });

    return analysis;
  },

  deleteAnalysis(id: string): boolean {
    const analyses = this.getAnalyses();
    const filtered = analyses.filter(a => a.id !== id);
    localStorage.setItem(STORAGE_KEY_ANALYSES, JSON.stringify(filtered));
    return true;
  },

  getAnalysesByPatientId(patientId: string): AnalysisRecord[] {
    const analyses = this.getAnalyses();
    return analyses.filter(a => a.patientId === patientId);
  },

  // Settings
  getSettings(): AppSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (!data) {
        localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
        return DEFAULT_SETTINGS;
      }
      return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings(settings: AppSettings): AppSettings {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
    return settings;
  },

  // Notifications
  getNotifications(): NotificationItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_NOTIFS);
      if (!data) {
        localStorage.setItem(STORAGE_KEY_NOTIFS, JSON.stringify(SEED_NOTIFS));
        return SEED_NOTIFS;
      }
      return JSON.parse(data);
    } catch {
      return SEED_NOTIFS;
    }
  },

  markNotificationRead(id: string): void {
    const list = this.getNotifications().map(n => n.id === id ? { ...n, read: true } : n);
    localStorage.setItem(STORAGE_KEY_NOTIFS, JSON.stringify(list));
  },

  addNotification(notif: Omit<NotificationItem, "id" | "timestamp" | "read">): NotificationItem {
    const list = this.getNotifications();
    const newItem: NotificationItem = {
      ...notif,
      id: `notif-${Date.now()}`,
      timestamp: "Just now",
      read: false
    };
    localStorage.setItem(STORAGE_KEY_NOTIFS, JSON.stringify([newItem, ...list.slice(0, 19)]));
    return newItem;
  },

  resetAllDemoData(): void {
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(SEED_USERS));
    localStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify(SEED_USERS[0]));
    localStorage.setItem(STORAGE_KEY_APPOINTMENTS, JSON.stringify(SEED_APPOINTMENTS));
    localStorage.setItem(STORAGE_KEY_PATIENTS, JSON.stringify(SEED_PATIENTS));
    localStorage.setItem(STORAGE_KEY_ANALYSES, JSON.stringify(SEED_ANALYSES));
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
    localStorage.setItem(STORAGE_KEY_NOTIFS, JSON.stringify(SEED_NOTIFS));
  }
};
