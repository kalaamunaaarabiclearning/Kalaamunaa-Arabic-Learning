import { Course, Order, Post, SiteSettings, Testimonial, User, UserCourseProgress } from '../types';
import { fetchFromGoogleSheets, sendToGoogleSheets } from './googleSheets';

const STORAGE_KEYS = {
  USERS: 'kalaamunaa_users',
  COURSES: 'kalaamunaa_courses',
  ORDERS: 'kalaamunaa_orders',
  POSTS: 'kalaamunaa_posts',
  TESTIMONIALS: 'kalaamunaa_testimonials',
  SETTINGS: 'kalaamunaa_settings',
  PROGRESS: 'kalaamunaa_progress',
  CURRENT_USER: 'kalaamunaa_current_user',
  CART: 'kalaamunaa_cart',
};

// Initial default site settings
export const DEFAULT_SETTINGS: SiteSettings = {
  appName: 'Kalaamunaa For Arabic Learning',
  arabicSubtitle: 'كَلَامُنَا لِتَعْلِيمِ اللُّغَةِ الْعَرَبِيَّةِ',
  heroBadge: 'Platform Pembelajaran Bahasa Arab Terpadu & Bergaransi Pemahaman',
  heroTitle: 'Kuasai Bahasa Arab dengan Metode',
  heroHighlight: 'Sistematis, Mudah, & Menyenangkan',
  heroDescription: 'Belajar kaidah Nahwu, Shorof, Percakapan (Hiwar), dan pemahaman Kitab bersama Ustadz berpengalaman. Dilengkapi video berurutan, evaluasi kuis terukur, dan sertifikat resmi.',
  arabicQuote: 'تَعَلَّمُوا الْعَرَبِيَّةَ فَإِنَّهَا مِنْ دِينِكُمْ',
  arabicQuoteTranslation: '"Pelajarilah bahasa Arab, karena sesungguhnya ia merupakan bagian dari agamamu." — Khalifah Umar bin Khattab رضي الله عنه',
  whatsappNumber: '6282311776535',
  adminEmail: 'kalaamunaa.arabiclearning@gmail.com',
  instagramUsername: 'kalaamunaa.arabic',
  youtubeHandle: '@kalaamunaa.arabic',
  aboutTitle: 'Tentang Kalaamunaa For Arabic Learning',
  aboutContent: 'Kalaamunaa For Arabic Learning adalah pusat pendidikan bahasa Arab modern yang dirancang untuk membantu umat Islam dari berbagai latar belakang memahami bahasa Al-Qur\'an, literatur klasik Islam, dan kemampuan berkomunikasi aktif. Dengan silabus yang teruji dan pendekatan bertahap (tadarruj), siswa dituntun mulai dari nol hingga mahir menganalisis kaidah bahasa dan bercakap-cakap dengan fasih.',
  googleSheetsUrl: 'https://script.google.com/macros/s/AKfycbwG_AIXop_Su7QzSoIuM0Q7FP9jq9kSVOguUqH09BonZ9lRHNxAe_4uf7ZPU9Ti9X6f/exec',
  previewBadge: 'Uji Coba Kelas Gratis',
  previewTitle: 'Pratinjau Kelas & Cuplikan Pembelajaran',
  previewArabicSubtitle: 'دَرْسٌ تَجْرِيبِيٌّ لِتَعْلِيمِ اللُّغَةِ الْعَرَبِيَّةِ',
  previewDescription: 'Tonton langsung video pengantar metode pengajaran bahasa Arab di Kalaamunaa. Rasakan kemudahan memahami pembagian kata dan logika dasar tata bahasa sebelum Anda mendaftar kelas lengkap.',
  previewYoutubeUrl: 'https://www.youtube.com/watch?v=kYJzXv-K5v0',
  previewKeyPoints: [
    'Penjelasan metode tadarruj bertahap dari nol tanpa pusing',
    'Contoh aplikasi langsung dalam bacaan ayat Al-Qur\'an dan shalat',
    'Simulasi kemudahan belajar melalui video terstruktur & kuis bertingkat',
    'Bimbingan intonasi dan makharijul huruf yang fasih dan tepat',
  ],
};

// Default Initial Courses
export const DEFAULT_COURSES: Course[] = [
  {
    id: 'course-1',
    title: 'Nahwu Kilat & Praktis untuk Pemula (Dasar Tata Bahasa Arab)',
    arabicTitle: 'النَّحْوُ الْوَاضِحُ لِلْمُبْتَدِئِينَ',
    level: 'Pemula (Mubtadi\')',
    category: 'Nahwu & Shorof',
    price: 199000,
    originalPrice: 350000,
    thumbnail: 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&w=800&q=80',
    shortDescription: 'Pondasi utama kaidah Nahwu: memahami jenis kata, harakat akhir, dan struktur kalimat dasar dengan mudah tanpa pusing.',
    fullDescription: 'Kursus ini dirancang khusus bagi Anda yang ingin mulai belajar bahasa Arab dari nol. Materi disajikan secara bertahap menggunakan contoh-contoh praktis dari Al-Qur\'an dan hadits, sehingga peserta dapat langsung merasakan kemajuan nyata dalam memahami bacaan shalat dan ayat-ayat suci.',
    whatYouWillGet: [
      'Membedakan Isim, Fi\'il, dan Harf dalam teks Arab gundul secara tepat',
      'Memahami konsep dasar Rafa\', Nashab, Jar, dan Jazm',
      'Mampu menyusun kalimat sempurna (Jumlah Ismiyyah & Fi\'liyyah)',
      'Akses seumur hidup modul video dan rangkuman PDF',
      'Kuis evaluasi interaktif pada setiap pelajaran',
      'Sertifikat kelulusan resmi Kalaamunaa',
    ],
    instructorName: 'Mudarris Kalaamunaa',
    certificateFormUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSc-contoh-sertifikat-nahwu-kalaamunaa/viewform',
    isFeatured: true,
    lessons: [
      {
        id: 'lesson-1-1',
        courseId: 'course-1',
        title: 'Pelajaran 1: Pembagian Kata dalam Bahasa Arab (Isim, Fi\'il, Harf)',
        description: 'Mengenal karakteristik masing-masing jenis kata, tanda-tanda isim (tanwin, alif lam, huruf jar), serta tanda-tanda fi\'il.',
        youtubeUrl: 'https://www.youtube.com/watch?v=kYJzXv-K5v0',
        quizUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSf-kuis-pelajaran-1/viewform',
        duration: '22 Menit',
        order: 1,
      },
      {
        id: 'lesson-1-2',
        courseId: 'course-1',
        title: 'Pelajaran 2: Memahami Jumlah Mufidah (Kalimat Sempurna)',
        description: 'Perbedaan Jumlah Ismiyyah (Mubtada & Khabar) dan Jumlah Fi\'liyyah (Fi\'il & Fa\'il) serta contoh penerapannya.',
        youtubeUrl: 'https://www.youtube.com/watch?v=9No-FiEInLA',
        quizUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSf-kuis-pelajaran-2/viewform',
        duration: '28 Menit',
        order: 2,
      },
      {
        id: 'lesson-1-3',
        courseId: 'course-1',
        title: 'Pelajaran 3: Harakat Akhir & Pengantar I\'rab (Marfu\', Manshub, Majrur)',
        description: 'Mengetahui mengapa kata Arab harakat akhirnya bisa dhommah, fathah, kasrah, atau sukun secara sistematis.',
        youtubeUrl: 'https://www.youtube.com/watch?v=aqz-KE-bpKQ',
        quizUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSf-kuis-pelajaran-3/viewform',
        duration: '35 Menit',
        order: 3,
      },
    ],
  },
  {
    id: 'course-2',
    title: 'Durusul Lughah Al-Arabiyyah Jilid 1 (Metode Universitas Madinah)',
    arabicTitle: 'دُرُوسُ اللُّغَةِ الْعَرَبِيَّةِ - الْجُزْءُ الْأَوَّلُ',
    level: 'Pemula (Mubtadi\')',
    category: 'Bahasa Arab Al-Qur\'an',
    price: 249000,
    originalPrice: 400000,
    thumbnail: 'https://images.unsplash.com/photo-1584281729288-8974533d67b1?auto=format&fit=crop&w=800&q=80',
    shortDescription: 'Kitab legendaris kurikulum pengajaran bahasa Arab bagi non-Arab di Universitas Islam Madinah, dikaji kata per kata.',
    fullDescription: 'Kitab Durusul Lughah karya Dr. V. Abdur Rahim telah terbukti melahirkan jutaan pembelajar bahasa Arab yang fasih di seluruh dunia. Kursus ini menuntun Anda mempelajari seluruh bab Jilid 1 dengan penjelasan detail dalam bahasa Indonesia, latihan lisan, dan evaluasi terstruktur.',
    whatYouWillGet: [
      'Penguasaan 23 bab dasar kitab Durusul Lughah Jilid 1 secara tuntas',
      'Pengayaan 300+ kosakata penting sehari-hari dan istilah Qur\'ani',
      'Latihan tanya jawab interaktif untuk mengasah kelancaran berpikir',
      'Evaluasi pemahaman di tiap bab melalui Google Form',
      'Sertifikat kelulusan resmi Kalaamunaa',
    ],
    instructorName: 'Mudarris Kalaamunaa',
    certificateFormUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSc-contoh-sertifikat-durusul-lughah/viewform',
    isFeatured: true,
    lessons: [
      {
        id: 'lesson-2-1',
        courseId: 'course-2',
        title: 'Pelajaran 1: Kata Tunjuk Dekat (هَـٰذَا) & Penggunaannya',
        description: 'Membahas isim isyarah hadza, bentuk tanya maa hadza & a-hadza, serta contoh benda di sekitar.',
        youtubeUrl: 'https://www.youtube.com/watch?v=kYJzXv-K5v0',
        quizUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSf-kuis-durusul-1/viewform',
        duration: '25 Menit',
        order: 1,
      },
      {
        id: 'lesson-2-2',
        courseId: 'course-2',
        title: 'Pelajaran 2: Kata Tunjuk Jauh (ذَٰلِكَ) & Latihan Percakapan',
        description: 'Membedakan penggunaan hadza dan dzalika serta latihan membaca teks berharakat.',
        youtubeUrl: 'https://www.youtube.com/watch?v=9No-FiEInLA',
        quizUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSf-kuis-durusul-2/viewform',
        duration: '30 Menit',
        order: 2,
      },
    ],
  },
  {
    id: 'course-3',
    title: 'Percakapan Bahasa Arab Sehari-hari (Hiwar & Muhadatsah Praktis)',
    arabicTitle: 'الْمُحَادَثَةُ الْيَوْمِيَّةُ وَالْحِوَارُ',
    level: 'Menengah (Mutawassith)',
    category: 'Percakapan (Hiwar)',
    price: 220000,
    originalPrice: 380000,
    thumbnail: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80',
    shortDescription: 'Lancar berbicara bahasa Arab dalam situasi nyata: perkenalan, di bandara, belanja, kampus, hingga restoran.',
    fullDescription: 'Fokus melatih lisan (lisanun \'arabi) agar tidak kaku saat berbicara. Dilengkapi audio dialog penutur asli, teknik menyusun kalimat spontan, dan idiom-idiom bahasa Arab fushah kontemporer.',
    whatYouWillGet: [
      'Ratusan pola ungkapan dan respons cepat percakapan harian',
      'Prononsiasi makharijul huruf dan intonasi bahasa Arab yang fasih',
      'Percaya diri berbicara bahasa Arab saat ibadah haji, umrah, atau studi',
      'Kuis lisan dan pemahaman pendengaran (Istima\')',
      'Sertifikat kelulusan resmi Kalaamunaa',
    ],
    instructorName: 'Mudarris Kalaamunaa',
    certificateFormUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSc-contoh-sertifikat-hiwar/viewform',
    isFeatured: true,
    lessons: [
      {
        id: 'lesson-3-1',
        courseId: 'course-3',
        title: 'Pelajaran 1: Ta\'aruf & Sapaan Hangat dalam Bahasa Arab Fushah',
        description: 'Kaidah menyapa, menanyakan kabar, asal daerah, profesi, dan tata krama perkenalan.',
        youtubeUrl: 'https://www.youtube.com/watch?v=kYJzXv-K5v0',
        quizUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSf-kuis-hiwar-1/viewform',
        duration: '20 Menit',
        order: 1,
      },
      {
        id: 'lesson-3-2',
        courseId: 'course-3',
        title: 'Pelajaran 2: Percakapan di Bandara, Hotel, & Transportasi Umrah',
        description: 'Frasa penting saat bepergian ke tanah suci atau negara Timur Tengah.',
        youtubeUrl: 'https://www.youtube.com/watch?v=aqz-KE-bpKQ',
        quizUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSf-kuis-hiwar-2/viewform',
        duration: '24 Menit',
        order: 2,
      },
    ],
  },
  {
    id: 'course-4',
    title: 'Kaidah I\'rab & Praktek Membaca Kitab Kuning Gundul',
    arabicTitle: 'قَوَاعِدُ الْإِعْرَابِ وَقِرَاءَةُ الْكُتُبِ',
    level: 'Mahir (Mutaqaddim)',
    category: 'Membaca Kitab',
    price: 299000,
    originalPrice: 490000,
    thumbnail: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80',
    shortDescription: 'Tingkatkan kemampuan membaca teks Arab tanpa harakat secara tepat dengan analisis I\'rab mendalam.',
    fullDescription: 'Dikhususkan untuk peserta yang telah memahami kaidah dasar Nahwu dan Shorof serta ingin mahir membaca literatur kitab klasik (Tafsir, Fiqih, Hadits). Dilengkapi metode jitu menentukan posisi kata dalam kalimat panjang.',
    whatYouWillGet: [
      'Metode cepat mengenali harakat akhir kata tanpa harakat (kitab gundul)',
      'Teknik membedakan Na\'at Man\'ut, Idhafah, dan Khobar Muqaddam',
      'Praktek langsung bedah kitab Fathul Qorib dan Riyadhus Shalihin',
      'Kuis analisis I\'rab tingkat lanjut',
      'Sertifikat kelulusan resmi Kalaamunaa',
    ],
    instructorName: 'Mudarris Kalaamunaa',
    certificateFormUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSc-contoh-sertifikat-irab/viewform',
    isFeatured: false,
    lessons: [
      {
        id: 'lesson-4-1',
        courseId: 'course-4',
        title: 'Pelajaran 1: Anatomi I\'rab & Kunci Menentukan Kedudukan Kata',
        description: 'Rumus 3 langkah praktis menganalisis kalimat panjang dalam kitab para ulama.',
        youtubeUrl: 'https://www.youtube.com/watch?v=kYJzXv-K5v0',
        quizUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSf-kuis-irab-1/viewform',
        duration: '32 Menit',
        order: 1,
      },
    ],
  },
];

// Default Initial Testimonials
export const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: 'testi-1',
    name: 'Ahmad Fauzi, S.Pd',
    role: 'Guru & Pembelajar Mandiri',
    city: 'Jakarta Selatan',
    stars: 5,
    review: 'MasyaAllah, metode pengajaran di Kalaamunaa sangat sistematis! Video pelajarannya ringkas dan padat, lalu ada kuis wajib yang memastikan kita paham sebelum bisa lanjut. Sangat merekomendasikan untuk siapa saja yang ingin paham bahasa Arab Al-Qur\'an.',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    courseName: 'Nahwu Kilat & Praktis untuk Pemula',
  },
  {
    id: 'testi-2',
    name: 'dr. Nur Aisyah',
    role: 'Dokter & Pegiat Kajian',
    city: 'Surabaya',
    stars: 5,
    review: 'Dulu saya mengira Nahwu itu rumit dan butuh waktu bertahun-tahun. Bersama Mudarris Kalaamunaa, konsep kalimat dan harakat dijelaskan dengan logika sederhana. Begitu tuntas kuisnya, sertifikatnya langsung bisa diajukan. Berkah selalu!',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    courseName: 'Durusul Lughah Al-Arabiyyah Jilid 1',
  },
  {
    id: 'testi-3',
    name: 'Muhammad Ridwan',
    role: 'Karyawan Swasta',
    city: 'Bandung',
    stars: 5,
    review: 'Sistem belajarnya sangat ramah buat orang sibuk seperti saya. Bisa belajar kapan saja lewat video YouTube yang rapi, kuisnya menguji ingatan. Pesan lewat WhatsApp langsung di-approve admin dengan sangat cepat!',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    courseName: 'Percakapan Bahasa Arab Sehari-hari',
  },
  {
    id: 'testi-4',
    name: 'Ustadzah Siti Fatimah',
    role: 'Mahasiswi Pascasarjana',
    city: 'Yogyakarta',
    stars: 5,
    review: 'Materi bedah I\'rab dan kitab kuningnya luar biasa berbobot. Tata bahasa Arab disajikan dengan elegan dan mudah diaplikasikan pada teks-teks klasik. Jazakumullahu khairan Kalaamunaa!',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    courseName: 'Kaidah I\'rab & Praktek Membaca Kitab Kuning Gundul',
  },
];

// Default Initial Posts / Articles
export const DEFAULT_POSTS: Post[] = [
  {
    id: 'post-1',
    title: '5 Tips Menghafal Kosakata Bahasa Arab (Mufradat) Agar Melekat Kuat di Ingatan',
    arabicHeading: 'خَمْسُ نَصَائِحَ لِحِفْظِ الْمُفْرَدَاتِ',
    category: 'Tips Belajar',
    excerpt: 'Jangan hanya menghafal kata tunggal! Simak metode pengelompokan tematik dan penggunaan kalimat langsung agar hafalan mufradat tahan bertahun-tahun.',
    content: `Banyak pemula mengeluh kosakata bahasa Arab yang dihafal sering kali menguap dalam hitungan hari. Berikut adalah 5 formula ampuh dari Mudarris Kalaamunaa:

1. Hafalkan Dalam Bentuk Kalimat (Bukan Kata Lepas):
Otak manusia mengingat konteks jauh lebih kuat daripada kata tunggal. Alih-alih menghafal kata "كِتَابٌ" (buku) saja, buatlah kalimat sederhana: "قَرَأْتُ الْكِتَابَ فِي الْمَسْجِدِ" (Saya membaca buku di masjid).

2. Kelompokkan Berdasarkan Tema Kehidupan:
Hari ini khusus kosakata dapur, esok kosakata bandara, lusa kosakata shalat. Ini membentuk asosiasi pikiran yang kuat.

3. Gunakan Metode Spaced Repetition:
Ulangi hafalan pada hari ke-1, hari ke-3, hari ke-7, dan hari ke-30.

4. Bicarakan dengan Lisan (Bukan Hanya Mata):
Makharijul huruf membutuhkan memori otot mulut. Ucapkan secara lantang dan jelas.

5. Sambungkan dengan Ayat Al-Qur'an:
Ketika menemukan kata baru, cari ayat yang mengandung kata tersebut agar bernilai ibadah dan berkesan mendalam di hati.`,
    imageUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80',
    author: 'Mudarris Kalaamunaa',
    publishedDate: '14 Oktober 2026',
  },
  {
    id: 'post-2',
    title: 'Perbedaan Mendasar Antara Jumlah Ismiyyah dan Jumlah Fi\'liyyah',
    arabicHeading: 'الْفَرْقُ بَيْنَ الْجُمْلَةِ الْإِسْمِيَّةِ وَالْفِعْلِيَّةِ',
    category: 'Kaidah Nahwu',
    excerpt: 'Pahami cara membedakan kalimat yang diawali Isim dan Fi\'il, serta pengaruhnya terhadap struktur Mubtada Khabar dan Fi\'il Fa\'il.',
    content: `Kunci utama memahami tata bahasa Arab adalah mengenali struktur kalimatnya. Dalam ilmu Nahwu, kalimat sempurna (Jumlah Mufidah) terbagi menjadi dua:

1. Jumlah Ismiyyah (الجملة الاسمية):
Kalimat yang diawali dengan Isim (kata benda/nama). Struktur intinya adalah Mubtada (pokok kalimat) dan Khabar (keterangan). Keduanya selalu berstatus Marfu' (biasanya berharakat dhommah).
Contoh: "اللَّهُ غَفُورٌ" (Allah Maha Pengampun).

2. Jumlah Fi'liyyah (الجملة الفعلية):
Kalimat yang diawali dengan Fi'il (kata kerja). Struktur dasarnya adalah Fi'il (kata kerja) dan Fa'il (pelaku/subjek yang marfu'). Jika membutuhkan objek, ditambahkan Maf'ul Bih (yang manshub).
Contoh: "كَتَبَ التِّلْمِيذُ الدَّرْسَ" (Siswa itu telah menulis pelajaran).

Dengan memahami perbedaan ini, Anda akan dengan mudah membedah ratusan ayat dalam Al-Qur'an Al-Karim!`,
    imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
    author: 'Mudarris Kalaamunaa',
    publishedDate: '10 Oktober 2026',
  },
  {
    id: 'post-3',
    title: 'Mengapa Bahasa Arab Memiliki Kedudukan Istimewa dalam Islam?',
    arabicHeading: 'فَضْلُ اللُّغَةِ الْعَرَبِيَّةِ فِي الْإِسْلَامِ',
    category: 'Wawasan Bahasa',
    excerpt: 'Kutipan ulama salaf tentang pentingnya bahasa Arab sebagai kunci memahami wahyu ilahi dan memurnikan akal budi.',
    content: `Bahasa Arab bukan sekadar sarana komunikasi suku bangsa tertentu, melainkan bahasa pilihan Allah SWT untuk menurunkan mukjizat abadi, Al-Qur'an Al-Karim.

Syaikhul Islam Ibnu Taimiyyah rahimahullah berkata:
"Sesungguhnya membiasakan diri berbahasa Arab memberikan pengaruh yang kuat terhadap akal, akhlak, dan agama."

Umar bin Khattab radhiyallahu 'anhu juga menegaskan:
"Pelajarilah bahasa Arab, karena sesungguhnya ia merupakan bagian dari agamamu, dan pelajarilah hukum faraidh karena ia bagian dari agamamu."

Belajar bahasa Arab adalah salah satu pintu ibadah terbesar yang mendekatkan hati seorang hamba kepada kalam Tuhannya.`,
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80',
    author: 'Mudarris Kalaamunaa',
    publishedDate: '05 Oktober 2026',
  },
];

// Teacher / Admin Account specifications
export const TEACHER_CREDENTIALS = {
  username: 'Mudarris Kalaamunaa',
  password: 'KaLaAmUnAa123',
};

// Storage Service Class
class StorageService {
  private listeners: (() => void)[] = [];
  private isImporting = false;
  private syncDebounceTimer: any = null;

  constructor() {
    this.initializeDefaults();
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  public notify(skipCloudSync: boolean = false) {
    this.listeners.forEach((l) => {
      try {
        l();
      } catch (err) {
        console.error('Error notifying storage listener:', err);
      }
    });

    if (skipCloudSync || this.isImporting) {
      return;
    }

    // Debounce cloud sync so consecutive updates don't spam Google Apps Script
    if (this.syncDebounceTimer) {
      clearTimeout(this.syncDebounceTimer);
    }
    this.syncDebounceTimer = setTimeout(() => {
      const settings = this.getSettings();
      if (settings.googleSheetsUrl) {
        this.syncToCloud(settings.googleSheetsUrl).catch(() => {});
      }
    }, 1200);
  }

  private initializeDefaults() {
    if (!localStorage.getItem(STORAGE_KEYS.COURSES)) {
      localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(DEFAULT_COURSES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
    } else {
      try {
        const existing = JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS) || '{}');
        if (!existing.googleSheetsUrl || existing.googleSheetsUrl !== DEFAULT_SETTINGS.googleSheetsUrl) {
          existing.googleSheetsUrl = DEFAULT_SETTINGS.googleSheetsUrl;
          localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(existing));
        }
      } catch {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
      }
    }
    if (!localStorage.getItem(STORAGE_KEYS.TESTIMONIALS)) {
      localStorage.setItem(STORAGE_KEYS.TESTIMONIALS, JSON.stringify(DEFAULT_TESTIMONIALS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.POSTS)) {
      localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(DEFAULT_POSTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      // Seed initial users including student test account
      const defaultUsers: User[] = [
        {
          id: 'user-mudarris',
          name: 'Mudarris Kalaamunaa',
          email: 'kalaamunaa.arabiclearning@gmail.com',
          role: 'teacher',
          createdAt: new Date().toISOString(),
        },
        {
          id: 'user-student-demo',
          name: 'Ahmad Santoso',
          email: 'ahmad@example.com',
          password: 'password123',
          role: 'student',
          phone: '08123456789',
          createdAt: new Date().toISOString(),
        },
      ];
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(defaultUsers));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
      // Seed a sample order for demonstration
      const sampleOrder: Order = {
        id: 'ord-1001',
        orderNumber: 'KLM-20261015-01',
        studentId: 'user-student-demo',
        studentName: 'Ahmad Santoso',
        studentEmail: 'ahmad@example.com',
        studentPhone: '08123456789',
        items: [
          {
            courseId: 'course-1',
            courseTitle: 'Nahwu Kilat & Praktis untuk Pemula (Dasar Tata Bahasa Arab)',
            price: 199000,
            thumbnail: 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&w=800&q=80',
          },
        ],
        totalPrice: 199000,
        status: 'approved',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        approvedAt: new Date(Date.now() - 86400000).toISOString(),
      };
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify([sampleOrder]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.PROGRESS)) {
      // Seed progress for the demo student
      const sampleProgress: Record<string, UserCourseProgress> = {
        'user-student-demo_course-1': {
          userId: 'user-student-demo',
          courseId: 'course-1',
          currentLessonId: 'lesson-1-2',
          isCompleted: false,
          lessonsProgress: {
            'lesson-1-1': {
              lessonId: 'lesson-1-1',
              hasWatchedVideo: true,
              hasCompletedQuiz: true,
              completedAt: new Date(Date.now() - 86400000).toISOString(),
            },
          },
        },
      };
      localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(sampleProgress));
    }
  }

  // --- SETTINGS ---
  public getSettings(): SiteSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  }

  public updateSettings(settings: Partial<SiteSettings>): SiteSettings {
    const current = this.getSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
    this.notify();
    return updated;
  }

  // --- CURRENT USER SESSION ---
  public getCurrentUser(): User | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  public setCurrentUser(user: User | null): void {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
    this.notify(true);
  }

  // --- USERS MANAGEMENT ---
  public getUsers(): User[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USERS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public async registerStudentAsync(
    name: string,
    email: string,
    password: string,
    phone?: string
  ): Promise<{ success: boolean; message: string; user?: User }> {
    const settings = this.getSettings();
    if (settings.googleSheetsUrl) {
      try {
        await this.syncFromCloud(settings.googleSheetsUrl);
      } catch (err) {
        console.warn('Pre-registration sync warning:', err);
      }
    }

    const users = this.getUsers();
    const normalizedEmail = email.trim().toLowerCase();
    const trimmedName = name.trim();

    // Protect Mudarris credentials and identity from being used by student registrants
    if (password === TEACHER_CREDENTIALS.password || password.toLowerCase() === TEACHER_CREDENTIALS.password.toLowerCase()) {
      return { 
        success: false, 
        message: 'Kata sandi ini dilindungi dan dikhususkan untuk akun pengajar. Silakan buat kata sandi lain untuk akun peserta.' 
      };
    }

    if (normalizedEmail === 'kalaamunaa.arabiclearning@gmail.com' || trimmedName.toLowerCase() === TEACHER_CREDENTIALS.username.toLowerCase()) {
      return { 
        success: false, 
        message: 'Identitas ini dikhususkan untuk Mudarris Kalaamunaa.' 
      };
    }

    if (users.some((u) => u.email && u.email.trim().toLowerCase() === normalizedEmail)) {
      return { success: false, message: 'Email sudah terdaftar. Silakan gunakan email lain atau login.' };
    }

    const newUser: User = {
      id: 'usr_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      name: trimmedName,
      email: normalizedEmail,
      password: password,
      role: 'student',
      phone: phone?.trim(),
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    this.setCurrentUser(newUser);

    // Immediately push to Google Sheets so other devices see this new user
    if (settings.googleSheetsUrl) {
      try {
        await this.syncToCloud(settings.googleSheetsUrl);
      } catch (err) {
        console.warn('Post-registration cloud push warning:', err);
      }
    }

    return { success: true, message: 'Pendaftaran berhasil!', user: newUser };
  }

  public registerStudent(name: string, email: string, password: string, phone?: string): { success: boolean; message: string; user?: User } {
    const users = this.getUsers();
    const normalizedEmail = email.trim().toLowerCase();
    const trimmedName = name.trim();

    // Protect Mudarris credentials and identity from being used by student registrants
    if (password === TEACHER_CREDENTIALS.password || password.toLowerCase() === TEACHER_CREDENTIALS.password.toLowerCase()) {
      return { 
        success: false, 
        message: 'Kata sandi ini dilindungi dan dikhususkan untuk akun pengajar. Silakan buat kata sandi lain untuk akun peserta.' 
      };
    }

    if (normalizedEmail === 'kalaamunaa.arabiclearning@gmail.com' || trimmedName.toLowerCase() === TEACHER_CREDENTIALS.username.toLowerCase()) {
      return { 
        success: false, 
        message: 'Identitas ini dikhususkan untuk Mudarris Kalaamunaa.' 
      };
    }

    if (users.some((u) => u.email && u.email.trim().toLowerCase() === normalizedEmail)) {
      return { success: false, message: 'Email sudah terdaftar. Silakan gunakan email lain atau login.' };
    }

    const newUser: User = {
      id: 'usr_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      name: trimmedName,
      email: normalizedEmail,
      password: password,
      role: 'student',
      phone: phone?.trim(),
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    this.setCurrentUser(newUser);
    return { success: true, message: 'Pendaftaran berhasil!', user: newUser };
  }

  public async loginStudentAsync(
    identifier: string,
    password: string
  ): Promise<{ success: boolean; message: string; user?: User }> {
    const trimmedId = identifier.trim();
    const lowerId = trimmedId.toLowerCase();

    // Check if Mudarris is logging in via username or admin email
    const isTeacherUsername = lowerId === TEACHER_CREDENTIALS.username.toLowerCase();
    const isTeacherEmail = lowerId === 'kalaamunaa.arabiclearning@gmail.com';

    if (isTeacherUsername || isTeacherEmail) {
      if (password === TEACHER_CREDENTIALS.password) {
        const teacherUser: User = {
          id: 'user-mudarris',
          name: 'Mudarris Kalaamunaa',
          email: 'kalaamunaa.arabiclearning@gmail.com',
          role: 'teacher',
          createdAt: new Date().toISOString(),
        };
        this.setCurrentUser(teacherUser);
        return { 
          success: true, 
          message: 'Ahlan wa Sahlan, Mudarris Kalaamunaa! Mengalihkan ke Dasbor...', 
          user: teacherUser 
        };
      } else {
        return { 
          success: false, 
          message: 'Password Mudarris Kalaamunaa salah. Periksa kembali huruf besar/kecil.' 
        };
      }
    }

    // Normal student login by email
    let users = this.getUsers();
    let found = users.find((u) => u.email && u.email.trim().toLowerCase() === lowerId);

    // If user not found in local cache or wrong password, actively pull fresh data directly from Google Sheets
    const settings = this.getSettings();
    if ((!found || found.password !== password) && settings.googleSheetsUrl) {
      try {
        const remoteData = await fetchFromGoogleSheets(settings.googleSheetsUrl);
        if (remoteData && typeof remoteData === 'object') {
          if (Array.isArray(remoteData.users)) {
            const remoteUser = remoteData.users.find(
              (u: User) => u.email && u.email.trim().toLowerCase() === lowerId
            );
            if (remoteUser) {
              found = remoteUser;
            }
          }
          this.importDataBundle(remoteData);
        }
        if (!found) {
          users = this.getUsers();
          found = users.find((u) => u.email && u.email.trim().toLowerCase() === lowerId);
        }
      } catch (err) {
        console.warn('Realtime cloud sync on login failed:', err);
      }
    }

    if (!found) {
      return { success: false, message: 'Email tidak ditemukan. Pastikan Anda sudah mendaftar.' };
    }

    if (found.password && found.password !== password) {
      return { success: false, message: 'Password salah. Silakan coba kembali.' };
    }

    this.setCurrentUser(found);
    return { success: true, message: 'Login berhasil!', user: found };
  }

  public loginStudent(identifier: string, password: string): { success: boolean; message: string; user?: User } {
    const trimmedId = identifier.trim();
    const lowerId = trimmedId.toLowerCase();

    // Check if Mudarris is logging in via username or admin email
    const isTeacherUsername = lowerId === TEACHER_CREDENTIALS.username.toLowerCase();
    const isTeacherEmail = lowerId === 'kalaamunaa.arabiclearning@gmail.com';

    if (isTeacherUsername || isTeacherEmail) {
      if (password === TEACHER_CREDENTIALS.password) {
        const teacherUser: User = {
          id: 'user-mudarris',
          name: 'Mudarris Kalaamunaa',
          email: 'kalaamunaa.arabiclearning@gmail.com',
          role: 'teacher',
          createdAt: new Date().toISOString(),
        };
        this.setCurrentUser(teacherUser);
        return { 
          success: true, 
          message: 'Ahlan wa Sahlan, Mudarris Kalaamunaa! Mengalihkan ke Dasbor...', 
          user: teacherUser 
        };
      } else {
        return { 
          success: false, 
          message: 'Password Mudarris Kalaamunaa salah. Periksa kembali huruf besar/kecil.' 
        };
      }
    }

    const users = this.getUsers();
    const found = users.find((u) => u.email && u.email.trim().toLowerCase() === lowerId);

    if (!found) {
      return { success: false, message: 'Email tidak ditemukan. Pastikan Anda sudah mendaftar.' };
    }

    if (found.password && found.password !== password) {
      return { success: false, message: 'Password salah. Silakan coba kembali.' };
    }

    this.setCurrentUser(found);
    return { success: true, message: 'Login berhasil!', user: found };
  }

  // --- COURSES MANAGEMENT ---
  public getCourses(): Course[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.COURSES);
      return data ? JSON.parse(data) : DEFAULT_COURSES;
    } catch {
      return DEFAULT_COURSES;
    }
  }

  public getCourseById(id: string): Course | undefined {
    return this.getCourses().find((c) => c.id === id);
  }

  public saveCourse(course: Course): void {
    const courses = this.getCourses();
    const index = courses.findIndex((c) => c.id === course.id);
    if (index >= 0) {
      courses[index] = course;
    } else {
      courses.unshift(course);
    }
    localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(courses));
    this.notify();
  }

  public deleteCourse(id: string): void {
    const courses = this.getCourses().filter((c) => c.id !== id);
    localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(courses));
    this.notify();
  }

  // --- CART MANAGEMENT ---
  public getCart(): Course[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CART);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public addToCart(course: Course): boolean {
    const cart = this.getCart();
    if (!cart.some((c) => c.id === course.id)) {
      cart.push(course);
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
      this.notify();
      return true;
    }
    return false;
  }

  public removeFromCart(courseId: string): void {
    const cart = this.getCart().filter((c) => c.id !== courseId);
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    this.notify();
  }

  public clearCart(): void {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify([]));
    this.notify();
  }

  // --- ORDERS MANAGEMENT & APPROVAL ---
  public getOrders(): Order[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public createOrder(student: User, courses: Course[]): Order {
    const orders = this.getOrders();
    const totalPrice = courses.reduce((sum, c) => sum + c.price, 0);
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randNum = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `KLM-${dateStr}-${randNum}`;

    const newOrder: Order = {
      id: 'ord_' + Date.now().toString(36) + randNum,
      orderNumber,
      studentId: student.id,
      studentName: student.name,
      studentEmail: student.email,
      studentPhone: student.phone,
      items: courses.map((c) => ({
        courseId: c.id,
        courseTitle: c.title,
        price: c.price,
        thumbnail: c.thumbnail,
      })),
      totalPrice,
      status: 'pending', // Menunggu Approval Admin
      createdAt: new Date().toISOString(),
    };

    orders.unshift(newOrder);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    this.clearCart();
    this.notify();
    return newOrder;
  }

  public updateOrderStatus(orderId: string, status: 'pending' | 'approved' | 'rejected'): void {
    const orders = this.getOrders();
    const order = orders.find((o) => o.id === orderId);
    if (order) {
      order.status = status;
      if (status === 'approved') {
        order.approvedAt = new Date().toISOString();
      }
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
      this.notify();
    }
  }

  public deleteOrder(orderId: string): void {
    const orders = this.getOrders().filter((o) => o.id !== orderId);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    this.notify();
  }

  /**
   * Check if a student has approved access to a specific course
   */
  public isCourseApprovedForStudent(studentId: string, courseId: string): boolean {
    const orders = this.getOrders();
    return orders.some(
      (order) =>
        order.studentId === studentId &&
        order.status === 'approved' &&
        order.items.some((item) => item.courseId === courseId)
    );
  }

  /**
   * Check if a course is ordered but still pending approval
   */
  public isCoursePendingForStudent(studentId: string, courseId: string): boolean {
    const orders = this.getOrders();
    return orders.some(
      (order) =>
        order.studentId === studentId &&
        order.status === 'pending' &&
        order.items.some((item) => item.courseId === courseId)
    );
  }

  /**
   * Get all courses that the student has ordered (with their access status)
   */
  public getStudentCourses(studentId: string): { course: Course; status: 'approved' | 'pending'; orderId: string }[] {
    const orders = this.getOrders();
    const allCourses = this.getCourses();
    const result: { course: Course; status: 'approved' | 'pending'; orderId: string }[] = [];
    const seenCourseIds = new Set<string>();

    // Process approved orders first so approved status wins
    const studentOrders = orders.filter((o) => o.studentId === studentId);
    
    // Check approved orders
    for (const order of studentOrders.filter((o) => o.status === 'approved')) {
      for (const item of order.items) {
        if (!seenCourseIds.has(item.courseId)) {
          const course = allCourses.find((c) => c.id === item.courseId);
          if (course) {
            seenCourseIds.add(item.courseId);
            result.push({ course, status: 'approved', orderId: order.id });
          }
        }
      }
    }

    // Check pending orders
    for (const order of studentOrders.filter((o) => o.status === 'pending')) {
      for (const item of order.items) {
        if (!seenCourseIds.has(item.courseId)) {
          const course = allCourses.find((c) => c.id === item.courseId);
          if (course) {
            seenCourseIds.add(item.courseId);
            result.push({ course, status: 'pending', orderId: order.id });
          }
        }
      }
    }

    return result;
  }

  // --- LESSON PROGRESS & CERTIFICATE TRACKING ---
  public getAllProgress(): Record<string, UserCourseProgress> {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROGRESS);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  }

  public getCourseProgress(userId: string, courseId: string): UserCourseProgress {
    const key = `${userId}_${courseId}`;
    const all = this.getAllProgress();
    if (all[key]) {
      return all[key];
    }

    const initial: UserCourseProgress = {
      userId,
      courseId,
      lessonsProgress: {},
      isCompleted: false,
    };
    return initial;
  }

  public markVideoWatched(userId: string, courseId: string, lessonId: string): UserCourseProgress {
    const key = `${userId}_${courseId}`;
    const all = this.getAllProgress();
    const current = all[key] || {
      userId,
      courseId,
      lessonsProgress: {},
      isCompleted: false,
    };

    if (!current.lessonsProgress[lessonId]) {
      current.lessonsProgress[lessonId] = {
        lessonId,
        hasWatchedVideo: true,
        hasCompletedQuiz: false,
      };
    } else {
      current.lessonsProgress[lessonId].hasWatchedVideo = true;
    }

    all[key] = current;
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(all));
    this.notify();
    return current;
  }

  public markQuizCompleted(userId: string, courseId: string, lessonId: string): UserCourseProgress {
    const key = `${userId}_${courseId}`;
    const all = this.getAllProgress();
    const current = all[key] || {
      userId,
      courseId,
      lessonsProgress: {},
      isCompleted: false,
    };

    if (!current.lessonsProgress[lessonId]) {
      current.lessonsProgress[lessonId] = {
        lessonId,
        hasWatchedVideo: true,
        hasCompletedQuiz: true,
        completedAt: new Date().toISOString(),
      };
    } else {
      current.lessonsProgress[lessonId].hasCompletedQuiz = true;
      current.lessonsProgress[lessonId].completedAt = new Date().toISOString();
    }

    // Check if all lessons of this course are completed
    const course = this.getCourseById(courseId);
    if (course && course.lessons.length > 0) {
      const allLessonsDone = course.lessons.every(
        (l) => current.lessonsProgress[l.id]?.hasWatchedVideo && current.lessonsProgress[l.id]?.hasCompletedQuiz
      );
      if (allLessonsDone) {
        current.isCompleted = true;
      }
    }

    all[key] = current;
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(all));
    this.notify();
    return current;
  }

  // --- POSTS / ARTICLES MANAGEMENT ---
  public getPosts(): Post[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.POSTS);
      return data ? JSON.parse(data) : DEFAULT_POSTS;
    } catch {
      return DEFAULT_POSTS;
    }
  }

  public savePost(post: Post): void {
    const posts = this.getPosts();
    const index = posts.findIndex((p) => p.id === post.id);
    if (index >= 0) {
      posts[index] = post;
    } else {
      posts.unshift(post);
    }
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
    this.notify();
  }

  public deletePost(id: string): void {
    const posts = this.getPosts().filter((p) => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
    this.notify();
  }

  // --- TESTIMONIALS MANAGEMENT ---
  public getTestimonials(): Testimonial[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TESTIMONIALS);
      return data ? JSON.parse(data) : DEFAULT_TESTIMONIALS;
    } catch {
      return DEFAULT_TESTIMONIALS;
    }
  }

  public saveTestimonial(testimonial: Testimonial): void {
    const list = this.getTestimonials();
    const index = list.findIndex((t) => t.id === testimonial.id);
    if (index >= 0) {
      list[index] = testimonial;
    } else {
      list.unshift(testimonial);
    }
    localStorage.setItem(STORAGE_KEYS.TESTIMONIALS, JSON.stringify(list));
    this.notify();
  }

  public deleteTestimonial(id: string): void {
    const list = this.getTestimonials().filter((t) => t.id !== id);
    localStorage.setItem(STORAGE_KEYS.TESTIMONIALS, JSON.stringify(list));
    this.notify();
  }

  // --- FULL CLOUD SYNC & BACKUP ---
  public getAllDataBundle() {
    return {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      settings: this.getSettings(),
      courses: this.getCourses(),
      users: this.getUsers(),
      orders: this.getOrders(),
      progress: this.getAllProgress(),
      posts: this.getPosts(),
      testimonials: this.getTestimonials(),
    };
  }

  public importDataBundle(data: any): boolean {
    this.isImporting = true;
    try {
      if (!data) return false;
      if (data.settings && typeof data.settings === 'object') {
        const current = this.getSettings();
        const merged = { ...current, ...data.settings };
        if (!merged.googleSheetsUrl && current.googleSheetsUrl) {
          merged.googleSheetsUrl = current.googleSheetsUrl;
        }
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(merged));
      }
      if (data.courses && Array.isArray(data.courses) && data.courses.length > 0) {
        localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(data.courses));
      }
      if (data.users && Array.isArray(data.users)) {
        // Smart merge users by email, preserving passwords
        const localUsers = this.getUsers();
        const userMap = new Map<string, User>();
        localUsers.forEach((u) => {
          if (u.email) userMap.set(u.email.trim().toLowerCase(), u);
        });
        data.users.forEach((u: User) => {
          if (u.email) {
            const key = u.email.trim().toLowerCase();
            const existing = userMap.get(key);
            userMap.set(key, {
              ...existing,
              ...u,
              email: key,
              password: u.password || existing?.password || '',
            });
          }
        });
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(Array.from(userMap.values())));
      }
      if (data.orders && Array.isArray(data.orders)) {
        // Smart merge orders by ID
        const localOrders = this.getOrders();
        const orderMap = new Map<string, Order>();
        localOrders.forEach((o) => {
          if (o.id) orderMap.set(o.id, o);
        });
        data.orders.forEach((o: Order) => {
          if (o.id) orderMap.set(o.id, o);
        });
        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(Array.from(orderMap.values())));
      }
      if (data.progress && typeof data.progress === 'object') {
        const localProg = this.getAllProgress();
        const mergedProg = { ...localProg, ...data.progress };
        localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(mergedProg));
      }
      if (data.posts && Array.isArray(data.posts) && data.posts.length > 0) {
        localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(data.posts));
      }
      if (data.testimonials && Array.isArray(data.testimonials) && data.testimonials.length > 0) {
        localStorage.setItem(STORAGE_KEYS.TESTIMONIALS, JSON.stringify(data.testimonials));
      }
      return true;
    } catch (err) {
      console.error('Failed importing bundle:', err);
      return false;
    } finally {
      this.isImporting = false;
      this.notify(true);
    }
  }

  public async syncToCloud(url: string): Promise<boolean> {
    const bundle = this.getAllDataBundle();
    return await sendToGoogleSheets(url, bundle);
  }

  public async syncFromCloud(url: string): Promise<boolean> {
    const remoteData = await fetchFromGoogleSheets(url);
    if (remoteData && typeof remoteData === 'object' && Object.keys(remoteData).length > 0) {
      this.importDataBundle(remoteData);
      return true;
    }
    return false;
  }
}

export const storage = new StorageService();
