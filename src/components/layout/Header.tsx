import React, { useState, useRef, useEffect } from "react";
import { 
  Menu, 
  Search, 
  Bell, 
  HeartPulse, 
  CheckCircle2, 
  ChevronDown, 
  UserPlus, 
  User, 
  Stethoscope, 
  X,
  Calendar,
  Package,
  Download
} from "lucide-react";
import { NotificationItem, RegisteredUser } from "../../types";
import { storageService } from "../../services/storage";
import { downloadCompleteProjectZip } from "../../services/projectExport";

interface HeaderProps {
  onToggleSidebar: () => void;
  onNavigate: (route: string) => void;
  isDemoMode: boolean;
  onToggleDemoMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleSidebar,
  onNavigate,
  isDemoMode,
  onToggleDemoMode
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [currentUser, setCurrentUser] = useState<RegisteredUser | null>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setNotifications(storageService.getNotifications());
    setCurrentUser(storageService.getCurrentUser());
  }, [isNotifOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    onNavigate(`/history?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#110d16]/95 backdrop-blur-md border-b border-rose-950/60 px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Left: Mobile Toggle & Search */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-xl text-rose-300 hover:text-white hover:bg-rose-900/40 lg:hidden"
          aria-label="Toggle Navigation Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative w-full max-w-md hidden sm:block">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-rose-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search patient, Health ID, Scan ID, or findings..."
            className="w-full pl-9 pr-4 py-2 bg-[#191321] border border-rose-900/50 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-rose-300/40 focus:outline-hidden focus:border-red-500 focus:ring-1 focus:ring-red-500/30 transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-rose-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </form>
      </div>

      {/* Right: Actions, Notifications & Active Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Register Patient Button */}
        <button
          onClick={() => onNavigate("/register")}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-950/70 hover:bg-rose-900/80 border border-rose-800/60 text-rose-200 text-xs font-bold transition-colors"
        >
          <UserPlus className="w-3.5 h-3.5 text-red-400" />
          <span>Register Patient</span>
        </button>

        {/* Download Project ZIP button */}
        <button
          onClick={async () => {
            await downloadCompleteProjectZip();
          }}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-700/60 text-rose-200 text-xs font-bold transition-colors shadow-xs"
          title="Download the full application source code and files as a ZIP archive"
        >
          <Download className="w-3.5 h-3.5 text-emerald-400" />
          <span>Download Project ZIP</span>
        </button>

        {/* Analyze MRI CTA button */}
        <button
          onClick={() => onNavigate("/analyze")}
          className="flex items-center gap-2 px-3.5 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-red-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <HeartPulse className="w-4 h-4" />
          <span className="hidden xs:inline">Cranial Diagnostics</span>
        </button>

        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="relative p-2 rounded-xl text-rose-300 hover:text-white hover:bg-rose-900/40 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-3xl bg-[#17121f] border border-rose-800/80 shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150 text-white">
              <div className="flex items-center justify-between p-3.5 border-b border-rose-900/50 bg-[#120e18]">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-red-400" />
                  <h4 className="font-bold text-xs sm:text-sm text-white">Clinical Notifications</h4>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30">
                  {unreadCount} unread
                </span>
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-rose-900/30">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-rose-400/60">
                    No new clinical updates
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        storageService.markNotificationRead(n.id);
                        setNotifications(storageService.getNotifications());
                        if (n.link) {
                          onNavigate(n.link);
                          setIsNotifOpen(false);
                        }
                      }}
                      className={`p-3 text-left transition-colors cursor-pointer hover:bg-rose-900/30 ${
                        !n.read ? "bg-red-500/10" : ""
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-bold text-white">{n.title}</span>
                        <span className="text-[10px] text-rose-400/70 font-mono">{n.timestamp}</span>
                      </div>
                      <p className="text-[11px] text-rose-200/80 mt-1 leading-snug">{n.message}</p>
                    </div>
                  ))
                )}
              </div>

              <div className="p-2.5 border-t border-rose-900/50 bg-[#120e18] text-center">
                <button
                  onClick={() => {
                    notifications.forEach(n => storageService.markNotificationRead(n.id));
                    setNotifications(storageService.getNotifications());
                  }}
                  className="text-[11px] text-red-400 hover:text-red-300 font-bold"
                >
                  Mark all as read
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Switcher */}
        <button
          onClick={() => onNavigate("/register")}
          className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-[#191321] border border-rose-900/50 hover:border-rose-700 text-white transition-colors"
        >
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-red-600 to-rose-700 flex items-center justify-center text-white text-xs font-bold shadow-xs">
            {currentUser?.role === "Doctor" || currentUser?.role === "Radiologist" ? "Dr" : "Pt"}
          </div>
          <div className="hidden xl:block text-left">
            <p className="text-xs font-bold text-white leading-none truncate max-w-[120px]">
              {currentUser?.fullName || "Health Portal"}
            </p>
            <p className="text-[10px] text-rose-300/80 leading-none mt-0.5">
              {currentUser?.role || "Active Profile"}
            </p>
          </div>
        </button>
      </div>
    </header>
  );
};
