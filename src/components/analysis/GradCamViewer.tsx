import React, { useState, useRef, useEffect } from "react";
import { 
  Eye, 
  Layers, 
  Flame, 
  Sliders, 
  Crosshair, 
  Square, 
  Download, 
  Maximize2, 
  Info, 
  RefreshCw,
  Palette,
  HeartPulse
} from "lucide-react";
import { GradCamData } from "../../types";
import { renderGradCamToCanvas, ColorMapType, HeatmapRenderOptions } from "../../services/gradcamCanvas";

interface GradCamViewerProps {
  imageUrl: string;
  gradcam: GradCamData;
  prediction: string;
  isDemo?: boolean;
}

export const GradCamViewer: React.FC<GradCamViewerProps> = ({
  imageUrl,
  gradcam,
  prediction,
  isDemo = true
}) => {
  const [viewMode, setViewMode] = useState<"overlay" | "heatmap" | "original">("overlay");
  const [opacity, setOpacity] = useState(0.75);
  const [threshold, setThreshold] = useState(0.15);
  const [colormap, setColormap] = useState<ColorMapType>("INFERNO");
  const [showBoundingBox, setShowBoundingBox] = useState(true);
  const [showPeakCrosshair, setShowPeakCrosshair] = useState(true);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  // Load and render MRI onto canvas
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageUrl;
    img.onload = () => {
      imgRef.current = img;
      render();
    };
  }, [imageUrl]);

  const render = () => {
    if (!canvasRef.current || !imgRef.current) return;

    const options: HeatmapRenderOptions = {
      colormap,
      opacity,
      threshold,
      showBoundingBox,
      showPeakCrosshair,
      focusRegion: gradcam.focus_region,
    };

    renderGradCamToCanvas(canvasRef.current, imgRef.current, options, viewMode);
  };

  useEffect(() => {
    render();
  }, [viewMode, opacity, threshold, colormap, showBoundingBox, showPeakCrosshair, gradcam]);

  const handleDownloadSnapshot = () => {
    if (!canvasRef.current) return;
    const link = document.createElement("a");
    link.download = `cranial_heatmap_${prediction.toLowerCase()}_${colormap.toLowerCase()}.png`;
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
  };

  const handleResetControls = () => {
    setViewMode("overlay");
    setOpacity(0.75);
    setThreshold(0.15);
    setColormap("INFERNO");
    setShowBoundingBox(true);
    setShowPeakCrosshair(true);
  };

  return (
    <div className="rounded-3xl bg-[#15121c] border border-rose-900/40 p-5 sm:p-6 shadow-2xl space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-rose-900/30">
        <div>
          <div className="flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-red-400" />
            <h3 className="text-base font-bold text-white">
              Focal Lesion Visualizer & Saliency Heatmap
            </h3>
          </div>
          <p className="text-xs text-rose-200/70 mt-0.5">
            Automated anatomical region-of-interest localization and saliency intensity mapping
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleResetControls}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-xs text-rose-300 transition-colors"
            title="Reset to default view"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
          <button
            type="button"
            onClick={handleDownloadSnapshot}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md shadow-red-600/30 transition-all"
            title="Download high-resolution image"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Save Image</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Interactive Canvas + Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left / Center: The Render Canvas */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="relative w-full max-w-[440px] aspect-square rounded-3xl bg-black border-2 border-rose-900/60 shadow-2xl p-2 overflow-hidden flex items-center justify-center group">
            <canvas
              ref={canvasRef}
              width={512}
              height={512}
              className="w-full h-full object-contain rounded-2xl cursor-crosshair"
            />

            {/* Quick View Mode Floating Bar */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1 p-1 rounded-2xl bg-black/80 backdrop-blur-md border border-rose-800/80 shadow-xl">
              <button
                type="button"
                onClick={() => setViewMode("overlay")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  viewMode === "overlay"
                    ? "bg-red-600 text-white shadow-sm"
                    : "text-rose-200 hover:text-white"
                }`}
              >
                Blended
              </button>
              <button
                type="button"
                onClick={() => setViewMode("heatmap")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  viewMode === "heatmap"
                    ? "bg-red-600 text-white shadow-sm"
                    : "text-rose-200 hover:text-white"
                }`}
              >
                Heatmap
              </button>
              <button
                type="button"
                onClick={() => setViewMode("original")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  viewMode === "original"
                    ? "bg-red-600 text-white shadow-sm"
                    : "text-rose-200 hover:text-white"
                }`}
              >
                Raw MRI
              </button>
            </div>
          </div>

          <div className="w-full max-w-[440px] flex items-center justify-between text-[11px] font-mono text-rose-300/70 mt-2 px-1">
            <span>ROI: {gradcam.focus_region.quadrant}</span>
            <span>INTENSITY: {(gradcam.focus_region.intensity * 100).toFixed(0)}%</span>
          </div>
        </div>

        {/* Right: Controls & Adjustments */}
        <div className="lg:col-span-5 space-y-4">
          {/* Colormap Selector */}
          <div className="p-4 rounded-2xl bg-[#191422] border border-rose-900/40 space-y-2.5">
            <label className="text-xs font-mono uppercase text-rose-300 font-semibold flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-red-400" />
              <span>Saliency Palette</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(["INFERNO", "JET", "VIRIDIS", "COOLWARM"] as ColorMapType[]).map((cm) => (
                <button
                  key={cm}
                  type="button"
                  onClick={() => setColormap(cm)}
                  className={`p-2 rounded-xl text-xs font-bold border transition-all text-left flex items-center justify-between ${
                    colormap === cm
                      ? "bg-red-600/20 border-red-500 text-white shadow-xs"
                      : "bg-[#130f1b] border-rose-900/30 text-rose-200/70 hover:border-rose-700"
                  }`}
                >
                  <span>{cm}</span>
                  {colormap === cm && <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>}
                </button>
              ))}
            </div>
          </div>

          {/* Opacity Slider */}
          <div className="p-4 rounded-2xl bg-[#191422] border border-rose-900/40 space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-rose-300 uppercase font-semibold">Heatmap Blend Opacity</span>
              <span className="text-red-400 font-bold">{Math.round(opacity * 100)}%</span>
            </div>
            <input
              type="range"
              min={0.1}
              max={1.0}
              step={0.05}
              value={opacity}
              onChange={(e) => setOpacity(parseFloat(e.target.value))}
              className="w-full accent-red-600 cursor-pointer h-1.5 bg-rose-950 rounded-lg"
            />
          </div>

          {/* Threshold Slider */}
          <div className="p-4 rounded-2xl bg-[#191422] border border-rose-900/40 space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-rose-300 uppercase font-semibold">Intensity Threshold</span>
              <span className="text-red-400 font-bold">{Math.round(threshold * 100)}%</span>
            </div>
            <input
              type="range"
              min={0.0}
              max={0.8}
              step={0.05}
              value={threshold}
              onChange={(e) => setThreshold(parseFloat(e.target.value))}
              className="w-full accent-red-600 cursor-pointer h-1.5 bg-rose-950 rounded-lg"
            />
          </div>

          {/* Overlays Toggles */}
          <div className="p-4 rounded-2xl bg-[#191422] border border-rose-900/40 space-y-2.5">
            <span className="text-xs font-mono uppercase text-rose-300 font-semibold block">
              Anatomical Markers
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setShowBoundingBox(!showBoundingBox)}
                className={`p-2 rounded-xl text-xs font-bold border transition-colors flex items-center justify-center gap-1.5 ${
                  showBoundingBox
                    ? "bg-red-600/20 border-red-500 text-white"
                    : "bg-[#130f1b] border-rose-900/30 text-rose-200/60"
                }`}
              >
                <Square className="w-3.5 h-3.5" />
                <span>Lesion Box</span>
              </button>

              <button
                type="button"
                onClick={() => setShowPeakCrosshair(!showPeakCrosshair)}
                className={`p-2 rounded-xl text-xs font-bold border transition-colors flex items-center justify-center gap-1.5 ${
                  showPeakCrosshair
                    ? "bg-red-600/20 border-red-500 text-white"
                    : "bg-[#130f1b] border-rose-900/30 text-rose-200/60"
                }`}
              >
                <Crosshair className="w-3.5 h-3.5" />
                <span>Peak Center</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
