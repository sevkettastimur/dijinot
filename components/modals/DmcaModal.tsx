'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, X, CheckCircle2, FileText, Send } from 'lucide-react';

interface DmcaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DmcaModal({ isOpen, onClose }: DmcaModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [noteUrl, setNoteUrl] = useState('');
  const [rightsOwner, setRightsOwner] = useState('');
  const [email, setEmail] = useState('');
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 10 }}
          className="relative w-full max-w-lg rounded-2xl glass-panel bg-slate-900/95 border border-slate-700/80 p-6 shadow-2xl z-10"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-100">DMCA & Telif Hakları Bildirimi</h3>
                  <p className="text-xs text-slate-400">
                    Dijinot, 5651 sayılı kanun kapsamında yer sağlayıcıdır. Telif hakkınız ihlal edildiyse derhal müdahale edilir.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Hak Sahibi / Hak Sahibi Temsilcisi Adı Soyadı
                </label>
                <input
                  type="text"
                  required
                  value={rightsOwner}
                  onChange={(e) => setRightsOwner(e.target.value)}
                  placeholder="Prof. Dr. Ahmet Yılmaz / Yayınevi Adı"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  İletişim E-posta Adresi
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="iletisim@universite.edu.tr"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  İhlal Edilen Not Bağlantısı (URL veya Not Adı)
                </label>
                <input
                  type="text"
                  required
                  value={noteUrl}
                  onChange={(e) => setNoteUrl(e.target.value)}
                  placeholder="https://dijinot.com/notes/note-101"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  İhlal Gerekçesi ve Açıklama
                </label>
                <textarea
                  rows={3}
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Telif hakkı bana ait olan kitabın slaytlarının izinsiz taranarak yayınlanması..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-500/20"
                >
                  <Send className="w-3.5 h-3.5" /> Bildirimi Gönder
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center py-8 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
              <h3 className="text-lg font-bold text-slate-100">DMCA Talebiniz Alındı</h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Hukuk ekibimiz ilgili notu geçici olarak incelemeye aldı. 24 saat içerisinde e-posta adresiniz üzerinden geri dönüş sağlanacaktır.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
