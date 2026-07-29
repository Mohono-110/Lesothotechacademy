'use client';

import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Globe, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer id="footer" className="relative bg-gradient-to-b from-white to-gray-50 border-t border-lta-green/10">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* School info */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-lta-green to-lta-blue flex items-center justify-center text-white font-bold text-sm">
                LTA
              </div>
              <div>
                <h3 className="font-bold text-foreground">Lesotho Tech Academy</h3>
                <p className="text-xs text-muted-foreground">Learn | Code | Innovate</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Premier IT training institution in Lesotho. Empowering youth with practical technology 
              skills for the digital age. Based in Leribe 300 District.
            </p>
            <div className="flex items-center gap-3">
              {[
                { icon: Facebook, href: '#' },
                { icon: Twitter, href: '#' },
                { icon: Linkedin, href: '#' },
                { icon: Instagram, href: '#' },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  className="w-9 h-9 rounded-lg bg-lta-green/10 flex items-center justify-center text-lta-green hover:bg-lta-green hover:text-white transition-all"
                  aria-label={social.icon.displayName}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Home', id: 'hero' },
                { label: 'Courses', id: 'courses' },
                { label: 'About Us', id: 'about' },
                { label: 'Achievements', id: 'achievements' },
                { label: 'Register Now', action: 'register' },
              ].map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => {
                      if (link.id) scrollToSection(link.id);
                    }}
                    className="text-sm text-muted-foreground hover:text-lta-green transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Courses */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Our Courses</h4>
            <ul className="space-y-2.5">
              {[
                'Web Development Programming',
                'CMS Development & Customization',
                'Computer Networks',
                'Business Development Systems',
              ].map((course) => (
                <li key={course}>
                  <button
                    onClick={() => scrollToSection('courses')}
                    className="text-sm text-muted-foreground hover:text-lta-green transition-colors"
                  >
                    {course}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-lta-green shrink-0 mt-0.5" />
                <span className="text-sm text-muted-foreground">
                  Leribe 300 District, Lesotho
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="h-4 w-4 text-lta-green shrink-0 mt-0.5" />
                <span className="text-sm text-muted-foreground">
                  +266 XX XXX XXX
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="h-4 w-4 text-lta-green shrink-0 mt-0.5" />
                <a href="mailto:info@lesothotechacademy.com" className="text-sm text-muted-foreground hover:text-lta-green transition-colors">
                  info@lesothotechacademy.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Globe className="h-4 w-4 text-lta-green shrink-0 mt-0.5" />
                <a href="https://lesothotechacademy.com" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-lta-green transition-colors">
                  lesothotechacademy.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-lta-green/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground text-center sm:text-left">
              © {currentYear} Lesotho Tech Academy. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground">
              Founded by Relebohile Joseph Mohono • Leribe, Lesotho
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
