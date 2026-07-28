import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  GraduationCap, 
  BookOpen, 
  FileText, 
  Award, 
  UserCheck, 
  HelpCircle, 
  Upload, 
  Layers, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { MOCK_DEPARTMENTS, MOCK_COURSES, MOCK_NOTES, MOCK_PROFESSORS } from '@/lib/mock-data';
import { AcademicLevel } from '@/lib/types';

interface PageProps {
  params: Promise<{ deptSlug: string }>;
}

export default async function DepartmentDetailPage({ params }: PageProps) {
  const { deptSlug } = await params;
  const dept = MOCK_DEPARTMENTS.find(d => d.slug === deptSlug) || MOCK_DEPARTMENTS[0];

  if (!dept) {
    notFound();
  }

  const deptCourses = MOCK_COURSES.filter(c => c.departmentSlug === dept.slug || true);
  const deptNotes = MOCK_NOTES.filter(n => n.deptSlug === dept.slug || true);
  const deptProfessors = MOCK_PROFESSORS;

  const academicLevelsList: AcademicLevel[] = [
    'Lisans 1. Sınıf',
    'Lisans 2. Sınıf',
    'Lisans 3. Sınıf',
    'Lisans 4. Sınıf',
    'Yüksek Lisans',
    'Doktora',
    'Doçentlik & Prof'
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Department Header */}
      <div className="p-8 rounded-3xl glass-panel bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-950 border border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300 font-black text-lg">
              {dept.code}
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Bölüm Hiyerarşisi</span>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white">{dept.name}</h1>
            </div>
          </div>

          <Link href="/upload">
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-white text-xs font-bold shadow-lg shadow-cyan-500/20">
              <Upload className="w-4 h-4" /> Not Paylaş (+50 Dijipuan)
            </button>
          </Link>
        </div>

        <p className="text-slate-300 text-xs sm:text-sm max-w-3xl leading-relaxed">
          {dept.description}
        </p>

        <div className="flex flex-wrap gap-4 pt-2 text-xs font-medium text-slate-400 border-t border-slate-800/80">
          <span>{dept.activeCoursesCount} Aktif Müfredat Dersi</span>
          <span>•</span>
          <span>{dept.totalNotesCount.toLocaleString()} Toplam Materyal</span>
          <span>•</span>
          <span className="text-cyan-400 font-bold">1. Sınıftan Doçentliğe Tam Müfredat</span>
        </div>
      </div>

      {/* Grade Levels Navigation Matrix */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-cyan-400" />
          Sınıf ve Akademik Derece Hiyerarşisi
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {academicLevelsList.map((level, idx) => {
            const levelCourses = deptCourses.filter(c => c.level === level || idx % 2 === 0);
            return (
              <div
                key={level}
                className="p-5 rounded-3xl glass-card bg-slate-900/80 border border-slate-800 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 text-xs font-bold rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      {level}
                    </span>
                    <span className="text-xs text-slate-400">{levelCourses.length} Ders Açık</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-100">{level} Müfredat Dersleri</h3>

                  {/* Course list under level */}
                  <div className="space-y-2 pt-1">
                    {levelCourses.slice(0, 3).map((course) => (
                      <Link
                        key={course.id}
                        href={`/course/${course.code.replace(/\s+/g, '-').toLowerCase()}`}
                        className="group flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 hover:bg-cyan-950/40 border border-slate-800/80 hover:border-cyan-500/40 transition"
                      >
                        <div>
                          <span className="block text-xs font-bold text-slate-200 group-hover:text-cyan-300">
                            {course.code} - {course.name}
                          </span>
                          <span className="text-[10px] text-slate-400">{course.totalNotes} Not • {course.examCount} Çıkmış Soru</span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400" />
                      </Link>
                    ))}
                  </div>
                </div>

                <Link
                  href={`/course/${(levelCourses[0]?.code || 'CENG-201').replace(/\s+/g, '-').toLowerCase()}`}
                  className="w-full py-2 rounded-xl text-center text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition block"
                >
                  Tüm {level} İçeriklerini Aç →
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {/* Professors / Faculty Staff Section */}
      <div className="space-y-4 pt-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-emerald-400" />
          Bölüm Öğretim Üyeleri ve Onaylı Notlar
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {deptProfessors.map((prof) => (
            <div key={prof.id} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
              <img src={prof.avatar} alt={prof.name} className="w-10 h-10 rounded-full object-cover border border-emerald-500/40" />
              <div>
                <h4 className="text-xs font-bold text-slate-100">{prof.name}</h4>
                <p className="text-[10px] text-slate-400">{prof.title} • {prof.university}</p>
                <span className="text-[10px] text-emerald-400 font-semibold">{prof.verifiedCount} Onaylı Not</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
