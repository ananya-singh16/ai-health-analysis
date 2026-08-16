import React, { useState, useEffect } from "react";
import { 
  History, 
  Search, 
  Filter, 
  Download, 
  Trash2, 
  Eye, 
  HeartPulse, 
  Calendar, 
  ArrowUpDown,
  FileSpreadsheet,
  CheckCircle2
} from "lucide-react";
import { AnalysisRecord, TumorClass } from "../types";
import { storageService } from "../services/storage";

interface HistoryPageProps {
  onNavigate: (route: string) => void;
  initialSearch?: string;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({
  onNavigate,
  initialSearch = ""
}) => {
  const [analyses, setAnalyses] = useState<AnalysisRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [classFilter, setClassFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"date_desc" | "date_asc" | "conf_desc" | "conf_asc">("date_desc");

  useEffect(() => {
    setAnalyses(storageService.getAnalyses());
  }, []);

  const handleDelete = (id: string) => {
    if (confirm(`Are you sure you want to delete cranial scan record ${id}?`)) {
      storageService.deleteAnalysis(id);
      setAnalyses(storageService.getAnalyses());
    }
  };

  const handleExportCsv = () => {
    if (analyses.length === 0) return;

    const headers = ["Scan ID", "Patient ID", "Patient Name", "Date", "Diagnostic Finding", "Confidence (%)", "Duration (ms)", "Clinical Suite"];
    const rows = analyses.map(a => [
      a.id,
      a.patientId,
      `"${a.patientName.replace(/"/g, '""')}"`,
      new Date(a.date).toISOString(),
      a.prediction,
      (a.confidence * 100).toFixed(2),
      a.inferenceTimeMs,
      a.modelVersion
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `neurocare_diagnostic_archive_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtering & Sorting
  const filtered = analyses
    .filter(a => {
      const q = searchQuery.toLowerCase();
      const matchesQuery = 
        !q ||
        a.id.toLowerCase().includes(q) ||
        a.patientName.toLowerCase().includes(q) ||
        a.patientId.toLowerCase().includes(q) ||
        a.prediction.toLowerCase().includes(q);

      const matchesClass = classFilter === "all" || a.prediction === classFilter;
      return matchesQuery && matchesClass;
    })
    .sort((a, b) => {
      if (sortBy === "date_desc") return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortBy === "date_asc") return new Date(a.date).getTime() - new Date(b.date).getTime();
      if (sortBy === "conf_desc") return b.confidence - a.confidence;
      if (sortBy === "conf_asc") return a.confidence - b.confidence;
      return 0;
    });

  return (
    <div className="space-y-8">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-rose-900/40">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Diagnostic Archives & Scans
            </h1>
            <span className="text-xs font-mono text-red-300 bg-red-500/20 px-2.5 py-0.5 rounded-full border border-red-500/30">
              {analyses.length} Archived Scans
            </span>
          </div>
          <p className="text-xs sm:text-sm text-rose-200/70 mt-1">
            Complete radiological repository of cranial MRI assessments, focal lesion heatmaps, and doctor's notes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleExportCsv}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-xs font-bold text-rose-200 transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate("/analyze")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-xs shadow-md transition-all"
          >
            <HeartPulse className="w-4 h-4" />
            <span>Perform Scan</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="p-4 rounded-2xl bg-[#15121c] border border-rose-900/40 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-rose-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Scan ID, patient, pathology..."
            className="w-full pl-9 pr-4 py-2 bg-[#1c1724] border border-rose-900/50 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-rose-300/40 focus:outline-hidden focus:border-red-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Class Filter */}
          <div className="flex items-center gap-1.5 text-xs text-rose-200">
            <Filter className="w-3.5 h-3.5 text-red-400" />
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="px-3 py-1.5 bg-[#1c1724] border border-rose-900/50 rounded-xl text-xs text-slate-100 focus:outline-hidden focus:border-red-500"
            >
              <option value="all">All Diagnostic Findings</option>
              <option value="Glioma">Glioma</option>
              <option value="Meningioma">Meningioma</option>
              <option value="Pituitary">Pituitary</option>
              <option value="No Tumor">No Tumor (Normal)</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-1.5 text-xs text-rose-200">
            <ArrowUpDown className="w-3.5 h-3.5 text-red-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1.5 bg-[#1c1724] border border-rose-900/50 rounded-xl text-xs text-slate-100 focus:outline-hidden focus:border-red-500"
            >
              <option value="date_desc">Newest Date First</option>
              <option value="date_asc">Oldest Date First</option>
              <option value="conf_desc">Highest Confidence</option>
              <option value="conf_asc">Lowest Confidence</option>
            </select>
          </div>
        </div>
      </div>

      {/* Analysis Table */}
      <div className="p-6 rounded-3xl bg-[#15121c] border border-rose-900/40 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-rose-200">
            <thead className="text-[11px] uppercase tracking-wider text-rose-300/70 bg-[#120e18] border-b border-rose-900/40 font-mono">
              <tr>
                <th className="px-4 py-3 rounded-l-xl">Cranial MRI</th>
                <th className="px-4 py-3">Scan ID</th>
                <th className="px-4 py-3">Patient Record</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Diagnostic Assessment</th>
                <th className="px-4 py-3">Confidence</th>
                <th className="px-4 py-3">Latency</th>
                <th className="px-4 py-3 text-right rounded-r-xl">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rose-900/30">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-rose-400/60 text-xs">
                    No cranial scans found matching your search filters.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => {
                  const badgeColor = 
                    item.prediction === "Glioma" ? "text-rose-300 bg-rose-500/20 border-rose-500/40" :
                    item.prediction === "Meningioma" ? "text-amber-300 bg-amber-500/20 border-amber-500/40" :
                    item.prediction === "Pituitary" ? "text-cyan-300 bg-cyan-500/20 border-cyan-500/40" :
                    "text-emerald-300 bg-emerald-500/20 border-emerald-500/40";

                  return (
                    <tr key={item.id} className="hover:bg-rose-950/20 transition-colors">
                      <td className="px-4 py-3">
                        <div className="w-10 h-10 rounded-xl bg-black border border-rose-900/60 overflow-hidden shrink-0">
                          <img
                            src={item.imageUrl}
                            alt="Slice"
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      </td>
                      <td className="px-4 py-3 font-mono font-bold text-white">
                        {item.id}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-bold text-white">{item.patientName}</div>
                        <div className="text-[10px] text-rose-400/70 font-mono">{item.patientId}</div>
                      </td>
                      <td className="px-4 py-3 font-mono text-rose-300/70">
                        {new Date(item.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${badgeColor}`}>
                          {item.prediction}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono font-bold text-white">
                        {(item.confidence * 100).toFixed(1)}%
                      </td>
                      <td className="px-4 py-3 font-mono text-rose-300/70">
                        {item.inferenceTimeMs}ms
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => onNavigate(`/history/${item.id}`)}
                            className="p-1.5 rounded-xl text-red-400 hover:text-red-300 hover:bg-rose-950/60 transition-colors"
                            title="View Radiology Report"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(item.id)}
                            className="p-1.5 rounded-xl text-rose-400/60 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                            title="Delete Record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
