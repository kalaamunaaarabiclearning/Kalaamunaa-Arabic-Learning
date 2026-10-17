import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  ShoppingBag, 
  BookOpen, 
  FileText, 
  MessageSquareQuote, 
  Settings as SettingsIcon, 
  Database, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Plus, 
  Trash2, 
  Edit3, 
  ExternalLink, 
  Send, 
  Copy, 
  Check, 
  RefreshCw, 
  Youtube, 
  FileQuestion, 
  Award, 
  Save, 
  Search,
  Eye,
  AlertTriangle,
  Download,
  Upload
} from 'lucide-react';
import { Course, Lesson, Order, Post, SiteSettings, Testimonial, User } from '../types';
import { storage } from '../services/storage';
import { formatRupiah, formatDateIndo } from '../utils/formatters';
import { GOOGLE_APPS_SCRIPT_TEMPLATE } from '../services/googleSheets';

interface AdminDashboardProps {
  currentUser: User;
  onPreviewCourse: (courseId: string) => void;
  onNavigateHome: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  onPreviewCourse,
  onNavigateHome,
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'courses' | 'posts' | 'testimonials' | 'site-text' | 'sheets'>('orders');

  // Reactive state from storage
  const [orders, setOrders] = useState<Order[]>(storage.getOrders());
  const [courses, setCourses] = useState<Course[]>(storage.getCourses());
  const [posts, setPosts] = useState<Post[]>(storage.getPosts());
  const [testimonials, setTestimonials] = useState<Testimonial[]>(storage.getTestimonials());
  const [settings, setSettings] = useState<SiteSettings>(storage.getSettings());
  const [users, setUsers] = useState<User[]>(storage.getUsers());

  // Search & Filters
  const [orderFilter, setOrderFilter] = useState<'all' | 'pending' | 'approved'>('pending');
  const [searchQuery, setSearchQuery] = useState('');

  // Course Editing Modal State
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);

  // Lesson Editing Modal State
  const [selectedCourseForLesson, setSelectedCourseForLesson] = useState<Course | null>(null);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);

  // Post Editing Modal State
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  // Testimonial Editing Modal State
  const [editingTesti, setEditingTesti] = useState<Testimonial | null>(null);
  const [isTestiModalOpen, setIsTestiModalOpen] = useState(false);

  // Google Sheets Sync State
  const [sheetsUrlInput, setSheetsUrlInput] = useState(settings.googleSheetsUrl || '');
  const [syncStatus, setSyncStatus] = useState<string>('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [hasCopiedScript, setHasCopiedScript] = useState(false);

  // General Notification
  const [alertNotice, setAlertNotice] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setAlertNotice(msg);
    setTimeout(() => setAlertNotice(null), 4000);
  };

  useEffect(() => {
    const unsub = storage.subscribe(() => {
      setOrders(storage.getOrders());
      setCourses(storage.getCourses());
      setPosts(storage.getPosts());
      setTestimonials(storage.getTestimonials());
      setSettings(storage.getSettings());
      setUsers(storage.getUsers());
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (settings.googleSheetsUrl) {
      setSheetsUrlInput(settings.googleSheetsUrl);
    }
  }, [settings.googleSheetsUrl]);

  // --- ORDER APPROVAL ACTIONS ---
  const handleApproveOrder = (orderId: string) => {
    storage.updateOrderStatus(orderId, 'approved');
    showNotification('Pesanan berhasil disetujui (Approve)! Akses kursus telah aktif untuk peserta.');
  };

  const handleRejectOrder = (orderId: string) => {
    if (confirm('Apakah Anda yakin ingin menolak pesanan ini?')) {
      storage.updateOrderStatus(orderId, 'rejected');
      showNotification('Pesanan telah ditolak.');
    }
  };

  const handleDeleteOrder = (orderId: string) => {
    if (confirm('Hapus pesanan ini dari riwayat?')) {
      storage.deleteOrder(orderId);
      showNotification('Pesanan berhasil dihapus.');
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (orderFilter === 'pending' && o.status !== 'pending') return false;
    if (orderFilter === 'approved' && o.status !== 'approved') return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = o.studentName.toLowerCase().includes(q);
      const matchEmail = o.studentEmail.toLowerCase().includes(q);
      const matchNum = o.orderNumber.toLowerCase().includes(q);
      return matchName || matchEmail || matchNum;
    }
    return true;
  });

  const pendingOrdersCount = orders.filter((o) => o.status === 'pending').length;

  // --- COURSE MANAGEMENT ACTIONS ---
  const handleOpenAddCourse = () => {
    const newCourse: Course = {
      id: 'course_' + Date.now().toString(36),
      title: '',
      arabicTitle: '',
      level: 'Pemula (Mubtadi\')',
      category: 'Nahwu & Shorof',
      price: 199000,
      originalPrice: 350000,
      thumbnail: 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&w=800&q=80',
      shortDescription: '',
      fullDescription: '',
      whatYouWillGet: [
        'Memahami kaidah dasar bahasa Arab secara runtut',
        'Akses modul materi video YouTube terstruktur',
        'Evaluasi pemahaman dengan kuis Google Form',
        'Sertifikat kelulusan resmi Kalaamunaa',
      ],
      instructorName: 'Mudarris Kalaamunaa',
      certificateFormUrl: 'https://docs.google.com/forms/d/e/contoh-sertifikat/viewform',
      lessons: [],
      isFeatured: true,
    };
    setEditingCourse(newCourse);
    setIsCourseModalOpen(true);
  };

  const handleSaveCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse) return;
    if (!editingCourse.title.trim()) {
      alert('Judul kursus wajib diisi.');
      return;
    }
    storage.saveCourse(editingCourse);
    setIsCourseModalOpen(false);
    setEditingCourse(null);
    showNotification('Kursus berhasil disimpan!');
  };

  const handleDeleteCourse = (courseId: string) => {
    if (confirm('Hapus kursus ini beserta seluruh daftar pelajarannya?')) {
      storage.deleteCourse(courseId);
      showNotification('Kursus berhasil dihapus.');
    }
  };

  // --- LESSON MANAGEMENT ACTIONS ---
  const handleOpenAddLesson = (course: Course) => {
    setSelectedCourseForLesson(course);
    const newLesson: Lesson = {
      id: 'lesson_' + Date.now().toString(36),
      courseId: course.id,
      title: `Pelajaran ${course.lessons.length + 1}: `,
      description: '',
      youtubeUrl: 'https://www.youtube.com/watch?v=kYJzXv-K5v0',
      quizUrl: 'https://docs.google.com/forms/d/e/contoh-kuis/viewform',
      duration: '25 Menit',
      order: course.lessons.length + 1,
    };
    setEditingLesson(newLesson);
    setIsLessonModalOpen(true);
  };

  const handleEditLesson = (course: Course, lesson: Lesson) => {
    setSelectedCourseForLesson(course);
    setEditingLesson({ ...lesson });
    setIsLessonModalOpen(true);
  };

  const handleSaveLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLesson || !selectedCourseForLesson) return;

    const updatedLessons = [...selectedCourseForLesson.lessons];
    const existingIndex = updatedLessons.findIndex((l) => l.id === editingLesson.id);

    if (existingIndex >= 0) {
      updatedLessons[existingIndex] = editingLesson;
    } else {
      updatedLessons.push(editingLesson);
    }

    const updatedCourse: Course = {
      ...selectedCourseForLesson,
      lessons: updatedLessons,
    };

    storage.saveCourse(updatedCourse);
    setSelectedCourseForLesson(updatedCourse);
    setIsLessonModalOpen(false);
    setEditingLesson(null);
    showNotification('Pelajaran & Kuis berhasil disimpan!');
  };

  const handleDeleteLesson = (course: Course, lessonId: string) => {
    if (confirm('Hapus pelajaran ini?')) {
      const updatedLessons = course.lessons.filter((l) => l.id !== lessonId);
      const updatedCourse = { ...course, lessons: updatedLessons };
      storage.saveCourse(updatedCourse);
      showNotification('Pelajaran berhasil dihapus.');
    }
  };

  // --- POST MANAGEMENT ACTIONS ---
  const handleOpenAddPost = () => {
    const newPost: Post = {
      id: 'post_' + Date.now().toString(36),
      title: '',
      arabicHeading: '',
      category: 'Tips Belajar',
      excerpt: '',
      content: '',
      imageUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80',
      author: 'Mudarris Kalaamunaa',
      publishedDate: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
    };
    setEditingPost(newPost);
    setIsPostModalOpen(true);
  };

  const handleSavePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost || !editingPost.title.trim()) return;
    storage.savePost(editingPost);
    setIsPostModalOpen(false);
    setEditingPost(null);
    showNotification('Artikel berhasil disimpan!');
  };

  const handleDeletePost = (id: string) => {
    if (confirm('Hapus postingan ini?')) {
      storage.deletePost(id);
      showNotification('Postingan telah dihapus.');
    }
  };

  // --- TESTIMONIAL MANAGEMENT ACTIONS ---
  const handleOpenAddTesti = () => {
    const newTesti: Testimonial = {
      id: 'testi_' + Date.now().toString(36),
      name: '',
      role: 'Alumni Kalaamunaa',
      city: 'Jakarta',
      stars: 5,
      review: '',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      courseName: courses[0]?.title || 'Bahasa Arab',
    };
    setEditingTesti(newTesti);
    setIsTestiModalOpen(true);
  };

  const handleSaveTesti = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTesti || !editingTesti.name.trim()) return;
    storage.saveTestimonial(editingTesti);
    setIsTestiModalOpen(false);
    setEditingTesti(null);
    showNotification('Testimoni berhasil disimpan!');
  };

  const handleDeleteTesti = (id: string) => {
    if (confirm('Hapus testimoni ini?')) {
      storage.deleteTestimonial(id);
      showNotification('Testimoni telah dihapus.');
    }
  };

  // --- SITE TEXT SETTINGS SAVE ---
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    storage.updateSettings(settings);
    showNotification('Teks dan pengaturan landing page berhasil diperbarui!');
  };

  // --- GOOGLE SPREADSHEET SYNC ---
  const handleSaveSheetsUrl = () => {
    storage.updateSettings({ googleSheetsUrl: sheetsUrlInput.trim() });
    showNotification('URL Google Apps Script berhasil disimpan.');
  };

  const handleTestAndPushToSheets = async () => {
    if (!sheetsUrlInput.trim()) {
      alert('Masukkan URL Web App Google Apps Script terlebih dahulu.');
      return;
    }
    setIsSyncing(true);
    setSyncStatus('Mengirim data ke Google Spreadsheet...');
    try {
      const ok = await storage.syncToCloud(sheetsUrlInput.trim());
      if (ok) {
        setSyncStatus('Berhasil! Data kursus, pesanan, dan siswa tersimpan di Google Spreadsheet.');
      } else {
        setSyncStatus('Gagal menyinkronkan. Pastikan Web App disetel ke "Anyone" (Siapa saja).');
      }
    } catch (err: any) {
      setSyncStatus(`Gagal: ${err.message || err}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const handlePullFromSheets = async () => {
    if (!sheetsUrlInput.trim()) {
      alert('Masukkan URL Web App Google Apps Script terlebih dahulu.');
      return;
    }
    setIsSyncing(true);
    setSyncStatus('Mengambil data dari Google Spreadsheet...');
    try {
      const ok = await storage.syncFromCloud(sheetsUrlInput.trim());
      if (ok) {
        setSyncStatus('Berhasil! Seluruh data lokal disinkronkan dari Google Spreadsheet.');
      } else {
        setSyncStatus('Data Google Spreadsheet masih kosong atau belum diformat.');
      }
    } catch (err: any) {
      setSyncStatus(`Gagal: ${err.message || err}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const copyScriptToClipboard = () => {
    navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_TEMPLATE);
    setHasCopiedScript(true);
    setTimeout(() => setHasCopiedScript(false), 3000);
  };

  // JSON Export / Import
  const handleExportJson = () => {
    const bundle = storage.getAllDataBundle();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(bundle, null, 2));
    const a = document.createElement('a');
    a.setAttribute('href', dataStr);
    a.setAttribute('download', `backup_kalaamunaa_${new Date().toISOString().slice(0, 10)}.json`);
    a.click();
  };

  const handleImportJsonFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        const ok = storage.importDataBundle(json);
        if (ok) {
          showNotification('Data cadangan berhasil dipulihkan!');
        } else {
          alert('Format file cadangan tidak valid.');
        }
      } catch (err) {
        alert('Gagal membaca file JSON.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Alert Notice Toast */}
      {alertNotice && (
        <div className="fixed top-24 right-6 z-50 bg-[#0047AB] text-white px-5 py-3 rounded-2xl shadow-2xl border border-blue-300 flex items-center gap-2.5 text-xs font-bold animate-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{alertNotice}</span>
        </div>
      )}

      {/* Admin Header Bar */}
      <div className="bg-gradient-to-r from-slate-950 via-[#003380] to-[#0047AB] rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-slate-950 flex items-center gap-1.5 shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Pusat Kendali Mudarris & Admin</span>
            </span>
            <span className="text-xs text-blue-200 hidden sm:inline">
              Username: <b>{currentUser.name}</b>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Dasbor Pengajar Kalaamunaa
          </h1>
          <p className="text-xs text-blue-100 max-w-xl">
            Kelola persetujuan pesanan, tambah modul video YouTube, kuis Google Form, sertifikat kelulusan, dan sinkronisasi Google Spreadsheet.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onNavigateHome}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-colors"
          >
            Lihat Web Utama
          </button>
          <button
            onClick={handleExportJson}
            className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>Cadangkan Data (JSON)</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex overflow-x-auto gap-2 pb-2 border-b border-slate-200 text-xs font-bold">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-3 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'orders'
              ? 'bg-[#0047AB] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Persetujuan Pesanan</span>
          {pendingOrdersCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-extrabold flex items-center justify-center animate-pulse">
              {pendingOrdersCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('courses')}
          className={`px-4 py-3 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'courses'
              ? 'bg-[#0047AB] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Kelola Kursus & Pelajaran ({courses.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('posts')}
          className={`px-4 py-3 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'posts'
              ? 'bg-[#0047AB] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Kelola Postingan & Tips ({posts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('testimonials')}
          className={`px-4 py-3 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'testimonials'
              ? 'bg-[#0047AB] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <MessageSquareQuote className="w-4 h-4" />
          <span>Kelola Testimoni ({testimonials.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('site-text')}
          className={`px-4 py-3 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'site-text'
              ? 'bg-[#0047AB] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <SettingsIcon className="w-4 h-4" />
          <span>Kustomisasi Teks Landing Page</span>
        </button>

        <button
          onClick={() => setActiveTab('sheets')}
          className={`px-4 py-3 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'sheets'
              ? 'bg-[#0047AB] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Database className="w-4 h-4 text-emerald-600" />
          <span>Database Google Spreadsheet</span>
        </button>
      </div>

      {/* ============================================================== */}
      {/* TAB 1: PERSETUJUAN PESANAN (ORDER APPROVALS) */}
      {/* ============================================================== */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => setOrderFilter('pending')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  orderFilter === 'pending'
                    ? 'bg-amber-400 text-slate-950'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Menunggu Approval ({pendingOrdersCount})
              </button>
              <button
                onClick={() => setOrderFilter('approved')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  orderFilter === 'approved'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Disetujui ({orders.filter((o) => o.status === 'approved').length})
              </button>
              <button
                onClick={() => setOrderFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  orderFilter === 'all'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Semua ({orders.length})
              </button>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Cari siswa atau nomor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-[#0047AB]"
              />
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            {filteredOrders.length === 0 ? (
              <div className="text-center py-16 text-slate-500 space-y-2">
                <ShoppingBag className="w-10 h-10 mx-auto opacity-30" />
                <p className="text-xs">Tidak ada pesanan pada kategori ini.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                    <tr>
                      <th className="py-3.5 px-4">Nomor Order</th>
                      <th className="py-3.5 px-4">Nama & Email Siswa</th>
                      <th className="py-3.5 px-4">Paket Kursus yang Dipesan</th>
                      <th className="py-3.5 px-4">Total Biaya</th>
                      <th className="py-3.5 px-4">Tanggal Masuk</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Aksi Persetujuan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {filteredOrders.map((order) => {
                      const isPending = order.status === 'pending';

                      return (
                        <tr key={order.id} className={isPending ? 'bg-amber-50/40 hover:bg-amber-50/80' : 'hover:bg-slate-50/60'}>
                          <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                            {order.orderNumber}
                          </td>
                          <td className="py-3.5 px-4">
                            <div>
                              <p className="font-bold text-slate-900">{order.studentName}</p>
                              <p className="text-[11px] text-slate-500">{order.studentEmail}</p>
                              {order.studentPhone && (
                                <a
                                  href={`https://wa.me/${order.studentPhone.replace(/\D/g, '')}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[10px] text-emerald-600 hover:underline flex items-center gap-1 mt-0.5"
                                >
                                  <Send className="w-3 h-3" />
                                  <span>{order.studentPhone}</span>
                                </a>
                              )}
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="max-w-xs space-y-1">
                              {order.items.map((it, idx) => (
                                <div key={idx} className="flex items-center gap-1.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#0047AB]" />
                                  <span className="font-semibold text-slate-800 truncate">{it.courseTitle}</span>
                                </div>
                              ))}
                            </div>
                          </td>
                          <td className="py-3.5 px-4 font-extrabold text-[#0047AB]">
                            {formatRupiah(order.totalPrice)}
                          </td>
                          <td className="py-3.5 px-4 text-slate-500">
                            {formatDateIndo(order.createdAt)}
                          </td>
                          <td className="py-3.5 px-4">
                            {order.status === 'approved' ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                Disetujui
                              </span>
                            ) : order.status === 'pending' ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-200 text-amber-900">
                                <Clock className="w-3 h-3 text-amber-700" />
                                Menunggu Approval
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-100 text-red-800">
                                Ditolak
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {isPending ? (
                                <>
                                  <button
                                    onClick={() => handleApproveOrder(order.id)}
                                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs shadow-xs transition-colors flex items-center gap-1"
                                    title="Setujui dan berikan akses materi kelas"
                                  >
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    <span>Approve</span>
                                  </button>
                                  <button
                                    onClick={() => handleRejectOrder(order.id)}
                                    className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                                    title="Tolak pesanan"
                                  >
                                    <XCircle className="w-4 h-4" />
                                  </button>
                                </>
                              ) : (
                                <button
                                  onClick={() => handleDeleteOrder(order.id)}
                                  className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                                  title="Hapus riwayat pesanan"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: KELOLA KURSUS & PELAJARAN (COURSES & LESSONS) */}
      {/* ============================================================== */}
      {activeTab === 'courses' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Daftar Kursus Bahasa Arab Kalaamunaa
              </h2>
              <p className="text-xs text-slate-500">
                Tambah kursus baru, atur video YouTube tiap pelajaran, kuis Google Form, dan sertifikat.
              </p>
            </div>
            <button
              onClick={handleOpenAddCourse}
              className="px-4 py-2.5 bg-[#0047AB] hover:bg-[#003380] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Kursus Baru</span>
            </button>
          </div>

          {/* Courses Cards */}
          <div className="space-y-6">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden"
              >
                {/* Course Header Bar */}
                <div className="p-6 bg-slate-50/70 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-20 h-20 rounded-2xl object-cover border border-slate-200 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-[#0047AB] bg-blue-100 px-2 py-0.5 rounded-md">
                          {course.level}
                        </span>
                        <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                          {course.category}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 mt-1">
                        {course.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5 font-arabic text-blue-700">
                        {course.arabicTitle}
                      </p>
                      <p className="text-xs font-extrabold text-[#0047AB] mt-1">
                        Harga: {formatRupiah(course.price)} • {course.lessons.length} Pelajaran
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => onPreviewCourse(course.id)}
                      className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Ruang Belajar</span>
                    </button>
                    <button
                      onClick={() => {
                        setEditingCourse({ ...course });
                        setIsCourseModalOpen(true);
                      }}
                      className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-[#0047AB] rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
                    >
                      <Edit3 className="w-4 h-4" />
                      <span>Edit Kursus</span>
                    </button>
                    <button
                      onClick={() => handleDeleteCourse(course.id)}
                      className="p-2 text-slate-400 hover:text-red-600 rounded-xl hover:bg-red-50 transition-colors"
                      title="Hapus kursus"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Lessons Section for this course */}
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                        <Youtube className="w-4 h-4 text-red-600" />
                        <span>Daftar Video Pelajaran & Kuis Google Form</span>
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Siswa harus klik "Saya Sudah Menonton" lalu "Saya Sudah Kerjakan Kuis" untuk lanjut.
                      </p>
                    </div>

                    <button
                      onClick={() => handleOpenAddLesson(course)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Tambah Pelajaran</span>
                    </button>
                  </div>

                  {course.lessons.length === 0 ? (
                    <div className="p-4 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center text-xs text-slate-500">
                      Belum ada pelajaran pada kursus ini. Klik "Tambah Pelajaran" untuk memasukkan video YouTube & link Google Form.
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
                      {course.lessons.map((lesson, idx) => (
                        <div key={lesson.id} className="p-3.5 bg-white hover:bg-slate-50/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <span className="w-6 h-6 rounded-full bg-[#0047AB] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            <div className="min-w-0">
                              <h5 className="text-xs font-bold text-slate-900 truncate">
                                {lesson.title}
                              </h5>
                              <div className="flex flex-wrap items-center gap-3 mt-1 text-[11px] text-slate-500">
                                <a
                                  href={lesson.youtubeUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-red-600 hover:underline flex items-center gap-1"
                                >
                                  <Youtube className="w-3 h-3" />
                                  <span>Video YouTube</span>
                                </a>
                                <span>•</span>
                                <a
                                  href={lesson.quizUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-amber-700 hover:underline flex items-center gap-1"
                                >
                                  <FileQuestion className="w-3 h-3" />
                                  <span>Kuis G-Form</span>
                                </a>
                                {lesson.duration && (
                                  <>
                                    <span>•</span>
                                    <span>{lesson.duration}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                            <button
                              onClick={() => handleEditLesson(course, lesson)}
                              className="p-1.5 text-slate-500 hover:text-[#0047AB] rounded-lg hover:bg-blue-50"
                              title="Edit link video/kuis"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteLesson(course, lesson.id)}
                              className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                              title="Hapus pelajaran"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Certificate Link Setting for this course */}
                  <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-amber-700 shrink-0" />
                      <div>
                        <span className="font-bold text-amber-900">Link Google Form Sertifikat:</span>{' '}
                        <span className="text-slate-600 truncate max-w-sm inline-block font-mono text-[11px]">
                          {course.certificateFormUrl || 'Belum diatur'}
                        </span>
                      </div>
                    </div>
                    {course.certificateFormUrl && (
                      <a
                        href={course.certificateFormUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-amber-800 hover:underline font-bold text-[11px] flex items-center gap-1"
                      >
                        <span>Uji Link</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: KELOLA POSTINGAN & TIPS */}
      {/* ============================================================== */}
      {activeTab === 'posts' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Kelola Postingan & Artikel Edukatif
              </h2>
              <p className="text-xs text-slate-500">
                Artikel kaidah Nahwu/Shorof, tips mufradat, dan info kegiatan tampil di landing page.
              </p>
            </div>
            <button
              onClick={handleOpenAddPost}
              className="px-4 py-2.5 bg-[#0047AB] hover:bg-[#003380] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Tulis Postingan Baru</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden flex flex-col"
              >
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="h-36 w-full object-cover"
                />
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                      {post.category}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 line-clamp-2 mt-1">
                      {post.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">
                      {post.excerpt}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span>{post.publishedDate}</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setEditingPost({ ...post });
                          setIsPostModalOpen(true);
                        }}
                        className="p-1 text-slate-500 hover:text-[#0047AB]"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="p-1 text-slate-400 hover:text-red-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 4: KELOLA TESTIMONI */}
      {/* ============================================================== */}
      {activeTab === 'testimonials' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Kelola Testimoni Peserta
              </h2>
              <p className="text-xs text-slate-500">
                Atur ulasan siswa, jumlah bintang, nama dan profesi yang tampil di landing page.
              </p>
            </div>
            <button
              onClick={handleOpenAddTesti}
              className="px-4 py-2.5 bg-[#0047AB] hover:bg-[#003380] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Testimoni</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {testimonials.map((testi) => (
              <div
                key={testi.id}
                className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: testi.stars }).map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>
                  <p className="text-xs text-slate-600 italic line-clamp-4 leading-relaxed">
                    "{testi.review}"
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={testi.avatarUrl}
                      alt={testi.name}
                      className="w-9 h-9 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-900">{testi.name}</p>
                      <p className="text-[10px] text-slate-500">{testi.role}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setEditingTesti({ ...testi });
                        setIsTestiModalOpen(true);
                      }}
                      className="p-1 text-slate-500 hover:text-[#0047AB]"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteTesti(testi.id)}
                      className="p-1 text-slate-400 hover:text-red-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 5: KUSTOMISASI TEKS & LANDING PAGE */}
      {/* ============================================================== */}
      {activeTab === 'site-text' && (
        <form onSubmit={handleSaveSettings} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-bold text-slate-900">
              Kustomisasi Teks & Informasi Kontak Kalaamunaa
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Admin dapat mengubah seluruh teks judul, subjudul, kutipan hadits, nomor WhatsApp, dan link media sosial secara langsung.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nama Aplikasi / Brand
              </label>
              <input
                type="text"
                value={settings.appName}
                onChange={(e) => setSettings({ ...settings, appName: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Subjudul Tulisan Arab
              </label>
              <input
                type="text"
                value={settings.arabicSubtitle}
                onChange={(e) => setSettings({ ...settings, arabicSubtitle: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-arabic text-sm text-right"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nomor WhatsApp Admin (Checkout otomatis & Bantuan)
              </label>
              <input
                type="text"
                value={settings.whatsappNumber}
                onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                placeholder="6282311776535"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Email Resmi Kalaamunaa
              </label>
              <input
                type="email"
                value={settings.adminEmail}
                onChange={(e) => setSettings({ ...settings, adminEmail: e.target.value })}
                placeholder="kalaamunaa.arabiclearning@gmail.com"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Username Instagram
              </label>
              <input
                type="text"
                value={settings.instagramUsername}
                onChange={(e) => setSettings({ ...settings, instagramUsername: e.target.value })}
                placeholder="kalaamunaa.arabic"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Handle YouTube Channel
              </label>
              <input
                type="text"
                value={settings.youtubeHandle}
                onChange={(e) => setSettings({ ...settings, youtubeHandle: e.target.value })}
                placeholder="@kalaamunaa.arabic"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
              />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Badge Headline Hero Banner
              </label>
              <input
                type="text"
                value={settings.heroBadge}
                onChange={(e) => setSettings({ ...settings, heroBadge: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Judul Utama Hero
                </label>
                <input
                  type="text"
                  value={settings.heroTitle}
                  onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Highlight Judul (Warna Emas/Biru)
                </label>
                <input
                  type="text"
                  value={settings.heroHighlight}
                  onChange={(e) => setSettings({ ...settings, heroHighlight: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Deskripsi Lengkap Hero Banner
              </label>
              <textarea
                rows={3}
                value={settings.heroDescription}
                onChange={(e) => setSettings({ ...settings, heroDescription: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tentang Kalaamunaa (About Us)
              </label>
              <textarea
                rows={4}
                value={settings.aboutContent}
                onChange={(e) => setSettings({ ...settings, aboutContent: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            {/* SECTION PRATINJAU KELAS (VIDEO YOUTUBE UJI COBA) */}
            <div className="p-5 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-4">
              <div className="flex items-center gap-2 text-[#0047AB]">
                <Youtube className="w-5 h-5 text-red-600" />
                <h3 className="text-xs font-extrabold uppercase tracking-wider">
                  Pengaturan Section "Pratinjau Kelas" (Uji Coba Kelas YouTube)
                </h3>
              </div>
              <p className="text-[11px] text-slate-600">
                Bagian ini tampil sebelum section "Tentang Kami". Pengguna dapat langsung memutar video YouTube uji coba yang Anda tentukan di sini tanpa harus mendaftar terlebih dahulu.
              </p>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Youtube className="w-4 h-4 text-red-600" />
                  <span>Link Video YouTube Pratinjau Kelas</span>
                </label>
                <input
                  type="url"
                  value={settings.previewYoutubeUrl || ''}
                  onChange={(e) => setSettings({ ...settings, previewYoutubeUrl: e.target.value })}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono bg-white"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  Mendukung URL biasa, shorts, atau embed YouTube (contoh: https://www.youtube.com/watch?v=...).
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Judul Section Pratinjau
                  </label>
                  <input
                    type="text"
                    value={settings.previewTitle || ''}
                    onChange={(e) => setSettings({ ...settings, previewTitle: e.target.value })}
                    placeholder="Pratinjau Kelas: Rasakan Metode Belajarnya Langsung"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Badge / Label Kecil
                  </label>
                  <input
                    type="text"
                    value={settings.previewBadge || ''}
                    onChange={(e) => setSettings({ ...settings, previewBadge: e.target.value })}
                    placeholder="Uji Coba Kelas Gratis"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Subjudul Bahasa Arab
                  </label>
                  <input
                    type="text"
                    value={settings.previewArabicSubtitle || ''}
                    onChange={(e) => setSettings({ ...settings, previewArabicSubtitle: e.target.value })}
                    placeholder="دَرْسٌ تَجْرِيبِيٌّ لِتَعْلِيمِ اللُّغَةِ الْعَرَبِيَّةِ"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-arabic text-sm text-right bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Deskripsi Ringkas Video
                  </label>
                  <input
                    type="text"
                    value={settings.previewDescription || ''}
                    onChange={(e) => setSettings({ ...settings, previewDescription: e.target.value })}
                    placeholder="Tonton langsung cuplikan metode pembelajaran bahasa Arab..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Poin Pembahasan Kelas (Pisahkan Setiap Baris)
                </label>
                <textarea
                  rows={3}
                  value={(settings.previewKeyPoints || []).join('\n')}
                  onChange={(e) => setSettings({ ...settings, previewKeyPoints: e.target.value.split('\n').filter(Boolean) })}
                  placeholder="Metode bertahap dari nol&#10;Contoh aplikatif dalam ayat Al-Qur'an&#10;Bimbingan makharijul huruf yang fasih"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 bg-[#0047AB] hover:bg-[#003380] text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Perubahan Teks</span>
            </button>
          </div>
        </form>
      )}

      {/* ============================================================== */}
      {/* TAB 6: DATABASE GOOGLE SPREADSHEET */}
      {/* ============================================================== */}
      {activeTab === 'sheets' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-emerald-600" />
              <h2 className="text-base font-bold text-slate-900">
                Integrasi Database Real-time Google Spreadsheet
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Menyimpan seluruh database peserta, riwayat login, status pesanan, kustomisasi admin, dan progres kuis secara real-time ke akun Google Spreadsheet Anda.
            </p>
          </div>

          {/* Sync Status Banner */}
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Status Database: {settings.googleSheetsUrl ? 'Terkoneksi ke Google Sheets' : 'Penyimpanan Lokal Aktif (Siap Dihubungkan ke Sheets)'}
              </span>
              <span className="text-[11px] bg-emerald-200/80 px-2.5 py-0.5 rounded-full font-bold">
                {users.length} Siswa • {orders.length} Pesanan
              </span>
            </div>
            {syncStatus && (
              <p className="font-mono text-[11px] bg-white p-2 rounded-lg border border-emerald-300">
                {syncStatus}
              </p>
            )}
          </div>

          {/* Web App URL Input */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">
              URL Web App Google Apps Script (Berakhiran /exec)
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="url"
                value={sheetsUrlInput}
                onChange={(e) => setSheetsUrlInput(e.target.value)}
                placeholder="https://script.google.com/macros/s/.../exec"
                className="flex-1 px-3 py-2.5 border border-slate-200 rounded-xl text-xs font-mono"
              />
              <button
                type="button"
                onClick={handleSaveSheetsUrl}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl"
              >
                Simpan URL
              </button>
            </div>
          </div>

          {/* Sync Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={handleTestAndPushToSheets}
              disabled={isSyncing}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>Kirim & Sinkronkan Seluruh Data ke Google Sheet</span>
            </button>

            <button
              onClick={handlePullFromSheets}
              disabled={isSyncing}
              className="px-5 py-2.5 bg-blue-50 hover:bg-blue-100 text-[#0047AB] border border-blue-200 font-bold text-xs rounded-xl transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Tarik Data Terbaru dari Google Sheet</span>
            </button>
          </div>

          {/* Step-by-step Setup Guide */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-900">
                Panduan Cepat Menghubungkan Google Spreadsheet:
              </h4>
              <button
                onClick={copyScriptToClipboard}
                className="px-3 py-1.5 bg-[#0047AB] text-white rounded-lg font-bold text-[11px] flex items-center gap-1.5 shadow-xs"
              >
                {hasCopiedScript ? <Check className="w-3.5 h-3.5 text-amber-300" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{hasCopiedScript ? 'Tersalin!' : 'Salin Kode Script'}</span>
              </button>
            </div>

            <ol className="list-decimal list-inside space-y-1.5 text-slate-600 pl-1 leading-relaxed">
              <li>Buat Google Spreadsheet baru di Google Drive Anda (Beri judul: <b>Database Kalaamunaa</b>).</li>
              <li>Klik menu <b>Ekstensi (Extensions)</b> &gt; <b>Apps Script</b>.</li>
              <li>Hapus teks bawaan, lalu klik tombol <b>Salin Kode Script</b> di atas dan tempel (paste).</li>
              <li>Klik tombol <b>Terapkan (Deploy)</b> &gt; <b>Penerapan Baru (New deployment)</b>.</li>
              <li>Pilih jenis <b>Aplikasi Web (Web App)</b>, atur <b>Akses: Siapa Saja (Anyone)</b>.</li>
              <li>Salin URL Web App yang berakhiran <code>/exec</code> lalu tempel pada kolom di atas!</li>
            </ol>
          </div>

          {/* JSON Backup & Restore Fallback */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-xs font-bold text-slate-800">Cadangan Manual (JSON):</h4>
              <p className="text-[11px] text-slate-500">Unduh atau pulihkan file database mandiri kapan saja.</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportJson}
                className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-semibold flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh JSON</span>
              </button>
              <label className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5" />
                <span>Pulihkan JSON</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportJsonFile}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: EDIT / ADD COURSE */}
      {/* ============================================================== */}
      {isCourseModalOpen && editingCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto space-y-4 border border-slate-200 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {editingCourse.title ? 'Edit Data Kursus' : 'Tambah Paket Kursus Baru'}
              </h3>
              <button onClick={() => setIsCourseModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCourse} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Judul Kursus</label>
                <input
                  type="text"
                  required
                  value={editingCourse.title}
                  onChange={(e) => setEditingCourse({ ...editingCourse, title: e.target.value })}
                  placeholder="Contoh: Nahwu Kilat & Praktis untuk Pemula"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Judul Huruf Arab</label>
                <input
                  type="text"
                  value={editingCourse.arabicTitle || ''}
                  onChange={(e) => setEditingCourse({ ...editingCourse, arabicTitle: e.target.value })}
                  placeholder="النَّحْوُ الْوَاضِحُ"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-arabic text-sm text-right"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tingkatan Level</label>
                  <select
                    value={editingCourse.level}
                    onChange={(e: any) => setEditingCourse({ ...editingCourse, level: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  >
                    <option value="Pemula (Mubtadi')">Pemula (Mubtadi')</option>
                    <option value="Menengah (Mutawassith)">Menengah (Mutawassith)</option>
                    <option value="Mahir (Mutaqaddim)">Mahir (Mutaqaddim)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kategori Kursus</label>
                  <input
                    type="text"
                    required
                    value={editingCourse.category || ''}
                    onChange={(e) => setEditingCourse({ ...editingCourse, category: e.target.value })}
                    placeholder="Ketik kategori kursus (misal: Nahwu & Shorof, Percakapan, dll)"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Harga Kursus (Rp)</label>
                  <input
                    type="number"
                    required
                    value={editingCourse.price}
                    onChange={(e) => setEditingCourse({ ...editingCourse, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Harga Coret / Asli (Rp)</label>
                  <input
                    type="number"
                    value={editingCourse.originalPrice || 0}
                    onChange={(e) => setEditingCourse({ ...editingCourse, originalPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">URL Gambar Sampul / Thumbnail</label>
                <input
                  type="url"
                  value={editingCourse.thumbnail}
                  onChange={(e) => setEditingCourse({ ...editingCourse, thumbnail: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Ringkasan Singkat</label>
                <input
                  type="text"
                  value={editingCourse.shortDescription}
                  onChange={(e) => setEditingCourse({ ...editingCourse, shortDescription: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Deskripsi Lengkap</label>
                <textarea
                  rows={3}
                  value={editingCourse.fullDescription}
                  onChange={(e) => setEditingCourse({ ...editingCourse, fullDescription: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Apa yang Akan Didapatkan Siswa (Pisahkan Tiap Baris)
                </label>
                <textarea
                  rows={3}
                  value={editingCourse.whatYouWillGet.join('\n')}
                  onChange={(e) => setEditingCourse({ ...editingCourse, whatYouWillGet: e.target.value.split('\n').filter(Boolean) })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Link Google Form Pengajuan Sertifikat Kursus Ini
                </label>
                <input
                  type="url"
                  value={editingCourse.certificateFormUrl}
                  onChange={(e) => setEditingCourse({ ...editingCourse, certificateFormUrl: e.target.value })}
                  placeholder="https://docs.google.com/forms/d/..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono text-[11px]"
                />
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCourseModalOpen(false)}
                  className="px-4 py-2 border rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0047AB] text-white font-bold rounded-xl"
                >
                  Simpan Kursus
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: EDIT / ADD LESSON (VIDEO YOUTUBE & KUIS G-FORM) */}
      {/* ============================================================== */}
      {isLessonModalOpen && editingLesson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 border border-slate-200 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Pengaturan Pelajaran, Video & Kuis
              </h3>
              <button onClick={() => setIsLessonModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveLesson} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Judul Materi Pelajaran</label>
                <input
                  type="text"
                  required
                  value={editingLesson.title}
                  onChange={(e) => setEditingLesson({ ...editingLesson, title: e.target.value })}
                  placeholder="Pelajaran 1: Pembagian Kata (Isim, Fi'il, Harf)"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Youtube className="w-4 h-4 text-red-600" />
                  <span>Link Video YouTube</span>
                </label>
                <input
                  type="url"
                  required
                  value={editingLesson.youtubeUrl}
                  onChange={(e) => setEditingLesson({ ...editingLesson, youtubeUrl: e.target.value })}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono text-[11px]"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  Masukkan link youtube biasa, shorts, atau embed. Sistem otomatis menampilkan videonya di pemutar web.
                </p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <FileQuestion className="w-4 h-4 text-amber-600" />
                  <span>Link Kuis Google Form</span>
                </label>
                <input
                  type="url"
                  required
                  value={editingLesson.quizUrl}
                  onChange={(e) => setEditingLesson({ ...editingLesson, quizUrl: e.target.value })}
                  placeholder="https://docs.google.com/forms/d/..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono text-[11px]"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  Kuis akan terbuka setelah peserta menekan tombol "Saya Sudah Menonton".
                </p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Durasi / Estimasi Waktu</label>
                <input
                  type="text"
                  value={editingLesson.duration || ''}
                  onChange={(e) => setEditingLesson({ ...editingLesson, duration: e.target.value })}
                  placeholder="Contoh: 25 Menit"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Catatan Tambahan untuk Siswa</label>
                <textarea
                  rows={2}
                  value={editingLesson.description}
                  onChange={(e) => setEditingLesson({ ...editingLesson, description: e.target.value })}
                  placeholder="Poin penting atau ringkasan kaidah..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsLessonModalOpen(false)}
                  className="px-4 py-2 border rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0047AB] text-white font-bold rounded-xl"
                >
                  Simpan Pelajaran
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: POST EDIT */}
      {/* ============================================================== */}
      {isPostModalOpen && editingPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-4 border border-slate-200 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {editingPost.title ? 'Edit Postingan' : 'Tulis Postingan Baru'}
              </h3>
              <button onClick={() => setIsPostModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePost} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Judul Artikel</label>
                <input
                  type="text"
                  required
                  value={editingPost.title}
                  onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Kategori</label>
                <input
                  type="text"
                  value={editingPost.category}
                  onChange={(e) => setEditingPost({ ...editingPost, category: e.target.value })}
                  placeholder="Tips Belajar / Nahwu / Wawasan"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">URL Gambar Sampul</label>
                <input
                  type="url"
                  value={editingPost.imageUrl}
                  onChange={(e) => setEditingPost({ ...editingPost, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Ringkasan / Excerpt</label>
                <textarea
                  rows={2}
                  value={editingPost.excerpt}
                  onChange={(e) => setEditingPost({ ...editingPost, excerpt: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Isi Lengkap Artikel</label>
                <textarea
                  rows={6}
                  value={editingPost.content}
                  onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>
              <div className="pt-3 border-t flex justify-end gap-2">
                <button type="button" onClick={() => setIsPostModalOpen(false)} className="px-4 py-2 border rounded-xl">
                  Batal
                </button>
                <button type="submit" className="px-5 py-2 bg-[#0047AB] text-white font-bold rounded-xl">
                  Simpan Postingan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: TESTIMONIAL EDIT */}
      {/* ============================================================== */}
      {isTestiModalOpen && editingTesti && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {editingTesti.name ? 'Edit Testimoni' : 'Tambah Testimoni'}
              </h3>
              <button onClick={() => setIsTestiModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTesti} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Siswa</label>
                <input
                  type="text"
                  required
                  value={editingTesti.name}
                  onChange={(e) => setEditingTesti({ ...editingTesti, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Profesi / Peran</label>
                  <input
                    type="text"
                    value={editingTesti.role}
                    onChange={(e) => setEditingTesti({ ...editingTesti, role: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Jumlah Bintang (1-5)</label>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={editingTesti.stars}
                    onChange={(e) => setEditingTesti({ ...editingTesti, stars: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Kalimat Ulasan / Testimoni</label>
                <textarea
                  rows={4}
                  required
                  value={editingTesti.review}
                  onChange={(e) => setEditingTesti({ ...editingTesti, review: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Foto Profil / Avatar URL</label>
                <input
                  type="url"
                  value={editingTesti.avatarUrl}
                  onChange={(e) => setEditingTesti({ ...editingTesti, avatarUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>
              <div className="pt-3 border-t flex justify-end gap-2">
                <button type="button" onClick={() => setIsTestiModalOpen(false)} className="px-4 py-2 border rounded-xl">
                  Batal
                </button>
                <button type="submit" className="px-5 py-2 bg-[#0047AB] text-white font-bold rounded-xl">
                  Simpan Testimoni
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
