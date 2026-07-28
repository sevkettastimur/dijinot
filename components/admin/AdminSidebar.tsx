'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, ChevronRight, ShieldCheck, LogOut, X, Command,
} from 'lucide-react';
import { ADMIN_NAV } from './nav';
import { MOCK_ADMIN_OVERVIEW } from '@/lib/mock-data';

interface AdminSidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

function NavList({ collapsed, onNavigate }: { collapsed: boolean; onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="space-y-1">
      {ADMIN_NAV.map((item) => {
        const isActive = item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href);
        const Icon = item.icon;
        const badge = item.badgeKey ? MOCK_ADMIN_OVERVIEW[item.badgeKey] : undefined;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            title={collapsed ? item.label : undefined}
            className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
              isActive
                ? 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60 border border-transparent'
            }`}
          >
            {isActive && (
              <motion.span
                layoutId="admin-nav-active"
                className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-cyan-500"
              />
            )}
            <Icon className="w-4 h-4 shrink-0" />
            {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
            {!collapsed && badge ? (
              <span className="shrink-0 min-w-5 h-5 px-1.5 inline-flex items-center justify-center rounded-full bg-rose-500 text-white text-[10px] font-bold">
                {badge}
              </span>
            ) : null}
            {collapsed && badge ? (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" />
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}

function Brand({ collapsed }: { collapsed: boolean }) {
  return (
    <Link href="/admin" className="flex items-center gap-2.5 group">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-800 via-slate-900 to-cyan-700 flex items-center justify-center shadow-md shadow-cyan-500/20 shrink-0">
        <ShieldCheck className="w-5 h-5 text-cyan-300" />
      </div>
      {!collapsed && (
        <div className="flex flex-col leading-tight">
          <span className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white">
            diji<span className="text-cyan-600 dark:text-cyan-400">not</span>
          </span>
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
            Admin Console
          </span>
        </div>
      )}
    </Link>
  );
}

function Footer({ collapsed }: { collapsed: boolean }) {
  return (
    <div className="p-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
      {!collapsed && (
        <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-100/70 dark:bg-slate-800/50">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-xs font-black shrink-0">
            SA
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate">Sistem Yöneticisi</p>
            <p className="text-[9px] text-slate-500 dark:text-slate-400 truncate">Süper Admin • Tam Yetki</p>
          </div>
        </div>
      )}
      <Link
        href="/"
        title={collapsed ? 'Yönetici modundan çık' : undefined}
        className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
      >
        <LogOut className="w-4 h-4 shrink-0" />
        {!collapsed && <span>Yönetici Modundan Çık</span>}
      </Link>
    </div>
  );
}

export default function AdminSidebar({ collapsed, onToggleCollapse, mobileOpen, onCloseMobile }: AdminSidebarProps) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex flex-col shrink-0 sticky top-0 h-screen border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 transition-[width] duration-300 relative ${
          collapsed ? 'w-[76px]' : 'w-64'
        }`}
      >
        <button
          onClick={onToggleCollapse}
          className="absolute -right-3 top-8 z-30 w-6 h-6 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center hover:text-cyan-600 dark:hover:text-cyan-400 shadow-md transition"
          title={collapsed ? 'Genişlet' : 'Daralt'}
        >
          {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>

        <div className={`h-16 flex items-center border-b border-slate-200 dark:border-slate-800 ${collapsed ? 'justify-center px-2' : 'px-4'}`}>
          <Brand collapsed={collapsed} />
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          {!collapsed && (
            <span className="block px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Yönetim Modülleri
            </span>
          )}
          <NavList collapsed={collapsed} />

          {!collapsed && (
            <div className="mt-4 p-3 rounded-2xl bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950/40 dark:to-blue-950/30 border border-cyan-200 dark:border-cyan-500/20">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-cyan-700 dark:text-cyan-300">
                <Command className="w-3.5 h-3.5" /> AI Moderasyon Motoru
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                {MOCK_ADMIN_OVERVIEW.pendingModeration} belge OCR + intihal denetim kuyruğunda.
              </p>
            </div>
          )}
        </div>

        <Footer collapsed={collapsed} />
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onCloseMobile}
              className="lg:hidden fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 32 }}
              className="lg:hidden fixed inset-y-0 left-0 z-50 w-72 flex flex-col bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800"
            >
              <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800">
                <Brand collapsed={false} />
                <button onClick={onCloseMobile} className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-3">
                <NavList collapsed={false} onNavigate={onCloseMobile} />
              </div>
              <Footer collapsed={false} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
