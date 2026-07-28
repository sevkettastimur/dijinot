'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, BookOpen, GraduationCap, UserCheck, ArrowRight, X, Sparkles, FileText, Smile, Microscope } from 'lucide-react';
import Link from 'next/link';
import { MOCK_NOTES, MOCK_COURSES, MOCK_PROFESSORS, MOCK_TIERS } from '@/lib/mock-data';
import { EducationTier } from '@/lib/types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [selectedTier, setSelectedTier] = useState<EducationTier | 'all'>('all');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredNotes = MOCK_NOTES.filter(n => {
    const matchesTier = selectedTier === 'all' || n.educationTier === selectedTier;
    const matchesQuery = 
      n.title.toLowerCase().includes(query.toLowerCase()) || 
      n.courseCode.toLowerCase().includes(query.toLowerCase()) ||
      n.tags.some(t => t.toLowerCase().includes(query.toLowerCase()));
    return matchesTier && matchesQuery;
  });

  const filteredCourses = MOCK_COURSES.filter(c => {
    const matchesTier = selectedTier === 'all' || c.educationTier === selectedTier;
    const matchesQuery = 
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.code.toLowerCase().includes(query.toLowerCase());
    return matchesTier && matchesQuery;
  });

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 sm:px-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          className="relative w-full max-w-3xl rounded-2xl glass-panel bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-700/60 shadow-2xl overflow-hidden z-10"
        >
          {/* Input Bar */}
          <div className="flex items-center px-4 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
            <Search className="w-5 h-5 text-cyan-600 dark:text-cyan-400 mr-3 animate-pulse" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="1. Sınıf okuma-yazma, LGS Matematik, TYT Fizik, CENG 201 veya Doktora tezi ara..."
              className="w-full bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 text-sm sm:text-base focus:outline-none"
            />
            {query && (
              <button onClick={() => setQuery('')} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg text-slate-400 mr-2">
                <X className="w-4 h-4" />
              </button>
            )}
            <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md">
              ESC
            </kbd>
          </div>

          {/* Education Tier Selection Pills */}
          <div className="px-4 py-2 bg-slate-100/70 dark:bg-slate-950/40 border-b border-slate-200 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto text-xs">
            <button
              onClick={() => setSelectedTier('all')}
              className={`px-2.5 py-1 rounded-lg font-bold transition whitespace-nowrap ${
                selectedTier === 'all' ? 'bg-cyan-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              Tüm Kademeler
            </button>
            {MOCK_TIERS.map((tier) => (
              <button
                key={tier.id}
                onClick={() => setSelectedTier(tier.id)}
                className={`px-2.5 py-1 rounded-lg font-semibold transition whitespace-nowrap ${
                  selectedTier === tier.id ? 'bg-cyan-600 text-white' : 'bg-slate-200/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300'
                }`}
              >
                {tier.shortName}
              </button>
            ))}
          </div>

          {/* Results List */}
          <div className="max-h-[60vh] overflow-y-auto p-4 space-y-6">
            {filteredNotes.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 mb-2 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" /> Bulunan Notlar ({filteredNotes.length})
                </h4>
                <div className="space-y-2">
                  {filteredNotes.map((note) => (
                    <Link
                      key={note.id}
                      href={`/notes/${note.id}`}
                      onClick={onClose}
                      className="group flex items-start justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 hover:bg-cyan-50 dark:hover:bg-cyan-950/40 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/40 transition"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30">
                            {note.level}
                          </span>
                          <span className="text-xs text-slate-500">{note.courseCode}</span>
                        </div>
                        <h5 className="text-sm font-semibold text-slate-900 dark:text-slate-200 group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">
                          {note.title}
                        </h5>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                          {note.authorName} • {note.pageCount} Sayfa PDF • {note.downloadCount} İndirme
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 mt-1" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {filteredNotes.length === 0 && filteredCourses.length === 0 && (
              <div className="text-center py-12">
                <GraduationCap className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <p className="text-sm text-slate-600 dark:text-slate-400">Aradığınız kademede ders notu bulunamadı.</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
