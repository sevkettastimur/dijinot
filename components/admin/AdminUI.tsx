'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, LucideIcon, ArrowUpRight, ArrowDownRight,
  Users, FileText, ShieldAlert, Wallet, Coins, GraduationCap, Sparkles,
  Microscope, Download, Bot, Flag, FileWarning, CheckCircle2, Hourglass,
  Eye, ShieldCheck, Banknote, UserCheck, UserX, Scale, BadgeCheck,
  AlertTriangle, ShieldOff,
} from 'lucide-react';

/* --------------------------------------------------------------------------
   Icon registry — Server Components cannot pass component references across
   the RSC boundary, so they hand us a string key instead (same convention the
   rest of the app uses via `iconName` on TierInfo / Faculty).
   -------------------------------------------------------------------------- */
export const ADMIN_ICONS = {
  Users, FileText, ShieldAlert, Wallet, Coins, GraduationCap, Sparkles,
  Microscope, Download, Bot, Flag, FileWarning, CheckCircle2, Hourglass,
  Eye, ShieldCheck, Banknote, UserCheck, UserX, Scale, BadgeCheck,
  AlertTriangle, ShieldOff,
} satisfies Record<string, LucideIcon>;

export type AdminIconName = keyof typeof ADMIN_ICONS;

const resolveIcon = (icon: LucideIcon | AdminIconName): LucideIcon =>
  typeof icon === 'string' ? ADMIN_ICONS[icon] : icon;

/**
 * Stable module-scope renderer. Resolving an icon inside a component body and
 * rendering it as `<Icon />` would create a fresh component identity on every
 * render (remounting the subtree), so we resolve + create the element here.
 */
function AdminIcon({ icon, className }: { icon: LucideIcon | AdminIconName; className?: string }) {
  return React.createElement(resolveIcon(icon), { className });
}

/* ==========================================================================
   ACCENT COLOR SYSTEM (explicit maps — avoids purged dynamic Tailwind classes)
   ========================================================================== */
export type Accent = 'blue' | 'cyan' | 'indigo' | 'emerald' | 'amber' | 'purple' | 'rose' | 'slate';

const ACCENT: Record<Accent, { iconWrap: string; value: string; ring: string; soft: string; solid: string }> = {
  blue: { iconWrap: 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400', value: 'text-blue-600 dark:text-blue-400', ring: 'group-hover:border-blue-400/60', soft: 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800', solid: 'bg-blue-600 hover:bg-blue-500' },
  cyan: { iconWrap: 'bg-cyan-100 text-cyan-600 dark:bg-cyan-900/40 dark:text-cyan-400', value: 'text-cyan-600 dark:text-cyan-400', ring: 'group-hover:border-cyan-400/60', soft: 'bg-cyan-50 dark:bg-cyan-950/30 border-cyan-200 dark:border-cyan-800', solid: 'bg-cyan-600 hover:bg-cyan-500' },
  indigo: { iconWrap: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400', value: 'text-indigo-600 dark:text-indigo-400', ring: 'group-hover:border-indigo-400/60', soft: 'bg-indigo-50 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800', solid: 'bg-indigo-600 hover:bg-indigo-500' },
  emerald: { iconWrap: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400', value: 'text-emerald-600 dark:text-emerald-400', ring: 'group-hover:border-emerald-400/60', soft: 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800', solid: 'bg-emerald-600 hover:bg-emerald-500' },
  amber: { iconWrap: 'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400', value: 'text-amber-600 dark:text-amber-400', ring: 'group-hover:border-amber-400/60', soft: 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800', solid: 'bg-amber-500 hover:bg-amber-400' },
  purple: { iconWrap: 'bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400', value: 'text-purple-600 dark:text-purple-400', ring: 'group-hover:border-purple-400/60', soft: 'bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800', solid: 'bg-purple-600 hover:bg-purple-500' },
  rose: { iconWrap: 'bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400', value: 'text-rose-600 dark:text-rose-400', ring: 'group-hover:border-rose-400/60', soft: 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800', solid: 'bg-rose-600 hover:bg-rose-500' },
  slate: { iconWrap: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300', value: 'text-slate-700 dark:text-slate-200', ring: 'group-hover:border-slate-400/60', soft: 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700', solid: 'bg-slate-700 hover:bg-slate-600' },
};

export const accentClasses = (a: Accent) => ACCENT[a];

/* ==========================================================================
   KPI CARD
   ========================================================================== */
interface KpiCardProps {
  label: string;
  value: string | number;
  /** Component when used from a Client Component, or a registry key from a Server Component. */
  icon: LucideIcon | AdminIconName;
  accent?: Accent;
  delta?: { value: string; positive: boolean };
  sub?: string;
  index?: number;
}

export function KpiCard({ label, value, icon, accent = 'blue', delta, sub, index = 0 }: KpiCardProps) {
  const c = ACCENT[accent];
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      whileHover={{ y: -3 }}
      className={`group p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors ${c.ring} space-y-3`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</span>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${c.iconWrap}`}>
          <AdminIcon icon={icon} className="w-[18px] h-[18px]" />
        </div>
      </div>
      <div className="flex items-end justify-between gap-2">
        <span className={`text-2xl sm:text-3xl font-black tracking-tight ${c.value}`}>{value}</span>
        {delta && (
          <span className={`inline-flex items-center gap-0.5 text-[11px] font-bold ${delta.positive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
            {delta.positive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
            {delta.value}
          </span>
        )}
      </div>
      {sub && <span className="block text-[10px] text-slate-400 dark:text-slate-500">{sub}</span>}
    </motion.div>
  );
}

/* ==========================================================================
   SECTION CARD  (titled panel)
   ========================================================================== */
interface SectionCardProps {
  title: string;
  icon?: LucideIcon | AdminIconName;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function SectionCard({ title, icon, action, children, className = '' }: SectionCardProps) {
  return (
    <div className={`rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm ${className}`}>
      <div className="flex items-center justify-between gap-3 px-5 sm:px-6 py-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2 min-w-0">
          {icon && <AdminIcon icon={icon} className="w-[18px] h-[18px] text-cyan-600 dark:text-cyan-400 shrink-0" />}
          <h2 className="text-sm font-bold text-slate-900 dark:text-white truncate">{title}</h2>
        </div>
        {action}
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </div>
  );
}

/* ==========================================================================
   STATUS PILL (generic)
   ========================================================================== */
export function Pill({ tone, icon, children }: { tone: Accent; icon?: LucideIcon | AdminIconName; children: React.ReactNode }) {
  const toneMap: Record<Accent, string> = {
    blue: 'bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-700',
    cyan: 'bg-cyan-100 text-cyan-700 border-cyan-300 dark:bg-cyan-900/40 dark:text-cyan-300 dark:border-cyan-700',
    indigo: 'bg-indigo-100 text-indigo-700 border-indigo-300 dark:bg-indigo-900/40 dark:text-indigo-300 dark:border-indigo-700',
    emerald: 'bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-700',
    amber: 'bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-700',
    purple: 'bg-purple-100 text-purple-700 border-purple-300 dark:bg-purple-900/40 dark:text-purple-300 dark:border-purple-700',
    rose: 'bg-rose-100 text-rose-700 border-rose-300 dark:bg-rose-900/40 dark:text-rose-300 dark:border-rose-700',
    slate: 'bg-slate-100 text-slate-600 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
  };
  return (
    <span className={`inline-flex w-max items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${toneMap[tone]}`}>
      {icon && <AdminIcon icon={icon} className="w-3 h-3 shrink-0" />}
      {children}
    </span>
  );
}

/* Risk badge for plagiarism / AI scores */
export function ScoreBadge({ score, label }: { score: number; label: string }) {
  const tone: Accent = score >= 60 ? 'rose' : score >= 30 ? 'amber' : 'emerald';
  return (
    <Pill tone={tone}>
      {label} %{score}
    </Pill>
  );
}

/* ==========================================================================
   BAR CHART (vertical, Tailwind only)
   ========================================================================== */
interface Bar { label: string; value: number; barClass?: string; }

export function VerticalBars({ data, valueFmt, height = 180 }: { data: Bar[]; valueFmt?: (v: number) => string; height?: number }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="flex items-end gap-2 sm:gap-3" style={{ height }}>
      {data.map((d, i) => (
        <div key={d.label} className="flex-1 flex flex-col items-center justify-end gap-2 group">
          <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">
            {valueFmt ? valueFmt(d.value) : d.value.toLocaleString('tr-TR')}
          </span>
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: `${(d.value / max) * 100}%` }}
            transition={{ delay: i * 0.05, type: 'spring', stiffness: 120, damping: 18 }}
            className={`w-full rounded-t-lg ${d.barClass ?? 'bg-gradient-to-t from-cyan-600 to-blue-500'} min-h-[6px]`}
          />
          <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 text-center truncate w-full">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

/* ==========================================================================
   TOGGLE
   ========================================================================== */
export function Toggle({ on, onClick, accent = 'cyan' }: { on: boolean; onClick: () => void; accent?: Accent }) {
  const solidOn: Record<string, string> = { cyan: 'bg-cyan-500', emerald: 'bg-emerald-500', indigo: 'bg-indigo-500', blue: 'bg-blue-500' };
  return (
    <button
      onClick={onClick}
      className={`w-10 h-5 rounded-full transition-colors relative shrink-0 ${on ? solidOn[accent] ?? 'bg-cyan-500' : 'bg-slate-300 dark:bg-slate-700'}`}
    >
      <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${on ? 'translate-x-5' : ''}`} />
    </button>
  );
}

/* ==========================================================================
   ADMIN MODAL (framer-motion, ESC to close)
   ========================================================================== */
interface AdminModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: string;
}

export function AdminModal({ open, onClose, children, maxWidth = 'max-w-2xl' }: AdminModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[60] bg-slate-950/60 backdrop-blur-sm flex items-start sm:items-center justify-center p-4 overflow-y-auto"
        >
          <motion.div
            initial={{ scale: 0.95, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 20, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            onClick={(e) => e.stopPropagation()}
            className={`relative w-full ${maxWidth} my-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl`}
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 z-10 p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/40 transition"
            >
              <X className="w-4 h-4" />
            </button>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ==========================================================================
   ACTION BUTTON
   ========================================================================== */
export function ActionButton({
  tone = 'slate',
  icon: Icon,
  children,
  onClick,
  variant = 'solid',
  className = '',
}: {
  tone?: Accent;
  icon?: LucideIcon;
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'solid' | 'soft';
  className?: string;
}) {
  const c = ACCENT[tone];
  const base = variant === 'solid' ? `${c.solid} text-white` : `${c.soft} ${c.value} border`;
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition ${base} ${className}`}
    >
      {Icon && <Icon className="w-3.5 h-3.5" />}
      {children}
    </button>
  );
}

/* Toast-ish inline confirmation banner used after mock actions */
export function InlineToast({ tone, children }: { tone: Accent; icon?: LucideIcon; children: React.ReactNode }) {
  const c = ACCENT[tone];
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className={`px-3.5 py-2 rounded-xl border text-xs font-semibold ${c.soft} ${c.value}`}
    >
      {children}
    </motion.div>
  );
}
