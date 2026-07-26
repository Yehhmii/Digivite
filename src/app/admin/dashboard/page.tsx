'use client';

import React from 'react';
import Link from 'next/link';
import { 
  UserPlus, 
  QrCode, 
  UserCheck, 
  Sparkles, 
  ArrowRight, 
  Users, 
  CheckCircle2, 
  Clock, 
  ChevronRight,
  ShieldCheck,
  Table
} from 'lucide-react';

export default function DashboardPage() {
  const cards = [
    {
      title: 'Create Guest',
      description: 'Add new guests to your event & generate custom invitation links.',
      href: '/admin/guests',
      icon: UserPlus,
      gradient: 'from-blue-500 to-indigo-600',
      shadow: 'shadow-blue-500/10',
      badge: 'Quick Action',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    {
      title: 'QR Code Verification',
      description: 'Scan guest QR passes instantly at the venue entrance.',
      href: '/admin/scanner',
      icon: QrCode,
      gradient: 'from-violet-500 to-purple-600',
      shadow: 'shadow-purple-500/10',
      badge: 'Live Entrance',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200'
    },
    {
      title: 'Checked-in Guests',
      description: 'Monitor real-time arrival logs and check-in history.',
      href: '/admin/checkedIn',
      icon: UserCheck,
      gradient: 'from-emerald-500 to-teal-600',
      shadow: 'shadow-emerald-500/10',
      badge: 'Real-time',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    {
      title: 'Guest Status & Seating',
      description: 'View RSVP responses, assign tables, and update guest info.',
      href: '/admin/status',
      icon: Sparkles,
      gradient: 'from-amber-500 to-orange-600',
      shadow: 'shadow-amber-500/10',
      badge: 'Management',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200'
    }
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 lg:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-12 w-64 h-64 bg-violet-500/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold tracking-wide text-indigo-200">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              <span>Event Management Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
              Digivite Executive Control Center
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Seamlessly manage invitations, verify QR passes, monitor live venue check-ins, and orchestrate seating for your guests.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link 
              href="/admin/guests"
              className="inline-flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all duration-200 shadow-lg shadow-indigo-600/30 hover:scale-[1.02] active:scale-[0.98]"
            >
              <UserPlus className="w-4 h-4" />
              <span>Create New Guest</span>
            </Link>
            <Link 
              href="/admin/scanner"
              className="inline-flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm backdrop-blur-md border border-white/10 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              <QrCode className="w-4 h-4 text-indigo-300" />
              <span>Open QR Scanner</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Metrics Bar */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            System Highlights
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Event Guest Hub</p>
              <h3 className="text-lg font-bold text-slate-800">Active Lists</h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Venue Gate</p>
              <h3 className="text-lg font-bold text-slate-800">Live Verification</h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Scanner Engine</p>
              <h3 className="text-lg font-bold text-slate-800">Ready</h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Table className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Seating & Tables</p>
              <h3 className="text-lg font-bold text-slate-800">Configured</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Main Feature Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Admin Modules
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <Link 
                key={card.title} 
                href={card.href}
                className="group relative bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${card.gradient} text-white flex items-center justify-center shadow-lg ${card.shadow} group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className={`text-[11px] font-bold px-3 py-1 rounded-full border ${card.badgeColor}`}>
                      {card.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors flex items-center gap-1.5">
                      {card.title}
                    </h3>
                    <p className="text-slate-500 text-xs leading-relaxed mt-1.5">
                      {card.description}
                    </p>
                  </div>
                </div>

                <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-600 group-hover:text-indigo-600 transition-colors">
                  <span>Manage module</span>
                  <div className="w-7 h-7 rounded-full bg-slate-50 group-hover:bg-indigo-50 text-slate-400 group-hover:text-indigo-600 flex items-center justify-center transition-colors">
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}