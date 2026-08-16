import { TumorClass, FocusRegion } from "../types";

export interface SampleScan {
  id: string;
  name: string;
  type: TumorClass;
  sliceType: string;
  expectedConfidence: number;
  description: string;
  anatomicalLocation: string;
  focusRegion: FocusRegion;
  imagingCharacteristics: string[];
  svgDataUri: string;
  fileSize?: string;
  dimensions?: string;
}

// Procedural high-fidelity brain MRI SVG generator
function generateBrainMriSvg(type: TumorClass, focus: FocusRegion): string {
  // Generates clean medical MRI schematic illustration resembling clinical axial/coronal brain scans
  let tumorVisual = "";
  if (type === "Glioma") {
    tumorVisual = `
      <!-- Glioma infiltrating lesion with vasogenic edema ring -->
      <radialGradient id="edema" cx="62%" cy="40%" r="28%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.95" />
        <stop offset="45%" stop-color="#cbd5e1" stop-opacity="0.8" />
        <stop offset="75%" stop-color="#64748b" stop-opacity="0.4" />
        <stop offset="100%" stop-color="#1e293b" stop-opacity="0" />
      </radialGradient>
      <circle cx="280" cy="180" r="48" fill="url(#edema)" filter="blur(3px)" />
      <path d="M 260,160 Q 295,150 305,185 Q 315,215 275,210 Q 245,200 260,160 Z" fill="#f8fafc" opacity="0.9" filter="blur(1px)"/>
      <circle cx="278" cy="182" r="14" fill="#0f172a" opacity="0.6" /> <!-- Central necrotic core -->
    `;
  } else if (type === "Meningioma") {
    tumorVisual = `
      <!-- Meningioma well-circumscribed dural-attached mass -->
      <radialGradient id="mening" cx="35%" cy="32%" r="22%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="1" />
        <stop offset="70%" stop-color="#e2e8f0" stop-opacity="0.85" />
        <stop offset="90%" stop-color="#94a3b8" stop-opacity="0.5" />
        <stop offset="100%" stop-color="#334155" stop-opacity="0" />
      </radialGradient>
      <path d="M 140,135 Q 185,130 190,175 Q 180,210 145,200 Q 130,170 140,135 Z" fill="url(#mening)" filter="blur(1px)" />
      <path d="M 125,120 Q 140,135 135,210 Q 120,225 118,220" stroke="#f1f5f9" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.85"/> <!-- Dural tail sign -->
    `;
  } else if (type === "Pituitary") {
    tumorVisual = `
      <!-- Pituitary adenoma at sellar / central skull base -->
      <radialGradient id="pituit" cx="50%" cy="58%" r="18%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.98" />
        <stop offset="60%" stop-color="#e2e8f0" stop-opacity="0.8" />
        <stop offset="85%" stop-color="#64748b" stop-opacity="0.3" />
        <stop offset="100%" stop-color="#0f172a" stop-opacity="0" />
      </radialGradient>
      <ellipse cx="225" cy="265" rx="28" ry="24" fill="url(#pituit)" filter="blur(1px)"/>
      <ellipse cx="225" cy="265" rx="18" ry="15" fill="#f8fafc" opacity="0.9"/>
    `;
  } else {
    // Normal Brain - Pristine bilateral symmetry
    tumorVisual = `
      <!-- Normal Symmetrical Brain Ventricles & Parenchyma -->
    `;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 450 450" width="100%" height="100%">
    <rect width="450" height="450" fill="#030712"/>
    
    <defs>
      <!-- Calvarium bone/tissue glow -->
      <radialGradient id="cranium" cx="50%" cy="50%" r="50%">
        <stop offset="78%" stop-color="#0f172a"/>
        <stop offset="88%" stop-color="#334155"/>
        <stop offset="93%" stop-color="#94a3b8"/>
        <stop offset="97%" stop-color="#e2e8f0"/>
        <stop offset="100%" stop-color="#030712"/>
      </radialGradient>

      <!-- Parenchyma Texture -->
      <radialGradient id="parenchyma" cx="50%" cy="48%" r="44%">
        <stop offset="0%" stop-color="#1e293b"/>
        <stop offset="40%" stop-color="#334155"/>
        <stop offset="75%" stop-color="#475569"/>
        <stop offset="95%" stop-color="#1e293b"/>
      </radialGradient>

      <!-- Cerebrospinal Fluid Ventricles -->
      <filter id="mriBlur" x="-10%" y="-10%" width="120%" height="120%">
        <feGaussianBlur stdDeviation="0.8"/>
      </filter>
    </defs>

    <!-- Skull Outer Bone Outline -->
    <ellipse cx="225" cy="225" rx="175" ry="195" fill="url(#cranium)"/>
    <ellipse cx="225" cy="225" rx="160" ry="180" fill="url(#parenchyma)"/>

    <!-- Falx Cerebri (Midline Interhemispheric Fissure) -->
    <line x1="225" y1="55" x2="225" y2="395" stroke="#090d16" stroke-width="3" stroke-dasharray="2 1" opacity="0.8"/>

    <!-- Sulci / Gyri brain cortical fold patterns -->
    <g stroke="#1e293b" stroke-width="2.5" fill="none" opacity="0.6" filter="url(#mriBlur)">
      <path d="M 120,130 Q 150,150 135,190 T 115,240 T 140,300"/>
      <path d="M 330,130 Q 300,150 315,190 T 335,240 T 310,300"/>
      <path d="M 160,100 Q 190,130 170,170 T 180,240"/>
      <path d="M 290,100 Q 260,130 280,170 T 270,240"/>
      <path d="M 150,330 Q 180,350 210,370"/>
      <path d="M 300,330 Q 270,350 240,370"/>
    </g>

    <!-- Bilateral Lateral Ventricles (Frontal & Occipital Horns) -->
    <g fill="#050811" filter="url(#mriBlur)">
      <!-- Left Ventricle (Patient Right) -->
      <path d="M 215,170 C 215,140 195,150 190,185 C 185,215 195,245 212,255 C 216,240 216,190 215,170 Z" />
      <path d="M 210,265 C 190,285 185,310 195,330 C 205,335 215,310 214,275 Z" opacity="0.85"/>

      <!-- Right Ventricle (Patient Left) -->
      <path d="M 235,170 C 235,140 255,150 260,185 C 265,215 255,245 238,255 C 234,240 234,190 235,170 Z" />
      <path d="M 240,265 C 260,285 265,310 255,330 C 245,335 235,310 236,275 Z" opacity="0.85"/>

      <!-- Third Ventricle Central -->
      <ellipse cx="225" cy="225" rx="4" ry="18"/>
    </g>

    <!-- Basal Ganglia & Thalamic Outline -->
    <ellipse cx="185" cy="220" rx="16" ry="24" fill="#3b485d" opacity="0.35" filter="url(#mriBlur)"/>
    <ellipse cx="265" cy="220" rx="16" ry="24" fill="#3b485d" opacity="0.35" filter="url(#mriBlur)"/>

    <!-- Tumor Specific Lesion Overlay -->
    ${tumorVisual}

    <!-- Medical DICOM HUD Overlay Markers -->
    <g fill="#f43f5e" opacity="0.75" font-family="monospace" font-size="11" font-weight="600">
      <text x="18" y="28">T2-AXIAL 5.0mm</text>
      <text x="18" y="44">TR: 4200 TE: 105</text>
      <text x="18" y="430">FOV: 240mm</text>
      <text x="350" y="28">NEUROCARE</text>
      <text x="385" y="44">R: 0.94</text>
      <text x="220" y="22" text-anchor="middle" fill="#94a3b8">A</text>
      <text x="220" y="442" text-anchor="middle" fill="#94a3b8">P</text>
      <text x="12" y="230" fill="#94a3b8">R</text>
      <text x="432" y="230" fill="#94a3b8">L</text>
    </g>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const SAMPLE_SCANS: SampleScan[] = [
  {
    id: "sample-glioma-01",
    name: "Sample 1: High-Grade Glioma",
    type: "Glioma",
    sliceType: "Axial T2 / FLAIR",
    expectedConfidence: 0.94,
    description: "Axial T2 scan displaying a large heterogenous infiltrating mass in the right temporoparietal lobe with extensive peripheral vasogenic edema.",
    anatomicalLocation: "Right Temporoparietal Cortex",
    focusRegion: { x: 0.62, y: 0.40, radius: 0.20, intensity: 0.94, quadrant: "Right Temporoparietal" },
    imagingCharacteristics: [
      "Infiltrative hyperintense borders on T2-weighted sequence",
      "Mass effect with mild subfalcine herniation component",
      "Central necrosis with irregular peripheral ring salience"
    ],
    fileSize: "248 KB",
    dimensions: "512x512",
    svgDataUri: generateBrainMriSvg("Glioma", { x: 0.62, y: 0.40, radius: 0.20, intensity: 0.94, quadrant: "Right Temporoparietal" })
  },
  {
    id: "sample-meningioma-02",
    name: "Sample 2: Parasagittal Meningioma",
    type: "Meningioma",
    sliceType: "Axial Contrast-Enhanced T1",
    expectedConfidence: 0.91,
    description: "Well-circumscribed extra-axial extra-parenchymal mass along the left frontal convexity with characteristic broad dural attachment.",
    anatomicalLocation: "Left Parasagittal Convexity",
    focusRegion: { x: 0.33, y: 0.36, radius: 0.16, intensity: 0.89, quadrant: "Left Frontal Convexity" },
    imagingCharacteristics: [
      "Well-defined hyperdense homogeneous extra-axial lesion",
      "Distinct 'dural tail sign' extending along the inner calvarial margin",
      "Adjacent cortical buckling without parenchymal infiltration"
    ],
    fileSize: "215 KB",
    dimensions: "512x512",
    svgDataUri: generateBrainMriSvg("Meningioma", { x: 0.33, y: 0.36, radius: 0.16, intensity: 0.89, quadrant: "Left Frontal Convexity" })
  },
  {
    id: "sample-pituitary-03",
    name: "Sample 3: Pituitary Macroadenoma",
    type: "Pituitary",
    sliceType: "Coronal / Axial T1 Post-Contrast",
    expectedConfidence: 0.96,
    description: "Centrally positioned expansile mass arising from the sella turcica with suprasellar extension toward the optic chiasm.",
    anatomicalLocation: "Sellar / Suprasellar Region",
    focusRegion: { x: 0.50, y: 0.59, radius: 0.13, intensity: 0.96, quadrant: "Central Sellar Region" },
    imagingCharacteristics: [
      "Enlargement of the pituitary fossa with suprasellar elevation",
      "Waist sign / 'figure-of-eight' appearance at diaphragmatic notch",
      "Homogeneous enhancement with intact cavernous sinus planes"
    ],
    fileSize: "260 KB",
    dimensions: "512x512",
    svgDataUri: generateBrainMriSvg("Pituitary", { x: 0.50, y: 0.59, radius: 0.13, intensity: 0.96, quadrant: "Central Sellar Region" })
  },
  {
    id: "sample-normal-04",
    name: "Sample 4: Normal Brain Control",
    type: "No Tumor",
    sliceType: "Axial T2 Fast Spin Echo",
    expectedConfidence: 0.98,
    description: "Normal brain anatomy showing symmetrical lateral ventricles, intact grey-white matter differentiation, and absence of focal lesions.",
    anatomicalLocation: "Normal Anatomical Symmetry",
    focusRegion: { x: 0.50, y: 0.50, radius: 0.05, intensity: 0.10, quadrant: "Symmetrical Ventricles" },
    imagingCharacteristics: [
      "Sharp, symmetrical ventricular system without midline shift",
      "Preserved cortical sulcation and basal cisterns",
      "No abnormal signal intensity or pathological mass effect"
    ],
    fileSize: "198 KB",
    dimensions: "512x512",
    svgDataUri: generateBrainMriSvg("No Tumor", { x: 0.50, y: 0.50, radius: 0.05, intensity: 0.10, quadrant: "Symmetrical Ventricles" })
  }
];
