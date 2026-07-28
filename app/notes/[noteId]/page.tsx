'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Download, 
  Share2, 
  Bookmark, 
  CheckCircle2, 
  Star, 
  BrainCircuit, 
  Sparkles, 
  MessageSquare, 
  ThumbsUp, 
  Send, 
  HelpCircle, 
  Zap, 
  FileText, 
  Layers, 
  ShieldCheck,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { MOCK_NOTES, MOCK_USER } from '@/lib/mock-data';

interface PageProps {
  params: Promise<{ noteId: string }>;
}

export default function NoteDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const note = MOCK_NOTES.find(n => n.id === resolvedParams.noteId) || MOCK_NOTES[0];

  const [activeTab, setActiveTab] = useState<'ocr' | 'comments' | 'details'>('ocr');
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [commentsList, setCommentsList] = useState(note.comments);
  const [isSaved, setIsSaved] = useState(false);
  const [hasDownloaded, setHasDownloaded] = useState(false);

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const commentObj = {
      id: `c-${Date.now()}`,
      userName: MOCK_USER.name,
      userAvatar: MOCK_USER.avatar,
      userBadge: MOCK_USER.department,
      rating: 5,
      date: 'Şimdi',
      comment: newComment,
      likes: 0
    };
    setCommentsList([commentObj, ...commentsList]);
    setNewComment('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Back Bar & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link href="/faculties" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-400 font-semibold transition">
          <ArrowLeft className="w-4 h-4" /> Kataloğa Dön
        </Link>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsSaved(!isSaved)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition ${
              isSaved ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-amber-400 text-amber-400' : ''}`} />
            <span>{isSaved ? 'Kaydedildi' : 'Kaydet'}</span>
          </button>
          
          <button className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400">
            <Share2 className="w-4 h-4" />
          </button>

          <button
            onClick={() => setHasDownloaded(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-white text-xs font-bold shadow-lg shadow-cyan-500/20"
          >
            <Download className="w-4 h-4" />
            <span>{hasDownloaded ? 'İndiriliyor...' : `İndir (${note.dijipuanPrice} Dijipuan)`}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left PDF Canvas Viewer (2 Cols) | Right Info & AI Sidebar (1 Col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* PDF / Note Reader Canvas Panel (2 Columns wide on desktop) */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Reader Toolbar */}
          <div className="p-3 rounded-2xl glass-panel bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-4 text-xs">
            {/* Page Nav */}
            <div className="flex items-center gap-2">
              <button 
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-bold text-slate-200">
                Sayfa {currentPage} / {note.pageCount}
              </span>
              <button 
                disabled={currentPage >= note.pageCount}
                onClick={() => setCurrentPage(prev => Math.min(note.pageCount, prev + 1))}
                className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Zoom controls */}
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setZoomLevel(prev => Math.max(50, prev - 10))}
                className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                title="Küçült"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="font-mono text-slate-400 w-12 text-center">{zoomLevel}%</span>
              <button 
                onClick={() => setZoomLevel(prev => Math.min(150, prev + 10))}
                className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                title="Büyüt"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-400"
                title="Tam Ekran"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Interactive Mock PDF Viewer Canvas */}
          <div className="relative rounded-3xl glass-panel bg-slate-950 border border-slate-800 min-h-[560px] flex items-center justify-center p-4 overflow-hidden">
            
            {/* Mock Page Thumbnail Sidebar inside Viewer */}
            <div className="absolute left-3 top-3 bottom-3 w-20 bg-slate-900/90 border border-slate-800 rounded-2xl p-2 hidden sm:flex flex-col gap-2 overflow-y-auto z-10">
              {Array.from({ length: Math.min(6, note.pageCount) }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-full h-16 rounded-lg border overflow-hidden flex flex-col items-center justify-center text-[10px] font-bold transition ${
                    currentPage === i + 1 ? 'border-cyan-500 bg-cyan-950/60 text-cyan-300' : 'border-slate-800 bg-slate-950 text-slate-500'
                  }`}
                >
                  <span>S. {i + 1}</span>
                </button>
              ))}
            </div>

            {/* Rendered Mock Page Container */}
            <div 
              className="transition-transform duration-200 ease-out flex flex-col items-center justify-center max-w-xl mx-auto space-y-4"
              style={{ transform: `scale(${zoomLevel / 100})` }}
            >
              <div className="w-full bg-slate-900 border border-slate-700/60 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 text-slate-200">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 text-[10px] font-extrabold bg-cyan-500/20 text-cyan-300 rounded">
                      {note.courseCode}
                    </span>
                    <span className="text-xs text-slate-400">{note.university}</span>
                  </div>
                  <span className="text-xs text-slate-500 font-mono">Sayfa {currentPage}</span>
                </div>

                {/* Simulated Handwritten / Typed Lecture Note Content */}
                <div className="space-y-4 font-serif text-sm sm:text-base leading-relaxed">
                  <h4 className="font-sans font-bold text-lg text-cyan-300">
                    Bölüm 3: {note.tags[0] || 'Algoritmik Yapılar'} ve Sınav Analizleri
                  </h4>

                  <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/30 font-sans text-xs text-cyan-200 space-y-1">
                    <span className="font-bold uppercase tracking-wider flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-amber-400" /> AI OCR Tespiti:
                    </span>
                    <p>{note.ocrSummary.keyPoints[0]}</p>
                  </div>

                  <p className="text-slate-300">
                    {note.description}
                  </p>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-400 space-y-2">
                    <span className="block font-sans text-[10px] uppercase font-bold text-slate-400">// C++ Örnek Kod Bloğu:</span>
                    <pre className="overflow-x-auto">
{`void dijkstra(int startNode) {
    priority_queue<pair<int, int>> pq;
    dist[startNode] = 0;
    pq.push({0, startNode});
    while(!pq.empty()) {
        int u = pq.top().second;
        pq.pop();
        // Edge relaxation steps...
    }
}`}
                    </pre>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 text-center text-xs text-slate-500">
                  Hazırlayan: {note.authorName} • Dijinot AI OCR Verified Page
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Note Info & AI Summary Sidebar (Right Side) */}
        <div className="space-y-6">
          
          {/* Author & Verification Card */}
          <div className="p-6 rounded-3xl glass-card bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center gap-3">
              <img src={note.authorAvatar} alt={note.authorName} className="w-12 h-12 rounded-full object-cover border-2 border-cyan-500/50" />
              <div>
                <h3 className="text-base font-bold text-slate-100">{note.authorName}</h3>
                <span className="inline-block text-[11px] font-semibold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">
                  {note.authorBadge}
                </span>
              </div>
            </div>

            {note.isVerifiedByProfessor && (
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <span className="block text-xs font-bold text-emerald-300">Öğretim Üyesi Onaylı</span>
                  <span className="text-[10px] text-slate-400">{note.professorName} tarafından kontrol edilmiştir.</span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-3 gap-2 text-center text-xs pt-2 border-t border-slate-800">
              <div>
                <span className="block font-bold text-amber-400 flex items-center justify-center gap-1">
                  <Star className="w-3 h-3 fill-amber-400" /> {note.rating}
                </span>
                <span className="text-[10px] text-slate-400">Puan</span>
              </div>
              <div>
                <span className="block font-bold text-slate-200">{note.downloadCount}</span>
                <span className="text-[10px] text-slate-400">İndirme</span>
              </div>
              <div>
                <span className="block font-bold text-cyan-400">{note.pageCount}</span>
                <span className="text-[10px] text-slate-400">Sayfa</span>
              </div>
            </div>
          </div>

          {/* AI OCR Summary & Discussion Tabs */}
          <div className="p-6 rounded-3xl glass-panel bg-slate-900/90 border border-slate-800 space-y-4">
            
            {/* Tab Header */}
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <button
                onClick={() => setActiveTab('ocr')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  activeTab === 'ocr' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <BrainCircuit className="w-4 h-4 text-cyan-400" />
                <span>AI Sınav Özeti</span>
              </button>

              <button
                onClick={() => setActiveTab('comments')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  activeTab === 'comments' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <MessageSquare className="w-4 h-4 text-indigo-400" />
                <span>Tartışma ({commentsList.length})</span>
              </button>
            </div>

            {/* TAB 1: AI OCR SUMMARY */}
            {activeTab === 'ocr' && (
              <div className="space-y-4 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-200">{note.ocrSummary.summaryTitle}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                    %{note.ocrSummary.aiConfidenceScore} AI Skor
                  </span>
                </div>

                <p className="text-slate-300 leading-relaxed">{note.ocrSummary.overview}</p>

                {/* Key Points */}
                <div className="space-y-1.5">
                  <span className="font-bold text-cyan-400 block">Önemli Noktalar:</span>
                  <ul className="space-y-1 text-slate-400 pl-4 list-disc">
                    {note.ocrSummary.keyPoints.map((point, idx) => (
                      <li key={idx}>{point}</li>
                    ))}
                  </ul>
                </div>

                {/* Probable Questions */}
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <span className="font-bold text-amber-400 flex items-center gap-1">
                    <HelpCircle className="w-3.5 h-3.5" /> Sınavda Çıkma İhtimali Yüksek Sorular:
                  </span>
                  {note.ocrSummary.probableExamQuestions.map((q, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-slate-500 font-mono">{q.topic}</span>
                        <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${
                          q.difficulty === 'Zor' ? 'bg-rose-500/20 text-rose-300' : 'bg-amber-500/20 text-amber-300'
                        }`}>
                          {q.difficulty}
                        </span>
                      </div>
                      <p className="text-slate-200 font-semibold">{q.question}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 2: COMMENTS / DISCUSSIONS */}
            {activeTab === 'comments' && (
              <div className="space-y-4 text-xs">
                {/* New Comment Input */}
                <form onSubmit={handleAddComment} className="flex gap-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Soru veya yorum yazın..."
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                  <button type="submit" className="p-2 rounded-xl bg-cyan-600 text-white hover:bg-cyan-500">
                    <Send className="w-4 h-4" />
                  </button>
                </form>

                {/* Comments List */}
                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                  {commentsList.map((c) => (
                    <div key={c.id} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img src={c.userAvatar} alt={c.userName} className="w-5 h-5 rounded-full object-cover" />
                          <span className="font-bold text-slate-200">{c.userName}</span>
                        </div>
                        <span className="text-[10px] text-slate-500">{c.date}</span>
                      </div>
                      <p className="text-slate-300 leading-snug">{c.comment}</p>
                      <div className="flex items-center gap-2 pt-1 text-[10px] text-slate-500">
                        <button className="flex items-center gap-1 hover:text-cyan-400">
                          <ThumbsUp className="w-3 h-3" /> {c.likes}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
