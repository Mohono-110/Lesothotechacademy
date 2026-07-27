'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About Us' },
  { href: '/courses', label: 'Courses' },
  { href: '/news', label: 'News' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile menu on navigation by using pathname as key
  const mobileKey = mobileOpen ? pathname : 'closed';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-lta-green/10'
          : pathname === '/'
          ? 'bg-transparent'
          : 'bg-white/95 backdrop-blur-md shadow-sm border-b border-lta-green/5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 lg:w-12 lg:h-12 overflow-hidden rounded-full border-2 border-lta-green/30 group-hover:border-lta-green transition-colors">
              <img src="/logo.png" alt="Lesotho Tech Academy" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col">
              <span className={`font-bold text-sm lg:text-base leading-tight ${!scrolled && pathname === '/' ? 'text-white' : 'text-foreground'}`}>
                Lesotho Tech
              </span>
              <span className="text-[10px] lg:text-xs text-lta-green font-semibold tracking-wider uppercase">
                Academy
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 text-sm font-medium rounded-lg hover:bg-lta-green/5 transition-all ${
                  pathname === link.href
                    ? 'text-lta-green bg-lta-green/5'
                    : scrolled || pathname !== '/'
                    ? 'text-muted-foreground hover:text-lta-green'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/admissions">
              <Button
                size="sm"
                className="bg-lta-green hover:bg-lta-green-dark text-white btn-glow-green"
              >
                <GraduationCap className="h-4 w-4 mr-1" />
                Apply Now
              </Button>
            </Link>
            <Link href="/login">
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-lta-green"
              >
                Login
              </Button>
            </Link>
          </div>

          <button
            className={`md:hidden p-2 rounded-lg hover:bg-lta-green/5 transition-colors ${!scrolled && pathname === '/' ? 'text-white' : 'text-foreground'}`}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key={pathname}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white/95 backdrop-blur-md border-t border-lta-green/10 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    pathname === link.href
                      ? 'text-lta-green bg-lta-green/5'
                      : 'text-muted-foreground hover:text-lta-green hover:bg-lta-green/5'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-3 border-t border-lta-green/10 flex flex-col gap-2">
                <Link href="/admissions" className="block">
                  <Button size="sm" className="w-full bg-lta-green hover:bg-lta-green-dark text-white">
                    Apply Now
                  </Button>
                </Link>
                <Link href="/login" className="block">
                  <Button variant="outline" size="sm" className="w-full border-lta-green/30 text-lta-green">
                    Login
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
