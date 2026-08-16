import React, { useState, useEffect } from "react";
import { AppLayout } from "./components/layout/AppLayout";
import { LandingPage } from "./pages/LandingPage";
import { DashboardPage } from "./pages/DashboardPage";
import { AnalyzePage } from "./pages/AnalyzePage";
import { RegistrationPage } from "./pages/RegistrationPage";
import { AppointmentsPage } from "./pages/AppointmentsPage";
import { HealthGuidePage } from "./pages/HealthGuidePage";
import { ResultsDetailPage } from "./pages/ResultsDetailPage";
import { PatientsPage } from "./pages/PatientsPage";
import { PatientDetailPage } from "./pages/PatientDetailPage";
import { HistoryPage } from "./pages/HistoryPage";
import { ModelInfoPage } from "./pages/ModelInfoPage";
import { AboutPage } from "./pages/AboutPage";
import { SettingsPage } from "./pages/SettingsPage";
import { storageService } from "./services/storage";
import { AppSettings } from "./types";

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    return window.location.hash ? window.location.hash.slice(1) : "/";
  });
  const [settings, setSettings] = useState<AppSettings>(() => storageService.getSettings());

  // Listen to browser hash navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash ? window.location.hash.slice(1) : "/";
      setCurrentRoute(hash);
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const handleNavigate = (route: string) => {
    window.location.hash = route;
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleUpdateSettings = (newSettings: AppSettings) => {
    storageService.saveSettings(newSettings);
    setSettings(newSettings);
  };

  const handleResetData = () => {
    storageService.resetAllDemoData();
    setSettings(storageService.getSettings());
  };

  // Route Parser
  const renderRoute = () => {
    const cleanRoute = currentRoute.split("?")[0];
    const params = new URLSearchParams(currentRoute.split("?")[1] || "");

    if (cleanRoute === "/" || cleanRoute === "/landing") {
      return <LandingPage onNavigate={handleNavigate} />;
    }

    if (cleanRoute === "/dashboard") {
      return <DashboardPage onNavigate={handleNavigate} settings={settings} />;
    }

    if (cleanRoute === "/register") {
      return <RegistrationPage onNavigate={handleNavigate} />;
    }

    if (cleanRoute === "/appointments") {
      return <AppointmentsPage onNavigate={handleNavigate} />;
    }

    if (cleanRoute === "/health-guide") {
      return <HealthGuidePage onNavigate={handleNavigate} />;
    }

    if (cleanRoute === "/analyze") {
      const patientId = params.get("patientId") || undefined;
      return <AnalyzePage onNavigate={handleNavigate} settings={settings} presetScanId={patientId} />;
    }

    if (cleanRoute.startsWith("/history/")) {
      const scanId = cleanRoute.replace("/history/", "");
      return <ResultsDetailPage scanId={scanId} onNavigate={handleNavigate} settings={settings} />;
    }

    if (cleanRoute === "/history") {
      const search = params.get("search") || "";
      return <HistoryPage onNavigate={handleNavigate} initialSearch={search} />;
    }

    if (cleanRoute.startsWith("/patients/")) {
      const patientId = cleanRoute.replace("/patients/", "");
      return <PatientDetailPage patientId={patientId} onNavigate={handleNavigate} />;
    }

    if (cleanRoute === "/patients") {
      return <PatientsPage onNavigate={handleNavigate} />;
    }

    if (cleanRoute === "/model") {
      return <ModelInfoPage onNavigate={handleNavigate} settings={settings} />;
    }

    if (cleanRoute === "/about") {
      return <AboutPage />;
    }

    if (cleanRoute === "/settings") {
      return (
        <SettingsPage
          settings={settings}
          onUpdateSettings={handleUpdateSettings}
          onResetData={handleResetData}
        />
      );
    }

    // Default Fallback
    return <LandingPage onNavigate={handleNavigate} />;
  };

  return (
    <AppLayout
      currentRoute={currentRoute}
      onNavigate={handleNavigate}
      settings={settings}
      onUpdateSettings={handleUpdateSettings}
    >
      {renderRoute()}
    </AppLayout>
  );
}
