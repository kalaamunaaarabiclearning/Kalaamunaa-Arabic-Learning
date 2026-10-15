import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Lock, 
  PlayCircle, 
  FileQuestion, 
  Award, 
  ExternalLink, 
  Check, 
  AlertCircle,
  Sparkles,
  HelpCircle,
  GraduationCap,
  Clock,
  BookOpen
} from 'lucide-react';
import { Course, Lesson, User, UserCourseProgress } from '../types';
import { storage } from '../services/storage';
import { getYouTubeEmbedUrl } from '../utils/formatters';

interface CourseClassroomProps {
  course: Course;
  currentUser: User;
  onBack: () => void;
}

export const CourseClassroom: React.FC<CourseClassroomProps> = ({
  course,
  currentUser,
  onBack,
}) => {
  const isTeacher = currentUser.role === 'teacher' || currentUser.role === 'admin';
  const [progress, setProgress] = useState<UserCourseProgress>(() => 
    storage.getCourseProgress(currentUser.id, course.id)
  );

  // Set initial active lesson to first unfinished lesson, or first lesson
  const [activeLessonId, setActiveLessonId] = useState<string>(() => {
    const lessons = course.lessons;
    if (lessons.length === 0) return '';
    const currentProg = storage.getCourseProgress(currentUser.id, course.id);
    const unfinished = lessons.find(
      (l) => !currentProg.lessonsProgress[l.id]?.hasCompletedQuiz
    );
    return unfinished ? unfinished.id : lessons[0].id;
  });

  const [showCelebrationModal, setShowCelebrationModal] = useState(false);

  // Sync progress changes from storage
  useEffect(() => {
    const unsub = storage.subscribe(() => {
      const updated = storage.getCourseProgress(currentUser.id, course.id);
      setProgress(updated);
    });
    return unsub;
  }, [course.id, currentUser.id]);

  const activeLessonIndex = course.lessons.findIndex((l) => l.id === activeLessonId);
  const activeLesson: Lesson | undefined = course.lessons[activeLessonIndex] || course.lessons[0];

  // Helper: check if a lesson is unlocked
  const isLessonUnlocked = (lessonIndex: number): boolean => {
    if (isTeacher) return true; // Teachers can preview everything
    if (lessonIndex === 0) return true; // First lesson is always unlocked
    const previousLesson = course.lessons[lessonIndex - 1];
    return !!progress.lessonsProgress[previousLesson.id]?.hasCompletedQuiz;
  };

  // Helper: check if lesson is fully finished
  const isLessonFinished = (lessonId: string): boolean => {
    return !!progress.lessonsProgress[lessonId]?.hasCompletedQuiz;
  };

  const activeLessonProg = activeLesson ? progress.lessonsProgress[activeLesson.id] : undefined;
  const hasWatched = !!activeLessonProg?.hasWatchedVideo;
  const hasCompletedQuiz = !!activeLessonProg?.hasCompletedQuiz;

  // Calculate total completed lessons
  const completedLessonsCount = course.lessons.filter(
    (l) => progress.lessonsProgress[l.id]?.hasCompletedQuiz
  ).length;
  const completionPercentage = course.lessons.length > 0 
    ? Math.round((completedLessonsCount / course.lessons.length) * 100) 
    : 0;

  const isAllCourseCompleted = course.lessons.length > 0 && completedLessonsCount === course.lessons.length;

  // Actions
  const handleMarkWatched = () => {
    if (!activeLesson) return;
    const updated = storage.markVideoWatched(currentUser.id, course.id, activeLesson.id);
    setProgress(updated);
  };

  const handleMarkQuizDone = () => {
    if (!activeLesson) return;
    const updated = storage.markQuizCompleted(currentUser.id, course.id, activeLesson.id);
    setProgress(updated);

    // If next lesson exists, advance to next lesson
    if (activeLessonIndex < course.lessons.length - 1) {
      const nextLesson = course.lessons[activeLessonIndex + 1];
      setActiveLessonId(nextLesson.id);
    } else {
      setShowCelebrationModal(true);
    }
  };

  const handleApplyCertificate = () => {
    const targetUrl = course.certificateFormUrl || 'https://docs.google.com/forms';
    window.open(targetUrl, '_blank');
  };

  const embedUrl = activeLesson ? getYouTubeEmbedUrl(activeLesson.youtubeUrl) : '';

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      {/* Top Classroom Bar */}
      <div className="bg-slate-950 border-b border-slate-800 px-4 sm:px-6 py-3.5 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center gap-1.5 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Kembali ke Dasbor</span>
          </button>
          <div className="border-l border-slate-800 pl-3">
            <h1 className="text-xs sm:text-sm font-bold text-white line-clamp-1">
              {course.title}
            </h1>
            <p className="text-[11px] text-blue-400 font-arabic">
              {course.arabicTitle || 'كَلَامُنَا لِتَعْلِيمِ اللُّغَةِ الْعَرَبِيَّةِ'}
            </p>
          </div>
        </div>

        {/* Progress Badge */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-[11px] text-slate-400">Progres Belajar</p>
            <p className="text-xs font-bold text-emerald-400">
              {completedLessonsCount} dari {course.lessons.length} Pelajaran ({completionPercentage}%)
            </p>
          </div>
          <div className="w-24 sm:w-32 bg-slate-800 rounded-full h-2.5 overflow-hidden">
            <div 
              className="bg-emerald-500 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>

          {isAllCourseCompleted && (
            <button
              onClick={handleApplyCertificate}
              className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
            >
              <Award className="w-4 h-4 text-slate-950" />
              <span className="hidden md:inline">Ajukan Sertifikat</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Classroom Grid */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left: Video Player & Step-by-Step Learning Progression */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {activeLesson ? (
            <>
              {/* Lesson Title & Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60">
                <div>
                  <span className="text-[11px] font-bold text-blue-400 bg-blue-950/80 px-2.5 py-1 rounded-md border border-blue-800/60">
                    Pelajaran #{activeLessonIndex + 1}
                  </span>
                  <h2 className="text-lg sm:text-xl font-bold text-white mt-1.5">
                    {activeLesson.title}
                  </h2>
                </div>

                {/* Status indicator for this lesson */}
                <div className="flex items-center gap-2">
                  {hasCompletedQuiz ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-500/40">
                      <CheckCircle2 className="w-4 h-4" />
                      Pelajaran Selesai
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-950/80 text-amber-300 border border-amber-500/40">
                      <Clock className="w-4 h-4" />
                      Sedang Dipelajari
                    </span>
                  )}
                </div>
              </div>

              {/* YouTube Video Player */}
              <div className="rounded-2xl overflow-hidden bg-black border border-slate-700/80 shadow-2xl aspect-video w-full relative">
                {embedUrl ? (
                  <iframe
                    src={embedUrl}
                    title={activeLesson.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-slate-500">
                    <PlayCircle className="w-12 h-12 text-slate-600 mb-2" />
                    <p className="text-sm">Link video YouTube belum disematkan untuk pelajaran ini.</p>
                  </div>
                )}
              </div>

              {/* Lesson Description */}
              {activeLesson.description && (
                <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 text-xs sm:text-sm text-slate-300 leading-relaxed">
                  <p className="font-bold text-blue-300 mb-1">Catatan & Rangkuman Pelajaran:</p>
                  <p>{activeLesson.description}</p>
                </div>
              )}

              {/* STEP PROGRESSION CARD (Video -> Kuis -> Pelajaran Selanjutnya) */}
              <div className="p-6 rounded-2xl bg-slate-800/90 border border-slate-700 shadow-xl space-y-6">
                <div className="border-b border-slate-700 pb-3">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    <span>Tahapan Kelulusan Pelajaran #{activeLessonIndex + 1}</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Ikuti alur terstruktur: tonton video hingga tuntas, lalu kerjakan kuis evaluasi.
                  </p>
                </div>

                {/* TAHAP 1: Menonton Video */}
                <div className={`p-4 rounded-xl border transition-all ${
                  hasWatched 
                    ? 'bg-emerald-950/30 border-emerald-500/40' 
                    : 'bg-blue-950/30 border-blue-500/40'
                }`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                        hasWatched ? 'bg-emerald-500 text-slate-950' : 'bg-[#0047AB] text-white'
                      }`}>
                        {hasWatched ? <Check className="w-4 h-4 stroke-[3]" /> : '1'}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">
                          Tahap 1: Tonton Video Pembelajaran
                        </h4>
                        <p className="text-xs text-slate-400">
                          {hasWatched 
                            ? 'Anda telah mengonfirmasi selesai menonton materi ini.' 
                            : 'Silakan tonton video di atas dengan seksama, kemudian klik tombol konfirmasi.'}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={handleMarkWatched}
                      disabled={hasWatched}
                      className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 shrink-0 ${
                        hasWatched
                          ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-600/50 cursor-default'
                          : 'bg-[#0047AB] hover:bg-blue-600 text-white shadow-md shadow-blue-900/40 hover:scale-102 active:scale-98'
                      }`}
                    >
                      {hasWatched ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>Saya Sudah Menonton ✓</span>
                        </>
                      ) : (
                        <>
                          <PlayCircle className="w-4 h-4" />
                          <span>Saya Sudah Menonton</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* TAHAP 2: Mengerjakan Kuis Google Form */}
                <div className={`p-4 rounded-xl border transition-all ${
                  !hasWatched
                    ? 'bg-slate-900/40 border-slate-800 opacity-60'
                    : hasCompletedQuiz
                    ? 'bg-emerald-950/30 border-emerald-500/40'
                    : 'bg-amber-950/30 border-amber-500/40'
                }`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                        !hasWatched 
                          ? 'bg-slate-800 text-slate-500' 
                          : hasCompletedQuiz 
                          ? 'bg-emerald-500 text-slate-950' 
                          : 'bg-amber-400 text-slate-950'
                      }`}>
                        {!hasWatched ? <Lock className="w-4 h-4" /> : hasCompletedQuiz ? <Check className="w-4 h-4 stroke-[3]" /> : '2'}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                          <span>Tahap 2: Evaluasi Kuis Pemahaman</span>
                          {!hasWatched && (
                            <span className="text-[10px] text-amber-400 font-semibold bg-amber-950/60 px-2 py-0.5 rounded-sm">
                              Terkunci (Klik Saya Sudah Menonton Dulu)
                            </span>
                          )}
                        </h4>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {!hasWatched
                            ? 'Kuis ini belum dapat dibuka. Tonton video di atas dan klik "Saya Sudah Menonton" terlebih dahulu.'
                            : hasCompletedQuiz
                            ? 'Alhamdulillah, Anda telah menyelesaikan kuis evaluasi untuk materi ini.'
                            : 'Kerjakan soal evaluasi di Google Form untuk menguji pemahaman Anda.'}
                        </p>
                      </div>
                    </div>

                    {/* Actions for Quiz */}
                    {hasWatched && (
                      <div className="flex flex-col sm:flex-row items-center gap-2 shrink-0">
                        {activeLesson.quizUrl && (
                          <a
                            href={activeLesson.quizUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                          >
                            <FileQuestion className="w-4 h-4 text-amber-400" />
                            <span>Buka Kuis Google Form</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}

                        <button
                          onClick={handleMarkQuizDone}
                          disabled={hasCompletedQuiz}
                          className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                            hasCompletedQuiz
                              ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-600/50 cursor-default'
                              : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-900/40 hover:scale-102 active:scale-98'
                          }`}
                        >
                          {hasCompletedQuiz ? (
                            <>
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                              <span>Saya Sudah Kerjakan Kuis ✓</span>
                            </>
                          ) : (
                            <>
                              <Check className="w-4 h-4" />
                              <span>Saya Sudah Kerjakan Kuis</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Lesson Navigation Buttons */}
                <div className="pt-4 border-t border-slate-700/80 flex items-center justify-between">
                  <button
                    disabled={activeLessonIndex === 0}
                    onClick={() => setActiveLessonId(course.lessons[activeLessonIndex - 1].id)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    ← Pelajaran Sebelumnya
                  </button>

                  {activeLessonIndex < course.lessons.length - 1 ? (
                    <button
                      disabled={!hasCompletedQuiz && !isTeacher}
                      onClick={() => setActiveLessonId(course.lessons[activeLessonIndex + 1].id)}
                      className="px-5 py-2 rounded-xl text-xs font-bold bg-[#0047AB] hover:bg-blue-600 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                      Pelajaran Selanjutnya →
                    </button>
                  ) : (
                    <button
                      disabled={!isAllCourseCompleted}
                      onClick={handleApplyCertificate}
                      className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1.5"
                    >
                      <Award className="w-4 h-4" />
                      <span>Ajukan Sertifikat Kelulusan</span>
                    </button>
                  )}
                </div>
              </div>

              {/* CELEBRATION BANNER IF COURSE COMPLETED */}
              {isAllCourseCompleted && (
                <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-500/20 via-blue-900/30 to-emerald-900/20 border border-amber-400/40 text-center space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center mx-auto shadow-lg shadow-amber-400/20">
                    <Award className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-white">
                      Mabruk! Anda Telah Menyelesaikan Kursus Ini!
                    </h3>
                    <p className="text-xs text-slate-300 max-w-md mx-auto mt-1">
                      Seluruh video pelajaran dan kuis evaluasi telah Anda tuntaskan dengan baik. 
                      Klik tombol di bawah ini untuk mengisi formulir pengajuan sertifikat resmi Kalaamunaa.
                    </p>
                  </div>
                  <button
                    onClick={handleApplyCertificate}
                    className="px-7 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-amber-400/20 transition-all inline-flex items-center gap-2"
                  >
                    <Award className="w-4 h-4 text-slate-950" />
                    <span>Ajukan Sertifikat Sekarang (Google Form)</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20 text-slate-500">
              <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Kursus ini belum memiliki daftar pelajaran.</p>
            </div>
          )}
        </div>

        {/* Right Sidebar: Syllabus & Lesson Progression List */}
        <div className="w-full lg:w-80 bg-slate-950 border-t lg:border-t-0 lg:border-l border-slate-800 p-4 sm:p-5 flex flex-col shrink-0">
          <div className="mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-400" />
              <span>Daftar Pelajaran Kursus</span>
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Klik materi untuk berpindah pelajaran
            </p>
          </div>

          {/* Lessons List */}
          <div className="space-y-2 overflow-y-auto flex-1 pr-1">
            {course.lessons.map((lesson, idx) => {
              const unlocked = isLessonUnlocked(idx);
              const finished = isLessonFinished(lesson.id);
              const isActive = lesson.id === activeLessonId;

              return (
                <button
                  key={lesson.id}
                  disabled={!unlocked}
                  onClick={() => setActiveLessonId(lesson.id)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3 ${
                    isActive
                      ? 'bg-blue-900/40 border-[#0047AB] text-white shadow-xs'
                      : finished
                      ? 'bg-slate-900/60 hover:bg-slate-850 border-slate-800 text-slate-300'
                      : unlocked
                      ? 'bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-300'
                      : 'bg-slate-950 border-slate-900 text-slate-600 opacity-60 cursor-not-allowed'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {finished ? (
                      <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    ) : unlocked ? (
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        isActive ? 'bg-[#0047AB] text-white' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {idx + 1}
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-slate-900 text-slate-600 flex items-center justify-center">
                        <Lock className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold truncate">
                      {lesson.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-[10px]">
                      {finished ? (
                        <span className="text-emerald-400 font-semibold">Tuntas (100%)</span>
                      ) : isActive ? (
                        <span className="text-blue-400 font-semibold">Sedang Dipelajari</span>
                      ) : unlocked ? (
                        <span className="text-slate-400">Tersedia</span>
                      ) : (
                        <span className="text-slate-600">Terkunci</span>
                      )}
                      {lesson.duration && (
                        <>
                          <span className="text-slate-700">•</span>
                          <span className="text-slate-500">{lesson.duration}</span>
                        </>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Certificate Action Box at Bottom of Sidebar */}
          <div className="mt-4 pt-4 border-t border-slate-800">
            <div className={`p-3.5 rounded-xl border text-xs text-center space-y-2 ${
              isAllCourseCompleted 
                ? 'bg-amber-950/40 border-amber-500/50 text-amber-200' 
                : 'bg-slate-900/50 border-slate-800 text-slate-500'
            }`}>
              <Award className={`w-6 h-6 mx-auto ${isAllCourseCompleted ? 'text-amber-400' : 'text-slate-600'}`} />
              <div>
                <p className="font-bold text-slate-200">
                  {isAllCourseCompleted ? 'Sertifikat Siap Diajukan!' : 'Sertifikat Resmi Kursus'}
                </p>
                <p className="text-[11px] text-slate-400">
                  {isAllCourseCompleted 
                    ? 'Selamat! Anda berhak memperoleh sertifikat penyelesaian kursus.' 
                    : 'Selesaikan seluruh video & kuis untuk membuka pengajuan sertifikat.'}
                </p>
              </div>
              <button
                disabled={!isAllCourseCompleted}
                onClick={handleApplyCertificate}
                className="w-full py-2 bg-amber-400 hover:bg-amber-300 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 font-bold text-xs rounded-lg transition-all"
              >
                Ajukan Sertifikat
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
