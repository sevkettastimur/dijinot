'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Coins, Upload, Download, Award, FileText, CheckCircle2,
  Clock, Trash2, Edit3, Eye, Bookmark, TrendingUp, Sparkles,
  ShieldCheck, Plus, Wifi, WifiOff, Zap, BookOpen, Microscope,
  GraduationCap, Crown, BarChart3
} from 'lucide-react';
import {
  MOCK_USER, MOCK_USER_FREE, MOCK_USER_RESEARCHER,
  MOCK_NOTES, MOCK_NOTE_EARNINGS, MOCK_TEMPLATES
} from '@/lib/mock-data';
import { UserProfile, SubscriptionRole } from '@/lib/types';
import TierBadge from '@/components/dashboard/TierBadge';
import DownloadLimitTracker from '@/components/dashboard/DownloadLimitTracker';
import AISummaryWidget from '@/components/dashboard/AISummaryWidget';
import CreatorEarningsPanel from '@/components/dashboard/CreatorEarningsPanel';
import PlagiarismChecker from '@/components/dashboard/PlagiarismChecker';

// --- Role Switcher (demo only) ---
const ROLE_USERS: Record<SubscriptionRole, UserProfile> = {
  FREE_STUDENT: MOCK_USER_FREE,
  PRO_STUDENT: MOCK_USER,
  RESEARCHER_DOCENT: MOCK_USER_RESEARCHER,
};

const ROLE_LABELS: Record<SubscriptionRole, string> = {
  FREE_STUDENT: '🎓 Ücretsiz Öğrenci',
  PRO_STUDENT: '⚡ Pro Öğrenci',
  RESEARCHER_DOCENT: '🔬 Araştırmacı & Doçent',
};

const USER_NOTES = [
  { id: 'note-101', title: 'Veri Yapıları - Vize Özet Kitapçığı', courseCode: 'CENG 201', date: '12 Mar 2026', status: 'Approved', downloads: 3820, earnedDijipuan: 450 },
  { id: 'note-104', title: 'Mühendislik Termodinamiği - Çözümlü Set', courseCode: 'MECH 202', date: '02 Nis 2026', status: 'Approved', downloads: 2100, earnedDijipuan: 280 },
  { id: 'note-105', title: 'İşletim Sistemleri - Process Scheduling', courseCode: 'CENG 302', date: 'Dün', status: 'Pending', downloads: 0, earnedDijipuan: 50 },
];

export default function UserDashboardPage() {
  const [activeRole, setActiveRole] = useState<SubscriptionRole>('PRO_STUDENT');
  const [activeTab, setActiveTab] = useState<'my-notes' | 'saved' | 'transactions'>('my-notes');
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [offlineSync, setOfflineSync] = useState(true);

  const user = ROLE_USERS[activeRole];
  const isFree = activeRole === 'FREE_STUDENT';
  const isPro = activeRole === 'PRO_STUDENT';
  const isResearcher = activeRole === 'RESEARCHER_DOCENT';

  return (
    <div className="space-y-6 pb-12">

      {/* Demo Role Switcher */}
      <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-amber-700 dark:text-amber-300 shrink-0">Demo Rol:</span>
        {(Object.keys(ROLE_LABELS) as SubscriptionRole[]).map((r) => (
          <button
            key={r}
            onClick={() => setActiveRole(r)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeRole === r
                ? 'bg-amber-500 text-white shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-amber-400'
            }`}
          >
            {ROLE_LABELS[r]}
          </button>
        ))}
      </div>

      {/* Profile Header */}
      <motion.div
        key={activeRole}
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm"
      >
        <div className="flex items-center gap-4">
          <div className="relative">
            <img src={user.avatar} alt={user.name} className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-4 border-cyan-500/30 shadow-lg" />
            {isResearcher && (
              <div className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full bg-purple-600 flex items-center justify-center border-2 border-white dark:border-slate-900 shadow">
                <ShieldCheck className="w-3.5 h-3.5 text-white" />
              </div>
            )}
            {isPro && (
              <div className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center border-2 border-white dark:border-slate-900 shadow">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
            )}
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">{user.name}</h1>
              {isResearcher && (
                <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/50 border border-purple-400/40 text-purple-700 dark:text-purple-300 text-[10px] font-bold">
                  <ShieldCheck className="w-3 h-3" /> Akademik Doğrulanmış
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">{user.university} • {user.department} ({user.academicLevel})</p>
            <TierBadge role={user.role} size="sm" />
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {isPro && (
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-700 text-xs font-bold text-indigo-700 dark:text-indigo-300">
              <Zap className="w-3.5 h-3.5" /> 2X Dijipuan Çarpanı Aktif
            </div>
          )}
          {isResearcher && (
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-700 text-xs font-bold text-purple-700 dark:text-purple-300">
              <Crown className="w-3.5 h-3.5" /> Telif Geliri Aktif
            </div>
          )}
          <Link href="/upload">
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 text-white text-xs font-bold shadow-md shadow-cyan-500/20 transition">
              <Plus className="w-4 h-4" /> Not Paylaş
            </button>
          </Link>
        </div>
      </motion.div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Dijipuan Bakiye', value: user.dijipuanBalance.toLocaleString('tr-TR'), sub: '+150 bu hafta', color: 'amber', Icon: Coins },
          { label: 'Yüklenen Notlar', value: user.uploadedCount, sub: isPro ? '2X Dijipuan Aktif' : '2 Not İncelemede', color: 'cyan', Icon: Upload },
          { label: 'Toplam İndirme', value: user.downloadedCount, sub: 'Tüm notlarınızdan', color: 'indigo', Icon: Download },
          { label: 'Akademik İtibar', value: `%${user.reputationScore}`, sub: 'Çok Yüksek', color: 'emerald', Icon: Award },
        ].map(({ label, value, sub, color, Icon }) => (
          <motion.div
            key={label}
            whileHover={{ y: -2 }}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{label}</span>
              <div className={`w-8 h-8 rounded-xl bg-${color}-100 dark:bg-${color}-900/40 text-${color}-600 dark:text-${color}-400 flex items-center justify-center`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <span className={`block text-2xl sm:text-3xl font-black text-${color}-600 dark:text-${color}-400`}>{value}</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400">{sub}</span>
          </motion.div>
        ))}
      </div>

      {/* === FREE USER TIER-SPECIFIC SECTION === */}
      {isFree && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Ücretsiz Öğrenci Paneli</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DownloadLimitTracker used={user.monthlyDownloadsUsed} limit={user.monthlyDownloadLimit} onUpgrade={() => setShowUpgradeModal(true)} />
            {/* Dijipuan Earnings Widget */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-amber-500" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Dijipuan Kazan</h3>
              </div>
              <div className="text-center py-2">
                <span className="text-3xl font-black text-amber-500">{user.dijipuanBalance}</span>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Mevcut Dijipuan Bakiyeniz</p>
              </div>
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs text-amber-700 dark:text-amber-300 space-y-1">
                <p className="font-bold">📤 Not Yükleyerek Dijipuan Kazan!</p>
                <p className="text-[11px] opacity-80">Her onaylı not +50 Dijipuan. Pro üyede 2X çarpan!</p>
              </div>
              <Link href="/upload">
                <button className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold hover:from-amber-400 transition shadow-md shadow-amber-500/20">
                  Not Yükle & Dijipuan Kazan
                </button>
              </Link>
            </div>
          </div>
          {/* Feature Gate banners */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <AISummaryWidget role="FREE_STUDENT" onUpgrade={() => setShowUpgradeModal(true)} />
            <div className="p-5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-700 relative overflow-hidden">
              <div className="absolute inset-0 backdrop-blur-[1px] bg-white/40 dark:bg-slate-900/40 flex items-center justify-center z-10">
                <div className="text-center space-y-2">
                  <BookOpen className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mx-auto" />
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Öğretmen Onaylı Notlar</p>
                  <button onClick={() => setShowUpgradeModal(true)} className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition">Pro&apos;ya Geç</button>
                </div>
              </div>
              <div className="opacity-20 space-y-2 pointer-events-none">
                {[1,2,3].map(i => <div key={i} className="h-4 bg-indigo-300 dark:bg-indigo-700 rounded" />)}
              </div>
            </div>
            <PlagiarismChecker role="FREE_STUDENT" onUpgrade={() => setShowUpgradeModal(true)} />
          </div>
        </motion.div>
      )}

      {/* === PRO USER SECTION === */}
      {isPro && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-500" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Pro Öğrenci Paneli</h2>
          </div>
          {/* Pro badges row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-700">
              <Download className="w-8 h-8 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <div>
                <p className="text-xs font-extrabold text-indigo-700 dark:text-indigo-300">Sınırsız İndirme</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">PDF & Soru Bankası Aktif</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-700">
              <Zap className="w-8 h-8 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <div>
                <p className="text-xs font-extrabold text-emerald-700 dark:text-emerald-300">2X Dijipuan Çarpanı</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">Her yüklemede çift puan</p>
              </div>
            </div>
            <div className="flex items-center justify-between gap-3 p-4 rounded-2xl bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-700">
              <div className="flex items-center gap-3">
                {offlineSync ? <Wifi className="w-8 h-8 text-cyan-600 dark:text-cyan-400 shrink-0" /> : <WifiOff className="w-8 h-8 text-slate-400 shrink-0" />}
                <div>
                  <p className="text-xs font-extrabold text-cyan-700 dark:text-cyan-300">Çevrimdışı Senkron</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">{offlineSync ? 'Aktif' : 'Pasif'}</p>
                </div>
              </div>
              <button
                onClick={() => setOfflineSync(!offlineSync)}
                className={`w-10 h-5 rounded-full transition-all ${offlineSync ? 'bg-cyan-500' : 'bg-slate-300 dark:bg-slate-700'} relative shrink-0`}
              >
                <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${offlineSync ? 'translate-x-5' : ''}`} />
              </button>
            </div>
          </div>
          {/* AI Widget - unlocked */}
          <AISummaryWidget role="PRO_STUDENT" />
        </motion.div>
      )}

      {/* === RESEARCHER SECTION === */}
      {isResearcher && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="flex items-center gap-2">
            <Microscope className="w-5 h-5 text-purple-500" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Araştırmacı & Doçent Paneli</h2>
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/50 border border-purple-400/40 text-purple-700 dark:text-purple-300 text-[10px] font-bold">
              <ShieldCheck className="w-3 h-3" /> Verified Educator
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <CreatorEarningsPanel
              earnings={MOCK_NOTE_EARNINGS}
              totalMonthly={user.totalEarningsMonthly}
              totalAllTime={user.totalEarningsAllTime}
              onWithdraw={() => {}}
            />
            <PlagiarismChecker role="RESEARCHER_DOCENT" />
          </div>

          {/* Presentation Templates */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-500" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Doktora & Doçentlik Sunum Şablonları</h3>
              </div>
              <span className="text-[10px] text-purple-600 dark:text-purple-400 font-bold">{MOCK_TEMPLATES.length} Şablon</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {MOCK_TEMPLATES.map((tmpl) => (
                <div key={tmpl.id} className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 group cursor-pointer hover:border-purple-400 dark:hover:border-purple-600 transition">
                  <div className="relative h-28 overflow-hidden">
                    <img src={tmpl.preview} alt={tmpl.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    {tmpl.isPremium && (
                      <span className="absolute top-2 right-2 px-1.5 py-0.5 bg-purple-600 text-white text-[9px] font-bold rounded">Premium</span>
                    )}
                  </div>
                  <div className="p-2.5 space-y-1">
                    <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200 line-clamp-2">{tmpl.title}</p>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
                      <span>{tmpl.slides > 0 ? `${tmpl.slides} slayt` : 'Word/PDF'}</span>
                      <span>{tmpl.downloads.toLocaleString('tr-TR')} indirme</span>
                    </div>
                    <button className="w-full py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-[10px] font-bold transition">
                      İndir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Notes Table (all roles) */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5">
        {/* Tab Headers */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto text-xs">
          {[
            { key: 'my-notes', label: `Yüklediğim Notlar (${USER_NOTES.length})`, icon: FileText, color: 'cyan' },
            { key: 'saved', label: `Kaydedilenlerim (${user.savedCount})`, icon: Bookmark, color: 'amber' },
            { key: 'transactions', label: 'Dijipuan Geçmişi', icon: TrendingUp, color: 'indigo' },
          ].map(({ key, label, icon: Icon, color }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as typeof activeTab)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold transition whitespace-nowrap ${
                activeTab === key
                  ? `bg-${color}-100 dark:bg-${color}-900/30 text-${color}-700 dark:text-${color}-300 border border-${color}-300 dark:border-${color}-700`
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'my-notes' && (
            <motion.div key="my-notes" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-3">Ders Notu / Kod</th>
                    <th className="py-3 px-3">Tarih</th>
                    <th className="py-3 px-3">Durum</th>
                    <th className="py-3 px-3">İndirme</th>
                    <th className="py-3 px-3">Kazanç {isPro && <span className="text-indigo-500">2X</span>}</th>
                    <th className="py-3 px-3 text-right">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {USER_NOTES.map((note) => (
                    <tr key={note.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition group">
                      <td className="py-3.5 px-3">
                        <span className="px-1.5 py-0.5 text-[9px] font-extrabold bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300 rounded">{note.courseCode}</span>
                        <p className="font-bold text-slate-800 dark:text-slate-200 line-clamp-1 mt-0.5">{note.title}</p>
                      </td>
                      <td className="py-3.5 px-3 text-slate-500 dark:text-slate-400 font-mono text-[11px]">{note.date}</td>
                      <td className="py-3.5 px-3">
                        {note.status === 'Approved'
                          ? <span className="flex w-max items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 font-bold text-[10px] border border-emerald-300 dark:border-emerald-700"><CheckCircle2 className="w-3 h-3" />Onaylandı</span>
                          : <span className="flex w-max items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 font-bold text-[10px] border border-amber-300 dark:border-amber-700"><Clock className="w-3 h-3" />AI İncelemesinde</span>
                        }
                      </td>
                      <td className="py-3.5 px-3 font-semibold text-slate-700 dark:text-slate-300">{note.downloads.toLocaleString('tr-TR')}</td>
                      <td className="py-3.5 px-3 font-bold text-amber-600 dark:text-amber-400">
                        +{isPro ? note.earnedDijipuan * 2 : note.earnedDijipuan} DP
                        {isPro && <span className="ml-1 text-[9px] text-indigo-500 dark:text-indigo-400">2X</span>}
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link href={`/notes/${note.id}`} className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-cyan-100 dark:hover:bg-cyan-900/40 text-slate-500 hover:text-cyan-700 dark:hover:text-cyan-300 transition"><Eye className="w-3.5 h-3.5" /></Link>
                          <button className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-amber-100 dark:hover:bg-amber-900/40 text-slate-500 hover:text-amber-700 dark:hover:text-amber-300 transition"><Edit3 className="w-3.5 h-3.5" /></button>
                          <button className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-rose-100 dark:hover:bg-rose-900/40 text-slate-500 hover:text-rose-700 dark:hover:text-rose-300 transition"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}

          {activeTab === 'saved' && (
            <motion.div key="saved" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {MOCK_NOTES.slice(0, 4).map((note) => (
                <div key={note.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-4">
                  <div className="min-w-0 space-y-1">
                    <span className="text-[10px] font-bold bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300 px-1.5 py-0.5 rounded">{note.courseCode}</span>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-1">{note.title}</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">{note.university ?? note.educationTier}</p>
                  </div>
                  <Link href={`/notes/${note.id}`} className="shrink-0">
                    <button className="px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition">Oku</button>
                  </Link>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'transactions' && (
            <motion.div key="transactions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-2.5 text-xs">
              {[
                { label: 'CENG 201 Not Yükleme Ödülü', sub: '12 Mart 2026 • Sistem Tarafından Eklendi', amount: isPro ? '+100' : '+50' },
                { label: 'MED 104 Anatomi İndirme Geliri', sub: '15 Mart 2026 • 20 Öğrenci İndirdi', amount: isPro ? '+800' : '+400' },
                { label: 'Aylık Pro Üyelik', sub: '1 Nisan 2026 • Otomatik Yenileme', amount: '-490' },
              ].map((tx, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <div>
                    <span className="block font-bold text-slate-800 dark:text-slate-200">{tx.label}</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">{tx.sub}</span>
                  </div>
                  <span className={`font-bold ${tx.amount.startsWith('+') ? 'text-amber-600 dark:text-amber-400' : 'text-rose-600 dark:text-rose-400'}`}>
                    {tx.amount} DP
                  </span>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Upgrade Modal */}
      <AnimatePresence>
        {showUpgradeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowUpgradeModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-md w-full border border-slate-200 dark:border-slate-700 shadow-2xl text-center space-y-5"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/30">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Pro Öğrenci'ye Geç</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Sınırsız indirme, AI OCR özetleyici ve çok daha fazlası</p>
              </div>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-4xl font-black text-indigo-600 dark:text-indigo-400">49 ₺</span>
                <span className="text-slate-500 dark:text-slate-400 text-sm">/ ay</span>
              </div>
              <div className="flex flex-col gap-2">
                <Link href="/pricing" onClick={() => setShowUpgradeModal(false)}>
                  <button className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-bold hover:from-indigo-500 transition shadow-md shadow-indigo-500/20">
                    7 Gün Ücretsiz Dene
                  </button>
                </Link>
                <button onClick={() => setShowUpgradeModal(false)} className="w-full py-2 rounded-xl text-slate-500 dark:text-slate-400 text-sm hover:text-slate-700 dark:hover:text-slate-200 transition">
                  Şimdi Değil
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
