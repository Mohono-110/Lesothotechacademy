'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import {
  BookOpen,
  Target,
  Eye,
  Lightbulb,
  Award,
  HandCoins,
  Globe,
  Users,
  ChevronRight,
  ExternalLink,
  GraduationCap,
  Sparkles,
  Heart,
  ShieldCheck,
  Code2,
  MapPin,
  Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

/* ─────────────────── shared animation helpers ─────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.55, ease: 'easeOut' },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: (i: number = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' },
  }),
};

/* ─────────────────── section wrapper ─────────────────── */
function Section({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={fadeUp}
      className={className}
    >
      {children}
    </motion.section>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
/* ───────────────────── ABOUT PAGE ─────────────────────────────── */
/* ═══════════════════════════════════════════════════════════════ */
export default function AboutPage() {
  return (
    <div className="flex-1 flex flex-col">
      {/* ═══════ PAGE HEADER ═══════ */}
      <section className="relative overflow-hidden pt-28 sm:pt-32 pb-16 sm:pb-20 bg-gradient-to-br from-[#1B5E20] via-[#004D40] to-[#01579B]">
        {/* Background decorations */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '48px 48px' }} />
        <motion.div
          className="absolute top-[-60px] right-[-40px] w-[240px] h-[240px] rounded-full bg-lta-green/10 blur-3xl"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity }}
        />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <Breadcrumb className="justify-center">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/" className="text-white/70 hover:text-white">
                    Home
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="text-white/40" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-white font-medium">
                    About Us
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.55 }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4"
          >
            About <span className="text-lta-green-light">Lesotho Tech Academy</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.55 }}
            className="max-w-2xl mx-auto text-white/75 text-sm sm:text-base leading-relaxed"
          >
            Empowering Lesotho&apos;s youth with practical, industry-aligned technology education.
            Learn about our story, our founder, and our vision for a digitally skilled nation.
          </motion.p>
        </div>
      </section>

      {/* ═══════ OUR STORY ═══════ */}
      <Section className="py-16 sm:py-24 section-pattern">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left — Visual */}
            <motion.div variants={scaleIn} custom={0} className="order-2 lg:order-1">
              <div className="relative">
                <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-lta-green/10 via-lta-blue/5 to-lta-green/5 border border-lta-green/10 flex items-center justify-center overflow-hidden">
                  <div className="text-center p-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-lta-green to-lta-blue mb-5 shadow-lg shadow-lta-green/20">
                      <img
                        src="/logo.png"
                        alt="Lesotho Tech Academy"
                        className="w-14 h-14 rounded-xl object-cover"
                      />
                    </div>
                    <h3 className="text-xl font-bold gradient-text mb-2">
                      Est. in Leribe, Lesotho
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Bridging the digital divide in the Mountain Kingdom
                    </p>
                  </div>
                </div>
                {/* Floating accent */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-lta-blue to-lta-blue-dark shadow-xl shadow-lta-blue/20 flex items-center justify-center"
                >
                  <div className="text-center">
                    <GraduationCap className="h-8 w-8 sm:h-10 sm:w-10 text-white mx-auto mb-1" />
                    <span className="text-[10px] sm:text-xs text-white/80 font-medium">Since 2024</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Right — Content */}
            <div className="order-1 lg:order-2 space-y-5">
              <motion.div variants={fadeUp} custom={0}>
                <Badge className="mb-3 bg-lta-green/10 text-lta-green border-lta-green/20 px-4 py-1.5 text-xs font-semibold tracking-wide uppercase">
                  Our Story
                </Badge>
              </motion.div>
              <motion.h2
                variants={fadeUp}
                custom={1}
                className="text-2xl sm:text-3xl font-bold text-foreground"
              >
                A Mission Born from{' '}
                <span className="gradient-text">Necessity</span>
              </motion.h2>
              <motion.div variants={fadeUp} custom={2} className="space-y-4">
                <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                  Lesotho Tech Academy was founded with a clear and urgent mission: to bridge the
                  widening technology skills gap in Lesotho. In a country where digital literacy is
                  still emerging, we recognised that young Basotho needed more than theoretical
                  knowledge — they needed practical, hands-on skills that would make them employable
                  in the global technology landscape.
                </p>
                <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                  Based in the Leribe 300 District, our academy was established to provide
                  accessible, affordable, and industry-aligned IT training. We believe that every
                  student — regardless of their background — deserves the opportunity to learn to code,
                  build systems, and contribute to Lesotho&apos;s growing digital economy.
                </p>
                <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                  From our inception, we have focused on creating a learning environment that
                  mirrors real-world tech workplaces. Our approach combines project-based learning,
                  mentorship, and industry-relevant tools to ensure our graduates are ready for
                  the workforce from day one.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </Section>

      {/* ═══════ MISSION & VISION ═══════ */}
      <Section className="py-16 sm:py-24 bg-gradient-to-b from-white to-lta-green/[0.02]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.h2
              variants={fadeUp}
              custom={0}
              className="text-2xl sm:text-3xl font-bold text-foreground mb-3"
            >
              Our <span className="gradient-text">Mission &amp; Vision</span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="max-w-xl mx-auto text-muted-foreground text-sm sm:text-base">
              Guided by purpose, driven by impact.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Mission */}
            <motion.div variants={fadeUp} custom={2}>
              <Card className="h-full group hover:shadow-lg hover:shadow-lta-green/5 transition-all duration-300 hover:-translate-y-1 py-0 gap-0 overflow-hidden border-lta-green/15">
                <div className="h-1 bg-gradient-to-r from-lta-green to-lta-green-dark" />
                <CardContent className="p-8 sm:p-10 space-y-5">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-lta-green/10 text-lta-green group-hover:bg-lta-green group-hover:text-white transition-colors duration-300">
                    <Target className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">Our Mission</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                    To provide high-quality, practical, and affordable IT education that empowers
                    individuals in Lesotho with the skills needed to succeed in the digital economy.
                    We are committed to bridging the technology skills gap through hands-on training,
                    mentorship, and industry-relevant curriculum that prepares our students for
                    immediate employment and entrepreneurial success.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Vision */}
            <motion.div variants={fadeUp} custom={3}>
              <Card className="h-full group hover:shadow-lg hover:shadow-lta-blue/5 transition-all duration-300 hover:-translate-y-1 py-0 gap-0 overflow-hidden border-lta-blue/15">
                <div className="h-1 bg-gradient-to-r from-lta-blue to-lta-blue-dark" />
                <CardContent className="p-8 sm:p-10 space-y-5">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-lta-blue/10 text-lta-blue group-hover:bg-lta-blue group-hover:text-white transition-colors duration-300">
                    <Eye className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">Our Vision</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                    To become the leading technology training institution in Lesotho and the broader
                    Southern African region, recognised for producing highly skilled, innovative,
                    and job-ready graduates. We envision a future where every young person in
                    Lesotho has access to world-class technology education, enabling them to build
                    solutions that transform their communities and contribute to the nation&apos;s
                    technological advancement.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </Section>

      {/* ═══════ OUR FOUNDER ═══════ */}
      <Section className="py-16 sm:py-24 section-pattern">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.div variants={fadeUp} custom={0}>
              <Badge className="mb-3 bg-lta-blue/10 text-lta-blue border-lta-blue/20 px-4 py-1.5 text-xs font-semibold tracking-wide uppercase">
                Meet The Founder
              </Badge>
            </motion.div>
            <motion.h2
              variants={fadeUp}
              custom={1}
              className="text-2xl sm:text-3xl font-bold text-foreground"
            >
              The Mind Behind{' '}
              <span className="gradient-text">Lesotho Tech Academy</span>
            </motion.h2>
          </div>

          <motion.div variants={fadeUp} custom={2}>
            <Card className="overflow-hidden py-0 gap-0 border-lta-green/10">
              <CardContent className="p-0">
                <div className="grid md:grid-cols-[280px_1fr] lg:grid-cols-[320px_1fr] gap-0">
                  {/* Profile Card */}
                  <div className="bg-gradient-to-br from-lta-green to-lta-blue p-8 sm:p-10 flex flex-col items-center justify-center text-center">
                    {/* Initials Circle */}
                    <motion.div
                      animate={{ scale: [1, 1.03, 1] }}
                      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                      className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-white/15 backdrop-blur-sm border-2 border-white/25 flex items-center justify-center mb-5 shadow-xl"
                    >
                      <span className="text-3xl sm:text-4xl font-bold text-white tracking-wide">
                        RJM
                      </span>
                    </motion.div>

                    <h3 className="text-xl font-bold text-white mb-1">
                      Relebohile Joseph Mohono
                    </h3>
                    <p className="text-white/70 text-sm font-medium mb-4">Founder &amp; CEO</p>

                    <div className="flex items-center gap-2 text-white/80 text-xs mb-2">
                      <MapPin className="h-3.5 w-3.5" />
                      <span>Leribe 300 District, Lesotho</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/80 text-xs">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>Age 32</span>
                    </div>

                    {/* Achievement Badge */}
                    <div className="mt-6 inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2.5 border border-white/15">
                      <Sparkles className="h-4 w-4 text-yellow-300" />
                      <span className="text-white text-xs font-medium">Award-Winning Mentor</span>
                    </div>
                  </div>

                  {/* Bio Content */}
                  <div className="p-8 sm:p-10 lg:p-12 space-y-6">
                    <div>
                      <h4 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                        <GraduationCap className="h-5 w-5 text-lta-green" />
                        Education
                      </h4>
                      <div className="bg-muted/50 rounded-xl p-4 border border-border/50">
                        <p className="text-foreground font-medium text-sm sm:text-base">
                          BSc (Hons) in Business Information Technology
                        </p>
                        <p className="text-muted-foreground text-sm mt-1">
                          Limkokwing University of Creative Technology — Graduated 2018
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-lta-blue" />
                        Biography
                      </h4>
                      <div className="space-y-3 text-muted-foreground text-sm sm:text-base leading-relaxed">
                        <p>
                          Relebohile Joseph Mohono is a passionate technologist and educator who
                          founded Lesotho Tech Academy with a singular vision: to equip Basotho
                          youth with the practical IT skills needed to compete in the global digital
                          economy. With a BSc (Hons) in Business Information Technology from
                          Limkokwing University (2018), Relebohile combines strong academic
                          foundations with deep industry knowledge.
                        </p>
                        <p>
                          His passion for technology extends beyond the classroom. Relebohile
                          actively mentors young students and has demonstrated an exceptional
                          ability to guide learners towards outstanding achievements in technology
                          competitions at the national level.
                        </p>
                        <p>
                          Under his leadership, Lesotho Tech Academy is rapidly becoming a beacon
                          of practical IT education in Lesotho, known for its hands-on approach,
                          affordable pricing, and genuine commitment to student success.
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                        <Award className="h-5 w-5 text-amber-500" />
                        Mentoring Achievement
                      </h4>
                      <div className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20 rounded-xl p-4 border border-amber-200/50 dark:border-amber-800/30">
                        <p className="text-sm text-foreground leading-relaxed">
                          Mentored <strong>3 students</strong> from{' '}
                          <a
                            href="https://millicentacademy.co.ls"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-lta-blue hover:text-lta-blue-dark underline underline-offset-2 decoration-lta-blue/40 hover:decoration-lta-blue transition-colors font-medium inline-flex items-center gap-1"
                          >
                            Millicent Academy Junior School
                            <ExternalLink className="h-3 w-3" />
                          </a>{' '}
                          for the LSMTA Science Fair 2026 (Technology Category), securing{' '}
                          <strong className="text-amber-600">1st Prize</strong> and{' '}
                          <strong className="text-slate-500">2nd Prize</strong> at the{' '}
                          <strong>National Level</strong>.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </Section>

      {/* ═══════ OUR VALUES ═══════ */}
      <Section className="py-16 sm:py-24 bg-gradient-to-b from-white to-lta-green/[0.02]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.h2
              variants={fadeUp}
              custom={0}
              className="text-2xl sm:text-3xl font-bold text-foreground mb-3"
            >
              Our <span className="gradient-text">Core Values</span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="max-w-xl mx-auto text-muted-foreground text-sm sm:text-base">
              The principles that guide everything we do at Lesotho Tech Academy.
            </motion.p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Lightbulb,
                title: 'Innovation',
                description:
                  'We foster creative thinking and encourage our students to push boundaries, experiment with new technologies, and develop innovative solutions to real-world problems.',
                color: 'bg-lta-green/10 text-lta-green group-hover:bg-lta-green group-hover:text-white',
              },
              {
                icon: Award,
                title: 'Excellence',
                description:
                  'We hold ourselves and our students to the highest standards of quality. Every lesson, project, and assessment is designed to cultivate excellence in technical skills.',
                color: 'bg-lta-blue/10 text-lta-blue group-hover:bg-lta-blue group-hover:text-white',
              },
              {
                icon: HandCoins,
                title: 'Accessibility',
                description:
                  'We believe quality technology education should be within everyone\'s reach. Our affordable fees and online options ensure no one is left behind.',
                color: 'bg-amber-500/10 text-amber-600 group-hover:bg-amber-500 group-hover:text-white',
              },
              {
                icon: Users,
                title: 'Community',
                description:
                  'We build a supportive learning community where students collaborate, share knowledge, and grow together. Our alumni network provides ongoing mentorship and career support.',
                color: 'bg-purple-500/10 text-purple-600 group-hover:bg-purple-500 group-hover:text-white',
              },
            ].map((item, i) => (
              <motion.div key={item.title} variants={fadeUp} custom={i + 2}>
                <Card className="h-full text-center group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 py-8 px-6">
                  <CardContent className="space-y-4">
                    <div
                      className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl ${item.color} transition-colors duration-300`}
                    >
                      <item.icon className="h-7 w-7" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
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

      {/* ═══════ WHY LTA ═══════ */}
      <Section className="py-16 sm:py-24 section-pattern">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.h2
              variants={fadeUp}
              custom={0}
              className="text-2xl sm:text-3xl font-bold text-foreground mb-3"
            >
              Why <span className="gradient-text">Lesotho Tech Academy</span>?
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="max-w-xl mx-auto text-muted-foreground text-sm sm:text-base">
              What sets us apart from other training institutions in Lesotho.
            </motion.p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {[
              {
                icon: Code2,
                title: 'Practical, Project-Based Learning',
                description:
                  'Our courses are built around real-world projects, not just theory. Students build portfolios of actual work that demonstrates their skills to employers.',
                highlight: '100% Hands-On',
              },
              {
                icon: HandCoins,
                title: 'Unbeatable Affordability',
                description:
                  'We offer the most competitive pricing in Lesotho. With a low registration fee of just M300 and course fees starting at M2,000, quality IT education is truly accessible.',
                highlight: 'From M2,000',
              },
              {
                icon: Globe,
                title: 'Online & In-Person Options',
                description:
                  'Whether you prefer face-to-face classes or need the flexibility of online learning, we accommodate both. Our online classes use the same high-quality curriculum as our in-person sessions.',
                highlight: 'Hybrid Model',
              },
              {
                icon: ShieldCheck,
                title: 'Local Context, Global Standards',
                description:
                  'Our curriculum is designed with Lesotho\'s unique context in mind while maintaining international standards. Students learn skills that are relevant both locally and globally.',
                highlight: 'Globally Relevant',
              },
            ].map((item, i) => (
              <motion.div key={item.title} variants={fadeUp} custom={i + 2}>
                <Card className="h-full group hover:shadow-lg hover:shadow-lta-green/5 transition-all duration-300 hover:-translate-y-1 py-0 gap-0 overflow-hidden">
                  <CardContent className="p-6 sm:p-8 space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-lta-green/10 text-lta-green group-hover:bg-lta-green group-hover:text-white transition-colors duration-300 shrink-0">
                        <item.icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <h3 className="text-base sm:text-lg font-semibold text-foreground">
                          {item.title}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                    <div className="pt-3 border-t border-border/50">
                      <Badge
                        variant="secondary"
                        className="bg-lta-green/10 text-lta-green border-lta-green/20 text-xs font-semibold"
                      >
                        <Heart className="h-3 w-3 mr-1" />
                        {item.highlight}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══════ PARTNER / MILLECENT ACADEMY LINK ═══════ */}
      <Section className="py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={scaleIn} custom={0}>
            <Card className="overflow-hidden py-0 gap-0 border-lta-blue/15">
              <CardContent className="p-8 sm:p-10 lg:p-12">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="shrink-0">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-lta-blue to-lta-blue-dark flex items-center justify-center shadow-lg shadow-lta-blue/20">
                      <Sparkles className="h-10 w-10 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
                      Partnering for Excellence
                    </h3>
                    <p className="text-muted-foreground leading-relaxed text-sm sm:text-base mb-4">
                      Our success at the LSMTA Science Fair 2026 was made possible through
                      collaboration with{' '}
                      <a
                        href="https://millicentacademy.co.ls"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-lta-blue hover:text-lta-blue-dark underline underline-offset-2 decoration-lta-blue/40 hover:decoration-lta-blue transition-colors font-medium inline-flex items-center gap-1"
                      >
                        Millicent Academy Junior School
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                      . Together, we proved that with the right mentorship and dedication,
                      Basotho students can achieve extraordinary results in technology at the
                      national level.
                    </p>
                    <a
                      href="https://millicentacademy.co.ls"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button
                        variant="outline"
                        className="border-lta-blue/30 text-lta-blue hover:bg-lta-blue hover:text-white transition-colors duration-300 rounded-xl px-6"
                      >
                        Visit Millicent Academy
                        <ExternalLink className="h-4 w-4 ml-2" />
                      </Button>
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </Section>

      {/* ═══════ CTA ═══════ */}
      <Section className="py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            variants={scaleIn}
            custom={0}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1B5E20] via-[#004D40] to-[#01579B] p-10 sm:p-14"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-36 h-36 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4 pointer-events-none" />

            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                Join Our Growing Community
              </h2>
              <p className="text-white/75 max-w-lg mx-auto mb-2 text-sm sm:text-base leading-relaxed">
                Be part of Lesotho&apos;s next generation of technology leaders.
                Start your journey with us today.
              </p>
              <p className="text-lta-green-light font-medium text-sm mb-8">
                Registration fee: Only M300 for all courses
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button asChild size="lg" className="bg-white text-[#1B5E20] hover:bg-lta-green-light hover:text-white text-base px-8 py-6 shadow-lg rounded-xl font-semibold transition-colors duration-300">
                  <Link href="/admissions">
                    <GraduationCap className="h-5 w-5 mr-2" />
                    Apply Now
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-2 border-white/30 text-white hover:bg-white/10 hover:text-white text-base px-8 py-6 rounded-xl backdrop-blur-sm">
                  <Link href="/courses">
                    <BookOpen className="h-5 w-5 mr-2" />
                    Browse Courses
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </Section>
    </div>
  );
}
