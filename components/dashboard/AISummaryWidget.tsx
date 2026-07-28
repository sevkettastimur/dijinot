'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, Upload, FileText, Sparkles, CheckCircle2, ChevronDown, Zap } from 'lucide-react';
import { SubscriptionRole } from '@/lib/types';
import { FeatureGateBanner } from './TierBadge';

interface AISummaryWidgetProps {
  role: SubscriptionRole;
  onUpgrade?: () => void;
}

const MOCK_SUMMARY = {
  title: 'CENG 201 - Vize Özet AI Analizi',
  sections: [
    { label: 'Genel Bakış', content: 'Bu not AVL Ağaçları, Graph Traversal ve Big-O analizi konularını kapsamaktadır. Vize sınavında %85 ihtimalle bu konulardan soru gelecektir.' },
    { label: 'Kritik Formüller', content: 'Height(Tree) = max(H(L), H(R)) + 1 | Big-O: O(log N) < O(N) < O(N log N) < O(N²)' },
    { label: 'Olası Sınav Sorusu', content: 'AVL ağacına eleman eklendiğinde rotasyon türünü belirleyin. Zorluk: Orta-Zor.' },
  ],
  confidence: 98.4,
};

export default function AISummaryWidget({ role, onUpgrade }: AISummaryWidgetProps) {
  const [activeTab, setActiveTab] = useState<'summary' | 'tips'>('summary');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [expandedSection, setExpandedSection] = useState<number | null>(0);

  const isUnlocked = role === 'PRO_STUDENT' || role === 'RESEARCHER_DOCENT';

  const handleProcess = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setShowResult(true);
    }, 1800);
  };

  if (!isUnlocked) {
    return (
      <FeatureGateBanner
        label="AI OCR Not Özetleyicisi — Pro Özellik"
        description="Yüklediğiniz PDF notları yapay zekâ ile saniyeler içinde özetleyin."
        requiredRole="PRO_STUDENT"
        onUpgrade={onUpgrade}
      />
    );
  }

  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center shadow-md shadow-indigo-500/20">
            <BrainCircuit className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Yapay Zekâ OCR Özetleyici</h3>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">2X Dijipuan Çarpanı Aktif</p>
          </div>
        </div>
        <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold border border-emerald-300 dark:border-emerald-600">
          <Zap className="w-3 h-3" /> Aktif
        </span>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
        {(['summary', 'tips'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition ${
              activeTab === tab
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            {tab === 'summary' ? '📄 Not Özeti' : '🎯 Sınav Tüyoları'}
          </button>
        ))}
      </div>

      {/* Upload area */}
      {!showResult && (
        <div className="border-2 border-dashed border-indigo-300 dark:border-indigo-700 rounded-xl p-6 text-center space-y-3">
          <Upload className="w-8 h-8 text-indigo-400 mx-auto" />
          <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">PDF notunuzu buraya sürükleyin veya seçin</p>
          <button
            onClick={handleProcess}
            disabled={isProcessing}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 text-white text-xs font-bold hover:from-indigo-500 transition disabled:opacity-60"
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                AI Analiz Ediyor...
              </span>
            ) : (
              <span className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5" /> AI ile Özetle</span>
            )}
          </button>
        </div>
      )}

      {/* Results */}
      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{MOCK_SUMMARY.title}</p>
              <span className="text-[10px] bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full font-bold border border-emerald-300 dark:border-emerald-600">
                <CheckCircle2 className="w-3 h-3 inline mr-0.5" />
                %{MOCK_SUMMARY.confidence} Güven
              </span>
            </div>
            {MOCK_SUMMARY.sections.map((sec, i) => (
              <div key={i} className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <button
                  onClick={() => setExpandedSection(expandedSection === i ? null : i)}
                  className="w-full flex items-center justify-between p-3 text-left bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{sec.label}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${expandedSection === i ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {expandedSection === i && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="p-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-200 dark:border-slate-700">
                        {sec.content}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
            <button
              onClick={() => setShowResult(false)}
              className="text-[10px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 underline mt-1 block text-center w-full"
            >
              Yeni not analiz et
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
