import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  BookOpen, 
  FileText, 
  HelpCircle, 
  UserCheck, 
  Upload, 
  Star, 
  Download, 
  CheckCircle2, 
  Eye, 
  ArrowLeft,
  Sparkles,
  Award
} from 'lucide-react';
import { MOCK_COURSES, MOCK_NOTES, MOCK_PROFESSORS } from '@/lib/mock-data';

interface PageProps {
  params: Promise<{ courseCode: string }>;
}

export default async function CourseDetailPage({ params }: PageProps) {
  const { courseCode } = await params;
  
  // Format slug e.g. "ceng-201" back to matching course
  const normalizedCode = courseCode.toUpperCase().replace('-', ' ');
  const course = MOCK_COURSES.find(c => c.code.replace(/\s+/g, '') === normalizedCode.replace(/\s+/g, '')) || MOCK_COURSES[0];

  const courseNotes = MOCK_NOTES;

  return (
    <div className="space-y-8 pb-12">
      {/* Breadcrumb / Back button */}
      <div>
        <Link href="/department/bilgisayar-muhendisligi" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-400 font-semibold transition">
          <ArrowLeft className="w-4 h-4" /> Bölüm Sayfasına Dön
        </Link>
      </div>

      {/* Course Banner */}
      <div className="p-8 rounded-3xl glass-panel bg-slate-900/90 border border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 text-xs font-black rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                {course.code}
              </span>
              <span className="text-xs text-slate-400 font-semibold">{course.level}</span>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300">{course.credits} Kredi / ECTS</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white">{course.name}</h1>
          </div>

          <Link href="/upload">
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-white text-xs font-bold shadow-lg shadow-cyan-500/20">
              <Upload className="w-4 h-4" /> Bu Derse Not Ekle
            </button>
          </Link>
        </div>

        <p className="text-slate-300 text-xs sm:text-sm max-w-3xl leading-relaxed">
          {course.description}
        </p>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 text-xs text-slate-400 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-emerald-400" />
            <span>Dersi Verenler: <strong className="text-slate-200">{course.professors.join(', ')}</strong></span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-cyan-400 font-bold">{course.totalNotes} Ders Notu</span>
            <span className="text-amber-400 font-bold">{course.examCount} Çıkmış Soru Seti</span>
          </div>
        </div>
      </div>

      {/* Materials Tabs & Notes Grid */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            Mevcut Ders Notları ve Çıkmış Sınav Soruları
          </h2>

          <div className="flex items-center gap-2 text-xs">
            <button className="px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
              Tümü ({courseNotes.length})
            </button>
            <button className="px-3 py-1.5 rounded-lg bg-slate-800/80 text-slate-400 font-semibold hover:text-slate-200">
              Vize Soruları
            </button>
            <button className="px-3 py-1.5 rounded-lg bg-slate-800/80 text-slate-400 font-semibold hover:text-slate-200">
              Final Özetleri
            </button>
          </div>
        </div>

        {/* Note Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courseNotes.map((note) => (
            <div
              key={note.id}
              className="p-6 rounded-3xl glass-card bg-slate-900/80 border border-slate-800 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 text-[10px] font-bold bg-indigo-500/20 text-indigo-300 rounded border border-indigo-500/30">
                    {note.examType}
                  </span>
                  {note.isVerifiedByProfessor && (
                    <span className="px-2 py-0.5 text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Prof. Onaylı
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-slate-100">{note.title}</h3>
                <p className="text-xs text-slate-400 line-clamp-2">{note.description}</p>

                <div className="flex items-center gap-2.5 pt-2">
                  <img src={note.authorAvatar} alt={note.authorName} className="w-7 h-7 rounded-full object-cover border border-cyan-500/30" />
                  <div className="text-xs">
                    <span className="block font-bold text-slate-200">{note.authorName}</span>
                    <span className="text-[10px] text-slate-400">{note.authorBadge}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1 text-amber-400 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" /> {note.rating}
                  </span>
                  <span>{note.downloadCount} İndirme</span>
                </div>

                <Link href={`/notes/${note.id}`}>
                  <button className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition shadow-md">
                    Notu İncele & İndir
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
