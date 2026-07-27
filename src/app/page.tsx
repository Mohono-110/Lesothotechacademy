'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import {
  Code2,
  MonitorSmartphone,
  Network,
  Globe,
  GraduationCap,
  BookOpen,
  Wallet,
  Wifi,
  ArrowRight,
  Trophy,
  Medal,
  Star,
  Sparkles,
  ChevronRight,
  Clock,
  Banknote,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

/* ─────────────────── shared animation helpers ─────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.55, ease: 'easeOut' },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: (i: number = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.12, duration: 0.5, ease: 'easeOut' },
  }),
};

/* ─────────────────── section wrapper ─────────────────── */
function Section({
  children,
  className = '',
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.section
      ref={ref}
      id={id}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={fadeUp}
      className={className}
    >
      {children}
    </motion.section>
  );
}

/* ─────────────────── Course data ─────────────────── */
const courses = [
  {
    title: 'Web Development Programming',
    slug: 'web-development-programming',
    duration: '3 Months',
    price: 'M2,600',
    description:
      'Master front-end and back-end web technologies. Build responsive, modern websites and web applications from scratch.',
    icon: Code2,
    accent: 'from-lta-green/20 to-lta-green/5',
    border: 'border-lta-green/20',
    iconBg: 'bg-lta-green/10 text-lta-green',
  },
  {
    title: 'Computer Networks',
    slug: 'computer-networks',
    duration: '6 Months',
    price: 'M3,500',
    description:
      'Understand network fundamentals, routing, switching, security protocols, and enterprise-level infrastructure management.',
    icon: Network,
    accent: 'from-lta-blue/20 to-lta-blue/5',
    border: 'border-lta-blue/20',
    iconBg: 'bg-lta-blue/10 text-lta-blue',
  },
  {
    title: 'CMS Development & Customization',
    slug: 'cms-development-customization',
    duration: '6 Months',
    price: 'M4,000',
    description:
      'Learn to build and customize Content Management Systems using WordPress, Joomla, and modern headless CMS platforms.',
    icon: Globe,
    accent: 'from-amber-500/20 to-amber-500/5',
    border: 'border-amber-500/20',
    iconBg: 'bg-amber-500/10 text-amber-600',
  },
  {
    title: 'Business Development Systems',
    slug: 'business-development-systems',
    duration: '3 Months',
    price: 'M2,000',
    description:
      'Develop enterprise-grade business solutions including CRM, ERP systems, and automation tools for organizational growth.',
    icon: MonitorSmartphone,
    accent: 'from-purple-500/20 to-purple-500/5',
    border: 'border-purple-500/20',
    iconBg: 'bg-purple-500/10 text-purple-600',
  },
];

/* ═══════════════════════════════════════════════════════════════ */
/* ───────────────────── HOME PAGE ──────────────────────────────── */
/* ═══════════════════════════════════════════════════════════════ */
export default function HomePage() {
  return (
    <div className="flex-1 flex flex-col">
      {/* ═══════ HERO ═══════ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1B5E20] via-[#004D40] to-[#01579B]" />

        {/* Animated Decorative Circles */}
        <motion.div
          className="absolute top-[-120px] left-[-80px] w-[340px] h-[340px] rounded-full bg-lta-green/10 blur-3xl"
          animate={{ x: [0, 30, 0], y: [0, -20, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-[-100px] right-[-60px] w-[400px] h-[400px] rounded-full bg-lta-blue/10 blur-3xl"
          animate={{ x: [0, -25, 0], y: [0, 25, 0], scale: [1, 0.95, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-[30%] right-[10%] w-[200px] h-[200px] rounded-full border border-white/10"
          animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-[20%] left-[5%] w-[150px] h-[150px] rounded-full border border-white/10"
          animate={{ scale: [1, 0.9, 1], opacity: [0.1, 0.25, 0.1] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-[15%] left-[40%] w-[80px] h-[80px] rounded-full bg-white/5"
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-[30%] right-[25%] w-[60px] h-[60px] rounded-full bg-white/5"
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '48px 48px' }} />

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="mb-6"
          >
            <div className="inline-flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white/10 backdrop-blur-sm border-2 border-white/20 shadow-2xl">
              <img
                src="/logo.png"
                alt="Lesotho Tech Academy"
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover"
              />
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-tight mb-4"
          >
            Lesotho Tech{' '}
            <span className="text-lta-green-light">Academy</span>
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.55 }}
            className="text-lg sm:text-xl md:text-2xl text-white/80 font-medium tracking-wide mb-6"
          >
            Learn&nbsp;&nbsp;|&nbsp;&nbsp;Code&nbsp;&nbsp;|&nbsp;&nbsp;Innovate
          </motion.p>

          {/* Intro */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.55 }}
            className="max-w-2xl mx-auto text-sm sm:text-base text-white/70 leading-relaxed mb-10"
          >
            Premier IT training institution in Leribe 300 District, Lesotho.
            Bridging the technology skills gap with industry-aligned,
            practical education that empowers the next generation of innovators.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14"
          >
            <Link href="/admissions">
              <Button
                size="lg"
                className="bg-lta-green hover:bg-lta-green-dark text-white text-base px-8 py-6 shadow-lg shadow-lta-green/30 btn-glow-green rounded-xl"
              >
                <GraduationCap className="h-5 w-5 mr-2" />
                Apply Now
              </Button>
            </Link>
            <Link href="/courses">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white/30 text-white hover:bg-white/10 hover:text-white text-base px-8 py-6 rounded-xl backdrop-blur-sm"
              >
                <BookOpen className="h-5 w-5 mr-2" />
                Explore Courses
              </Button>
            </Link>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.55 }}
            className="grid grid-cols-3 gap-4 sm:gap-8 max-w-lg mx-auto"
          >
            {[
              { value: '4+', label: 'Courses' },
              { value: 'M300', label: 'Registration' },
              { value: 'Online', label: 'Classes Available' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center gap-1 p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10"
              >
                <span className="text-lg sm:text-2xl font-bold text-lta-green-light">
                  {stat.value}
                </span>
                <span className="text-[10px] sm:text-xs text-white/60 font-medium">
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-1.5">
            <div className="w-1.5 h-3 rounded-full bg-white/50" />
          </div>
        </motion.div>
      </section>

      {/* ═══════ WHY CHOOSE US ═══════ */}
      <Section className="py-20 sm:py-28 section-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <motion.div variants={fadeUp} custom={0}>
              <Badge className="mb-4 bg-lta-green/10 text-lta-green border-lta-green/20 px-4 py-1.5 text-xs font-semibold tracking-wide uppercase">
                Why Choose Us
              </Badge>
            </motion.div>
            <motion.h2
              variants={fadeUp}
              custom={1}
              className="text-3xl sm:text-4xl font-bold text-foreground mb-4"
            >
              Why <span className="gradient-text">Lesotho Tech Academy</span>?
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="max-w-2xl mx-auto text-muted-foreground">
              We combine practical skills, affordable pricing, and industry-relevant curriculum
              to deliver a learning experience that truly transforms careers.
            </motion.p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Code2,
                title: 'Hands-On Training',
                description:
                  'Every course is built around real-world projects so you graduate with a portfolio, not just a certificate.',
              },
              {
                icon: BookOpen,
                title: 'Industry-Aligned Curriculum',
                description:
                  'Our syllabus is regularly updated with input from tech industry professionals to keep you ahead of trends.',
              },
              {
                icon: Wallet,
                title: 'Affordable Fees',
                description:
                  'Quality IT education should not break the bank. Our fees are the most competitive in Lesotho.',
              },
              {
                icon: Wifi,
                title: 'Online Classes',
                description:
                  'Study from anywhere with our online class option. Perfect for working professionals and remote learners.',
              },
            ].map((item, i) => (
              <motion.div key={item.title} variants={fadeUp} custom={i + 3}>
                <Card className="h-full text-center group hover:shadow-lg hover:shadow-lta-green/5 transition-all duration-300 hover:-translate-y-1 py-8 px-6">
                  <CardContent className="space-y-4">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-lta-green/10 text-lta-green group-hover:bg-lta-green group-hover:text-white transition-colors duration-300">
                      <item.icon className="h-7 w-7" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══════ COURSES PREVIEW ═══════ */}
      <Section className="py-20 sm:py-28 bg-gradient-to-b from-white to-lta-green/[0.02]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <motion.div variants={fadeUp} custom={0}>
              <Badge className="mb-4 bg-lta-blue/10 text-lta-blue border-lta-blue/20 px-4 py-1.5 text-xs font-semibold tracking-wide uppercase">
                Our Courses
              </Badge>
            </motion.div>
            <motion.h2
              variants={fadeUp}
              custom={1}
              className="text-3xl sm:text-4xl font-bold text-foreground mb-4"
            >
              Explore Our <span className="gradient-text">Programmes</span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="max-w-2xl mx-auto text-muted-foreground">
              Choose from our carefully designed courses that prepare you for the real-world tech industry.
            </motion.p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {courses.map((course, i) => (
              <motion.div key={course.slug} variants={scaleIn} custom={i}>
                <Card className="h-full group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 py-0 gap-0 overflow-hidden">
                  {/* Color Accent Bar */}
                  <div
                    className={`h-1.5 bg-gradient-to-r ${course.accent.replace('/20', '/60').replace('/5', '/30')}`}
                  />
                  <CardContent className="p-6 space-y-4">
                    {/* Icon + Duration */}
                    <div className="flex items-start justify-between">
                      <div
                        className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${course.iconBg}`}
                      >
                        <course.icon className="h-6 w-6" />
                      </div>
                      <Badge
                        variant="secondary"
                        className="text-[10px] font-semibold bg-muted/80 text-muted-foreground"
                      >
                        <Clock className="h-3 w-3 mr-1" />
                        {course.duration}
                      </Badge>
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-semibold text-foreground leading-snug min-h-[2.5rem]">
                      {course.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                      {course.description}
                    </p>

                    {/* Price + Link */}
                    <div className="flex items-center justify-between pt-2 border-t border-border/50">
                      <span className="text-lg font-bold text-lta-green">
                        {course.price}
                      </span>
                      <Link href={`/courses/${course.slug}`}>
                        <span className="inline-flex items-center gap-1 text-sm font-medium text-lta-blue hover:text-lta-blue-dark transition-colors group-hover:gap-2">
                          Learn More
                          <ChevronRight className="h-4 w-4" />
                        </span>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* View All */}
          <motion.div variants={fadeUp} custom={4} className="text-center mt-10">
            <Link href="/courses">
              <Button
                variant="outline"
                size="lg"
                className="border-lta-green/30 text-lta-green hover:bg-lta-green hover:text-white btn-glow-green rounded-xl px-8"
              >
                View All Courses
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </Section>

      {/* ═══════ ACHIEVEMENTS ═══════ */}
      <Section className="py-20 sm:py-28 bg-gradient-to-b from-lta-green/[0.03] to-transparent">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <motion.div variants={fadeUp} custom={0}>
              <Badge className="mb-4 bg-amber-500/10 text-amber-600 border-amber-500/20 px-4 py-1.5 text-xs font-semibold tracking-wide uppercase">
                Achievements
              </Badge>
            </motion.div>
            <motion.h2
              variants={fadeUp}
              custom={1}
              className="text-3xl sm:text-4xl font-bold text-foreground mb-4"
            >
              Award-Winning <span className="gradient-text">Excellence</span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="max-w-2xl mx-auto text-muted-foreground">
              Our commitment to quality education and mentorship has been recognised
              at the highest national level.
            </motion.p>
          </div>

          <motion.div variants={fadeUp} custom={3}>
            <Card className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-white to-yellow-50 dark:from-amber-950/20 dark:via-card dark:to-yellow-950/20 border-amber-200/50 dark:border-amber-800/30 py-0 gap-0">
              {/* Decorative corner glow */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-amber-300/20 to-transparent rounded-bl-full pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-36 h-36 bg-gradient-to-tr from-yellow-300/15 to-transparent rounded-tr-full pointer-events-none" />

              <CardContent className="relative p-8 sm:p-10 lg:p-14">
                <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
                  {/* Trophy / Award Visual */}
                  <div className="flex-shrink-0">
                    <motion.div
                      animate={{ rotate: [0, 3, -3, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                      className="relative"
                    >
                      <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center shadow-xl shadow-amber-400/30 animate-pulse-glow">
                        <Trophy className="h-14 w-14 sm:h-16 sm:w-16 text-white drop-shadow-lg" />
                      </div>
                      {/* Sparkle accents */}
                      <motion.div
                        animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute -top-2 -right-2"
                      >
                        <Sparkles className="h-5 w-5 text-amber-500" />
                      </motion.div>
                      <motion.div
                        animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.8, 0.4] }}
                        transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
                        className="absolute -bottom-1 -left-1"
                      >
                        <Star className="h-4 w-4 text-yellow-500" />
                      </motion.div>
                    </motion.div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 text-center lg:text-left">
                    <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
                      LSMTA Science Fair 2026
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mb-5">
                      Our founder mentored <strong className="text-foreground">3 students</strong> from{' '}
                      <a
                        href="https://millicentacademy.co.ls"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-lta-blue hover:text-lta-blue-dark underline underline-offset-2 decoration-lta-blue/40 hover:decoration-lta-blue transition-colors font-medium"
                      >
                        Millicent Academy Junior School
                      </a>{' '}
                      for the LSMTA Science Fair 2026, competing in the Technology Category.
                      The students achieved outstanding results at the <strong className="text-foreground">National Level</strong>:
                    </p>

                    {/* Prize Badges */}
                    <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 mb-5">
                      <div className="inline-flex items-center gap-2.5 bg-gradient-to-r from-amber-400 to-yellow-400 text-amber-900 px-5 py-2.5 rounded-xl shadow-md">
                        <Medal className="h-5 w-5" />
                        <span className="font-bold text-sm">1st Prize</span>
                        <Star className="h-3.5 w-3.5 fill-current" />
                      </div>
                      <div className="inline-flex items-center gap-2.5 bg-gradient-to-r from-slate-300 to-slate-400 text-slate-800 px-5 py-2.5 rounded-xl shadow-md">
                        <Medal className="h-5 w-5" />
                        <span className="font-bold text-sm">2nd Prize</span>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground">
                      This achievement demonstrates our commitment to practical mentorship and
                      the power of quality technology education in transforming young lives in Lesotho.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </Section>

      {/* ═══════ CTA ═══════ */}
      <Section className="py-20 sm:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            variants={scaleIn}
            custom={0}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1B5E20] via-[#004D40] to-[#01579B] p-10 sm:p-14 lg:p-16"
          >
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-56 h-56 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4 pointer-events-none" />

            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Start Your Tech Journey?
              </h2>
              <p className="text-white/75 max-w-xl mx-auto mb-2 text-sm sm:text-base leading-relaxed">
                Join Lesotho Tech Academy and gain the practical skills you need
                to thrive in today&apos;s digital economy.
              </p>
              <p className="text-lta-green-light font-medium text-sm mb-8">
                Registration fee: Only M300 for all courses
              </p>

              <Link href="/admissions">
                <Button
                  size="lg"
                  className="bg-white text-[#1B5E20] hover:bg-lta-green-light hover:text-white text-base px-10 py-6 shadow-lg rounded-xl font-semibold transition-colors duration-300"
                >
                  <GraduationCap className="h-5 w-5 mr-2" />
                  Apply Now — M300 Registration
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </Section>
    </div>
  );
}
