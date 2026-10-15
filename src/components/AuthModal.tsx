import React, { useState } from 'react';
import { 
  X, 
  User as UserIcon, 
  Lock, 
  Mail, 
  Phone, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles,
  AlertCircle,
  CheckCircle2,
  KeyRound
} from 'lucide-react';
import { storage, TEACHER_CREDENTIALS } from '../services/storage';
import { User } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  initialTab?: 'student-login' | 'student-register' | 'teacher-login';
  onClose: () => void;
  onSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialTab = 'student-login',
  onClose,
  onSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<'student-login' | 'student-register' | 'teacher-login'>(initialTab);
  
  // Student Login fields
  const [studentEmail, setStudentEmail] = useState('');
  const [studentPassword, setStudentPassword] = useState('');

  // Student Register fields
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPhone, setRegPhone] = useState('');

  // Teacher Login fields
  const [teacherUsername, setTeacherUsername] = useState('Mudarris Kalaamunaa');
  const [teacherPassword, setTeacherPassword] = useState('KaLaAmUnAa123');

  // Status message
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleStudentLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!studentEmail.trim() || !studentPassword) {
      setErrorMessage('Harap isi email dan password.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await storage.loginStudentAsync(studentEmail, studentPassword);
      if (result.success && result.user) {
        setSuccessMessage('Login berhasil! Mengalihkan...');
        setTimeout(() => {
          onSuccess(result.user!);
          onClose();
        }, 500);
      } else {
        setErrorMessage(result.message);
      }
    } catch {
      setErrorMessage('Terjadi kendala koneksi database cloud.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStudentRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!regName.trim() || !regEmail.trim() || !regPassword) {
      setErrorMessage('Nama lengkap, email, dan password wajib diisi.');
      return;
    }

    if (regPassword.length < 6) {
      setErrorMessage('Password minimal 6 karakter.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await storage.registerStudentAsync(regName, regEmail, regPassword, regPhone);
      if (result.success && result.user) {
        setSuccessMessage('Pendaftaran berhasil! Akun Anda siap digunakan.');
        setTimeout(() => {
          onSuccess(result.user!);
          onClose();
        }, 600);
      } else {
        setErrorMessage(result.message);
      }
    } catch {
      setErrorMessage('Terjadi kendala koneksi database cloud.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTeacherLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const result = storage.loginTeacher(teacherUsername, teacherPassword);
    if (result.success && result.user) {
      setSuccessMessage('Ahlan wa Sahlan, Mudarris Kalaamunaa!');
      setTimeout(() => {
        onSuccess(result.user!);
        onClose();
      }, 600);
    } else {
      setErrorMessage(result.message);
    }
  };

  const fillTeacherDefault = () => {
    setTeacherUsername(TEACHER_CREDENTIALS.username);
    setTeacherPassword(TEACHER_CREDENTIALS.password);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-[#0047AB] px-6 pt-6 pb-5 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-blue-200 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1">
            <span className="font-arabic text-xl font-bold">كَلَامُنَا</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-700/60 text-blue-100 font-semibold border border-blue-400/30">
              For Arabic Learning
            </span>
          </div>
          <h2 className="text-xl font-bold tracking-tight">
            {activeTab === 'student-login' && 'Masuk Sebagai Peserta'}
            {activeTab === 'student-register' && 'Daftar Akun Peserta Baru'}
            {activeTab === 'teacher-login' && 'Portal Masuk Guru / Mudarris'}
          </h2>
          <p className="text-xs text-blue-100 mt-1">
            {activeTab === 'teacher-login' 
              ? 'Khusus pengajar dan admin pengelola kurikulum Kalaamunaa'
              : 'Akses kelas video bahasa Arab, evaluasi kuis, dan sertifikat resmi'}
          </p>

          {/* Navigation Tabs */}
          <div className="flex bg-blue-900/60 p-1 rounded-xl mt-5 text-xs font-semibold">
            <button
              onClick={() => { setActiveTab('student-login'); setErrorMessage(''); setSuccessMessage(''); }}
              className={`flex-1 py-2 rounded-lg transition-all ${
                activeTab === 'student-login' 
                  ? 'bg-white text-[#0047AB] shadow-xs' 
                  : 'text-blue-100 hover:text-white'
              }`}
            >
              Masuk
            </button>
            <button
              onClick={() => { setActiveTab('student-register'); setErrorMessage(''); setSuccessMessage(''); }}
              className={`flex-1 py-2 rounded-lg transition-all ${
                activeTab === 'student-register' 
                  ? 'bg-white text-[#0047AB] shadow-xs' 
                  : 'text-blue-100 hover:text-white'
              }`}
            >
              Daftar
            </button>
            <button
              onClick={() => { setActiveTab('teacher-login'); setErrorMessage(''); setSuccessMessage(''); }}
              className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1 ${
                activeTab === 'teacher-login' 
                  ? 'bg-amber-400 text-slate-900 shadow-xs font-bold' 
                  : 'text-amber-200 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Guru</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {/* Messages */}
          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* TAB 1: Student Login */}
          {activeTab === 'student-login' && (
            <form onSubmit={handleStudentLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Alamat Email Peserta
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={studentEmail}
                    onChange={(e) => setStudentEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#0047AB] focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Kata Sandi (Password)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    value={studentPassword}
                    onChange={(e) => setStudentPassword(e.target.value)}
                    placeholder="Masukkan kata sandi..."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#0047AB] focus:bg-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-[#0047AB] hover:bg-[#003380] disabled:opacity-60 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm mt-2"
              >
                {isLoading ? (
                  <span>Memeriksa akun di database cloud...</span>
                ) : (
                  <>
                    <span>Masuk ke Kelas</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <p className="text-xs text-slate-500">
                  Belum punya akun?{' '}
                  <button
                    type="button"
                    onClick={() => setActiveTab('student-register')}
                    className="text-[#0047AB] font-bold hover:underline"
                  >
                    Daftar di sini
                  </button>
                </p>
              </div>
            </form>
          )}

          {/* TAB 2: Student Register */}
          {activeTab === 'student-register' && (
            <form onSubmit={handleStudentRegister} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Lengkap
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Contoh: Muhammad Abdullah"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#0047AB] focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Alamat Email (Digunakan untuk Login)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="email.aktif@gmail.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#0047AB] focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Kata Sandi (Password)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Minimal 6 karakter..."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#0047AB] focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nomor WhatsApp Aktif (Opsional untuk Konfirmasi)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="Contoh: 082311776535"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#0047AB] focus:bg-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-[#0047AB] hover:bg-[#003380] disabled:opacity-60 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm mt-3"
              >
                {isLoading ? (
                  <span>Menyimpan akun ke database cloud...</span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Daftar & Buat Akun Peserta</span>
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <p className="text-xs text-slate-500">
                  Sudah memiliki akun?{' '}
                  <button
                    type="button"
                    onClick={() => setActiveTab('student-login')}
                    className="text-[#0047AB] font-bold hover:underline"
                  >
                    Masuk di sini
                  </button>
                </p>
              </div>
            </form>
          )}

          {/* TAB 3: Teacher / Mudarris Login */}
          {activeTab === 'teacher-login' && (
            <form onSubmit={handleTeacherLogin} className="space-y-4">
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
                <KeyRound className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Kredensial Resmi Guru:</p>
                  <p className="font-mono text-[11px] text-amber-800">
                    User: <b>Mudarris Kalaamunaa</b><br />
                    Pass: <b>KaLaAmUnAa123</b>
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Username Guru / Mudarris
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={teacherUsername}
                    onChange={(e) => setTeacherUsername(e.target.value)}
                    placeholder="Mudarris Kalaamunaa"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:bg-white font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Password Guru
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    value={teacherPassword}
                    onChange={(e) => setTeacherPassword(e.target.value)}
                    placeholder="KaLaAmUnAa123"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:bg-white font-medium"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={fillTeacherDefault}
                  className="px-3 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
                >
                  Isi Otomatis
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Masuk Dasbor Guru</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
