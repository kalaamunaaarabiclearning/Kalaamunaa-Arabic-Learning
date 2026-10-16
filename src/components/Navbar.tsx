import React, { useState } from 'react';
import { 
  BookOpen, 
  ShoppingCart, 
  User as UserIcon, 
  LogOut, 
  Menu, 
  X, 
  ShieldCheck, 
  GraduationCap,
  Sparkles
} from 'lucide-react';
import { User, Course, SiteSettings } from '../types';

interface NavbarProps {
  currentUser: User | null;
  cart: Course[];
  settings: SiteSettings;
  onOpenCart: () => void;
  onOpenAuth: (initialTab?: 'student-login' | 'student-register') => void;
  onNavigate: (view: 'landing' | 'student-dashboard' | 'admin-dashboard' | 'classroom') => void;
  currentView: string;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  cart,
  settings,
  onOpenCart,
  onOpenAuth,
  onNavigate,
  currentView,
  onLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Beranda', href: '#beranda', view: 'landing' as const },
    { label: 'Pratinjau Kelas', href: '#pratinjau', view: 'landing' as const },
    { label: 'Tentang Kami', href: '#tentang', view: 'landing' as const },
    { label: 'Keunggulan', href: '#keunggulan', view: 'landing' as const },
    { label: 'Jenis Kursus', href: '#kursus', view: 'landing' as const },
    { label: 'Postingan & Tips', href: '#postingan', view: 'landing' as const },
    { label: 'Testimoni', href: '#testimoni', view: 'landing' as const },
  ];

  const handleNavClick = (view: 'landing', hash: string) => {
    onNavigate('landing');
    setMobileMenuOpen(false);
    setTimeout(() => {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top Announcement Bar */}
      <div className="bg-[#0047AB] text-white text-xs py-1.5 px-4 font-medium">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] bg-amber-400 text-slate-900 font-bold uppercase tracking-wider">
              {settings.arabicSubtitle}
            </span>
            <span className="hidden md:inline text-blue-100">
              Pendaftaran Kelas Bahasa Arab Intensif Kalaamunaa Dibuka!
            </span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-blue-100">
            <span>WhatsApp: +{settings.whatsappNumber}</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand Name */}
          <div 
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0047AB] to-[#002b66] flex items-center justify-center text-white shadow-md shadow-blue-900/20 group-hover:scale-105 transition-transform">
              <span className="font-arabic text-2xl font-bold tracking-wide">ك</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight text-slate-900 group-hover:text-[#0047AB] transition-colors">
                  Kalaamunaa
                </span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-blue-50 text-[#0047AB] font-bold border border-blue-200">
                  Arabic
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                For Arabic Learning
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.view, item.href)}
                className="text-sm font-semibold text-slate-600 hover:text-[#0047AB] transition-colors relative py-1"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right Action Icons: Cart & Auth */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative p-2.5 rounded-xl border border-slate-200 hover:border-[#0047AB] text-slate-700 hover:text-[#0047AB] transition-all bg-slate-50/50 hover:bg-blue-50/50"
              title="Keranjang Belanja Kursus"
            >
              <ShoppingCart className="w-5 h-5" />
              {cart.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#0047AB] text-white text-[11px] font-bold flex items-center justify-center shadow-xs animate-pulse">
                  {cart.length}
                </span>
              )}
            </button>

            {/* User Logged In State vs Guest */}
            {currentUser ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                {currentUser.role === 'teacher' || currentUser.role === 'admin' ? (
                  <button
                    onClick={() => onNavigate('admin-dashboard')}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                      currentView === 'admin-dashboard'
                        ? 'bg-[#0047AB] text-white shadow-sm'
                        : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 text-amber-500" />
                    <span>Dasbor Mudarris</span>
                  </button>
                ) : (
                  <button
                    onClick={() => onNavigate('student-dashboard')}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                      currentView === 'student-dashboard'
                        ? 'bg-[#0047AB] text-white shadow-sm'
                        : 'bg-blue-50 text-[#0047AB] hover:bg-blue-100'
                    }`}
                  >
                    <GraduationCap className="w-4 h-4" />
                    <span>Dasbor Kursus Saya</span>
                  </button>
                )}

                <div className="hidden md:flex flex-col text-right">
                  <span className="text-xs font-bold text-slate-800 line-clamp-1 max-w-[120px]">
                    {currentUser.name}
                  </span>
                  <span className="text-[10px] text-slate-500 capitalize">
                    {currentUser.role === 'teacher' ? 'Guru' : 'Peserta'}
                  </span>
                </div>

                <button
                  onClick={onLogout}
                  className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                  title="Keluar"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenAuth('student-login')}
                  className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-[#0047AB] hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Masuk
                </button>
                <button
                  onClick={() => onOpenAuth('student-register')}
                  className="px-4 py-2 text-xs font-bold text-white bg-[#0047AB] hover:bg-[#003380] rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Daftar</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={onOpenCart}
              className="relative p-2 rounded-lg text-slate-700"
            >
              <ShoppingCart className="w-5 h-5" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#0047AB] text-white text-[10px] font-bold flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 shadow-xl space-y-3">
          <div className="space-y-1">
            {navLinks.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.view, item.href)}
                className="w-full text-left px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:text-[#0047AB] rounded-lg"
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-2">
            {currentUser ? (
              <>
                <div className="px-3 py-2 bg-slate-50 rounded-lg">
                  <p className="text-xs font-bold text-slate-800">{currentUser.name}</p>
                  <p className="text-[11px] text-slate-500">{currentUser.email}</p>
                </div>
                {currentUser.role === 'teacher' ? (
                  <button
                    onClick={() => {
                      onNavigate('admin-dashboard');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-2.5 px-3 bg-[#0047AB] text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Masuk ke Dasbor Mudarris</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      onNavigate('student-dashboard');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-2.5 px-3 bg-[#0047AB] text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2"
                  >
                    <GraduationCap className="w-4 h-4" />
                    <span>Dasbor Kursus Saya</span>
                  </button>
                )}
                <button
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 px-3 text-red-600 text-xs font-bold border border-red-200 rounded-lg flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Keluar Akun</span>
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    onOpenAuth('student-login');
                    setMobileMenuOpen(false);
                  }}
                  className="py-2.5 text-center text-xs font-bold border border-slate-300 text-slate-700 rounded-xl"
                >
                  Masuk
                </button>
                <button
                  onClick={() => {
                    onOpenAuth('student-register');
                    setMobileMenuOpen(false);
                  }}
                  className="py-2.5 text-center text-xs font-bold bg-[#0047AB] text-white rounded-xl"
                >
                  Daftar
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
