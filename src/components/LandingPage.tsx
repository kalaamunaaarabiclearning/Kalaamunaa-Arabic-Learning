import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  BookOpen, 
  GraduationCap, 
  Video, 
  Award, 
  Star, 
  ShoppingCart, 
  Phone, 
  Mail, 
  ChevronRight, 
  PlayCircle,
  FileCheck2,
  Clock,
  Compass,
  Users,
  ShieldCheck,
  Calendar,
  X
} from 'lucide-react';
import { Course, Post, SiteSettings, Testimonial, User } from '../types';
import { formatRupiah, getYouTubeEmbedUrl } from '../utils/formatters';

interface LandingPageProps {
  settings: SiteSettings;
  courses: Course[];
  posts: Post[];
  testimonials: Testimonial[];
  currentUser: User | null;
  onSelectCourse: (course: Course) => void;
  onAddToCart: (course: Course) => void;
  cartCourseIds: string[];
  onOpenAuth: (tab?: 'student-login' | 'student-register') => void;
  onOpenClassroom?: (courseId: string) => void;
  approvedCourseIds?: string[];
}

export const LandingPage: React.FC<LandingPageProps> = ({
  settings,
  courses,
  posts,
  testimonials,
  currentUser,
  onSelectCourse,
  onAddToCart,
  cartCourseIds,
  onOpenAuth,
  onOpenClassroom,
  approvedCourseIds = [],
}) => {
  // Reading post modal state
  const [readingPost, setReadingPost] = useState<Post | null>(null);

  return (
    <div className="space-y-24 pb-20">
      {/* ============================================================== */}
      {/* 1. HERO SECTION */}
      {/* ============================================================== */}
      <section id="beranda" className="relative overflow-hidden bg-slate-900 text-white pt-16 pb-24 sm:pt-24 sm:pb-32">
        {/* Subtle decorative Islamic geometric glow and grid */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(0,71,171,0.5),rgba(255,255,255,0))]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#0047AB]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-900/60 border border-blue-400/30 text-blue-200 text-xs sm:text-sm font-semibold backdrop-blur-xs">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>{settings.heroBadge}</span>
          </div>

          {/* Arabic Calligraphy Header Accent */}
          <div className="space-y-3">
            <p className="font-arabic text-3xl sm:text-5xl font-bold text-amber-300 drop-shadow-md tracking-wider">
              {settings.arabicSubtitle}
            </p>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
              {settings.heroTitle}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-amber-300 to-amber-400">
                {settings.heroHighlight}
              </span>
            </h1>
          </div>

          {/* Description */}
          <p className="text-slate-300 text-sm sm:text-lg max-w-2xl mx-auto leading-relaxed">
            {settings.heroDescription}
          </p>

          {/* Hadith / Quote Box */}
          <div className="max-w-xl mx-auto p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 backdrop-blur-md space-y-1 text-center shadow-lg">
            <p className="font-arabic text-lg sm:text-xl text-amber-300 font-bold">
              {settings.arabicQuote}
            </p>
            <p className="text-xs text-slate-300 italic">
              {settings.arabicQuoteTranslation}
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <a
              href="#kursus"
              className="w-full sm:w-auto px-8 py-4 bg-[#0047AB] hover:bg-blue-600 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-blue-900/40 hover:scale-102 active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              <span>Jelajahi Paket Kursus</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <a
              href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent('Assalamualaikum Admin Kalaamunaa, saya ingin berkonsultasi mengenai kelas belajar bahasa Arab.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-emerald-950/40 hover:scale-102 active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4" />
              <span>Konsultasi WhatsApp Admin</span>
            </a>
          </div>

          {/* Quick Metrics */}
          <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto border-t border-slate-800/80 text-center">
            <div className="p-3">
              <p className="text-2xl sm:text-3xl font-extrabold text-amber-300">100%</p>
              <p className="text-xs text-slate-400 mt-0.5">Sistematis & Terukur</p>
            </div>
            <div className="p-3">
              <p className="text-2xl sm:text-3xl font-extrabold text-blue-300">YouTube</p>
              <p className="text-xs text-slate-400 mt-0.5">Video Pembelajaran</p>
            </div>
            <div className="p-3">
              <p className="text-2xl sm:text-3xl font-extrabold text-amber-300">G-Form</p>
              <p className="text-xs text-slate-400 mt-0.5">Kuis Tiap Pelajaran</p>
            </div>
            <div className="p-3">
              <p className="text-2xl sm:text-3xl font-extrabold text-blue-300">Resmi</p>
              <p className="text-xs text-slate-400 mt-0.5">Sertifikat Kelulusan</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 2. PRATINJAU KELAS (UJI COBA KELAS VIDEO YOUTUBE LANGSUNG) */}
      {/* ============================================================== */}
      <section id="pratinjau" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 via-[#002b66] to-[#0047AB] rounded-3xl p-6 sm:p-10 lg:p-12 text-white shadow-2xl border border-blue-900/40 relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="relative z-10 text-center max-w-3xl mx-auto space-y-3 mb-8 sm:mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/20 border border-amber-300/40 text-amber-300 text-xs font-bold">
              <PlayCircle className="w-4 h-4 text-amber-300" />
              <span>{settings.previewBadge || 'Uji Coba Kelas Gratis'}</span>
            </div>

            {settings.previewArabicSubtitle && (
              <p className="font-arabic text-xl sm:text-2xl font-bold text-amber-200">
                {settings.previewArabicSubtitle}
              </p>
            )}

            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              {settings.previewTitle || 'Pratinjau Kelas: Rasakan Metode Belajarnya Langsung'}
            </h2>

            <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
              {settings.previewDescription || 'Tonton cuplikan materi pengajaran bahasa Arab di Kalaamunaa berikut ini secara langsung. Rasakan bagaimana metode penyampaian yang runtut dan jelas mempermudah Anda memahami tata bahasa Arab.'}
            </p>
          </div>

          {/* Video Player & Points Grid */}
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Embedded YouTube Video */}
            <div className="lg:col-span-8">
              <div className="rounded-2xl overflow-hidden bg-black border-2 border-blue-400/30 shadow-2xl aspect-video w-full relative group">
                <iframe
                  src={getYouTubeEmbedUrl(settings.previewYoutubeUrl || 'https://www.youtube.com/watch?v=kYJzXv-K5v0')}
                  title={settings.previewTitle || 'Pratinjau Video Kelas Kalaamunaa'}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-blue-200 mt-2.5 px-1">
                <span className="flex items-center gap-1.5 font-medium">
                  <PlayCircle className="w-3.5 h-3.5 text-red-400" />
                  <span>Pemutar Video Langsung (YouTube)</span>
                </span>
                <span className="text-amber-300 font-semibold">
                  Tersedia Gratis untuk Seluruh Calon Peserta
                </span>
              </div>
            </div>

            {/* Side Card: Key Points & CTA */}
            <div className="lg:col-span-4 bg-slate-900/80 backdrop-blur-md rounded-2xl p-6 border border-white/10 space-y-5">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-amber-400/10 px-2.5 py-0.5 rounded-md">
                  Poin Pembahasan Kelas
                </span>
                <h3 className="text-base font-bold text-white mt-1.5">
                  Yang Anda Pelajari Pada Sesi Ini:
                </h3>
              </div>

              <div className="space-y-3">
                {(settings.previewKeyPoints || [
                  'Metode bertahap (tadarruj) dari nol tanpa pusing',
                  'Membedakan kata dan struktur kalimat sederhana',
                  'Contoh aplikatif dalam ayat Al-Qur\'an dan shalat',
                  'Simulasi kemudahan belajar video & evaluasi kuis',
                ]).map((point, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="leading-snug">{point}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-white/10 space-y-2.5">
                <a
                  href="#kursus"
                  className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Daftar Kursus Pilihan Anda</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>

                <a
                  href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent('Assalamualaikum Admin Kalaamunaa, saya baru saja menonton video Pratinjau Kelas dan ingin menanyakan pendaftaran kursus lebih lanjut.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Tanya Pengajar via WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 3. TENTANG KURSUS KALAAMUNAA */}
      {/* ============================================================== */}
      <section id="tentang" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
              <img
                src="https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&w=800&q=80"
                alt="Belajar Bahasa Arab Kalaamunaa"
                className="w-full h-[400px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0047AB]/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="font-arabic text-2xl text-amber-300">
                  كَلَامُنَا لِتَعْلِيمِ اللُّغَةِ الْعَرَبِيَّةِ
                </span>
                <p className="text-xs text-blue-100 mt-1">
                  Membuka gerbang pemahaman bahasa Al-Qur'an dan Sunnah secara mendalam.
                </p>
              </div>
            </div>

            {/* Floating Trust Badge */}
            <div className="absolute -bottom-6 -right-4 sm:right-6 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Kurikulum Teruji</p>
                <p className="text-[11px] text-slate-500">Materi Tadarruj dari Nol</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 text-[#0047AB] text-xs font-bold border border-blue-200">
              <Compass className="w-3.5 h-3.5" />
              <span>Mengenal Lembaga Pendidikan Kami</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-snug">
              {settings.aboutTitle}
            </h2>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              {settings.aboutContent}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#0047AB] flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Metode Bertahap (Tadarruj)</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Tidak langsung rumit; dimulai dari kata, pola kalimat, hingga I'rab.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Evaluasi Google Form Wajib</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Memastikan peserta benar-benar faham sebelum beranjak ke materi berikutnya.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 3. KEUNGGULAN KURSUS KALAAMUNAA */}
      {/* ============================================================== */}
      <section id="keunggulan" className="bg-slate-50 py-20 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0047AB] bg-blue-100/70 px-3 py-1 rounded-full">
              Mengapa Memilih Kami
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Keunggulan Kursus Bahasa Arab di Kalaamunaa
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Pengalaman belajar yang dirancang dengan teliti untuk kenyamanan, kejelasan materi, dan hasil nyata.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0047AB] flex items-center justify-center">
                <Video className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                Video Berurutan & Sistematis
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Setiap materi dikemas dalam video YouTube beresolusi tinggi dengan bahasa pengantar Indonesia yang santun dan mudah dipahami.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                Evaluasi Kuis Google Form Terarah
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Pelajaran terkunci berjenjang. Anda harus menonton video dan mengerjakan kuis sebelum dapat melangkah ke pelajaran berikutnya.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                Bimbingan Mudarris Berpengalaman
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Diusung oleh pengajar kompeten yang siap mendampingi proses konsultasi melalui saluran WhatsApp resmi Kalaamunaa.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                Sertifikat Kelulusan Resmi
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Setelah menuntaskan seluruh materi dan kuis, tombol pengajuan sertifikat akan otomatis terbuka untuk klaim sertifikat resmi.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 4. KATALOG JENIS KURSUS YANG TERSEDIA */}
      {/* ============================================================== */}
      <section id="kursus" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0047AB] bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              Pilihan Paket Kursus
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Katalog Kursus Bahasa Arab Kalaamunaa
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
              Klik pada kursus untuk melihat deskripsi lengkap, silabus pelajaran, dan apa yang akan Anda dapatkan setelah lulus.
            </p>
          </div>

          <div className="text-xs text-slate-500 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200">
            Akses Seumur Hidup • Verifikasi WhatsApp Cepat
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map((course) => {
            const isInCart = cartCourseIds.includes(course.id);
            const isApproved = approvedCourseIds.includes(course.id);

            return (
              <div
                key={course.id}
                className="bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-xl hover:border-blue-300 transition-all flex flex-col overflow-hidden group cursor-pointer"
                onClick={() => onSelectCourse(course)}
              >
                {/* Thumbnail */}
                <div className="relative h-48 w-full bg-slate-900 overflow-hidden">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                  {/* Level Tag */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-[#0047AB] text-white shadow-xs">
                      {course.level}
                    </span>
                  </div>

                  {course.arabicTitle && (
                    <div className="absolute bottom-3 right-3 text-right">
                      <span className="font-arabic text-amber-300 text-sm font-semibold drop-shadow-xs">
                        {course.arabicTitle}
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                      {course.category}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#0047AB] transition-colors line-clamp-2 leading-snug">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2">
                      {course.shortDescription}
                    </p>
                  </div>

                  {/* Metrics & Price */}
                  <div className="pt-3 border-t border-slate-100 space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                        <span>{course.lessons.length} Pelajaran</span>
                      </span>
                      <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                        <Award className="w-3.5 h-3.5" />
                        <span>Sertifikat</span>
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between">
                      <div>
                        <p className="text-base font-extrabold text-[#0047AB]">
                          {formatRupiah(course.price)}
                        </p>
                        {course.originalPrice && (
                          <p className="text-[11px] text-slate-400 line-through">
                            {formatRupiah(course.originalPrice)}
                          </p>
                        )}
                      </div>

                      {isApproved ? (
                        <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200">
                          Akses Aktif
                        </span>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onAddToCart(course);
                          }}
                          disabled={isInCart}
                          className={`p-2 rounded-xl transition-all ${
                            isInCart
                              ? 'bg-slate-100 text-slate-400'
                              : 'bg-blue-50 text-[#0047AB] hover:bg-[#0047AB] hover:text-white'
                          }`}
                          title={isInCart ? 'Sudah di Keranjang' : 'Tambah ke Keranjang'}
                        >
                          <ShoppingCart className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectCourse(course);
                      }}
                      className="w-full py-2 bg-slate-100 group-hover:bg-[#0047AB] text-slate-700 group-hover:text-white rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1"
                    >
                      <span>Lihat Rincian Kursus</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ============================================================== */}
      {/* 5. POSTINGAN & TIPS DARI ADMIN */}
      {/* ============================================================== */}
      <section id="postingan" className="bg-slate-50 py-20 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0047AB] bg-blue-100 px-3 py-1 rounded-full">
              Wawasan & Edukasi
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Postingan & Tips Belajar Bahasa Arab dari Admin
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Kaidah praktis Nahwu, tips memperkuat hafalan mufradat, dan motivasi mendalami lisan Al-Qur'an.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-lg transition-all overflow-hidden flex flex-col group cursor-pointer"
                onClick={() => setReadingPost(post)}
              >
                <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-[#0047AB] text-white">
                      {post.category}
                    </span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    {post.arabicHeading && (
                      <p className="font-arabic text-xs font-bold text-amber-700">
                        {post.arabicHeading}
                      </p>
                    )}
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#0047AB] transition-colors line-clamp-2 leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{post.publishedDate}</span>
                    </span>
                    <span className="text-[#0047AB] font-bold flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                      <span>Baca Lengkap</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 6. TESTIMONI PESERTA (JUMLAH BINTANG & ULASAN) */}
      {/* ============================================================== */}
      <section id="testimoni" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            Kisah Sukses Peserta
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Apa Kata Mereka Tentang Kalaamunaa?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Ulasan jujur dari para pembelajar yang telah merasakan kemudahan memahami bahasa Arab melalui bimbingan kami.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testi) => (
            <div
              key={testi.id}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4 relative"
            >
              <div className="space-y-3">
                {/* Stars Rating */}
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star
                      key={idx}
                      className={`w-4 h-4 ${
                        idx < testi.stars ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                      }`}
                    />
                  ))}
                  <span className="text-[11px] font-bold text-slate-600 ml-1">
                    ({testi.stars}.0)
                  </span>
                </div>

                <p className="text-xs text-slate-600 italic leading-relaxed">
                  "{testi.review}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                <img
                  src={testi.avatarUrl}
                  alt={testi.name}
                  className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                />
                <div className="overflow-hidden">
                  <h4 className="text-xs font-bold text-slate-900 truncate">
                    {testi.name}
                  </h4>
                  <p className="text-[10px] text-slate-500 truncate">
                    {testi.role} {testi.city ? `• ${testi.city}` : ''}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================== */}
      {/* 7. CTA / WHATSAPP BANNER */}
      {/* ============================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#0047AB] via-[#003885] to-slate-950 rounded-3xl p-8 sm:p-12 text-white text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="space-y-2">
            <span className="font-arabic text-2xl text-amber-300">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Siap Memulai Perjalanan Belajar Bahasa Arab Anda?
            </h2>
            <p className="text-xs sm:text-sm text-blue-100 max-w-xl mx-auto">
              Daftar sekarang, pilih kursus yang Anda minati, dan checkout langsung terhubung ke WhatsApp Admin Kalaamunaa (+{settings.whatsappNumber}) untuk proses approval instan.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onOpenAuth('student-register')}
              className="w-full sm:w-auto px-8 py-3.5 bg-white text-[#0047AB] hover:bg-blue-50 font-extrabold text-xs rounded-xl shadow-lg transition-all"
            >
              Daftar Akun Peserta Gratis
            </button>
            <a
              href={`https://wa.me/${settings.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4" />
              <span>Chat WhatsApp Admin</span>
            </a>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* POST DETAIL READER MODAL */}
      {/* ============================================================== */}
      {readingPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-slate-200 shadow-2xl">
            <div className="relative h-56 w-full bg-slate-900 overflow-hidden shrink-0">
              <img
                src={readingPost.imageUrl}
                alt={readingPost.title}
                className="w-full h-full object-cover opacity-70"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              <button
                onClick={() => setReadingPost(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/40 text-white hover:bg-black/70"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-6 right-6 text-white space-y-1">
                <span className="text-[10px] font-bold bg-[#0047AB] px-2 py-0.5 rounded-md">
                  {readingPost.category}
                </span>
                <h3 className="text-lg font-bold leading-tight">
                  {readingPost.title}
                </h3>
              </div>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed flex-1">
              {readingPost.arabicHeading && (
                <p className="font-arabic text-base text-amber-700 font-bold text-center py-1 bg-amber-50 rounded-xl">
                  {readingPost.arabicHeading}
                </p>
              )}
              <div className="whitespace-pre-line text-slate-600">
                {readingPost.content}
              </div>
              <div className="pt-4 border-t text-xs text-slate-400 flex items-center justify-between">
                <span>Penulis: {readingPost.author}</span>
                <span>{readingPost.publishedDate}</span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t flex justify-end">
              <button
                onClick={() => setReadingPost(null)}
                className="px-5 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl"
              >
                Tutup Bacaan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
