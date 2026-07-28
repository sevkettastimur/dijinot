import React from 'react';
import Link from 'next/link';
import { 
  Building2, 
  Cpu, 
  Stethoscope, 
  Scale, 
  TrendingUp, 
  Compass, 
  Atom, 
  BookOpen, 
  ArrowRight, 
  FileText 
} from 'lucide-react';
import { MOCK_FACULTIES, MOCK_DEPARTMENTS } from '@/lib/mock-data';

export default function FacultiesPage() {
  const iconMap: Record<string, any> = {
    Cpu,
    Stethoscope,
    Scale,
    TrendingUp,
    Compass,
    Atom
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
          <Building2 className="w-4 h-4" /> Akademik Kataloğu
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          Tüm Fakülteler ve Lisans Programları
        </h1>
        <p className="text-slate-400 text-sm max-w-2xl">
          Türkiye’deki üniversitelerde aktif eğitim veren fakülteleri inceleyin, bölüm bazlı 1. sınıf - 4. sınıf ve lisansüstü ders notlarına kolayca ulaşın.
        </p>
      </div>

      {/* Faculty Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_FACULTIES.map((faculty) => {
          const IconComponent = iconMap[faculty.iconName] || BookOpen;
          const departments = MOCK_DEPARTMENTS.filter(d => d.facultySlug === faculty.slug);

          return (
            <div
              key={faculty.id}
              className="p-6 rounded-3xl glass-card bg-slate-900/80 border border-slate-800 space-y-5 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${faculty.colorGradient} flex items-center justify-center text-white shadow-lg`}>
                  <IconComponent className="w-6 h-6" />
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                    {faculty.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {faculty.description}
                  </p>
                </div>

                {/* Sub-departments sample list */}
                <div className="space-y-1.5 pt-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Öne Çıkan Bölümler:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {departments.length > 0 ? (
                      departments.map(d => (
                        <span key={d.id} className="px-2 py-0.5 rounded bg-slate-800 text-[11px] text-slate-300">
                          {d.name}
                        </span>
                      ))
                    ) : (
                      <span className="text-[11px] text-slate-500">Genel Lisans & Lisansüstü Programları</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-xs font-semibold text-cyan-400 flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5" /> {faculty.totalNotes.toLocaleString()} Not
                </span>
                <Link href={`/faculties/${faculty.slug}`}>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-cyan-600 text-slate-200 hover:text-white text-xs font-bold transition">
                    İncele <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
