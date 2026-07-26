'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createContext, useContext, useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  UserCheck, 
  Users, 
  Settings, 
  QrCode, 
  X,
  Sparkles
} from 'lucide-react';

const SidebarContext = createContext<{
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
}>({
  isOpen: false,
  toggle: () => {},
  close: () => {},
});

export const useSidebar = () => useContext(SidebarContext);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsOpen(false);
      }
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const toggle = () => setIsOpen(!isOpen);
  const close = () => setIsOpen(false);

  return (
    <SidebarContext.Provider value={{ isOpen, toggle, close }}>
      {children}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 md:hidden transition-opacity"
          onClick={close}
        />
      )}
    </SidebarContext.Provider>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const { isOpen, close } = useSidebar();

  const navItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/checkedIn', label: 'Events & Check-Ins', icon: UserCheck },
    { href: '/admin/guests', label: 'Guests', icon: Users },
    { href: '/admin/scanner', label: 'QR Scanner', icon: QrCode },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  const handleLinkClick = () => {
    if (window.innerWidth < 768) {
      close();
    }
  };

  return (
    <aside className={`
      fixed top-16 left-0 h-[calc(100vh-4rem)] bg-white border-r border-slate-200 shadow-xl z-50 transform transition-transform duration-300 ease-in-out
      md:relative md:top-0 md:h-full md:translate-x-0 md:shadow-none
      ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      w-64 flex flex-col justify-between shrink-0
    `}>
      <div className="flex flex-col h-full">
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-gradient-to-r from-indigo-600 to-violet-600 md:hidden text-white">
          <div className="flex items-center gap-2 font-bold text-lg">
            <Sparkles className="w-5 h-5" />
            <span>Admin Panel</span>
          </div>
          <button
            onClick={close}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
        
        {/* Desktop Brand Header */}
        <div className="hidden md:flex items-center gap-2.5 p-5 border-b border-slate-100">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold shadow-xs">
            D
          </div>
          <h1 className="text-lg font-bold text-slate-800 tracking-tight">Digivite Admin</h1>
        </div>
        
        {/* Navigation items */}
        <nav className="flex-1 p-3 overflow-y-auto space-y-1">
          <div className="px-3 py-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Navigation
          </div>
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={handleLinkClick}
                    className={`
                      flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium
                      ${isActive 
                        ? 'bg-indigo-50/80 text-indigo-600 shadow-xs font-semibold' 
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }
                    `}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        
        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-medium text-slate-500">System Online</span>
          </div>
        </div>
      </div>
    </aside>
  );
}