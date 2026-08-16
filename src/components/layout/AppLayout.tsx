import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { DisclaimerBanner } from "../common/DisclaimerBanner";
import { AppSettings } from "../../types";
import { HeartPulse } from "lucide-react";

interface AppLayoutProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  settings: AppSettings;
  onUpdateSettings: (settings: AppSettings) => void;
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  currentRoute,
  onNavigate,
  settings,
  onUpdateSettings,
  children
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleDemoMode = () => {
    onUpdateSettings({
      ...settings,
      demoMode: !settings.demoMode
    });
  };

  return (
    <div className="min-h-screen bg-[#0e0b11] text-slate-100 flex">
      {/* Sidebar Navigation */}
      <Sidebar
        currentRoute={currentRoute}
        onNavigate={onNavigate}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        isDemoMode={settings.demoMode}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Top Header */}
        <Header
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          onNavigate={onNavigate}
          isDemoMode={settings.demoMode}
          onToggleDemoMode={toggleDemoMode}
        />

        {/* Global Medical Disclaimer Header Strip */}
        <div className="px-4 sm:px-6 pt-3">
          <DisclaimerBanner compact className="shadow-xs" />
        </div>

        {/* Page Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-rose-950/60 py-6 px-4 sm:px-6 bg-[#0c0810] text-center text-xs text-rose-300/60">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-rose-200">
              <HeartPulse className="w-4 h-4 text-red-500" />
              <strong className="text-white">NeuroCare Health</strong>
              <span>— Cranial Diagnostic & Patient Management Portal</span>
            </div>
            <p className="text-[11px] text-rose-300/60">
              For educational/research purposes only. This tool does not replace professional medical diagnosis.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};
