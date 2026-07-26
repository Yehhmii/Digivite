'use client';
import { signOut } from '@/actions/auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useSidebar } from '@/components/admin/Sidebar';
import { Menu, LogOut, Loader2, Bell, User } from 'lucide-react';

interface HeaderProps {
  admin: any;
}

export default function Header({ admin }: HeaderProps) {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { toggle } = useSidebar();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 h-16 transition-all">
      <div className="flex justify-between items-center px-4 sm:px-6 h-full">
        <div className="flex items-center gap-3">
          <button
            onClick={toggle}
            className="md:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="hidden sm:block">
            <h2 className="text-base sm:text-lg font-semibold text-slate-800 tracking-tight">
              Welcome back, <span className="text-indigo-600 font-bold">{admin?.name || 'Admin'}</span>
            </h2>
          </div>
          <div className="sm:hidden">
            <h2 className="text-sm font-semibold text-slate-800">
              Hi, <span className="text-indigo-600 font-bold">{admin?.name?.split(' ')[0] || 'Admin'}</span>
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button 
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors relative"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-600 rounded-full ring-2 ring-white" />
          </button>
          
          <div className="relative">
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-indigo-600 rounded-xl disabled:opacity-50 transition-all shadow-xs cursor-pointer"
            >
              {isLoggingOut ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Logging out...</span>
                </>
              ) : (
                <>
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </>
              )}
            </button>
            
            {/* Mobile user menu button */}
            <button
              onClick={toggleDropdown}
              className="sm:hidden flex items-center p-1 text-slate-600 hover:text-slate-900 rounded-full transition-colors"
              aria-label="Open user menu"
            >
              <div className="w-8 h-8 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-full flex items-center justify-center text-white shadow-xs font-bold text-xs">
                {admin?.name?.charAt(0)?.toUpperCase() || 'A'}
              </div>
            </button>
            
            {/* Mobile dropdown menu */}
            {isDropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-10"
                  onClick={() => setIsDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl py-1 z-20 border border-slate-100 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-3 border-b border-slate-100">
                    <div className="font-semibold text-sm text-slate-800">{admin?.name || 'Admin'}</div>
                    <div className="text-xs text-slate-400 truncate">{admin?.email}</div>
                  </div>
                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="w-full text-left px-4 py-2.5 text-xs font-medium text-rose-600 hover:bg-rose-50 disabled:opacity-50 flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    {isLoggingOut ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Logging out...</span>
                      </>
                    ) : (
                      <>
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}