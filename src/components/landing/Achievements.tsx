'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Trophy, Medal, Star, ExternalLink, Users, Crown, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function Achievements() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="achievements" className="py-20 lg:py-28 relative">
      <div className="absolute inset-0 section-pattern" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-yellow-100 text-yellow-700 text-sm font-medium mb-4">
            🏆 Our Achievements
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            LSMTA Science Fair <span className="gradient-text">2026 Champions</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base lg:text-lg">
            We are incredibly proud of our students who represented Lesotho Tech Academy 
            at the national level and achieved outstanding results.
          </p>
        </motion.div>

        {/* Main achievement card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto mb-12"
        >
          <Card className="overflow-hidden border-yellow-200 bg-gradient-to-br from-yellow-50/50 via-white to-lta-green/5 shadow-xl">
            {/* Top banner */}
            <div className="h-2 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600" />
            <CardContent className="p-6 lg:p-10">
              <div className="flex flex-col lg:flex-row gap-8 items-center">
                {/* Trophy visual */}
                <div className="shrink-0">
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="relative w-32 h-32 lg:w-40 lg:h-40 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 flex items-center justify-center shadow-xl shadow-yellow-300/30"
                  >
                    <Trophy className="h-16 w-16 lg:h-20 lg:w-20 text-white drop-shadow-lg" />
                    <motion.div
                      className="absolute -top-1 -right-1"
                      animate={{ rotate: [0, 15, -15, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Sparkles className="h-8 w-8 text-yellow-300" />
                    </motion.div>
                  </motion.div>
                </div>

                {/* Content */}
                <div className="text-center lg:text-left flex-1">
                  <div className="flex items-center gap-2 justify-center lg:justify-start mb-3">
                    <Crown className="h-6 w-6 text-yellow-600" />
                    <span className="text-sm font-bold text-yellow-700 uppercase tracking-wider">
                      National Champions
                    </span>
                  </div>
                  <h3 className="text-xl lg:text-2xl font-bold mb-3">
                    LSMTA Science Fair 2026 — National Level
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Under the mentorship of our founder Relebohile Joseph Mohono,{' '}
                    <strong className="text-foreground">
                      3 students from Millicent Academy Junior School
                    </strong>{' '}
                    competed at the Lesotho Science, Mathematics, and Technology Association (LSMTA) 
                    Science Fair 2026 National Level and achieved remarkable success:
                  </p>

                  {/* Prize cards */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                    <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-gradient-to-r from-yellow-100 to-yellow-50 border border-yellow-200">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-md">
                        <Medal className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="font-bold text-yellow-800">1st Prize</div>
                        <div className="text-xs text-yellow-600">Technology Category</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-gradient-to-r from-gray-100 to-gray-50 border border-gray-200">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 flex items-center justify-center shadow-md">
                        <Medal className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-700">2nd Prize</div>
                        <div className="text-xs text-gray-500">Technology Category</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Supporting details */}
        <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            {
              icon: Users,
              title: '3 Students Mentored',
              description: 'From Millicent Academy Junior School, representing Lesotho Tech Academy mentorship program',
              highlight: false,
            },
            {
              icon: Star,
              title: 'Technology Category',
              description: 'Students demonstrated exceptional skills in technology innovation and problem solving',
              highlight: false,
            },
            {
              icon: Trophy,
              title: 'National Level',
              description: 'Competed and won at the prestigious LSMTA Science Fair national competition in 2026',
              highlight: false,
            },
          ].map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.15 }}
            >
              <Card className="h-full text-center border-lta-green/10 hover:border-lta-green/30 hover:shadow-lg transition-all">
                <CardContent className="p-6">
                  <div className="w-14 h-14 rounded-xl bg-lta-green/10 flex items-center justify-center mx-auto mb-4">
                    <item.icon className="h-7 w-7 text-lta-green" />
                  </div>
                  <h4 className="font-semibold text-lg mb-2">{item.title}</h4>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Partner link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="text-center mt-12"
        >
          <p className="text-sm text-muted-foreground mb-3">
            In partnership with Millicent Academy Junior School
          </p>
          <Button
            variant="outline"
            className="gap-2 border-lta-blue/30 text-lta-blue hover:bg-lta-blue/5"
            asChild
          >
            <a href="https://millicentacademy.co.ls" target="_blank" rel="noopener noreferrer">
              Visit Millicent Academy
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
