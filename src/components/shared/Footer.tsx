'use client';

import Link from 'next/link';
import { MapPin, Phone, Mail, Globe, Facebook, Twitter, Linkedin, Instagram, ArrowRight } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-b from-white to-gray-50 border-t border-lta-green/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
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
              {[Facebook, Twitter, Linkedin, Instagram].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-lg bg-lta-green/10 flex items-center justify-center text-lta-green hover:bg-lta-green hover:text-white transition-all"
                  aria-label={Icon.displayName}
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {[
                { href: '/', label: 'Home' },
                { href: '/about', label: 'About Us' },
                { href: '/courses', label: 'Our Courses' },
                { href: '/admissions', label: 'Admissions' },
                { href: '/news', label: 'News & Events' },
                { href: '/contact', label: 'Contact Us' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-lta-green transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Our Courses</h4>
            <ul className="space-y-2.5">
              {[
                { href: '/courses/web-development-programming', label: 'Web Development (3 Months)' },
                { href: '/courses/computer-networks', label: 'Computer Networks (6 Months)' },
                { href: '/courses/cms-development-customization', label: 'CMS Development (6 Months)' },
                { href: '/courses/business-development-systems', label: 'Business Dev Systems (3 Months)' },
              ].map((course) => (
                <li key={course.href}>
                  <Link href={course.href} className="text-sm text-muted-foreground hover:text-lta-green transition-colors">
                    {course.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-lta-green shrink-0 mt-0.5" />
                <span className="text-sm text-muted-foreground">Leribe 300 District, Lesotho</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="h-4 w-4 text-lta-green shrink-0 mt-0.5" />
                <div className="text-sm text-muted-foreground">
                  <a href="tel:+26650699110" className="hover:text-lta-green transition-colors">+266 5069 9110</a>
                  <span className="mx-2 text-muted-foreground/40">|</span>
                  <a href="tel:+26662835137" className="hover:text-lta-green transition-colors">+266 6283 5137</a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="h-4 w-4 text-lta-green shrink-0 mt-0.5" />
                <a href="mailto:info@lesothotechacademy.org" className="text-sm text-muted-foreground hover:text-lta-green transition-colors">
                  info@lesothotechacademy.org
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Globe className="h-4 w-4 text-lta-green shrink-0 mt-0.5" />
                <a href="https://www.lesothotechacademy.org" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-lta-green transition-colors">
                  www.lesothotechacademy.org
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-lta-green/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground text-center sm:text-left">
              &copy; {currentYear} Lesotho Tech Academy. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground">
              Founded by Relebohile Joseph Mohono &bull; Leribe, Lesotho
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
