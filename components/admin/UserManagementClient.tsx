'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Users, UserCheck, UserX, Coins, ChevronDown, Inbox,
  Settings2, ShieldOff, ShieldCheck, Plus, Minus, Sparkles,
  Microscope, GraduationCap, Mail, Building2, Upload, Download, Save,
} from 'lucide-react';
import { AdminModal, ActionButton, SectionCard, KpiCard } from './AdminUI';
import { MembershipBadge, UserStatusBadge } from './StatusBadges';
import { AdminUserRecord, SubscriptionRole, AdminUserStatus } from '@/lib/types';

const ROLE_OPTIONS: { key: SubscriptionRole; label: string; icon: typeof Sparkles; tone: string }[] = [
  { key: 'FREE_STUDENT', label: 'Ücretsiz Öğrenci', icon: GraduationCap, tone: 'border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-200' },
  { key: 'PRO_STUDENT', label: 'Pro Öğrenci & YKS', icon: Sparkles, tone: 'border-indigo-300 dark:border-indigo-700 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300' },
  { key: 'RESEARCHER_DOCENT', label: 'Araştırmacı & Doçent', icon: Microscope, tone: 'border-purple-300 dark:border-purple-700 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300' },
];

const STATUS_FILTERS: { key: AdminUserStatus | 'all'; label: string }[] = [
  { key: 'all', label: 'Tümü' },
  { key: 'active', label: 'Aktif' },
  { key: 'pending', label: 'Onay Bekleyen' },
  { key: 'suspended', label: 'Askıya Alınmış' },
];

const DP_STEPS = [-500, -100, 100, 500];

export default function UserManagementClient({ users }: { users: AdminUserRecord[] }) {
  const [rows, setRows] = useState<AdminUserRecord[]>(users);
  const [query, setQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<SubscriptionRole | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<AdminUserStatus | 'all'>('all');
  const [editing, setEditing] = useState<AdminUserRecord | null>(null);
  const [draftRole, setDraftRole] = useState<SubscriptionRole>('FREE_STUDENT');
  const [draftDijipuan, setDraftDijipuan] = useState(0);
  const [draftVerified, setDraftVerified] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLocaleLowerCase('tr');
    return rows.filter((u) => {
      const matchesQuery =
        !q ||
        u.name.toLocaleLowerCase('tr').includes(q) ||
        u.email.toLocaleLowerCase('tr').includes(q) ||
        u.university.toLocaleLowerCase('tr').includes(q);
      const matchesRole = roleFilter === 'all' || u.role === roleFilter;
      const matchesStatus = statusFilter === 'all' || u.status === statusFilter;
      return matchesQuery && matchesRole && matchesStatus;
    });
  }, [rows, query, roleFilter, statusFilter]);

  const counts = useMemo(
    () => ({
      total: rows.length,
      active: rows.filter((u) => u.status === 'active').length,
      suspended: rows.filter((u) => u.status === 'suspended').length,
      dijipuan: rows.reduce((s, u) => s + u.dijipuanBalance, 0),
    }),
    [rows]
  );

  const notify = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2600);
  };

  const openEditor = (u: AdminUserRecord) => {
    setEditing(u);
    setDraftRole(u.role);
    setDraftDijipuan(u.dijipuanBalance);
    setDraftVerified(u.isVerifiedEducator);
  };

  const saveEditor = () => {
    if (!editing) return;
    setRows((prev) =>
      prev.map((u) =>
        u.id === editing.id
          ? { ...u, role: draftRole, dijipuanBalance: Math.max(0, draftDijipuan), isVerifiedEducator: draftVerified }
          : u
      )
    );
    notify(`${editing.name} güncellendi.`);
    setEditing(null);
  };

  const toggleSuspend = (u: AdminUserRecord) => {
    const next: AdminUserStatus = u.status === 'suspended' ? 'active' : 'suspended';
    setRows((prev) => prev.map((r) => (r.id === u.id ? { ...r, status: next } : r)));
    notify(next === 'suspended' ? `${u.name} askıya alındı.` : `${u.name} yeniden aktifleştirildi.`);
    setEditing(null);
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">Kullanıcı & Üyelik Yönetimi</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Üyelik kademesini değiştirin, Dijipuan bakiyesini düzenleyin veya hesapları askıya alın.
          </p>
        </div>
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
              className="px-3.5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold"
            >
              {toast}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard index={0} label="Listelenen Kullanıcı" value={counts.total} icon={Users} accent="cyan" sub="Örnek yönetim veri seti" />
        <KpiCard index={1} label="Aktif Hesap" value={counts.active} icon={UserCheck} accent="emerald" sub="Platformu kullanabilir" />
        <KpiCard index={2} label="Askıya Alınmış" value={counts.suspended} icon={UserX} accent="rose" sub="Giriş ve indirme engelli" />
        <KpiCard index={3} label="Toplam Dijipuan" value={counts.dijipuan.toLocaleString('tr-TR')} icon={Coins} accent="amber" sub="Listedeki bakiyeler toplamı" />
      </div>

      <SectionCard title={`Kullanıcılar (${filtered.length})`} icon={Users}>
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="İsim, e-posta veya kurum ara..."
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500 transition"
              />
            </div>
            <div className="relative">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value as SubscriptionRole | 'all')}
                className="appearance-none w-full lg:w-56 pl-3.5 pr-8 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 cursor-pointer"
              >
                <option value="all">Tüm Üyelik Kademeleri</option>
                {ROLE_OPTIONS.map((r) => <option key={r.key} value={r.key}>{r.label}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {STATUS_FILTERS.map((f) => {
              const count = f.key === 'all' ? rows.length : rows.filter((r) => r.status === f.key).length;
              const isActive = statusFilter === f.key;
              return (
                <button
                  key={f.key}
                  onClick={() => setStatusFilter(f.key)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[11px] font-bold whitespace-nowrap transition ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border border-cyan-500/40'
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent'
                  }`}
                >
                  {f.label}
                  <span className={`px-1.5 rounded-full text-[9px] ${isActive ? 'bg-cyan-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Table */}
          <div className="overflow-x-auto -mx-1 px-1">
            <table className="w-full text-left text-xs border-collapse min-w-[880px]">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-3">Kullanıcı</th>
                  <th className="py-3 px-3">Üyelik Kademesi</th>
                  <th className="py-3 px-3">Durum</th>
                  <th className="py-3 px-3">Dijipuan</th>
                  <th className="py-3 px-3">Yükleme / İndirme</th>
                  <th className="py-3 px-3">Son Aktiflik</th>
                  <th className="py-3 px-3 text-right">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2.5">
                        <div className="relative shrink-0">
                          <img src={u.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                          {u.isVerifiedEducator && (
                            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-purple-600 flex items-center justify-center border border-white dark:border-slate-900">
                              <ShieldCheck className="w-2 h-2 text-white" />
                            </span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-800 dark:text-slate-200 truncate">{u.name}</p>
                          <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-3"><MembershipBadge role={u.role} /></td>
                    <td className="py-3.5 px-3"><UserStatusBadge status={u.status} /></td>
                    <td className="py-3.5 px-3 font-black text-amber-600 dark:text-amber-400 whitespace-nowrap">
                      {u.dijipuanBalance.toLocaleString('tr-TR')} DP
                    </td>
                    <td className="py-3.5 px-3 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1"><Upload className="w-3 h-3 text-cyan-500" />{u.uploads}</span>
                      <span className="mx-1.5 text-slate-300 dark:text-slate-700">/</span>
                      <span className="inline-flex items-center gap-1"><Download className="w-3 h-3 text-indigo-500" />{u.downloads}</span>
                    </td>
                    <td className="py-3.5 px-3 text-slate-500 dark:text-slate-400 text-[11px] whitespace-nowrap">{u.lastActive}</td>
                    <td className="py-3.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditor(u)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-cyan-100 dark:hover:bg-cyan-900/40 text-slate-600 dark:text-slate-300 hover:text-cyan-700 dark:hover:text-cyan-300 text-[10px] font-bold transition"
                        >
                          <Settings2 className="w-3.5 h-3.5" /> Yönet
                        </button>
                        <button
                          onClick={() => toggleSuspend(u)}
                          title={u.status === 'suspended' ? 'Aktifleştir' : 'Askıya al'}
                          className={`p-1.5 rounded-lg transition ${
                            u.status === 'suspended'
                              ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-rose-100 dark:hover:bg-rose-900/40 hover:text-rose-600 dark:hover:text-rose-400'
                          }`}
                        >
                          {u.status === 'suspended' ? <UserCheck className="w-3.5 h-3.5" /> : <ShieldOff className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filtered.length === 0 && (
              <div className="py-14 text-center space-y-2">
                <Inbox className="w-9 h-9 mx-auto text-slate-300 dark:text-slate-700" />
                <p className="text-xs font-bold text-slate-600 dark:text-slate-300">Eşleşen kullanıcı bulunamadı</p>
              </div>
            )}
          </div>
        </div>
      </SectionCard>

      {/* ============ USER EDITOR MODAL ============ */}
      <AdminModal open={!!editing} onClose={() => setEditing(null)} maxWidth="max-w-xl">
        {editing && (
          <div className="p-6 space-y-5">
            {/* Header */}
            <div className="flex items-center gap-3 pr-8">
              <img src={editing.avatar} alt="" className="w-14 h-14 rounded-2xl object-cover border-2 border-cyan-500/30 shrink-0" />
              <div className="min-w-0 space-y-1">
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white truncate">{editing.name}</h2>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate flex items-center gap-1">
                  <Mail className="w-3 h-3" /> {editing.email}
                </p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate flex items-center gap-1">
                  <Building2 className="w-3 h-3" /> {editing.university} • {editing.department}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              {[
                { label: 'İtibar', value: editing.reputationScore },
                { label: 'Yükleme', value: editing.uploads },
                { label: 'Katılım', value: editing.joinedAt },
              ].map((s) => (
                <div key={s.label} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                  <p className="text-[9px] text-slate-400 uppercase tracking-wide">{s.label}</p>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-200 mt-0.5">{s.value}</p>
                </div>
              ))}
            </div>

            {/* Tier switch */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Üyelik Kademesini Değiştir
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {ROLE_OPTIONS.map((r) => {
                  const Icon = r.icon;
                  const active = draftRole === r.key;
                  return (
                    <button
                      key={r.key}
                      onClick={() => setDraftRole(r.key)}
                      className={`p-3 rounded-xl border text-[10px] font-bold transition flex flex-col items-center gap-1.5 ${
                        active ? r.tone : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:border-cyan-300'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-center leading-tight">{r.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dijipuan adjust */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Dijipuan Bakiyesini Düzenle
              </label>
              <div className="flex items-center gap-2">
                <div className="flex-1 flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
                  <Coins className="w-4 h-4 text-amber-500 shrink-0" />
                  <input
                    type="number"
                    value={draftDijipuan}
                    onChange={(e) => setDraftDijipuan(Number(e.target.value))}
                    className="w-full bg-transparent text-sm font-black text-amber-700 dark:text-amber-300 focus:outline-none"
                  />
                  <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 shrink-0">DP</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {DP_STEPS.map((step) => (
                  <button
                    key={step}
                    onClick={() => setDraftDijipuan((v) => Math.max(0, v + step))}
                    className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-bold border transition ${
                      step > 0
                        ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100'
                        : 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 hover:bg-rose-100'
                    }`}
                  >
                    {step > 0 ? <Plus className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                    {Math.abs(step)}
                  </button>
                ))}
                <span className="ml-auto text-[10px] text-slate-400 dark:text-slate-500 self-center">
                  Önceki: {editing.dijipuanBalance.toLocaleString('tr-TR')} DP
                </span>
              </div>
            </div>

            {/* Verified educator toggle */}
            <button
              onClick={() => setDraftVerified((v) => !v)}
              className={`w-full flex items-center justify-between gap-3 p-3 rounded-xl border transition ${
                draftVerified
                  ? 'bg-purple-50 dark:bg-purple-950/30 border-purple-300 dark:border-purple-700'
                  : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'
              }`}
            >
              <span className="flex items-center gap-2 min-w-0">
                <ShieldCheck className={`w-4 h-4 shrink-0 ${draftVerified ? 'text-purple-600 dark:text-purple-400' : 'text-slate-400'}`} />
                <span className="text-left min-w-0">
                  <span className="block text-[11px] font-bold text-slate-800 dark:text-slate-200">Akademik Doğrulanmış Rozet</span>
                  <span className="block text-[10px] text-slate-500 dark:text-slate-400">Telif geliri ve doğrulanmış eğitmen etiketi</span>
                </span>
              </span>
              <span className={`w-10 h-5 rounded-full transition-colors relative shrink-0 ${draftVerified ? 'bg-purple-500' : 'bg-slate-300 dark:bg-slate-700'}`}>
                <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${draftVerified ? 'translate-x-5' : ''}`} />
              </span>
            </button>

            {/* Footer actions */}
            <div className="flex flex-wrap gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <ActionButton tone="cyan" icon={Save} onClick={saveEditor} className="flex-1 min-w-[140px]">
                Değişiklikleri Kaydet
              </ActionButton>
              <ActionButton
                tone={editing.status === 'suspended' ? 'emerald' : 'rose'}
                icon={editing.status === 'suspended' ? UserCheck : ShieldOff}
                variant="soft"
                onClick={() => toggleSuspend(editing)}
                className="flex-1 min-w-[140px]"
              >
                {editing.status === 'suspended' ? 'Hesabı Aktifleştir' : 'Hesabı Askıya Al'}
              </ActionButton>
            </div>
          </div>
        )}
      </AdminModal>
    </div>
  );
}
