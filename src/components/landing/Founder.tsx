'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { GraduationCap, Award, MapPin, Calendar, Briefcase } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function Founder() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="founder" className="py-20 lg:py-28 relative bg-gradient-to-b from-transparent to-lta-green/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-lta-green/10 text-lta-green text-sm font-medium mb-4">
            Our Founder
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Meet the <span className="gradient-text">Visionary</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Photo side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center"
          >
            <div className="relative">
              {/* Background decoration */}
              <div className="absolute inset-0 bg-gradient-to-br from-lta-green/20 to-lta-blue/20 rounded-3xl transform rotate-3 scale-105" />
              
              {/* Photo card */}
              <Card className="relative overflow-hidden rounded-2xl p-0 border-lta-green/20">
                <div className="aspect-[3/4] bg-gradient-to-br from-lta-green/10 via-lta-blue/5 to-lta-green/20 flex items-center justify-center relative">
                  {/* Placeholder with initials */}
                  <div className="w-48 h-48 rounded-full bg-gradient-to-br from-lta-green to-lta-blue flex items-center justify-center shadow-2xl">
                    <span className="text-white text-5xl font-bold">RJM</span>
                  </div>
                  
                  {/* Overlay gradient */}
                  <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-white/80 to-transparent" />
                </div>
              </Card>

              {/* Floating badge */}
              <motion.div
                className="absolute -bottom-4 -right-4 glass-card rounded-xl p-3 shadow-lg"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-lta-green flex items-center justify-center">
                    <Award className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-lta-green">BSc (Hons)</div>
                    <div className="text-[10px] text-muted-foreground">BIT Graduate</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Info side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3 className="text-2xl sm:text-3xl font-bold mb-2">
              Relebohile Joseph Mohono
            </h3>
            <p className="text-lta-green font-semibold mb-4">
              Founder & CEO, Lesotho Tech Academy
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Relebohile Joseph Mohono is a passionate technology educator and entrepreneur from Lesotho. 
              With a Bachelor of Science (Honours) in Business Information Technology from Limkokwing 
              University of Creative Technology (graduated 2018), he founded Lesotho Tech Academy with 
              the mission of bridging the digital skills gap in Lesotho and empowering the next generation 
              of tech professionals in Africa.
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              {[
                {
                  icon: GraduationCap,
                  label: 'Education',
                  value: 'BSc (Hons) Business IT, Limkokwing University (2018)',
                },
                {
                  icon: MapPin,
                  label: 'Location',
                  value: 'Leribe 300 District, Lesotho',
                },
                {
                  icon: Calendar,
                  label: 'Experience',
                  value: '6+ years in IT & Education',
                },
                {
                  icon: Briefcase,
                  label: 'Focus',
                  value: 'Web Development, CMS, Networking, Business Systems',
                },
              ].map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                >
                  <Card className="border-lta-green/10 hover:border-lta-green/20 transition-colors">
                    <CardContent className="p-4 flex gap-3">
                      <div className="shrink-0 w-10 h-10 rounded-lg bg-lta-green/10 flex items-center justify-center">
                        <item.icon className="h-5 w-5 text-lta-green" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          {item.label}
                        </div>
                        <div className="text-sm font-medium mt-0.5">{item.value}</div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
