import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ExternalLink,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { Course, Order, SiteSettings, User } from '../types';
import { formatRupiah } from '../utils/formatters';
import { storage } from '../services/storage';

interface CartModalProps {
  isOpen: boolean;
  cart: Course[];
  currentUser: User | null;
  settings: SiteSettings;
  onClose: () => void;
  onRemoveFromCart: (courseId: string) => void;
  onRequireLogin: () => void;
  onOrderCreated: (order: Order) => void;
}

export const CartModal: React.FC<CartModalProps> = ({
  isOpen,
  cart,
  currentUser,
  settings,
  onClose,
  onRemoveFromCart,
  onRequireLogin,
  onOrderCreated,
}) => {
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [whatsappUrl, setWhatsappUrl] = useState<string>('');

  if (!isOpen) return null;

  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);

  const handleCheckout = () => {
    if (!currentUser) {
      onRequireLogin();
      return;
    }

    if (cart.length === 0) return;

    // 1. Create order in storage with status "pending" (Menunggu Approval Admin)
    const newOrder = storage.createOrder(currentUser, cart);
    onOrderCreated(newOrder);

    // 2. Build the exact requested WhatsApp message format:
    // "Assalamualaikum Admin Kalaamunaa,
    // Saya {Nama siswa} ingin mengikuti kursus [kursus 1 x harganya], [kursus 2 x harganya]...dan seterusnya sesuai paket kursus yang dia pilih. Total (Rpxxxx sesuai total kurus yang dia pesan diisi otomatis)"
    const coursesString = cart
      .map((c) => `${c.title} x ${formatRupiah(c.price)}`)
      .join(', ');

    const waText = `Assalamualaikum Admin Kalaamunaa,\nSaya ${currentUser.name} ingin mengikuti kursus ${coursesString}. Total ${formatRupiah(totalPrice)}`;

    const targetPhone = settings.whatsappNumber || '6282311776535';
    const cleanPhone = targetPhone.replace(/\D/g, '');
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(waText)}`;

    setWhatsappUrl(url);
    setCreatedOrder(newOrder);

    // Open WhatsApp in a new tab immediately
    window.open(url, '_blank');
  };

  const handleFinish = () => {
    setCreatedOrder(null);
    setWhatsappUrl('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#0047AB] px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/10">
              <ShoppingBag className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Keranjang Kursus</h2>
              <p className="text-xs text-blue-200">
                {createdOrder ? 'Pesanan Berhasil Diajukan' : `${cart.length} paket kursus dipilih`}
              </p>
            </div>
          </div>
          <button
            onClick={createdOrder ? handleFinish : onClose}
            className="p-1.5 rounded-full text-blue-200 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {createdOrder ? (
            /* Post-Checkout Confirmation View */
            <div className="text-center py-4 space-y-5">
              <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto shadow-inner">
                <Clock className="w-9 h-9 animate-pulse" />
              </div>

              <div>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                  Menunggu Approval Admin
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 mt-2">
                  Pesanan Anda Telah Dicatat!
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Nomor Referensi: <b className="font-mono text-slate-700">{createdOrder.orderNumber}</b>
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 text-left text-xs text-slate-700 space-y-2">
                <p className="font-bold text-[#0047AB] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Alur Verifikasi Pembayaran & Akses:
                </p>
                <ol className="list-decimal list-inside space-y-1 text-slate-600 pl-1 leading-relaxed">
                  <li>Pesan WhatsApp otomatis telah disiapkan untuk Admin Kalaamunaa.</li>
                  <li>Kirim bukti transfer ke WhatsApp admin (+{settings.whatsappNumber}).</li>
                  <li>Admin akan memverifikasi dan menyetujui (approve) pesanan Anda di sistem.</li>
                  <li>Setelah di-approve, akses seluruh video pelajaran dan kuis akan terbuka secara otomatis!</li>
                </ol>
              </div>

              <div className="space-y-3 pt-2">
                {whatsappUrl && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 text-sm"
                  >
                    <Send className="w-4 h-4" />
                    <span>Buka WhatsApp Admin ({settings.whatsappNumber})</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}

                <button
                  onClick={handleFinish}
                  className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
                >
                  Tutup & Lihat di Dasbor Siswa
                </button>
              </div>
            </div>
          ) : cart.length === 0 ? (
            /* Empty Cart View */
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800">Keranjang Masih Kosong</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">
                  Pilih kursus bahasa Arab pilihan Anda di katalog untuk mulai belajar.
                </p>
              </div>
              <button
                onClick={onClose}
                className="px-5 py-2.5 bg-[#0047AB] text-white text-xs font-bold rounded-xl shadow-xs"
              >
                Jelajahi Katalog Kursus
              </button>
            </div>
          ) : (
            /* Items List */
            <div className="space-y-4">
              <div className="divide-y divide-slate-100">
                {cart.map((course) => (
                  <div key={course.id} className="py-3 flex items-center gap-3.5 first:pt-0">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                        {course.level}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 truncate mt-1">
                        {course.title}
                      </h4>
                      <p className="text-xs font-extrabold text-[#0047AB] mt-0.5">
                        {formatRupiah(course.price)}
                      </p>
                    </div>
                    <button
                      onClick={() => onRemoveFromCart(course.id)}
                      className="p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                      title="Hapus dari keranjang"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Summary Box */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 mt-4 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal Kursus:</span>
                  <span>{formatRupiah(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Biaya Pendaftaran / Sertifikat:</span>
                  <span className="text-emerald-600 font-semibold">Gratis</span>
                </div>
                <div className="border-t border-slate-200 pt-2 flex justify-between items-center text-sm font-extrabold text-slate-900">
                  <span>Total Pembayaran:</span>
                  <span className="text-[#0047AB] text-base">{formatRupiah(totalPrice)}</span>
                </div>
              </div>

              {/* User notice if not logged in */}
              {!currentUser && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Silakan masuk atau daftar terlebih dahulu sebelum melakukan checkout.</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {!createdOrder && cart.length > 0 && (
          <div className="p-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] text-slate-500">Total Tagihan:</p>
              <p className="text-base font-extrabold text-[#0047AB]">
                {formatRupiah(totalPrice)}
              </p>
            </div>

            <button
              onClick={handleCheckout}
              className="px-6 py-3 bg-[#0047AB] hover:bg-[#003380] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <Send className="w-4 h-4 text-emerald-300" />
              <span>Checkout & Hubungi WhatsApp</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
