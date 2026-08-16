import { FocusRegion } from "../types";

export type ColorMapType = "JET" | "VIRIDIS" | "INFERNO" | "COOLWARM";

export interface HeatmapRenderOptions {
  colormap: ColorMapType;
  opacity: number; // 0.0 to 1.0
  threshold: number; // 0.0 to 1.0
  showBoundingBox: boolean;
  showPeakCrosshair: boolean;
  focusRegion: FocusRegion;
  customOverlayUrl?: string;
}

// Colormap color stop definitions
const COLOR_STOPS: Record<ColorMapType, [number, number, number][]> = {
  JET: [
    [0, 0, 143],     // Dark Blue (0.0)
    [0, 0, 255],     // Blue (0.15)
    [0, 255, 255],   // Cyan (0.4)
    [0, 255, 0],     // Green (0.6)
    [255, 255, 0],   // Yellow (0.8)
    [255, 0, 0],     // Red (1.0)
  ],
  VIRIDIS: [
    [68, 1, 84],     // Deep Purple (0.0)
    [59, 82, 139],   // Blue-Purple (0.25)
    [33, 145, 140],  // Teal (0.5)
    [94, 201, 98],   // Green (0.75)
    [253, 231, 37],  // Yellow (1.0)
  ],
  INFERNO: [
    [0, 0, 4],       // Near Black (0.0)
    [87, 16, 110],   // Deep Purple (0.25)
    [187, 55, 84],   // Crimson (0.5)
    [249, 142, 9],   // Orange (0.75)
    [252, 255, 164], // Pale Yellow (1.0)
  ],
  COOLWARM: [
    [59, 76, 192],   // Cool Blue (0.0)
    [158, 186, 245], // Light Blue (0.35)
    [221, 221, 221], // Neutral White (0.5)
    [244, 154, 123], // Light Red (0.75)
    [180, 4, 38],    // Warm Crimson (1.0)
  ]
};

function interpolateColor(val: number, stops: [number, number, number][]): [number, number, number] {
  const clamped = Math.max(0, Math.min(1, val));
  const numSegments = stops.length - 1;
  const index = Math.min(numSegments - 1, Math.floor(clamped * numSegments));
  const t = (clamped - index / numSegments) * numSegments;

  const c1 = stops[index];
  const c2 = stops[index + 1];

  return [
    Math.round(c1[0] + (c2[0] - c1[0]) * t),
    Math.round(c1[1] + (c2[1] - c1[1]) * t),
    Math.round(c1[2] + (c2[2] - c1[2]) * t),
  ];
}

/**
 * Draws the blended Grad-CAM heatmap over an MRI image on a Canvas
 */
export function renderGradCamToCanvas(
  canvas: HTMLCanvasElement,
  imageElement: HTMLImageElement,
  options: HeatmapRenderOptions,
  mode: "original" | "heatmap" | "overlay" = "overlay"
): void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const width = canvas.width;
  const height = canvas.height;

  ctx.clearRect(0, 0, width, height);

  // 1. If mode is "original" or "overlay", draw base MRI scan
  if (mode === "original" || mode === "overlay") {
    ctx.drawImage(imageElement, 0, 0, width, height);
  } else {
    // Solid dark backdrop for heatmap-only mode
    ctx.fillStyle = "#090d16";
    ctx.fillRect(0, 0, width, height);
  }

  // If in pure original mode, we stop here
  if (mode === "original") return;

  // 2. Generate and render Grad-CAM Activation Heatmap
  const { focusRegion, colormap, opacity, threshold, showBoundingBox, showPeakCrosshair } = options;
  const stops = COLOR_STOPS[colormap] || COLOR_STOPS.JET;

  const centerX = focusRegion.x * width;
  const centerY = focusRegion.y * height;
  const radius = Math.max(20, focusRegion.radius * Math.min(width, height) * 1.6);

  // Create an offscreen buffer for accurate pixel-level heatmap color mapping
  const offscreen = document.createElement("canvas");
  offscreen.width = width;
  offscreen.height = height;
  const offCtx = offscreen.getContext("2d");
  if (!offCtx) return;

  // Draw smooth multi-layered gaussian gradient field
  const grad = offCtx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
  grad.addColorStop(0, "rgba(255, 255, 255, 1.0)");
  grad.addColorStop(0.25, "rgba(200, 200, 200, 0.85)");
  grad.addColorStop(0.55, "rgba(120, 120, 120, 0.50)");
  grad.addColorStop(0.80, "rgba(40, 40, 40, 0.20)");
  grad.addColorStop(1, "rgba(0, 0, 0, 0)");

  offCtx.fillStyle = grad;
  offCtx.fillRect(0, 0, width, height);

  // Map intensity gradient through selected medical colormap
  const imgData = offCtx.getImageData(0, 0, width, height);
  const data = imgData.data;

  for (let i = 0; i < data.length; i += 4) {
    const rawVal = data[i] / 255; // Normalized intensity 0.0 - 1.0
    
    // Check threshold
    if (rawVal < threshold || rawVal <= 0.02) {
      data[i + 3] = 0; // Transparent
      continue;
    }

    const scaledVal = (rawVal - threshold) / (1.0 - threshold);
    const [r, g, b] = interpolateColor(scaledVal, stops);

    data[i] = r;
    data[i + 1] = g;
    data[i + 2] = b;
    data[i + 3] = Math.round(rawVal * opacity * 255);
  }

  offCtx.putImageData(imgData, 0, 0);

  // Blend heatmap onto destination canvas
  if (mode === "overlay") {
    ctx.save();
    ctx.globalCompositeOperation = "screen";
    ctx.drawImage(offscreen, 0, 0);
    ctx.restore();
  } else {
    ctx.drawImage(offscreen, 0, 0);
  }

  // 3. Optional Bounding Box & Saliency Contours
  if (showBoundingBox && focusRegion.intensity > 0.3) {
    ctx.save();
    ctx.strokeStyle = "#06b6d4";
    ctx.lineWidth = 1.8;
    ctx.setLineDash([5, 3]);

    const boxW = radius * 1.5;
    const boxH = radius * 1.5;
    const boxX = centerX - boxW / 2;
    const boxY = centerY - boxH / 2;

    ctx.strokeRect(boxX, boxY, boxW, boxH);

    // Label tag
    ctx.setLineDash([]);
    ctx.fillStyle = "rgba(6, 182, 212, 0.9)";
    ctx.font = "600 10px JetBrains Mono, monospace";
    ctx.fillRect(boxX, boxY - 18, 110, 18);
    ctx.fillStyle = "#ffffff";
    ctx.fillText(`SALIENT REGION`, boxX + 6, boxY - 5);
    ctx.restore();
  }

  // 4. Optional Peak Gradient Activation Crosshair
  if (showPeakCrosshair) {
    ctx.save();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 6, 0, 2 * Math.PI);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(centerX - 10, centerY);
    ctx.lineTo(centerX + 10, centerY);
    ctx.moveTo(centerX, centerY - 10);
    ctx.lineTo(centerX, centerY + 10);
    ctx.stroke();

    // Coordinates tag
    ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
    ctx.strokeStyle = "rgba(51, 65, 85, 0.8)";
    ctx.lineWidth = 1;
    ctx.fillRect(centerX + 10, centerY + 10, 85, 28);
    ctx.strokeRect(centerX + 10, centerY + 10, 85, 28);

    ctx.fillStyle = "#38bdf8";
    ctx.font = "500 9px JetBrains Mono, monospace";
    ctx.fillText(`X:${Math.round(focusRegion.x * 100)}% Y:${Math.round(focusRegion.y * 100)}%`, centerX + 15, centerY + 23);
    ctx.fillText(`Peak: ${(focusRegion.intensity * 100).toFixed(0)}%`, centerX + 15, centerY + 33);
    ctx.restore();
  }
}
