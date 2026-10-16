import React from 'react';
import { 
  Instagram, 
  Mail, 
  Phone, 
  Youtube, 
  Send, 
  ExternalLink, 
  Award, 
  BookMarked, 
  Heart
} from 'lucide-react';
import { SiteSettings } from '../types';

interface FooterProps {
  settings: SiteSettings;
  onNavigateLandingSection?: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  onNavigateLandingSection,
}) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      {/* Upper Footer: Brand & Contact Channels */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0047AB] to-blue-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                <span className="font-arabic text-2xl font-bold">ك</span>
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-white tracking-tight">
                  Kalaamunaa
                </h3>
                <p className="text-xs text-blue-400 font-arabic font-semibold">
                  {settings.arabicSubtitle}
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed pr-4">
              Platform pembelajaran bahasa Arab komprehensif dari dasar hingga mahir. 
              Mengintegrasikan silabus sistematis, bimbingan video terstruktur, evaluasi kuis terukur, 
              dan sertifikat resmi untuk mencetak generasi yang paham bahasa Al-Qur'an.
            </p>

            {/* Quote badge */}
            <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs">
              <p className="font-arabic text-amber-300 text-sm mb-1">
                تَعَلَّمُوا الْعَرَبِيَّةَ فَإِنَّهَا مِنْ دِينِكُمْ
              </p>
              <p className="text-slate-400 text-[11px] italic">
                "Pelajarilah bahasa Arab, karena sesungguhnya ia bagian dari agamamu."
              </p>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4 border-l-2 border-[#0047AB] pl-2.5">
              Menu Navigasi
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#beranda" className="hover:text-blue-400 transition-colors flex items-center gap-1.5">
                  <span className="text-blue-500">•</span> Beranda Utama
                </a>
              </li>
              <li>
                <a href="#pratinjau" className="hover:text-blue-400 transition-colors flex items-center gap-1.5">
                  <span className="text-blue-500">•</span> Pratinjau Kelas (Uji Coba)
                </a>
              </li>
              <li>
                <a href="#tentang" className="hover:text-blue-400 transition-colors flex items-center gap-1.5">
                  <span className="text-blue-500">•</span> Tentang Kursus
                </a>
              </li>
              <li>
                <a href="#keunggulan" className="hover:text-blue-400 transition-colors flex items-center gap-1.5">
                  <span className="text-blue-500">•</span> Keunggulan Metode
                </a>
              </li>
              <li>
                <a href="#kursus" className="hover:text-blue-400 transition-colors flex items-center gap-1.5">
                  <span className="text-blue-500">•</span> Katalog Paket Kursus
                </a>
              </li>
              <li>
                <a href="#postingan" className="hover:text-blue-400 transition-colors flex items-center gap-1.5">
                  <span className="text-blue-500">•</span> Postingan & Tips Kaidah
                </a>
              </li>
              <li>
                <a href="#testimoni" className="hover:text-blue-400 transition-colors flex items-center gap-1.5">
                  <span className="text-blue-500">•</span> Testimoni Peserta
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Channels (Mandatory Links) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4 border-l-2 border-[#0047AB] pl-2.5">
              Kontak & Media Sosial Resmi
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* WhatsApp */}
              <a
                href={`https://wa.me/${settings.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/60 hover:bg-emerald-950/40 border border-slate-700/60 hover:border-emerald-500/50 transition-all group"
              >
                <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-[11px] text-slate-400">WhatsApp Resmi</p>
                  <p className="text-xs font-semibold text-slate-200 group-hover:text-emerald-300 truncate">
                    +{settings.whatsappNumber}
                  </p>
                </div>
              </a>

              {/* Instagram */}
              <a
                href={`https://instagram.com/${settings.instagramUsername}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/60 hover:bg-pink-950/40 border border-slate-700/60 hover:border-pink-500/50 transition-all group"
              >
                <div className="w-9 h-9 rounded-lg bg-pink-500/20 text-pink-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Instagram className="w-4 h-4" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-[11px] text-slate-400">Instagram</p>
                  <p className="text-xs font-semibold text-slate-200 group-hover:text-pink-300 truncate">
                    {settings.instagramUsername}
                  </p>
                </div>
              </a>

              {/* YouTube */}
              <a
                href={`https://youtube.com/${settings.youtubeHandle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/60 hover:bg-red-950/40 border border-slate-700/60 hover:border-red-500/50 transition-all group"
              >
                <div className="w-9 h-9 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Youtube className="w-4 h-4" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-[11px] text-slate-400">YouTube Channel</p>
                  <p className="text-xs font-semibold text-slate-200 group-hover:text-red-300 truncate">
                    {settings.youtubeHandle}
                  </p>
                </div>
              </a>

              {/* Email */}
              <a
                href={`mailto:${settings.adminEmail}`}
                className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/60 hover:bg-blue-950/40 border border-slate-700/60 hover:border-blue-500/50 transition-all group"
              >
                <div className="w-9 h-9 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-[11px] text-slate-400">Email Admin</p>
                  <p className="text-xs font-semibold text-slate-200 group-hover:text-blue-300 truncate">
                    {settings.adminEmail}
                  </p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Copyright */}
      <div className="bg-slate-950 border-t border-slate-800/80 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500">
          <p>
            © {currentYear} <span className="text-white font-semibold">Kalaamunaa For Arabic Learning</span>. Hak Cipta Dilindungi Undang-Undang.
          </p>
        </div>
      </div>
    </footer>
  );
};
