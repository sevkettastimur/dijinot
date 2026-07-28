'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Download, AlertTriangle, ArrowUp } from 'lucide-react';

interface DownloadLimitTrackerProps {
  used: number;
  limit: number;
  onUpgrade?: () => void;
}

export default function DownloadLimitTracker({ used, limit, onUpgrade }: DownloadLimitTrackerProps) {
  const remaining = limit - used;
  const pct = Math.min((used / limit) * 100, 100);
  const isCritical = remaining <= 1;
  const isExhausted = remaining <= 0;

  return (
    <div className={`p-5 rounded-2xl border space-y-3 ${
      isExhausted
        ? 'bg-rose-50 border-rose-300 dark:bg-rose-950/30 dark:border-rose-500/40'
        : isCritical
        ? 'bg-amber-50 border-amber-300 dark:bg-amber-950/30 dark:border-amber-500/40'
        : 'bg-white border-slate-200 dark:bg-slate-900 dark:border-slate-800'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
            isExhausted ? 'bg-rose-100 dark:bg-rose-900/60' :
            isCritical ? 'bg-amber-100 dark:bg-amber-900/60' :
            'bg-cyan-100 dark:bg-cyan-900/40'
          }`}>
            {isExhausted || isCritical
              ? <AlertTriangle className={`w-4 h-4 ${isExhausted ? 'text-rose-600 dark:text-rose-400' : 'text-amber-600 dark:text-amber-400'}`} />
              : <Download className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            }
          </div>
          <div>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Aylık Ücretsiz İndirme</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">Her ay 1'inde sıfırlanır</p>
          </div>
        </div>
        <div className="text-right">
          <span className={`text-2xl font-black ${
            isExhausted ? 'text-rose-600 dark:text-rose-400' :
            isCritical ? 'text-amber-600 dark:text-amber-400' :
            'text-slate-900 dark:text-slate-100'
          }`}>{remaining}</span>
          <span className="text-xs text-slate-500 dark:text-slate-400"> / {limit} kaldı</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="space-y-1">
        <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className={`h-full rounded-full ${
              isExhausted ? 'bg-rose-500' :
              isCritical ? 'bg-amber-500' :
              'bg-gradient-to-r from-cyan-500 to-blue-500'
            }`}
          />
        </div>
        <div className="flex justify-between text-[10px] text-slate-400">
          <span>{used} kullanıldı</span>
          <span>{limit} toplam</span>
        </div>
      </div>

      {(isCritical || isExhausted) && (
        <div className={`p-3 rounded-xl text-xs space-y-2 ${
          isExhausted
            ? 'bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300'
            : 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300'
        }`}>
          <p className="font-semibold">
            {isExhausted
              ? '❌ Aylık indirme limitiniz doldu!'
              : `⚠️ Yalnızca ${remaining} indirme hakkınız kaldı.`}
          </p>
          <button
            onClick={onUpgrade}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 font-bold text-indigo-700 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/40 transition w-max"
          >
            <ArrowUp className="w-3.5 h-3.5" />
            Pro&apos;ya Geç — Sınırsız İndirme
          </button>
        </div>
      )}
    </div>
  );
}
