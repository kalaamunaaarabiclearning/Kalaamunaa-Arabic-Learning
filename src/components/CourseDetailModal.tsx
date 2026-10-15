import React from 'react';
import { 
  X, 
  CheckCircle2, 
  BookOpen, 
  Clock, 
  Award, 
  UserCheck, 
  ShoppingCart, 
  PlayCircle,
  FileCheck2,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Course } from '../types';
import { formatRupiah } from '../utils/formatters';

interface CourseDetailModalProps {
  course: Course | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (course: Course) => void;
  onBuyNow: (course: Course) => void;
  isInCart: boolean;
  isEnrolled: boolean;
  isApproved: boolean;
  onOpenClassroom: (courseId: string) => void;
}

export const CourseDetailModal: React.FC<CourseDetailModalProps> = ({
  course,
  isOpen,
  onClose,
  onAddToCart,
  onBuyNow,
  isInCart,
  isEnrolled,
  isApproved,
  onOpenClassroom,
}) => {
  if (!isOpen || !course) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Banner with close button */}
        <div className="relative h-56 sm:h-64 w-full bg-slate-900 overflow-hidden shrink-0">
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/50 to-transparent" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/40 text-white hover:bg-black/70 transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-6 right-6 text-white space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#0047AB] text-white">
                {course.level}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-400 text-slate-900">
                {course.category}
              </span>
              {course.arabicTitle && (
                <span className="text-amber-200 font-arabic text-sm ml-auto hidden sm:inline">
                  {course.arabicTitle}
                </span>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              {course.title}
            </h1>
            <p className="text-xs text-slate-300 flex items-center gap-2">
              <UserCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Instruktur: <b>{course.instructorName}</b></span>
              <span>•</span>
              <BookOpen className="w-3.5 h-3.5 text-blue-400" />
              <span>{course.lessons.length} Pelajaran Bertahap</span>
            </p>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-8 flex-1">
          {/* Status Alert if Already Enrolled */}
          {isEnrolled && (
            <div className={`p-4 rounded-2xl flex items-center justify-between text-xs font-semibold ${
              isApproved 
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' 
                : 'bg-amber-50 border border-amber-200 text-amber-800'
            }`}>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>
                  {isApproved 
                    ? 'Anda telah memiliki akses aktif ke kursus ini!' 
                    : 'Pesanan Anda untuk kursus ini sedang menunggu persetujuan (approval) admin.'}
                </span>
              </div>
              {isApproved && (
                <button
                  onClick={() => onOpenClassroom(course.id)}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors"
                >
                  Buka Ruang Belajar
                </button>
              )}
            </div>
          )}

          {/* Section: Deskripsi Kursus */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#0047AB] flex items-center gap-2 mb-2.5">
              <BookOpen className="w-4 h-4" />
              <span>Deskripsi Lengkap Kursus</span>
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {course.fullDescription}
            </p>
          </div>

          {/* Section: Apa yang Akan Didapatkan Setelah Kursus */}
          <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-100">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2 mb-3">
              <Award className="w-4 h-4 text-[#0047AB]" />
              <span>Apa yang Akan Anda Dapatkan Setelah Kursus Ini</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {course.whatYouWillGet.map((benefit, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="leading-snug">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Silabus & Daftar Pelajaran */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <PlayCircle className="w-4 h-4 text-[#0047AB]" />
                <span>Silabus & Alur Pelajaran ({course.lessons.length} Materi)</span>
              </h3>
              <span className="text-[11px] text-slate-500">Video YouTube + Kuis Google Form</span>
            </div>

            <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
              {course.lessons.map((lesson, idx) => (
                <div key={lesson.id} className="p-4 bg-white hover:bg-slate-50 transition-colors flex items-start gap-3.5">
                  <span className="w-7 h-7 rounded-full bg-blue-100 text-[#0047AB] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-900">
                      {lesson.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                      {lesson.description}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-500">
                      <span className="flex items-center gap-1 text-blue-700 font-medium">
                        <PlayCircle className="w-3 h-3" />
                        <span>Video Pembelajaran</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-amber-700 font-medium">
                        <FileCheck2 className="w-3 h-3" />
                        <span>Evaluasi Kuis Google Form</span>
                      </span>
                      {lesson.duration && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{lesson.duration}</span>
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer / Action Bar */}
        <div className="p-5 sm:px-8 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-extrabold text-[#0047AB]">
                {formatRupiah(course.price)}
              </span>
              {course.originalPrice && (
                <span className="text-xs text-slate-400 line-through">
                  {formatRupiah(course.originalPrice)}
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500">
              Akses seumur hidup + Evaluasi Ustadz + Sertifikat Resmi
            </p>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {isApproved ? (
              <button
                onClick={() => onOpenClassroom(course.id)}
                className="w-full sm:w-auto px-6 py-3 bg-[#0047AB] hover:bg-[#003380] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>Masuk ke Ruang Belajar</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <>
                <button
                  onClick={() => onAddToCart(course)}
                  disabled={isInCart}
                  className={`px-4 py-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    isInCart
                      ? 'bg-slate-100 border-slate-300 text-slate-400 cursor-not-allowed'
                      : 'border-[#0047AB] text-[#0047AB] hover:bg-blue-50'
                  }`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>{isInCart ? 'Sudah di Keranjang' : 'Tambah Keranjang'}</span>
                </button>

                <button
                  onClick={() => onBuyNow(course)}
                  className="flex-1 sm:flex-initial px-6 py-3 bg-[#0047AB] hover:bg-[#003380] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Beli Sekarang / Daftar</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
