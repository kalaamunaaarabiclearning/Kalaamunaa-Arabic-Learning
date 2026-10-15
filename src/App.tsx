/**
 * Kalaamunaa For Arabic Learning
 * Professional Arabic Course Platform with Sequential Video & Quiz Progression,
 * WhatsApp Checkout, Admin Approval System, and Google Spreadsheet Live Database.
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './components/LandingPage';
import { AuthModal } from './components/AuthModal';
import { CartModal } from './components/CartModal';
import { CourseDetailModal } from './components/CourseDetailModal';
import { CourseClassroom } from './components/CourseClassroom';
import { StudentDashboard } from './components/StudentDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { storage } from './services/storage';
import { Course, Order, SiteSettings, User } from './types';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(() => storage.getCurrentUser());
  const [settings, setSettings] = useState<SiteSettings>(() => storage.getSettings());
  const [courses, setCourses] = useState<Course[]>(() => storage.getCourses());
  const [cart, setCart] = useState<Course[]>(() => storage.getCart());
  const [posts, setPosts] = useState(() => storage.getPosts());
  const [testimonials, setTestimonials] = useState(() => storage.getTestimonials());

  // Views & Routing: 'landing' | 'student-dashboard' | 'admin-dashboard' | 'classroom'
  const [currentView, setCurrentView] = useState<'landing' | 'student-dashboard' | 'admin-dashboard' | 'classroom'>('landing');
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);

  // Modals
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authInitialTab, setAuthInitialTab] = useState<'student-login' | 'student-register' | 'teacher-login'>('student-login');
  
  const [isCartOpen, setIsCartOpen] = useState(false);

  const [selectedCourseForDetail, setSelectedCourseForDetail] = useState<Course | null>(null);
  const [isCourseDetailOpen, setIsCourseDetailOpen] = useState(false);

  // Notification Banner
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Subscribe to storage changes
  useEffect(() => {
    const unsub = storage.subscribe(() => {
      setCurrentUser(storage.getCurrentUser());
      setSettings(storage.getSettings());
      setCourses(storage.getCourses());
      setCart(storage.getCart());
      setPosts(storage.getPosts());
      setTestimonials(storage.getTestimonials());
    });
    return unsub;
  }, []);

  // Handle Auth open
  const handleOpenAuth = (tab: 'student-login' | 'student-register' | 'teacher-login' = 'student-login') => {
    setAuthInitialTab(tab);
    setIsAuthOpen(true);
  };

  const handleAuthSuccess = (user: User) => {
    setCurrentUser(user);
    if (user.role === 'teacher' || user.role === 'admin') {
      setCurrentView('admin-dashboard');
      showToast(`Ahlan wa Sahlan, ${user.name}! Masuk ke Dasbor Guru.`);
    } else {
      showToast(`Ahlan wa Sahlan, ${user.name}!`);
    }
  };

  const handleLogout = () => {
    storage.setCurrentUser(null);
    setCurrentUser(null);
    setCurrentView('landing');
    showToast('Anda telah berhasil keluar akun.');
  };

  // Cart actions
  const handleAddToCart = (course: Course) => {
    const added = storage.addToCart(course);
    if (added) {
      showToast(`"${course.title}" berhasil ditambahkan ke keranjang.`);
    } else {
      showToast('Kursus ini sudah berada di dalam keranjang.');
    }
  };

  const handleRemoveFromCart = (courseId: string) => {
    storage.removeFromCart(courseId);
  };

  // Buy Now direct trigger
  const handleBuyNow = (course: Course) => {
    storage.addToCart(course);
    setIsCourseDetailOpen(false);
    setIsCartOpen(true);
  };

  // Classroom entry with security check
  const handleOpenClassroom = (courseId: string) => {
    if (!currentUser) {
      handleOpenAuth('student-login');
      return;
    }

    // Teachers/admins can always preview
    const isTeacher = currentUser.role === 'teacher' || currentUser.role === 'admin';
    if (!isTeacher) {
      // Check if student's course is approved
      const isApproved = storage.isCourseApprovedForStudent(currentUser.id, courseId);
      if (!isApproved) {
        alert('Akses terkunci! Kursus tidak dapat dijalankan kecuali telah mendapatkan approval dari admin.');
        return;
      }
    }

    setActiveCourseId(courseId);
    setCurrentView('classroom');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Enrolled and Approved course IDs for current user
  const studentCourses = currentUser ? storage.getStudentCourses(currentUser.id) : [];
  const approvedCourseIds = studentCourses.filter((s) => s.status === 'approved').map((s) => s.course.id);
  const enrolledCourseIds = studentCourses.map((s) => s.course.id);

  // Active classroom course
  const activeClassroomCourse = activeCourseId ? storage.getCourseById(activeCourseId) : null;

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800 flex flex-col selection:bg-[#0047AB] selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#0047AB] text-white px-5 py-3 rounded-2xl shadow-2xl border border-blue-300 text-xs font-bold animate-in slide-in-from-top-3">
          {toastMessage}
        </div>
      )}

      {/* Main Navbar (Hidden in dedicated Classroom view for immersive focus) */}
      {currentView !== 'classroom' && (
        <Navbar
          currentUser={currentUser}
          cart={cart}
          settings={settings}
          onOpenCart={() => setIsCartOpen(true)}
          onOpenAuth={handleOpenAuth}
          onNavigate={(view) => {
            setCurrentView(view);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          currentView={currentView}
          onLogout={handleLogout}
        />
      )}

      {/* View Routing */}
      <main className="flex-1">
        {currentView === 'landing' && (
          <LandingPage
            settings={settings}
            courses={courses}
            posts={posts}
            testimonials={testimonials}
            currentUser={currentUser}
            onSelectCourse={(course) => {
              setSelectedCourseForDetail(course);
              setIsCourseDetailOpen(true);
            }}
            onAddToCart={handleAddToCart}
            cartCourseIds={cart.map((c) => c.id)}
            onOpenAuth={(tab) => handleOpenAuth(tab)}
            onOpenClassroom={handleOpenClassroom}
            approvedCourseIds={approvedCourseIds}
          />
        )}

        {currentView === 'student-dashboard' && currentUser && (
          <StudentDashboard
            currentUser={currentUser}
            settings={settings}
            onOpenClassroom={handleOpenClassroom}
            onExploreCourses={() => {
              setCurrentView('landing');
              setTimeout(() => {
                document.querySelector('#kursus')?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
          />
        )}

        {currentView === 'admin-dashboard' && currentUser && (
          <AdminDashboard
            currentUser={currentUser}
            onPreviewCourse={handleOpenClassroom}
            onNavigateHome={() => setCurrentView('landing')}
          />
        )}

        {currentView === 'classroom' && activeClassroomCourse && currentUser && (
          <CourseClassroom
            course={activeClassroomCourse}
            currentUser={currentUser}
            onBack={() => {
              if (currentUser.role === 'teacher' || currentUser.role === 'admin') {
                setCurrentView('admin-dashboard');
              } else {
                setCurrentView('student-dashboard');
              }
            }}
          />
        )}
      </main>

      {/* Footer (Hidden in classroom for full-screen focus) */}
      {currentView !== 'classroom' && (
        <Footer
          settings={settings}
          onTeacherLoginClick={() => handleOpenAuth('teacher-login')}
        />
      )}

      {/* MODAL: Auth (Masuk Peserta / Daftar Peserta / Login Guru Mudarris) */}
      <AuthModal
        isOpen={isAuthOpen}
        initialTab={authInitialTab}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      {/* MODAL: Cart & WhatsApp Checkout */}
      <CartModal
        isOpen={isCartOpen}
        cart={cart}
        currentUser={currentUser}
        settings={settings}
        onClose={() => setIsCartOpen(false)}
        onRemoveFromCart={handleRemoveFromCart}
        onRequireLogin={() => {
          setIsCartOpen(false);
          handleOpenAuth('student-login');
        }}
        onOrderCreated={(order) => {
          showToast(`Pesanan ${order.orderNumber} berhasil dibuat! Menunggu Approval Admin.`);
        }}
      />

      {/* MODAL: Course Detail & Syllabus */}
      <CourseDetailModal
        course={selectedCourseForDetail}
        isOpen={isCourseDetailOpen}
        onClose={() => {
          setIsCourseDetailOpen(false);
          setSelectedCourseForDetail(null);
        }}
        onAddToCart={(c) => {
          handleAddToCart(c);
        }}
        onBuyNow={handleBuyNow}
        isInCart={selectedCourseForDetail ? cart.some((c) => c.id === selectedCourseForDetail.id) : false}
        isEnrolled={selectedCourseForDetail ? enrolledCourseIds.includes(selectedCourseForDetail.id) : false}
        isApproved={selectedCourseForDetail ? approvedCourseIds.includes(selectedCourseForDetail.id) : false}
        onOpenClassroom={(cId) => {
          setIsCourseDetailOpen(false);
          handleOpenClassroom(cId);
        }}
      />
    </div>
  );
}
