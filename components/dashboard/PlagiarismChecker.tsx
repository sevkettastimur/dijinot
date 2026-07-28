'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Upload, AlertTriangle, CheckCircle2, XCircle, FileText, Search } from 'lucide-react';
import { SubscriptionRole, PlagiarismResult } from '@/lib/types';
import { FeatureGateBanner } from './TierBadge';

interface PlagiarismCheckerProps {
  role: SubscriptionRole;
  onUpgrade?: () => void;
}

const MOCK_RESULT: PlagiarismResult = {
  fileName: 'transformer-tez-ozeti.pdf',
  overallScore: 7,
  aiGenerated: 12,
  copyrightRisk: 'low',
  matches: [
    { source: 'Vaswani et al. (2017) — "Attention Is All You Need"', similarity: 4.2 },
    { source: 'LeCun, Y. (2015) — "Deep Learning" Nature', similarity: 2.1 },
    { source: 'arXiv:2310.01208 — LoRA Fine-Tuning Survey', similarity: 0.7 },
  ],
};

const RISK_CONFIG = {
  low: { label: 'Düşük Risk', color: 'text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/40 border-emerald-400 dark:border-emerald-600', bar: 'bg-emerald-500', icon: CheckCircle2 },
  medium: { label: 'Orta Risk', color: 'text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/40 border-amber-400 dark:border-amber-600', bar: 'bg-amber-500', icon: AlertTriangle },
  high: { label: 'Yüksek Risk', color: 'text-rose-700 dark:text-rose-300 bg-rose-100 dark:bg-rose-900/40 border-rose-400 dark:border-rose-600', bar: 'bg-rose-500', icon: XCircle },
};

export default function PlagiarismChecker({ role, onUpgrade }: PlagiarismCheckerProps) {
  const [step, setStep] = useState<'idle' | 'checking' | 'done'>('idle');
  const [result] = useState<PlagiarismResult>(MOCK_RESULT);

  const isUnlocked = role === 'RESEARCHER_DOCENT';

  if (!isUnlocked) {
    return (
      <FeatureGateBanner
        label="AI Plagiat & Telif Denetim Aracı — Akademisyen Özelliği"
        description="Notlarınızı yayınlamadan önce telif hakkı ve intihal kontrolü yapın."
        requiredRole="RESEARCHER_DOCENT"
        onUpgrade={onUpgrade}
      />
    );
  }

  const riskCfg = RISK_CONFIG[result.copyrightRisk];
  const RiskIcon = riskCfg.icon;

  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-md shadow-purple-500/20">
          <ShieldCheck className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">AI Plagiat & Telif Denetimi</h3>
          <p className="text-[10px] text-slate-500 dark:text-slate-400">Yayın öncesi güvenli kontrol</p>
        </div>
      </div>

      {/* Upload / Check area */}
      {step === 'idle' && (
        <div className="border-2 border-dashed border-purple-300 dark:border-purple-700 rounded-xl p-6 text-center space-y-3">
          <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-900/40 flex items-center justify-center mx-auto">
            <FileText className="w-6 h-6 text-purple-500 dark:text-purple-400" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-700 dark:text-slate-200">PDF notunuzu yükleyin</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">Maks. 50MB — PDF, DOCX, TXT desteklenir</p>
          </div>
          <button
            onClick={() => { setStep('checking'); setTimeout(() => setStep('done'), 2200); }}
            className="flex items-center gap-2 mx-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white text-xs font-bold shadow-md shadow-purple-500/20 transition"
          >
            <Search className="w-4 h-4" /> Denetimi Başlat
          </button>
        </div>
      )}

      {/* Checking */}
      {step === 'checking' && (
        <div className="py-8 text-center space-y-3">
          <div className="w-12 h-12 border-4 border-purple-200 dark:border-purple-800 border-t-purple-600 rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-slate-700 dark:text-slate-200">AI analiz ediyor...</p>
          <p className="text-[10px] text-slate-500 dark:text-slate-400">Akademik veri tabanlarıyla karşılaştırılıyor</p>
        </div>
      )}

      {/* Results */}
      <AnimatePresence>
        {step === 'done' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            {/* Score row */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-center">
                <span className="block text-xl font-black text-slate-900 dark:text-slate-100">%{result.overallScore}</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Benzerlik</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-center">
                <span className="block text-xl font-black text-slate-900 dark:text-slate-100">%{result.aiGenerated}</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">AI Üretimi</span>
              </div>
              <div className={`p-3 rounded-xl border text-center ${riskCfg.color}`}>
                <RiskIcon className="w-5 h-5 mx-auto mb-1" />
                <span className="text-[10px] font-bold">{riskCfg.label}</span>
              </div>
            </div>

            {/* Overall bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                <span>Genel Benzerlik Skoru</span>
                <span>%{result.overallScore}</span>
              </div>
              <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${result.overallScore}%` }}
                  transition={{ duration: 1 }}
                  className={`h-full rounded-full ${riskCfg.bar}`}
                />
              </div>
            </div>

            {/* Matches */}
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Tespit Edilen Kaynaklar</p>
              {result.matches.map((m, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs gap-3">
                  <span className="text-slate-700 dark:text-slate-300 truncate">{m.source}</span>
                  <span className="shrink-0 font-bold text-slate-900 dark:text-slate-100">%{m.similarity}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setStep('idle')}
              className="w-full py-2 rounded-xl border border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300 text-xs font-bold hover:bg-purple-50 dark:hover:bg-purple-900/30 transition"
            >
              <Upload className="w-3.5 h-3.5 inline mr-1.5" />Yeni Dosya Denetle
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
