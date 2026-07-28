'use client';

import React from 'react';
import { Sparkles, GraduationCap, Microscope, Lock } from 'lucide-react';
import { SubscriptionRole } from '@/lib/types';

interface TierBadgeProps {
  role: SubscriptionRole;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

const CONFIG = {
  FREE_STUDENT: {
    label: 'Ücretsiz Öğrenci',
    icon: GraduationCap,
    className: 'bg-slate-100 text-slate-600 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
    iconClass: 'text-slate-500 dark:text-slate-400',
  },
  PRO_STUDENT: {
    label: 'Pro Öğrenci & YKS',
    icon: Sparkles,
    className: 'bg-indigo-500/10 text-indigo-700 border-indigo-400/40 dark:bg-indigo-500/20 dark:text-indigo-300 dark:border-indigo-500/40',
    iconClass: 'text-indigo-500 dark:text-indigo-400',
  },
  RESEARCHER_DOCENT: {
    label: 'Araştırmacı & Doçent',
    icon: Microscope,
    className: 'bg-purple-500/10 text-purple-700 border-purple-400/40 dark:bg-purple-500/20 dark:text-purple-300 dark:border-purple-500/40',
    iconClass: 'text-purple-500 dark:text-purple-400',
  },
};

const SIZE = {
  sm: 'px-2 py-0.5 text-[10px] gap-1',
  md: 'px-2.5 py-1 text-xs gap-1.5',
  lg: 'px-3.5 py-1.5 text-sm gap-2',
};

const ICON_SIZE = {
  sm: 'w-3 h-3',
  md: 'w-3.5 h-3.5',
  lg: 'w-4 h-4',
};

export default function TierBadge({ role, size = 'md', showIcon = true }: TierBadgeProps) {
  const cfg = CONFIG[role];
  const Icon = cfg.icon;

  return (
    <span
      className={`inline-flex items-center font-bold rounded-full border ${cfg.className} ${SIZE[size]}`}
    >
      {showIcon && <Icon className={`${ICON_SIZE[size]} ${cfg.iconClass} shrink-0`} />}
      {cfg.label}
    </span>
  );
}

interface FeatureGateProps {
  label: string;
  description: string;
  requiredRole: 'PRO_STUDENT' | 'RESEARCHER_DOCENT';
  onUpgrade?: () => void;
}

export function FeatureGateBanner({ label, description, requiredRole, onUpgrade }: FeatureGateProps) {
  const isPro = requiredRole === 'PRO_STUDENT';
  return (
    <div className={`relative p-5 rounded-2xl border overflow-hidden ${
      isPro
        ? 'bg-indigo-50 border-indigo-200 dark:bg-indigo-950/30 dark:border-indigo-500/30'
        : 'bg-purple-50 border-purple-200 dark:bg-purple-950/30 dark:border-purple-500/30'
    }`}>
      {/* Blur overlay */}
      <div className="absolute inset-0 backdrop-blur-[1px] bg-white/30 dark:bg-slate-900/30 flex items-center justify-center z-10">
        <div className="text-center space-y-2">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto ${
            isPro ? 'bg-indigo-100 dark:bg-indigo-900/60' : 'bg-purple-100 dark:bg-purple-900/60'
          }`}>
            <Lock className={`w-5 h-5 ${isPro ? 'text-indigo-600 dark:text-indigo-400' : 'text-purple-600 dark:text-purple-400'}`} />
          </div>
          <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{label}</p>
          <button
            onClick={onUpgrade}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold text-white transition ${
              isPro
                ? 'bg-indigo-600 hover:bg-indigo-500'
                : 'bg-purple-600 hover:bg-purple-500'
            }`}
          >
            {isPro ? 'Pro\'ya Geç' : 'Akademisyen Hesabına Geç'}
          </button>
        </div>
      </div>
      {/* Ghost content */}
      <div className="space-y-2 opacity-20 pointer-events-none select-none">
        <div className="h-4 bg-slate-300 dark:bg-slate-600 rounded w-3/4" />
        <div className="h-3 bg-slate-300 dark:bg-slate-600 rounded w-full" />
        <div className="h-3 bg-slate-300 dark:bg-slate-600 rounded w-2/3" />
        <div className="h-8 bg-slate-300 dark:bg-slate-600 rounded w-1/3 mt-4" />
      </div>
    </div>
  );
}
