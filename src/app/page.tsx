'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import About from '@/components/landing/About';
import Courses from '@/components/landing/Courses';
import Founder from '@/components/landing/Founder';
import Achievements from '@/components/landing/Achievements';
import Footer from '@/components/landing/Footer';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import StudentDashboard from '@/components/student/StudentDashboard';
import AdminDashboard from '@/components/admin/AdminDashboard';

export default function Home() {
  const { currentView } = useAppStore();

  return (
    <>
      <AnimatePresence mode="wait">
        {/* Landing Page */}
        {currentView === 'landing' && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="min-h-screen flex flex-col"
          >
            <Navbar />
            <main className="flex-1">
              <Hero />
              <About />
              <Courses />
              <Founder />
              <Achievements />
            </main>
            <Footer />
          </motion.div>
        )}

        {/* Login */}
        {currentView === 'login' && (
          <motion.div
            key="login"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <LoginForm />
          </motion.div>
        )}

        {/* Register */}
        {currentView === 'register' && (
          <motion.div
            key="register"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <RegisterForm />
          </motion.div>
        )}

        {/* Student Dashboard */}
        {(currentView === 'student-dashboard' || currentView === 'course-detail' || currentView === 'apply-course') && (
          <motion.div
            key="student-dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <StudentDashboard />
          </motion.div>
        )}

        {/* Admin Dashboard */}
        {currentView === 'admin-dashboard' && (
          <motion.div
            key="admin-dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <AdminDashboard />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
