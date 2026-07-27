'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Code, GraduationCap, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/store';
import Image from 'next/image';

export default function Hero() {
  const { setView } = useAppStore();

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-lta-green/5 via-white to-lta-blue/5" />
      <div className="absolute inset-0 section-pattern" />
      
      {/* Decorative shapes */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
        className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full border border-lta-green/10"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 70, repeat: Infinity, ease: 'linear' }}
        className="absolute -bottom-60 -left-60 w-[600px] h-[600px] rounded-full border border-lta-blue/10"
      />
      <motion.div
        className="absolute top-1/4 right-1/4 w-32 h-32 rounded-full bg-lta-green/5 blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-1/4 left-1/4 w-40 h-40 rounded-full bg-lta-blue/5 blur-3xl"
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 5, repeat: Infinity }}
      />

      {/* Floating icons */}
      <motion.div
        className="absolute top-32 left-[10%] text-lta-green/20 hidden lg:block"
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
      >
        <Code className="h-8 w-8" />
      </motion.div>
      <motion.div
        className="absolute top-48 right-[15%] text-lta-blue/20 hidden lg:block"
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 4, repeat: Infinity, delay: 1 }}
      >
        <GraduationCap className="h-8 w-8" />
      </motion.div>
      <motion.div
        className="absolute bottom-40 left-[20%] text-lta-green/15 hidden lg:block"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, delay: 1.5 }}
      >
        <Sparkles className="h-6 w-6" />
      </motion.div>

      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 pt-28">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-lta-green/10 border border-lta-green/20 mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-lta-green animate-pulse" />
              <span className="text-sm font-medium text-lta-green-dark">
                Now Enrolling — Limited Spots Available
              </span>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-4">
              <span className="text-foreground">Lesotho</span>{' '}
              <span className="gradient-text">Tech Academy</span>
            </h1>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex items-center gap-3 justify-center lg:justify-start mb-6"
            >
              <span className="h-px flex-1 max-w-[60px] bg-gradient-to-r from-lta-green/50 to-transparent" />
              <span className="text-lg sm:text-xl font-semibold text-muted-foreground tracking-wider">
                Learn | Code | Innovate
              </span>
              <span className="h-px flex-1 max-w-[60px] bg-gradient-to-l from-lta-green/50 to-transparent" />
            </motion.div>

            <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed">
              Transform your future with cutting-edge IT training in Web Development, 
              CMS, Computer Networks, and Business Systems. Based in Leribe 300 District, Lesotho.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Button
                  size="lg"
                  onClick={() => setView('register')}
                  className="bg-lta-green hover:bg-lta-green-dark text-white px-8 py-6 text-base font-semibold rounded-xl shadow-lg shadow-lta-green/25 btn-glow-green gap-2"
                >
                  Apply Now
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => {
                    const el = document.getElementById('courses');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="border-lta-green/30 text-lta-green hover:bg-lta-green/5 px-8 py-6 text-base font-semibold rounded-xl"
                >
                  View Courses
                </Button>
              </motion.div>
            </div>

            {/* Quick stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="flex items-center gap-8 mt-10 justify-center lg:justify-start"
            >
              {[
                { value: '4+', label: 'Courses' },
                { value: '50+', label: 'Students' },
                { value: 'M300', label: 'Registration' },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl font-bold gradient-text">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Visual side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
            className="hidden lg:flex justify-center items-center"
          >
            <div className="relative">
              {/* Main logo circle */}
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 6, repeat: Infinity }}
                className="relative w-80 h-80 rounded-full bg-gradient-to-br from-lta-green/10 to-lta-blue/10 border-2 border-lta-green/20 flex items-center justify-center shadow-2xl"
              >
                <div className="w-64 h-64 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-inner">
                  <Image
                    src="/logo.png"
                    alt="Lesotho Tech Academy Logo"
                    width={180}
                    height={180}
                    className="object-contain"
                  />
                </div>
              </motion.div>

              {/* Floating cards */}
              <motion.div
                className="absolute -top-4 -right-8 glass-card rounded-xl p-4 shadow-lg animate-float"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-lta-green/10 flex items-center justify-center">
                    <Code className="h-4 w-4 text-lta-green" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold">Web Dev</div>
                    <div className="text-[10px] text-muted-foreground">3 Months</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="absolute -bottom-4 -left-8 glass-card rounded-xl p-4 shadow-lg"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, delay: 1 }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-lta-blue/10 flex items-center justify-center">
                    <GraduationCap className="h-4 w-4 text-lta-blue" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold">Networking</div>
                    <div className="text-[10px] text-muted-foreground">6 Months</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="absolute top-1/2 -right-16 glass-card rounded-xl p-3 shadow-lg"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-yellow-600" />
                  </div>
                  <div className="text-xs font-semibold">Certified</div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
