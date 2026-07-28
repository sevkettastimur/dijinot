import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  Building2, 
  BookOpen, 
  Cpu, 
  Stethoscope, 
  Scale, 
  TrendingUp, 
  Compass, 
  Atom, 
  FileText, 
  GraduationCap, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { MOCK_FACULTIES, MOCK_DEPARTMENTS, MOCK_NOTES } from '@/lib/mock-data';

interface PageProps {
  params: Promise<{ facultySlug: string }>;
}

export default async function FacultyDetailPage({ params }: PageProps) {
  const { facultySlug } = await params;
  const faculty = MOCK_FACULTIES.find(f => f.slug === facultySlug);

  if (!faculty) {
    notFound();
  }

  const departments = MOCK_DEPARTMENTS.filter(d => d.facultySlug === faculty.slug);
  const facultyNotes = MOCK_NOTES.filter(n => n.facultySlug === faculty.slug);

  const iconMap: Record<string, any> = {
    Cpu,
    Stethoscope,
    Scale,
    TrendingUp,
    Compass,
    Atom
  };
  const IconComp = iconMap[faculty.iconName] || BookOpen;

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner */}
      <div className="p-8 rounded-3xl glass-panel bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 relative overflow-hidden space-y-4">
        <div className="flex items-center gap-3">
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${faculty.colorGradient} flex items-center justify-center text-white shadow-xl`}>
            <IconComp className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Fakülte Rehberi</span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white">{faculty.name}</h1>
          </div>
        </div>

        <p className="text-slate-300 text-xs sm:text-sm max-w-3xl leading-relaxed">
          {faculty.description}
        </p>

        <div className="flex flex-wrap gap-4 pt-2 text-xs font-medium text-slate-400 border-t border-slate-800">
          <span>{faculty.departmentCount} Bölüm</span>
          <span>•</span>
          <span>{faculty.totalNotes.toLocaleString()} Ders Notu</span>
          <span>•</span>
          <span className="text-emerald-400 font-bold">%99 Doğrulanmış Materyal</span>
        </div>
      </div>

      {/* Active Departments Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-cyan-400" />
          Fakülteye Bağlı Bölümler ({departments.length})
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((dept) => (
            <Link
              key={dept.id}
              href={`/department/${dept.slug}`}
              className="group p-5 rounded-2xl glass-card bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {dept.code}
                </span>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="text-base font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                {dept.name}
              </h3>
              <p className="text-xs text-slate-400 line-clamp-2">{dept.description}</p>
              <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-800/60">
                <span>{dept.activeCoursesCount} Ders</span>
                <span className="text-cyan-400 font-bold">{dept.totalNotesCount} Ders Notu</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Notes inside Faculty */}
      {facultyNotes.length > 0 && (
        <div className="space-y-4 pt-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            Öne Çıkan Fakülte Notları
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {facultyNotes.map((note) => (
              <div key={note.id} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-cyan-500/20 text-cyan-300 rounded">
                    {note.courseCode}
                  </span>
                  <h4 className="text-sm font-bold text-slate-200">{note.title}</h4>
                  <span className="text-xs text-slate-400">{note.authorName} • {note.downloadCount} İndirme</span>
                </div>
                <Link href={`/notes/${note.id}`}>
                  <button className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition">
                    Oku
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
