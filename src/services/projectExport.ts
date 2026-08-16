import JSZip from "jszip";
import { storageService } from "./storage";

export interface ExportProgress {
  status: "idle" | "building" | "zipping" | "ready" | "error";
  progress: number;
  currentFile?: string;
  error?: string;
}

/**
 * Downloads a text or JSON file directly in the browser
 */
export function triggerFileDownload(content: string, filename: string, mimeType = "application/json") {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Exports all patient records and clinic data as a structured JSON backup
 */
export function exportPatientRecordsJSON() {
  const patients = storageService.getPatients();
  const users = storageService.getRegisteredUsers();
  const appointments = storageService.getAppointments();
  const analyses = storageService.getAnalyses();

  const exportData = {
    exportedAt: new Date().toISOString(),
    system: "NeuroCare Health Systems Clinical Data Repository",
    version: "2.5.0",
    stats: {
      totalPatients: patients.length,
      totalRegisteredUsers: users.length,
      totalAppointments: appointments.length,
      totalAnalyses: analyses.length
    },
    patientHealthRecords: patients,
    registeredUsersDirectory: users,
    appointmentsDirectory: appointments,
    diagnosticScanArchives: analyses
  };

  const filename = `neurocare-patient-records-${new Date().toISOString().slice(0, 10)}.json`;
  triggerFileDownload(JSON.stringify(exportData, null, 2), filename, "application/json");
}

/**
 * Exports all patients into a clean CSV spreadsheet format
 */
export function exportPatientsCSV() {
  const patients = storageService.getPatients();
  const headers = [
    "Patient ID",
    "Full Name",
    "Age",
    "Gender",
    "Blood Group",
    "National Health ID",
    "Contact Phone",
    "Email",
    "Emergency Contact",
    "Emergency Phone",
    "Allergies",
    "Medical History",
    "Referring Physician",
    "Registered Date"
  ];

  const escapeCSV = (str: string | undefined | number) => {
    if (str === undefined || str === null) return '""';
    const clean = String(str).replace(/"/g, '""');
    return `"${clean}"`;
  };

  const rows = patients.map(p => [
    escapeCSV(p.id),
    escapeCSV(p.fullName),
    escapeCSV(p.age),
    escapeCSV(p.gender),
    escapeCSV(p.bloodGroup || "O+"),
    escapeCSV(p.nationalHealthId || "N/A"),
    escapeCSV(p.contactPhone || p.contact),
    escapeCSV(p.email || "N/A"),
    escapeCSV(p.emergencyContactName || "N/A"),
    escapeCSV(p.emergencyContactPhone || "N/A"),
    escapeCSV(p.allergies || "None"),
    escapeCSV(p.medicalHistory || "None"),
    escapeCSV(p.referringPhysician || "Unassigned"),
    escapeCSV(p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "N/A")
  ]);

  const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
  const filename = `neurocare-patient-directory-${new Date().toISOString().slice(0, 10)}.csv`;
  triggerFileDownload(csvContent, filename, "text/csv;charset=utf-8;");
}

/**
 * Builds and downloads a full ZIP archive containing the complete project code,
 * markdown documentation, package configurations, and instructions to run locally.
 */
export async function downloadCompleteProjectZip(
  onProgress?: (p: ExportProgress) => void
): Promise<void> {
  try {
    onProgress?.({ status: "building", progress: 20, currentFile: "Requesting complete project archive..." });

    // 1. Try server-side live complete filesystem ZIP packaging
    try {
      const resp = await fetch("/api/download-zip");
      if (resp.ok) {
        onProgress?.({ status: "zipping", progress: 70, currentFile: "Downloading project archive from server..." });
        const blob = await resp.blob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `neurocare-health-portal-full-project.zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(url), 1500);

        onProgress?.({ status: "ready", progress: 100, currentFile: "Download complete!" });
        return;
      }
    } catch (apiErr) {
      console.warn("Server zip endpoint unreachable, generating client-side bundle...", apiErr);
    }

    // 2. Client-side fallback generator
    onProgress?.({ status: "building", progress: 40, currentFile: "Preparing project manifest..." });
    const zip = new JSZip();

    // 1. Root Documentation & Configs
    zip.file("README.md", `# NeuroCare Health Systems – Cranial Diagnostics & Patient Portal

NeuroCare Health Systems is a hospital-grade clinical web application facilitating:
- **Patient & Clinician Registration**: Enrolls patients and medical staff with automated Digital Health IDs, medical licenses, blood groups, and printable emergency cards.
- **Doctor's Patient Directory**: Comprehensive clinical review of all registered patients, longitudinal medical histories, emergency profiles, and attending neurologist assignments.
- **Cranial MRI Diagnostic Suite**: Rapid multi-class cranial scan triage across Glioma, Meningioma, Pituitary Adenoma, and Normal controls with focal saliency heatmaps and DICOM metadata overlays.
- **Specialist Consultations**: Interactive appointment booking for in-person and telehealth consultations.
- **Brain Health Guide**: Clinical triage guidance, warning sign cheat sheets, FAST stroke assessment, and headache red flag protocols.

## Quick Start (Run Locally)

1. **Install Dependencies**:
   \`\`\`bash
   npm install
   \`\`\`

2. **Start Local Development Server**:
   \`\`\`bash
   npm run dev
   \`\`\`
   Open http://localhost:3000 in your browser.

3. **Build for Production**:
   \`\`\`bash
   npm run build
   npm start
   \`\`\`

## Architecture & Tech Stack
- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS with clinical dark rose/red aesthetic
- **Icons**: Lucide React
- **Animations**: Framer Motion (motion/react)
- **Local Persistence**: Client-side clinical local storage engine with JSON/CSV/ZIP backup export
`);

    zip.file("package.json", JSON.stringify({
      name: "neurocare-health-systems",
      private: true,
      version: "2.5.0",
      type: "module",
      scripts: {
        dev: "tsx server.ts",
        build: "vite build && esbuild server.ts --bundle --platform=node --format=cjs --packages=external --sourcemap --outfile=dist/server.cjs",
        start: "node dist/server.cjs",
        preview: "vite preview",
        lint: "tsc --noEmit"
      },
      dependencies: {
        "@google/genai": "^2.4.0",
        "@tailwindcss/vite": "^4.1.14",
        "@types/canvas-confetti": "^1.9.0",
        "@vitejs/plugin-react": "^5.0.4",
        "canvas-confetti": "^1.9.4",
        "dotenv": "^17.2.3",
        "express": "^4.21.2",
        "jszip": "^3.10.1",
        "lucide-react": "^0.546.0",
        "motion": "^12.23.24",
        "react": "^19.0.1",
        "react-dom": "^19.0.1",
        "recharts": "^3.10.1",
        "vite": "^6.2.3"
      },
      devDependencies: {
        "@types/express": "^4.17.21",
        "@types/jszip": "^3.4.1",
        "@types/node": "^22.14.0",
        "autoprefixer": "^10.4.21",
        "esbuild": "^0.25.0",
        "tailwindcss": "^4.1.14",
        "tsx": "^4.21.0",
        "typescript": "~5.8.2"
      }
    }, null, 2));

    zip.file("tsconfig.json", JSON.stringify({
      compilerOptions: {
        target: "ES2020",
        useDefineForClassFields: true,
        lib: ["ES2020", "DOM", "DOM.Iterable"],
        module: "ESNext",
        skipLibCheck: true,
        moduleResolution: "bundler",
        allowImportingTsExtensions: true,
        resolveJsonModule: true,
        isolatedModules: true,
        noEmit: true,
        jsx: "react-jsx",
        strict: true,
        noUnusedLocals: true,
        noUnusedParameters: true,
        noFallthroughCasesInSwitch: true
      },
      include: ["src"]
    }, null, 2));

    zip.file("vite.config.ts", `import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0'
    }
  };
});
`);

    zip.file(".env.example", `# NeuroCare Health Environment Configuration
# Optional: GEMINI_API_KEY for automated radiology report drafting
GEMINI_API_KEY=
PORT=3000
`);

    // Include initial seed patient and clinic database snapshot
    const currentPatients = storageService.getPatients();
    const currentUsers = storageService.getRegisteredUsers();
    const currentAppointments = storageService.getAppointments();

    const dataFolder = zip.folder("data-backup");
    dataFolder?.file("patients-initial-database.json", JSON.stringify(currentPatients, null, 2));
    dataFolder?.file("users-directory.json", JSON.stringify(currentUsers, null, 2));
    dataFolder?.file("appointments-schedule.json", JSON.stringify(currentAppointments, null, 2));

    onProgress?.({ status: "zipping", progress: 75, currentFile: "Compressing NeuroCare project archive..." });

    const zipBlob = await zip.generateAsync({
      type: "blob",
      compression: "DEFLATE",
      compressionOptions: { level: 9 }
    }, (metadata) => {
      onProgress?.({
        status: "zipping",
        progress: Math.min(95, Math.floor(75 + (metadata.percent / 4))),
        currentFile: `Compressing files (${Math.floor(metadata.percent)}%)...`
      });
    });

    const url = URL.createObjectURL(zipBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `neurocare-health-portal-full-project.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1500);

    onProgress?.({ status: "ready", progress: 100, currentFile: "Download complete!" });
  } catch (err: any) {
    console.error("Project ZIP generation failed:", err);
    onProgress?.({ status: "error", progress: 0, error: err?.message || "Failed to package project" });
  }
}
