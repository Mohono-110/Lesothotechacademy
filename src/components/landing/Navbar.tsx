'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/store';
import Image from 'next/image';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { setView, isAuthenticated, isAdmin, logout, currentStudent, currentAdmin, setStudentSubView, setAdminSubView } = useAppStore();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDashboard = () => {
    if (isAdmin) {
      setView('admin-dashboard');
      setAdminSubView('overview');
    } else {
      setView('student-dashboard');
      setStudentSubView('overview');
    }
    setMobileOpen(false);
  };

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
  };

  const scrollToSection = (id: string) => {
    setMobileOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-lta-green/10'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <button
            onClick={() => scrollToSection('hero')}
            className="flex items-center gap-3 group"
          >
            <div className="relative w-10 h-10 lg:w-12 lg:h-12 overflow-hidden rounded-full border-2 border-lta-green/30 group-hover:border-lta-green transition-colors">
              <Image
                src="/logo.png"
                alt="Lesotho Tech Academy"
                fill
                className="object-cover"
                sizes="48px"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm lg:text-base text-foreground leading-tight">
                Lesotho Tech
              </span>
              <span className="text-[10px] lg:text-xs text-lta-green font-semibold tracking-wider uppercase">
                Academy
              </span>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {[
              { label: 'Home', id: 'hero' },
              { label: 'Courses', id: 'courses' },
              { label: 'About', id: 'about' },
              { label: 'Achievements', id: 'achievements' },
              { label: 'Contact', id: 'footer' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-lta-green rounded-lg hover:bg-lta-green/5 transition-all"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDashboard}
                  className="gap-2 text-muted-foreground hover:text-lta-green"
                >
                  <User className="h-4 w-4" />
                  <span className="text-xs">
                    {isAdmin ? 'Admin' : `${currentStudent?.firstName} ${currentStudent?.lastName}`}
                  </span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="gap-2 border-lta-green/30 text-lta-green hover:bg-lta-green/5"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setView('login')}
                  className="text-muted-foreground hover:text-lta-green"
                >
                  Login
                </Button>
                <Button
                  size="sm"
                  onClick={() => setView('register')}
                  className="bg-lta-green hover:bg-lta-green-dark text-white btn-glow-green"
                >
                  Register
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-lta-green/5 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <X className="h-6 w-6 text-foreground" />
            ) : (
              <Menu className="h-6 w-6 text-foreground" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white/95 backdrop-blur-md border-t border-lta-green/10 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-2">
              {[
                { label: 'Home', id: 'hero' },
                { label: 'Courses', id: 'courses' },
                { label: 'About', id: 'about' },
                { label: 'Achievements', id: 'achievements' },
                { label: 'Contact', id: 'footer' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="block w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-lta-green hover:bg-lta-green/5 transition-all"
                >
                  {item.label}
                </button>
              ))}
              <div className="pt-3 border-t border-lta-green/10 flex flex-col gap-2">
                {isAuthenticated ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDashboard}
                      className="w-full gap-2 border-lta-green/30 text-lta-green"
                    >
                      <User className="h-4 w-4" />
                      Dashboard
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleLogout}
                      className="w-full gap-2"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => { setView('login'); setMobileOpen(false); }}
                      className="w-full border-lta-green/30 text-lta-green"
                    >
                      Login
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => { setView('register'); setMobileOpen(false); }}
                      className="w-full bg-lta-green hover:bg-lta-green-dark text-white"
                    >
                      Register
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
