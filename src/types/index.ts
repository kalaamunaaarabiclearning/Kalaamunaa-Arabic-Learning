export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'student' | 'teacher' | 'admin';
  phone?: string;
  createdAt: string;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  description: string;
  youtubeUrl: string; // e.g. https://www.youtube.com/watch?v=...
  quizUrl: string; // Google Form URL
  duration?: string;
  order: number;
}

export interface Course {
  id: string;
  title: string;
  arabicTitle?: string;
  level: 'Pemula (Mubtadi\')' | 'Menengah (Mutawassith)' | 'Mahir (Mutaqaddim)';
  category: string;
  price: number;
  originalPrice?: number;
  thumbnail: string;
  shortDescription: string;
  fullDescription: string;
  whatYouWillGet: string[]; // Apa yang didapatkan setelah kursus
  instructorName: string;
  certificateFormUrl: string; // Google Form custom link for certificate request
  lessons: Lesson[];
  isFeatured?: boolean;
}

export interface OrderItem {
  courseId: string;
  courseTitle: string;
  price: number;
  thumbnail?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentPhone?: string;
  items: OrderItem[];
  totalPrice: number;
  status: 'pending' | 'approved' | 'rejected'; // pending = Menunggu Approval Admin
  createdAt: string;
  approvedAt?: string;
  notes?: string;
}

export interface LessonProgress {
  lessonId: string;
  hasWatchedVideo: boolean; // Clicked "Saya Sudah Menonton"
  hasCompletedQuiz: boolean; // Clicked "Saya Sudah Kerjakan Kuis"
  completedAt?: string;
}

export interface UserCourseProgress {
  userId: string;
  courseId: string;
  lessonsProgress: Record<string, LessonProgress>;
  currentLessonId?: string;
  isCompleted: boolean;
  certificateRequested?: boolean;
}

export interface Post {
  id: string;
  title: string;
  arabicHeading?: string;
  category: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  author: string;
  publishedDate: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  city?: string;
  stars: number;
  review: string;
  avatarUrl: string;
  courseName?: string;
}

export interface SiteSettings {
  appName: string;
  arabicSubtitle: string;
  heroBadge: string;
  heroTitle: string;
  heroHighlight: string;
  heroDescription: string;
  arabicQuote: string;
  arabicQuoteTranslation: string;
  whatsappNumber: string; // 6282311776535
  adminEmail: string; // kalaamunaa.arabiclearning@gmail.com
  instagramUsername: string; // kalaamunaa.arabic
  youtubeHandle: string; // @kalaamunaa.arabic
  aboutTitle: string;
  aboutContent: string;
  aboutImageUrl?: string;
  googleSheetsUrl?: string; // Google Apps Script Web App URL for real-time live sync
  // Pratinjau Kelas (Trial Class Video Section)
  previewBadge?: string;
  previewTitle?: string;
  previewArabicSubtitle?: string;
  previewDescription?: string;
  previewYoutubeUrl?: string;
  previewKeyPoints?: string[];
}
