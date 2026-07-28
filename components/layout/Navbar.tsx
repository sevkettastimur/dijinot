'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Upload, 
  Sun, 
  Moon, 
  ChevronDown, 
  Sparkles, 
  GraduationCap, 
  Coins, 
  User, 
  FileText, 
  Award, 
  LogOut, 
  Layers,
  BookOpen,
  Menu,
  X,
  Smile,
  Microscope,
  Crown,
  CreditCard
} from 'lucide-react';
import { MOCK_TIERS, MOCK_USER } from '@/lib/mock-data';
import { EducationTier } from '@/lib/types';
import SearchModal from '../modals/SearchModal';

export default function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isTierMenuOpen, setIsTierMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedTier, setSelectedTier] = useState<EducationTier | 'all'>('all');

  const tierMenuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (tierMenuRef.current && !tierMenuRef.current.contains(event.target as Node)) {
        setIsTierMenuOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTheme = () => {
    const nextDarkState = !isDarkMode;
    setIsDarkMode(nextDarkState);
    if (nextDarkState) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const activeTierObj = MOCK_TIERS.find(t => t.id === selectedTier);

  return (
    <>
      <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200 dark:border-slate-800/80 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                    diji<span className="text-cyan-600 dark:text-cyan-400">not</span>
                  </span>
                </div>
                <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 -mt-1 hidden sm:block">
                  1. Sınıftan Doçentliğe Eğitim & Not Platformu
                </span>
              </div>
            </Link>

            {/* Dynamic Education Tier Dropdown */}
            <div className="relative hidden md:block" ref={tierMenuRef}>
              <button
                onClick={() => setIsTierMenuOpen(!isTierMenuOpen)}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60 text-xs font-bold text-slate-800 dark:text-slate-200 transition"
              >
                <Layers className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                <span>{activeTierObj ? activeTierObj.shortName : 'Tüm Eğitim Kademeleri'}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isTierMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isTierMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute left-0 mt-2 w-80 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 shadow-2xl p-3 space-y-1 z-50 text-xs"
                  >
                    <button
                      onClick={() => { setSelectedTier('all'); setIsTierMenuOpen(false); }}
                      className={`w-full text-left p-2.5 rounded-xl font-bold transition flex items-center justify-between ${
                        selectedTier === 'all' ? 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      <span>Tüm Eğitim Kademeleri</span>
                      <span className="text-[10px] text-slate-400">1. Sınıf - Prof</span>
                    </button>

                    {MOCK_TIERS.map((tier) => (
                      <Link
                        key={tier.id}
                        href={`/kategori/${tier.id}`}
                        onClick={() => { setSelectedTier(tier.id); setIsTierMenuOpen(false); }}
                        className={`w-full text-left p-2.5 rounded-xl transition block ${
                          selectedTier === tier.id ? 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 font-bold' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold">{tier.name}</span>
                          <span className={`px-1.5 py-0.2 rounded text-[9px] ${tier.badgeColor}`}>
                            Seç
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">{tier.description}</p>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Search Trigger Button */}
          <div className="flex-1 max-w-md hidden lg:block min-w-0">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="w-full flex items-center justify-between gap-2 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-900/80 hover:bg-slate-200 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs font-medium transition group overflow-hidden"
            >
              <div className="flex items-center gap-2 min-w-0 overflow-hidden">
                <Search className="w-4 h-4 shrink-0 text-slate-400 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors" />
                <span className="truncate">1. Sınıf, LGS, TYT/AYT, Vize notu veya tez ara...</span>
              </div>
              <kbd className="shrink-0 inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md">
                Ctrl + K
              </kbd>
            </button>
          </div>

          {/* Right Action Icons & User Dropdown */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800/60 lg:hidden text-slate-600 dark:text-slate-300"
            >
              <Search className="w-5 h-5" />
            </button>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
              title="Tema Değiştir"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-bold">
              <Coins className="w-4 h-4" />
              <span>{MOCK_USER.dijipuanBalance}</span>
              <span className="text-[10px] font-normal">Dijipuan</span>
            </div>

            <Link href="/upload">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 text-white text-xs font-bold shadow-md shadow-cyan-500/20 transition"
              >
                <Upload className="w-4 h-4" />
                <span className="hidden sm:inline">Not Paylaş</span>
              </motion.button>
            </Link>

            {/* Profile Dropdown */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <img
                  src={MOCK_USER.avatar}
                  alt={MOCK_USER.name}
                  className="w-8 h-8 rounded-full object-cover border-2 border-cyan-500/50"
                />
              </button>

              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 5 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 5 }}
                    className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 shadow-2xl p-4 space-y-3 z-50 text-xs"
                  >
                    <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
                      <h5 className="text-sm font-bold text-slate-900 dark:text-slate-100">{MOCK_USER.name}</h5>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{MOCK_USER.email}</p>
                    </div>
                    <Link
                      href="/dashboard"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition font-medium"
                    >
                      <User className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                      <span>Kullanıcı Paneli</span>
                    </Link>
                    <Link
                      href="/pricing"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition font-medium"
                    >
                      <Crown className="w-4 h-4 text-amber-500" />
                      <span>Fiyatlandırma & Üyelik</span>
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
