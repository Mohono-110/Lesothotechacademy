'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Target, Eye, Lightbulb, BookOpen } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const features = [
    {
      icon: Target,
      title: 'Our Mission',
      description:
        'To empower Basotho youth with world-class IT skills through accessible, hands-on training programs that bridge the digital divide and prepare students for the global technology industry.',
      iconBg: 'bg-lta-green/10',
      iconColor: 'text-lta-green',
    },
    {
      icon: Eye,
      title: 'Our Vision',
      description:
        'To become the leading technology education hub in Lesotho, producing skilled IT professionals who drive innovation, entrepreneurship, and economic growth across the Mountain Kingdom and Africa.',
      iconBg: 'bg-lta-blue/10',
      iconColor: 'text-lta-blue',
    },
    {
      icon: Lightbulb,
      title: 'Innovation Focus',
      description:
        'We emphasize practical, project-based learning with real-world applications. Our students build actual products, not just theory, ensuring they are job-ready from day one.',
      iconBg: 'bg-lta-green/10',
      iconColor: 'text-lta-green',
    },
    {
      icon: BookOpen,
      title: 'Quality Education',
      description:
        'Our curriculum is designed by industry professionals and continuously updated to reflect the latest technologies and best practices in software development and IT infrastructure.',
      iconBg: 'bg-lta-blue/10',
      iconColor: 'text-lta-blue',
    },
  ];

  return (
    <section id="about" className="py-20 lg:py-28 relative" ref={ref}>
      <div className="absolute inset-0 hero-gradient" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-lta-green/10 text-lta-green text-sm font-medium mb-4">
            About Us
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Empowering the Next Generation of{' '}
            <span className="gradient-text">Tech Leaders</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base lg:text-lg leading-relaxed">
            Lesotho Tech Academy is a premier IT training institution based in Leribe 300 District, Lesotho.
            Founded by Relebohile Joseph Mohono, we are committed to transforming lives through technology education
            and practical skills development. Our comprehensive courses prepare students for successful careers
            in the rapidly evolving tech industry.
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid sm:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.15 }}
            >
              <Card className="group h-full border-lta-green/10 hover:border-lta-green/30 hover:shadow-lg hover:shadow-lta-green/5 transition-all duration-300 bg-white/50">
                <CardContent className="p-6 flex gap-4">
                  <div
                    className={`shrink-0 w-12 h-12 rounded-xl ${feature.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform`}
                  >
                    <feature.icon className={`h-6 w-6 ${feature.iconColor}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Bottom stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-16 rounded-2xl bg-gradient-to-r from-lta-green to-lta-blue p-8 lg:p-12 text-white"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: '2025', label: 'Founded' },
              { value: '4', label: 'Specialized Courses' },
              { value: 'Leribe', label: 'District, Lesotho' },
              { value: '100%', label: 'Hands-on Learning' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl lg:text-3xl font-bold">{stat.value}</div>
                <div className="text-sm opacity-80 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
