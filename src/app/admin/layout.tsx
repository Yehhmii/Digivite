
'use client';
import { useEffect } from 'react';
import { SessionProvider, useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import Sidebar, { SidebarProvider } from '@/components/admin/Sidebar';
import Header from '@/components/admin/Header';
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "react-hot-toast";

function AdminContent({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  // pages where we do NOT want sidebar/header
  const isAuthPage = pathname === '/admin/login' || pathname === '/admin/signup';

  useEffect(() => {
    if (status === 'unauthenticated' && !isAuthPage) {
      router.push('/admin/login');
    }
  }, [status, router, isAuthPage]);

  if (status === 'loading' && !isAuthPage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          <p className="text-gray-600 text-sm">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  // If it's an auth page, skip Header/Sidebar and just render children
  if (isAuthPage) {
    return <main className="min-h-screen flex-1 p-4 sm:p-6">{children}</main>;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gray-100">
        <Header admin={session?.user} />
        <div className="flex">
          <Sidebar />
          <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{
            style: {
              border: "1px solid #E4E7EC",
              borderRadius: 15,
              padding: "16px",
              color: "#000",
              fontSize: 15,
              fontWeight: 400,
            },
            duration: 4000,
          }}
        />
        <NextTopLoader color="#3198F5" showSpinner={false} />
          <main className="flex-1 p-4 sm:p-6 md:ml-0 transition-all duration-300">
            <div className="max-w-7xl mx-auto">{children}</div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AdminContent>{children}</AdminContent>
    </SessionProvider>
  );
}
