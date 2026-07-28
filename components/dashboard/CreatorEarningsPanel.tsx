'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Coins, BarChart3, DollarSign, Download, CheckCircle2, Clock, PauseCircle } from 'lucide-react';
import { NoteEarning } from '@/lib/types';

interface CreatorEarningsPanelProps {
  earnings: NoteEarning[];
  totalMonthly: number;
  totalAllTime: number;
  onWithdraw?: () => void;
}

const STATUS_CONFIG = {
  active: { label: 'Aktif Satışta', color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/40 border-emerald-300 dark:border-emerald-600', icon: CheckCircle2 },
  pending: { label: 'İncelemede', color: 'text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/40 border-amber-300 dark:border-amber-600', icon: Clock },
  paused: { label: 'Durduruldu', color: 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700', icon: PauseCircle },
};

export default function CreatorEarningsPanel({
  earnings,
  totalMonthly,
  totalAllTime,
  onWithdraw,
}: CreatorEarningsPanelProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'notes'>('overview');

  const maxEarning = Math.max(...earnings.map(e => e.earningsThisMonth), 1);

  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-md shadow-amber-500/20">
            <DollarSign className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Telif Geliri & Not Satış Paneli</h3>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">Araştırmacı & Doçent</p>
          </div>
        </div>
        <button
          onClick={onWithdraw}
          className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold hover:from-amber-400 transition shadow-md shadow-amber-500/20"
        >
          Ödeme Talep Et
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-3">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-center"
        >
          <span className="block text-2xl font-black text-amber-600 dark:text-amber-400">
            {totalMonthly.toLocaleString('tr-TR')} ₺
          </span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Bu Ay Gelir</span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-center"
        >
          <span className="block text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {totalAllTime.toLocaleString('tr-TR')} ₺
          </span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Toplam Gelir</span>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
        {(['overview', 'notes'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition ${
              activeTab === tab
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            {tab === 'overview' ? <span className="flex items-center justify-center gap-1"><BarChart3 className="w-3 h-3" />Grafik</span> : <span className="flex items-center justify-center gap-1"><Coins className="w-3 h-3" />Notlarım</span>}
          </button>
        ))}
      </div>

      {/* Chart view */}
      {activeTab === 'overview' && (
        <div className="space-y-2">
          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Bu Ay Not Bazlı Gelir</p>
          {earnings.map((e, i) => (
            <div key={e.id} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-700 dark:text-slate-300 truncate max-w-[200px] font-medium">{e.courseCode}</span>
                <span className="font-bold text-amber-600 dark:text-amber-400 shrink-0 ml-2">{e.earningsThisMonth.toLocaleString('tr-TR')} ₺</span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(e.earningsThisMonth / maxEarning) * 100}%` }}
                  transition={{ duration: 0.7, delay: i * 0.1 }}
                  className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Notes table */}
      {activeTab === 'notes' && (
        <div className="space-y-2">
          {earnings.map((e) => {
            const cfg = STATUS_CONFIG[e.status];
            const StatusIcon = cfg.icon;
            return (
              <div key={e.id} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-cyan-700 dark:text-cyan-300 bg-cyan-100 dark:bg-cyan-900/40 px-1.5 py-0.5 rounded">
                      {e.courseCode}
                    </span>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1 line-clamp-1">{e.noteTitle}</p>
                  </div>
                  <span className={`shrink-0 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${cfg.color}`}>
                    <StatusIcon className="w-3 h-3" />{cfg.label}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1"><Download className="w-3 h-3" />{e.salesCount} satış</span>
                  <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-bold">
                    <Coins className="w-3 h-3" />{e.earningsTotal.toLocaleString('tr-TR')} ₺ toplam
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
