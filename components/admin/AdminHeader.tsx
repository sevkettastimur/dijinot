'use client';

import React, { useState, useRef, useEffect, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, Bell, Sun, Moon, LogOut, ShieldCheck, Users, FileText, Wallet,
  ShieldAlert, BadgeCheck, Scale, Server, Search, Dot,
} from 'lucide-react';
import { ADMIN_NAV } from './nav';
import { MOCK_ADMIN_NOTIFICATIONS, MOCK_ADMIN_OVERVIEW } from '@/lib/mock-data';
import { AdminNotificationType } from '@/lib/types';

const NOTIF_ICON: Record<AdminNotificationType, typeof Bell> = {
  moderation: ShieldAlert,
  verification: BadgeCheck,
  dmca: Scale,
  payout: Wallet,
  system: Server,
};

const NOTIF_TONE: Record<AdminNotificationType, string> = {
  moderation: 'text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/40',
  verification: 'text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/40',
  dmca: 'text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-900/40',
  payout: 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/40',
  system: 'text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800',
};

/* Theme lives on <html>, so we read it as an external store rather than
   mirroring it into state — this keeps the toggle in sync when the theme is
   changed elsewhere (e.g. the public navbar) and stays SSR-safe. */
const subscribeToTheme = (onChange: () => void) => {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  return () => observer.disconnect();
};
const getThemeSnapshot = () => document.documentElement.classList.contains('dark');
const getThemeServerSnapshot = () => false;

export default function AdminHeader({ onOpenMobileSidebar }: { onOpenMobileSidebar: () => void }) {
  const pathname = usePathname();
  const dark = useSyncExternalStore(subscribeToTheme, getThemeSnapshot, getThemeServerSnapshot);
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const active = [...ADMIN_NAV].sort((a, b) => b.href.length - a.href.length)
    .find((i) => (i.href === '/admin' ? pathname === '/admin' : pathname.startsWith(i.href)));

  const unread = MOCK_ADMIN_NOTIFICATIONS.filter((n) => n.unread).length;

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark', !dark);
  };

  const quickStats = [
    { icon: Users, label: 'Aktif Kullanıcı', value: (MOCK_ADMIN_OVERVIEW.totalUsers / 1000).toFixed(1) + 'K', tone: 'text-cyan-600 dark:text-cyan-400' },
    { icon: FileText, label: 'Onay Kuyruğu', value: MOCK_ADMIN_OVERVIEW.pendingModeration, tone: 'text-amber-600 dark:text-amber-400' },
    { icon: Wallet, label: 'Ödeme Talebi', value: MOCK_ADMIN_OVERVIEW.pendingPayouts, tone: 'text-emerald-600 dark:text-emerald-400' },
  ];

  return (
    <header className="sticky top-0 z-40 h-16 shrink-0 border-b border-slate-200 dark:border-slate-800 bg-white/85 dark:bg-slate-950/85 backdrop-blur-md">
      <div className="h-full px-4 sm:px-6 flex items-center justify-between gap-3">
        {/* Left: mobile menu + page title */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onOpenMobileSidebar}
            className="lg:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="min-w-0">
            <h1 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white truncate flex items-center gap-2">
              {active?.label ?? 'Yönetim Paneli'}
            </h1>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate hidden sm:block">{active?.hint}</p>
          </div>
        </div>

        {/* Center: quick system stats */}
        <div className="hidden xl:flex items-center gap-2">
          {quickStats.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100/70 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                <Icon className={`w-4 h-4 ${s.tone}`} />
                <div className="leading-none">
                  <span className={`text-sm font-black ${s.tone}`}>{s.value}</span>
                  <span className="block text-[9px] text-slate-500 dark:text-slate-400 mt-0.5">{s.label}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-2">
          <button className="hidden sm:flex p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition" title="Ara">
            <Search className="w-4 h-4" />
          </button>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            title="Tema Değiştir"
          >
            {dark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Notification center */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setNotifOpen((o) => !o)}
              className="relative p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              title="Bildirimler"
            >
              <Bell className="w-4 h-4" />
              {unread > 0 && (
                <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 inline-flex items-center justify-center rounded-full bg-rose-500 text-white text-[9px] font-black">
                  {unread}
                </span>
              )}
            </button>

            <AnimatePresence>
              {notifOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 8 }}
                  className="absolute right-0 mt-2 w-[340px] max-w-[calc(100vw-2rem)] rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden z-50"
                >
                  <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white">Bildirim Merkezi</h3>
                    <span className="text-[10px] font-bold text-cyan-600 dark:text-cyan-400">{unread} yeni</span>
                  </div>
                  <div className="max-h-[360px] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                    {MOCK_ADMIN_NOTIFICATIONS.map((n) => {
                      const Icon = NOTIF_ICON[n.type];
                      return (
                        <div key={n.id} className={`flex items-start gap-3 px-4 py-3 transition hover:bg-slate-50 dark:hover:bg-slate-800/50 ${n.unread ? 'bg-cyan-50/40 dark:bg-cyan-950/10' : ''}`}>
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${NOTIF_TONE[n.type]}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                              {n.title}
                              {n.unread && <Dot className="w-4 h-4 text-cyan-500 shrink-0" />}
                            </p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-snug mt-0.5">{n.detail}</p>
                            <span className="text-[9px] text-slate-400 dark:text-slate-500 mt-1 block">{n.time}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <Link
                    href="/admin/analytics"
                    onClick={() => setNotifOpen(false)}
                    className="block text-center py-2.5 text-[11px] font-bold text-cyan-600 dark:text-cyan-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 transition"
                  >
                    Tüm sistem günlüğünü gör
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Exit Admin */}
          <Link
            href="/"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold hover:opacity-90 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Admin&apos;den Çık</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
