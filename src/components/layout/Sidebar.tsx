import React from "react";
import { 
  LayoutDashboard, 
  HeartPulse, 
  Users, 
  History, 
  Settings, 
  UserPlus,
  Calendar,
  BookOpen,
  ChevronRight,
  ShieldCheck,
  Building2,
  PhoneCall
} from "lucide-react";
import { DemoBadge } from "../common/DemoBadge";

interface SidebarProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  isDemoMode: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRoute,
  onNavigate,
  isOpen,
  onToggle,
  isDemoMode
}) => {
  const navItems = [
    { id: "dashboard", label: "Clinic Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { id: "analyze", label: "Cranial Diagnostics", icon: HeartPulse, path: "/analyze", badge: "SCAN" },
    { id: "appointments", label: "Doctor Consultations", icon: Calendar, path: "/appointments" },
    { id: "register", label: "Register Patient & Staff", icon: UserPlus, path: "/register", badge: "NEW" },
    { id: "patients", label: "Patient Health Records", icon: Users, path: "/patients" },
    { id: "history", label: "Diagnostic Archives", icon: History, path: "/history" },
    { id: "health-guide", label: "Brain Health Guide", icon: BookOpen, path: "/health-guide" },
    { id: "settings", label: "Clinic Settings", icon: Settings, path: "/settings" },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onToggle}
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-xs lg:hidden"
        />
      )}

      <aside className={`
        fixed top-0 left-0 bottom-0 z-40
        w-64 bg-[#110d16] border-r border-rose-950/60
        flex flex-col justify-between
        transition-transform duration-300 ease-in-out
        lg:translate-x-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        {/* Brand Logo & Title */}
        <div>
          <div className="p-5 border-b border-rose-950/60 flex items-center gap-3">
            {/* Medical Cross / Heart Icon */}
            <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-red-600 to-rose-700 shadow-lg shadow-red-600/30 text-white shrink-0">
              <HeartPulse className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-400"></span>
              </span>
            </div>
            
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h1 className="font-black text-base tracking-tight text-white flex items-center">
                  Neuro<span className="text-red-400">Care</span>
                  <span className="ml-1 text-[9px] uppercase font-mono px-1.5 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 font-bold">
                    HEALTH
                  </span>
                </h1>
              </div>
              <p className="text-[11px] text-rose-200/60 font-medium truncate">
                Cranial Diagnostic & Patient Care
              </p>
            </div>
          </div>

          {/* Quick Clinic Status */}
          <div className="px-4 pt-3 pb-1">
            <div className="flex items-center justify-between p-2 rounded-xl bg-rose-950/30 border border-rose-900/40">
              <div className="flex items-center gap-1.5 text-xs text-rose-200">
                <Building2 className="w-3.5 h-3.5 text-red-400" />
                <span className="font-semibold text-[11px]">Pavilion Suite 400</span>
              </div>
              <DemoBadge label="ONLINE" size="sm" />
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentRoute === item.path || 
                (item.path !== "/" && currentRoute.startsWith(item.path));

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.path);
                    if (window.innerWidth < 1024) onToggle();
                  }}
                  className={`
                    w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl font-medium text-xs sm:text-sm
                    transition-all duration-150 group
                    ${isActive 
                      ? "bg-gradient-to-r from-red-600/20 to-rose-900/30 text-white border border-red-500/40 shadow-sm shadow-red-600/10 font-bold" 
                      : "text-rose-200/70 hover:text-white hover:bg-rose-950/40"
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 transition-colors ${isActive ? "text-red-400" : "text-rose-300/60 group-hover:text-rose-200"}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className="px-2 py-0.5 text-[9px] font-bold rounded-full bg-red-600 text-white uppercase tracking-wider shadow-xs">
                      {item.badge}
                    </span>
                  )}
                  {isActive && !item.badge && (
                    <ChevronRight className="w-4 h-4 text-red-400" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Emergency Hotline Footer */}
        <div className="p-4 border-t border-rose-950/60 bg-[#0e0a12]/80">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-red-950/40 to-rose-950/30 border border-red-900/40 text-[11px] text-rose-200 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-red-300">
              <PhoneCall className="w-3.5 h-3.5 text-red-400" />
              <span>Emergency Triage</span>
            </div>
            <p className="text-[10px] text-rose-200/70 leading-tight">
              Hotline: <strong className="text-white">911</strong> / <span className="font-mono text-rose-300">(800) 555-CRANIAL</span>
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
