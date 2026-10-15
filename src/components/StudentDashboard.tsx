import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  Clock, 
  CheckCircle2, 
  Award, 
  AlertCircle, 
  ArrowRight, 
  Send, 
  ExternalLink,
  ShoppingBag,
  Play,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { Course, Order, SiteSettings, User } from '../types';
import { storage } from '../services/storage';
import { formatRupiah, formatDateIndo } from '../utils/formatters';

interface StudentDashboardProps {
  currentUser: User;
  settings: SiteSettings;
  onOpenClassroom: (courseId: string) => void;
  onExploreCourses: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  currentUser,
  settings,
  onOpenClassroom,
  onExploreCourses,
}) => {
  const [activeTab, setActiveTab] = useState<'my-courses' | 'orders'>('my-courses');
  const [filterStatus, setFilterStatus] = useState<'all' | 'approved' | 'pending' | 'completed'>('all');

  // Enrolled courses with approval status
  const [enrolledList, setEnrolledList] = useState<{ course: Course; status: 'approved' | 'pending'; orderId: string }[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  const loadData = () => {
    const list = storage.getStudentCourses(currentUser.id);
    setEnrolledList(list);

    const allOrders = storage.getOrders();
    const myOrders = allOrders.filter((o) => o.studentId === currentUser.id);
    setOrders(myOrders);
  };

  useEffect(() => {
    loadData();
    const unsub = storage.subscribe(() => {
      loadData();
    });
    return unsub;
  }, [currentUser.id]);

  // Calculate statistics
  const approvedCourses = enrolledList.filter((item) => item.status === 'approved');
  const pendingCourses = enrolledList.filter((item) => item.status === 'pending');

  const courseStats = approvedCourses.map((item) => {
    const prog = storage.getCourseProgress(currentUser.id, item.course.id);
    const totalLessons = item.course.lessons.length;
    const completedLessons = item.course.lessons.filter(
      (l) => prog.lessonsProgress[l.id]?.hasCompletedQuiz
    ).length;
    const isCompleted = totalLessons > 0 && completedLessons === totalLessons;
    const percent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    return {
      course: item.course,
      status: item.status,
      orderId: item.orderId,
      totalLessons,
      completedLessons,
      isCompleted,
      percent,
    };
  });

  const completedCount = courseStats.filter((c) => c.isCompleted).length;
  const inProgressCount = courseStats.filter((c) => !c.isCompleted).length;

  // Filter list
  const filteredList = enrolledList.filter((item) => {
    if (filterStatus === 'pending') return item.status === 'pending';
    if (filterStatus === 'approved') return item.status === 'approved';
    if (filterStatus === 'completed') {
      if (item.status !== 'approved') return false;
      const prog = storage.getCourseProgress(currentUser.id, item.course.id);
      return item.course.lessons.length > 0 && item.course.lessons.every((l) => prog.lessonsProgress[l.id]?.hasCompletedQuiz);
    }
    return true;
  });

  const handleContactAdminWA = (orderNumber?: string) => {
    const text = `Assalamualaikum Admin Kalaamunaa,\nSaya ${currentUser.name} (${currentUser.email}) ingin mengonfirmasi pesanan kursus saya ${orderNumber ? `dengan No. Order: ${orderNumber}` : ''}. Mohon bantuannya untuk approval akses kursus. Syukran!`;
    const cleanPhone = (settings.whatsappNumber || '6282311776535').replace(/\D/g, '');
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Welcome & Overview Header */}
      <div className="bg-gradient-to-r from-[#0047AB] via-[#003885] to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute right-32 top-0 w-32 h-32 rounded-full bg-amber-400/10 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-blue-200 border border-white/15">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Portal Pembelajaran Siswa Kalaamunaa</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Ahlan wa Sahlan, {currentUser.name}!
            </h1>
            <p className="text-xs sm:text-sm text-blue-100 max-w-xl">
              Tingkatkan kemampuan bahasa Arab Anda secara istiqomah. Tonton video pelajaran, selesaikan kuis di tiap bab, dan dapatkan sertifikat kelulusan resmi.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onExploreCourses}
              className="px-5 py-3 bg-white text-[#0047AB] hover:bg-blue-50 font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              <span>Katalog Kursus Baru</span>
            </button>
          </div>
        </div>

        {/* 4 Quick Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-8 pt-6 border-t border-white/10">
          <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-4 border border-white/10">
            <p className="text-[11px] text-blue-200">Kursus Aktif</p>
            <p className="text-2xl font-extrabold mt-0.5">{approvedCourses.length}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-4 border border-white/10">
            <p className="text-[11px] text-blue-200">Sedang Berjalan</p>
            <p className="text-2xl font-extrabold mt-0.5 text-blue-300">{inProgressCount}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-4 border border-white/10">
            <p className="text-[11px] text-blue-200">Kursus Selesai (100%)</p>
            <p className="text-2xl font-extrabold mt-0.5 text-emerald-300">{completedCount}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-4 border border-white/10">
            <p className="text-[11px] text-blue-200">Menunggu Approval</p>
            <p className="text-2xl font-extrabold mt-0.5 text-amber-300">{pendingCourses.length}</p>
          </div>
        </div>
      </div>

      {/* Tabs Switcher: Kursus Saya vs Riwayat Pesanan */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('my-courses')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'my-courses'
                ? 'bg-[#0047AB] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Kursus Terdaftar ({enrolledList.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'bg-[#0047AB] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Riwayat Pesanan ({orders.length})</span>
          </button>
        </div>

        {/* Filter Pills for Courses */}
        {activeTab === 'my-courses' && (
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-semibold">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                filterStatus === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setFilterStatus('approved')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                filterStatus === 'approved' ? 'bg-[#0047AB] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Akses Aktif
            </button>
            <button
              onClick={() => setFilterStatus('completed')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                filterStatus === 'completed' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Telah Selesai
            </button>
            <button
              onClick={() => setFilterStatus('pending')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                filterStatus === 'pending' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Menunggu Approval
            </button>
          </div>
        )}
      </div>

      {/* TAB 1: KURSUS SAYA */}
      {activeTab === 'my-courses' && (
        <div>
          {filteredList.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[#0047AB] flex items-center justify-center mx-auto">
                <BookOpen className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Belum Ada Kursus yang Sesuai
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Anda belum memilih kursus pada filter ini. Jelajahi katalog kursus bahasa Arab Kalaamunaa dan mulai belajar hari ini!
              </p>
              <button
                onClick={onExploreCourses}
                className="px-6 py-2.5 bg-[#0047AB] text-white text-xs font-bold rounded-xl shadow-xs"
              >
                Pilih Kursus di Katalog
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredList.map((item) => {
                const prog = storage.getCourseProgress(currentUser.id, item.course.id);
                const totalLessons = item.course.lessons.length;
                const completedLessons = item.course.lessons.filter(
                  (l) => prog.lessonsProgress[l.id]?.hasCompletedQuiz
                ).length;
                const isCompleted = totalLessons > 0 && completedLessons === totalLessons;
                const percent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
                const isApproved = item.status === 'approved';

                return (
                  <div
                    key={item.course.id}
                    className="bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col"
                  >
                    {/* Course Thumbnail */}
                    <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
                      <img
                        src={item.course.thumbnail}
                        alt={item.course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                      {/* Status Badge */}
                      <div className="absolute top-3 left-3">
                        {isApproved ? (
                          isCompleted ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500 text-white shadow-xs">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Kursus Selesai
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-[#0047AB] text-white shadow-xs">
                              <Play className="w-3.5 h-3.5" />
                              Sedang Berjalan
                            </span>
                          )
                        ) : (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-slate-950 shadow-xs">
                            <Clock className="w-3.5 h-3.5" />
                            Menunggu Approval Admin
                          </span>
                        )}
                      </div>

                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <p className="text-[11px] font-bold text-amber-300">
                          {item.course.level}
                        </p>
                      </div>
                    </div>

                    {/* Course Card Body */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug">
                          {item.course.title}
                        </h4>
                        <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                          {item.course.shortDescription}
                        </p>
                      </div>

                      {/* Course Access / Progress Status */}
                      {isApproved ? (
                        <div className="space-y-2 pt-2 border-t border-slate-100">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-500 font-medium">
                              Progres Materi:
                            </span>
                            <span className="font-bold text-[#0047AB]">
                              {completedLessons} / {totalLessons} Selesai ({percent}%)
                            </span>
                          </div>

                          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-2 rounded-full transition-all duration-300 ${
                                isCompleted ? 'bg-emerald-500' : 'bg-[#0047AB]'
                              }`}
                              style={{ width: `${percent}%` }}
                            />
                          </div>

                          <div className="flex items-center gap-2 pt-2">
                            <button
                              onClick={() => onOpenClassroom(item.course.id)}
                              className="flex-1 py-2.5 bg-[#0047AB] hover:bg-[#003380] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
                            >
                              <Play className="w-3.5 h-3.5" />
                              <span>{isCompleted ? 'Ulas Materi Kelas' : 'Lanjutkan Belajar'}</span>
                            </button>

                            {isCompleted && (
                              <a
                                href={item.course.certificateFormUrl || 'https://docs.google.com/forms'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3.5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl transition-colors flex items-center gap-1"
                                title="Ajukan Sertifikat"
                              >
                                <Award className="w-4 h-4" />
                              </a>
                            )}
                          </div>
                        </div>
                      ) : (
                        /* PENDING APPROVAL LOCK CARD */
                        <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-2">
                          <div className="flex items-start gap-2">
                            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                            <p className="leading-snug">
                              <b>Kursus Belum Dapat Dijalankan:</b> Akses materi masih menunggu verifikasi persetujuan (approval) dari admin Kalaamunaa.
                            </p>
                          </div>

                          <button
                            onClick={() => handleContactAdminWA()}
                            className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 text-[11px]"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Konfirmasi ke WhatsApp Admin</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: RIWAYAT PESANAN */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Riwayat Pembelian Kursus Saya
            </h3>
            <span className="text-xs text-slate-500">
              Total {orders.length} transaksi tercatat
            </span>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-12 text-slate-500 space-y-2">
              <ShoppingBag className="w-10 h-10 mx-auto opacity-40" />
              <p className="text-xs">Belum ada riwayat pesanan.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Nomor Pesanan</th>
                    <th className="py-3 px-4">Daftar Kursus</th>
                    <th className="py-3 px-4">Tanggal</th>
                    <th className="py-3 px-4">Total</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-slate-50/60">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        {ord.orderNumber}
                      </td>
                      <td className="py-3 px-4">
                        <div className="max-w-xs space-y-0.5">
                          {ord.items.map((i, idx) => (
                            <p key={idx} className="font-semibold truncate">
                              • {i.courseTitle}
                            </p>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        {formatDateIndo(ord.createdAt)}
                      </td>
                      <td className="py-3 px-4 font-extrabold text-[#0047AB]">
                        {formatRupiah(ord.totalPrice)}
                      </td>
                      <td className="py-3 px-4">
                        {ord.status === 'approved' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Disetujui
                          </span>
                        ) : ord.status === 'pending' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                            <Clock className="w-3 h-3 text-amber-600" />
                            Menunggu Approval
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-100 text-red-800">
                            Ditolak
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {ord.status === 'pending' ? (
                          <button
                            onClick={() => handleContactAdminWA(ord.orderNumber)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px] inline-flex items-center gap-1"
                          >
                            <Send className="w-3 h-3" />
                            <span>Kirim Bukti WA</span>
                          </button>
                        ) : (
                          <span className="text-slate-400 text-[11px]">Selesai</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
