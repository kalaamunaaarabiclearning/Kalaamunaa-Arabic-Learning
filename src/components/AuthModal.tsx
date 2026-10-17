import React, { useState } from 'react';
import { 
  X, 
  User as UserIcon, 
  Lock, 
  Mail, 
  Phone, 
  ArrowRight, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  Eye,
  EyeOff
} from 'lucide-react';
import { storage } from '../services/storage';
import { User } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  initialTab?: 'student-login' | 'student-register';
  onClose: () => void;
  onSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialTab = 'student-login',
  onClose,
  onSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<'student-login' | 'student-register'>(initialTab);
  
  // Login fields (supports both student email and mudarris username)
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Student Register fields
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [showStudentRegisterPassword, setShowStudentRegisterPassword] = useState(false);

  // Status message
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!loginIdentifier.trim() || !loginPassword) {
      setErrorMessage('Harap isi email dan kata sandi.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await storage.loginStudentAsync(loginIdentifier, loginPassword);
      if (result.success && result.user) {
        setSuccessMessage(result.message || 'Login berhasil! Mengalihkan...');
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

    if (regPassword === 'KaLaAmUnAa123' || regPassword.toLowerCase() === 'kalaamunaa123') {
      setErrorMessage('Kata sandi ini dilindungi untuk keamanan sistem. Silakan gunakan kombinasi kata sandi lain untuk akun peserta.');
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
            {activeTab === 'student-login' ? 'Masuk ke Akun' : 'Daftar Akun Peserta Baru'}
          </h2>
          <p className="text-xs text-blue-100 mt-1">
            {activeTab === 'student-login'
              ? 'Akses ruang kelas video pembelajaran, kuis evaluasi, dan modul belajar'
              : 'Lengkapi data diri Anda untuk mulai belajar bahasa Arab terstruktur'}
          </p>

          {/* Navigation Tabs (Only Masuk and Daftar) */}
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

          {/* TAB 1: Unified Login (Student Email or Mudarris Username) */}
          {activeTab === 'student-login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Masukkan Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="Masukkan Email"
                    autoComplete="off"
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
                    type={showLoginPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Masukkan kata sandi..."
                    autoComplete="new-password"
                    className="w-full pl-10 pr-11 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#0047AB] focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 focus:outline-hidden transition-colors"
                    title={showLoginPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
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
                    type={showStudentRegisterPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Minimal 6 karakter..."
                    className="w-full pl-10 pr-11 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#0047AB] focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowStudentRegisterPassword(!showStudentRegisterPassword)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 focus:outline-hidden transition-colors"
                    title={showStudentRegisterPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                  >
                    {showStudentRegisterPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
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
        </div>
      </div>
    </div>
  );
};
