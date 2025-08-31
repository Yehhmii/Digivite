'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createContext, useContext, useState, useEffect } from 'react';

// Context for sidebar state
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

// Sidebar Provider (wrap your layout with this)
export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // Auto-close sidebar on mobile when switching to desktop
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
      {/* Mobile overlay */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-opacity-50 z-40 md:hidden"
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
    { href: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/admin/checkedIn', label: 'Events-CheckIns', icon: '🎉' },
    { href: '/admin/guests', label: 'Guests', icon: '👥' },
    { href: '/admin/settings', label: 'Settings', icon: '⚙️' },
  ];

  const handleLinkClick = () => {
    // Close sidebar on mobile when clicking a link
    if (window.innerWidth < 768) {
      close();
    }
  };

  return (
    <div className={`
      fixed top-16 left-0 h-[calc(100vh-4rem)] bg-white shadow-lg z-30 transform transition-transform duration-300 ease-in-out
      md:relative md:top-0 md:h-full md:translate-x-0 md:shadow-md
      ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      w-64
    `}>
      <div className="flex flex-col h-full">
        {/* Header - only show on mobile */}
        <div className="flex items-center justify-between p-4 border-b bg-indigo-600 md:hidden">
          <h1 className="text-lg font-bold text-white">
            Admin Panel
          </h1>
          <button
            onClick={close}
            className="text-white p-1 hover:bg-indigo-700 rounded"
            aria-label="Close menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Desktop header */}
        <div className="hidden md:block p-4 border-b">
          <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={handleLinkClick}
                  className={`
                    flex items-center p-3 rounded-lg transition-colors duration-200 text-sm sm:text-base
                    ${pathname === item.href 
                      ? 'bg-indigo-50 text-indigo-600 border-r-2 border-indigo-600' 
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }
                  `}
                >
                  <span className="mr-3 text-lg">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        {/* Footer */}
        <div className="p-4 border-t bg-gray-50">
          <div className="text-xs text-gray-500 text-center">
            Admin Dashboard v1.0
          </div>
        </div>
      </div>
    </div>
  );
}