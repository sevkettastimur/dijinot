import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  Smile, 
  BookOpen, 
  GraduationCap, 
  Cpu, 
  Microscope, 
  FileText, 
  Star, 
  Download, 
  CheckCircle2, 
  Upload, 
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import { MOCK_TIERS, MOCK_NOTES, MOCK_COURSES } from '@/lib/mock-data';
import { EducationTier } from '@/lib/types';

interface PageProps {
  params: Promise<{ level: string }>;
}

export default async function CategoryLevelPage({ params }: PageProps) {
  const { level } = await params;
  const tier = MOCK_TIERS.find(t => t.id === level);

  if (!tier) {
    notFound();
  }

  const tierNotes = MOCK_NOTES.filter(n => n.educationTier === tier.id);
  const tierCourses = MOCK_COURSES.filter(c => c.educationTier === tier.id);

  const iconMap: Record<string, any> = {
    Smile,
    BookOpen,
    GraduationCap,
    Cpu,
    Microscope
  };
  const IconComp = iconMap[tier.iconName] || BookOpen;

  return (
    <div className="space-y-8 pb-12">
      {/* Breadcrumb */}
      <div>
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-cyan-600 dark:hover:text-cyan-400 font-semibold transition">
          <ArrowLeft className="w-4 h-4" /> Ana Sayfaya Dön
        </Link>
      </div>

      {/* Tier Category Header */}
      <div className="p-8 rounded-3xl glass-panel bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400 shadow-md">
              <IconComp className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">Eğitim Kademesi Kataloğu</span>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">{tier.name}</h1>
            </div>
          </div>

          <Link href="/upload">
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 text-white text-xs font-bold shadow-md shadow-cyan-500/20">
              <Upload className="w-4 h-4" /> Not Paylaş (+50 Dijipuan)
            </button>
          </Link>
        </div>

        <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm max-w-3xl leading-relaxed">
          {tier.description}
        </p>

        <div className="flex flex-wrap items-center gap-4 pt-3 text-xs text-slate-500 border-t border-slate-200 dark:border-slate-800">
          <span className="font-bold text-cyan-600 dark:text-cyan-400">{tierNotes.length} Aktif Not & Özet</span>
          <span>•</span>
          <span className="font-bold text-indigo-600 dark:text-indigo-400">{tierCourses.length} Müfredat Dersi</span>
          <span>•</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-bold">MEB & Üniversite Onaylı Kodlar</span>
        </div>
      </div>

      {/* Courses in Tier */}
      {tierCourses.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            {tier.shortName} Müfredat Dersleri
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tierCourses.map((course) => (
              <Link
                key={course.id}
                href={`/course/${course.code.replace(/\s+/g, '-').toLowerCase()}`}
                className="group p-4 rounded-2xl glass-card bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/40 transition space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-cyan-500/10 text-cyan-700 dark:bg-cyan-500/20 dark:text-cyan-300 border border-cyan-500/30">
                    {course.code}
                  </span>
                  <span className="text-[11px] text-slate-500">{course.level}</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">
                  {course.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{course.description}</p>
                <span className="block text-[11px] text-cyan-600 dark:text-cyan-400 font-semibold pt-1">
                  {course.totalNotes} Not & Çıkmış Sorular →
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Lecture Notes List */}
      <div className="space-y-4 pt-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
          {tier.shortName} Ders Notları & Fasiküller
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tierNotes.map((note) => (
            <div
              key={note.id}
              className="p-5 rounded-3xl glass-card bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 text-[10px] font-bold bg-cyan-500/10 text-cyan-700 dark:bg-cyan-500/20 dark:text-cyan-300 rounded border border-cyan-500/30">
                    {note.level}
                  </span>
                  {note.isVerifiedByProfessor && (
                    <span className="px-2 py-0.5 text-[9px] font-bold bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 rounded flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Onaylı Materyal
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{note.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">{note.description}</p>

                <div className="flex items-center gap-2 pt-1">
                  <img src={note.authorAvatar} alt={note.authorName} className="w-6 h-6 rounded-full object-cover" />
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{note.authorName} ({note.authorBadge})</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" /> {note.rating}
                  </span>
                  <span>{note.downloadCount} İndirme</span>
                </div>
                <Link href={`/notes/${note.id}`}>
                  <button className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition">
                    Notu İncele
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
