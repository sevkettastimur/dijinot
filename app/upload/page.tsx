'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  FileText, 
  CheckCircle2, 
  Sparkles, 
  BrainCircuit, 
  Coins, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  Zap, 
  FileUp,
  GraduationCap
} from 'lucide-react';
import { MOCK_TIERS, MOCK_UNIVERSITIES, MOCK_FACULTIES, MOCK_DEPARTMENTS, MOCK_COURSES } from '@/lib/mock-data';
import { EducationTier } from '@/lib/types';

export default function UploadWizardPage() {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [isDragOver, setIsDragOver] = useState(false);
  const [fileUploaded, setFileUploaded] = useState<File | null>(null);
  const [isScanningOcr, setIsScanningOcr] = useState(false);
  const [ocrTextExtracted, setOcrTextExtracted] = useState('');

  // Step 2 Form State
  const [educationTier, setEducationTier] = useState<EducationTier>('lise');
  const [selectedUni, setSelectedUni] = useState(MOCK_UNIVERSITIES[0].name);
  const [selectedCourse, setSelectedCourse] = useState(MOCK_COURSES[0].code);
  const [professorName, setProfessorName] = useState('Kemal Yılmaz (Eğitmen)');
  const [examType, setExamType] = useState('TYT / AYT');
  const [noteTitle, setNoteTitle] = useState('');

  // Step 3 Form State
  const [monetizationType, setMonetizationType] = useState<'free' | 'paid'>('free');
  const [dijipuanPrice, setDijipuanPrice] = useState(15);
  const [agreeTerms, setAgreeTerms] = useState(true);

  const handleFileDrop = (e: React.DragEvent | React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    
    setIsScanningOcr(true);
    setFileUploaded(new File(['mock content'], '11_Sinif_Fizik_Vektörler_Ozet.pdf', { type: 'application/pdf' }));
    setNoteTitle('11. Sınıf & TYT/AYT Fizik Vektörler Formül Kitapçığı');

    setTimeout(() => {
      setIsScanningOcr(false);
      setOcrTextExtracted(
        'Yapay Zekâ OCR Tespiti: "Lise 11. Sınıf Fizik Vektörler, Nehirde Bağıl Hareket ve Newton Yasaları tespit edildi (%99.4 Doğruluk)."'
      );
    }, 1800);
  };

  const handleNext = () => {
    if (currentStep < 4) setCurrentStep((prev) => (prev + 1) as any);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep((prev) => (prev - 1) as any);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-700 dark:text-cyan-300 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
          <span>Katkı Sağla & +50 Dijipuan Kazan</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Akademik & Ders Notu Yükleme Sihirbazı
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm max-w-lg mx-auto">
          İlkokul okuma fasiküllerinden doktora tezlerine kadar materyalinizi yükleyin, Yapay Zekâ OCR anında tarasın!
        </p>
      </div>

      <div className="p-4 rounded-2xl glass-panel bg-white/90 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
        <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold">
          <div className={`p-2.5 rounded-xl transition ${currentStep >= 1 ? 'bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-500/40' : 'text-slate-400 bg-slate-100 dark:bg-slate-950'}`}>
            1. Dosya Yükle & OCR
          </div>
          <div className={`p-2.5 rounded-xl transition ${currentStep >= 2 ? 'bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-500/40' : 'text-slate-400 bg-slate-100 dark:bg-slate-950'}`}>
            2. Kademe & Ders Seçimi
          </div>
          <div className={`p-2.5 rounded-xl transition ${currentStep >= 3 ? 'bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-500/40' : 'text-slate-400 bg-slate-100 dark:bg-slate-950'}`}>
            3. Telif & Yayın Ayarı
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-10 rounded-3xl glass-panel bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 relative min-h-[420px]">
        <AnimatePresence mode="wait">
          
          {/* STEP 1 */}
          {currentStep === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileUp className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                1. Adım: Ders Notu veya Soru Bankası PDF Yükleyin
              </h2>

              {!fileUploaded ? (
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={handleFileDrop}
                  className={`border-2 border-dashed rounded-3xl p-10 text-center transition-all cursor-pointer flex flex-col items-center justify-center space-y-4 ${
                    isDragOver ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-950/40' : 'border-slate-300 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-950/60'
                  }`}
                >
                  <input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={handleFileDrop} className="hidden" id="file-upload-input" />
                  <label htmlFor="file-upload-input" className="cursor-pointer flex flex-col items-center space-y-3">
                    <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shadow-lg">
                      <Upload className="w-8 h-8" />
                    </div>
                    <div>
                      <span className="block text-base font-bold text-slate-900 dark:text-slate-200">
                        Sürükleyip Bırakın veya Dosya Seçin
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">PDF, PNG, JPG (Maksimum 50 MB)</span>
                    </div>
                  </label>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="w-8 h-8 text-cyan-600 dark:text-cyan-400" />
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-200">{fileUploaded.name}</h4>
                        <span className="text-xs text-slate-500 dark:text-slate-400">PDF Belgesi • 4.9 MB</span>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
                      Yüklendi
                    </span>
                  </div>

                  {isScanningOcr ? (
                    <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-cyan-500/40 text-center space-y-2">
                      <BrainCircuit className="w-10 h-10 text-cyan-600 dark:text-cyan-400 mx-auto animate-spin-slow" />
                      <h4 className="text-sm font-bold text-cyan-600 dark:text-cyan-300">Yapay Zekâ OCR Notu Tarıyor...</h4>
                    </div>
                  ) : (
                    <div className="p-4 rounded-2xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-500/40 space-y-1 text-xs">
                      <span className="font-bold text-cyan-700 dark:text-cyan-300">AI OCR Okuma Raporu:</span>
                      <p className="text-slate-700 dark:text-slate-300">{ocrTextExtracted}</p>
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-end pt-4">
                <button
                  disabled={!fileUploaded || isScanningOcr}
                  onClick={handleNext}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white text-xs font-bold transition shadow-md"
                >
                  <span>2. Adıma Geç</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: EDUCATION TIER & METADATA */}
          {currentStep === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                2. Adım: Eğitim Kademesi ve Ders Bilgileri
              </h2>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Eğitim Kademesi</label>
                  <select
                    value={educationTier}
                    onChange={(e) => setEducationTier(e.target.value as EducationTier)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-200 focus:outline-none focus:border-cyan-500"
                  >
                    {MOCK_TIERS.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Ders Notu Başlığı</label>
                    <input
                      type="text"
                      value={noteTitle}
                      onChange={(e) => setNoteTitle(e.target.value)}
                      placeholder="Örn: 11. Sınıf Fizik Formül Kartları"
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-200 focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Sınav / Tür</label>
                    <select
                      value={examType}
                      onChange={(e) => setExamType(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-200 focus:outline-none focus:border-cyan-500"
                    >
                      <option value="Okul Sınavı">Okul Yazılı Sınavı</option>
                      <option value="LGS Denemesi">LGS Denemesi</option>
                      <option value="TYT / AYT">TYT / AYT (YKS)</option>
                      <option value="Vize">Vize Sınavı</option>
                      <option value="Final">Final Sınavı</option>
                      <option value="Tez Özeti">Tez / Makale Özeti</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button onClick={handlePrev} className="px-5 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold">
                  <ArrowLeft className="w-4 h-4" /> Geri
                </button>
                <button onClick={handleNext} className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition shadow-md">
                  <span>3. Adıma Geç</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3 */}
          {currentStep === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Coins className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                3. Adım: Dijipuan & Yayın Ayarları
              </h2>

              <div className="space-y-4 text-xs">
                <label className="flex items-start gap-2 cursor-pointer p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <input type="checkbox" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} className="mt-0.5 accent-cyan-500" />
                  <span className="text-slate-700 dark:text-slate-300">
                    Bu materyalin şahsıma ait olduğunu ve telif hakları kurallarına uygun olduğunu beyan ederim.
                  </span>
                </label>
              </div>

              <div className="flex justify-between pt-4">
                <button onClick={handlePrev} className="px-5 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold">
                  <ArrowLeft className="w-4 h-4" /> Geri
                </button>
                <button
                  disabled={!agreeTerms}
                  onClick={() => setCurrentStep(4)}
                  className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-md"
                >
                  <CheckCircle2 className="w-4 h-4" /> Yayına Al (+50 Dijipuan)
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 4 */}
          {currentStep === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8 space-y-6">
              <CheckCircle2 className="w-16 h-16 text-emerald-600 dark:text-emerald-400 mx-auto animate-bounce" />
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Notunuz Başarıyla Yayınlandı!</h2>
              <p className="text-xs text-slate-600 dark:text-slate-400">Hesabınıza <strong className="text-amber-600 dark:text-amber-400">+50 Dijipuan</strong> aktarıldı.</p>
              <Link href="/notes/note-high-101">
                <button className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition shadow-md">
                  Görüntüle →
                </button>
              </Link>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
