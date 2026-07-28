'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Building2, 
  BookOpen, 
  Bookmark, 
  Trophy, 
  Coins, 
  ChevronLeft, 
  ChevronRight, 
  BrainCircuit, 
  Zap,
  GraduationCap,
  Smile,
  Microscope,
  Award,
  Crown
} from 'lucide-react';
import { MOCK_TIERS, MOCK_USER, MOCK_COURSES } from '@/lib/mock-data';

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const mainNavItems = [
    { label: 'Fakülteler & Bölümler', icon: Building2, href: '/faculties' },
    { label: 'Kaydedilenlerim', icon: Bookmark, href: '/dashboard' },
    { label: 'Liderlik Sıralaması', icon: Trophy, href: '/leaderboard' },
    { label: 'Üyelik & Paketler', icon: Crown, href: '/pricing' },
  ];

  return (
    <aside 
      className={`hidden md:flex flex-col border-r border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-950/90 transition-all duration-300 relative sticky top-16 h-[calc(100vh-4rem)] ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 w-6 h-6 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-cyan-600 dark:hover:text-cyan-400 z-30 shadow-md"
      >
        {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>

      <div className="p-4 space-y-6 flex-1 overflow-y-auto">
        
        {/* Education Tier Navigation Shortcuts */}
        <div className="space-y-2">
          {!isCollapsed && (
            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Eğitim Kademeleri
            </span>
          )}
          <div className="space-y-1">
            {MOCK_TIERS.map((tier) => (
              <Link
                key={tier.id}
                href={`/kategori/${tier.id}`}
                className="flex items-center justify-between p-2 rounded-xl bg-slate-100/80 dark:bg-slate-900/50 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-xs transition group"
                title={isCollapsed ? tier.shortName : undefined}
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <span className="w-2 h-2 rounded-full bg-cyan-500 shrink-0"></span>
                  {!isCollapsed && (
                    <span className="font-semibold text-slate-700 dark:text-slate-300 group-hover:text-cyan-600 dark:group-hover:text-cyan-300 truncate">
                      {tier.shortName}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Main Navigation */}
        <div className="space-y-1">
          {!isCollapsed && (
            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
              Navigasyon
            </span>
          )}
          {mainNavItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition group ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {!isCollapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </div>

        {/* AI Banner */}
        {!isCollapsed && (
          <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-indigo-900/40 dark:via-slate-900 dark:to-cyan-950/40 border border-indigo-200 dark:border-indigo-500/30 text-xs space-y-1.5 overflow-hidden">
            <div className="flex items-center gap-1.5 text-indigo-700 dark:text-indigo-300 font-bold">
              <BrainCircuit className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
              <span className="truncate">Yapay Zekâ OCR Not Okuyucu</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug break-words">
              İlkokul okuma özetlerinden doktora tezlerine kadar tüm notları anında tarayın.
            </p>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80">
        {!isCollapsed ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Coins className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{MOCK_USER.dijipuanBalance} Dijipuan</span>
            </div>
            <Link href="/dashboard" className="px-2 py-1 text-[10px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-300 rounded border border-amber-500/30">
              Panel
            </Link>
          </div>
        ) : (
          <div className="flex justify-center">
            <Coins className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>
        )}
      </div>
    </aside>
  );
}
