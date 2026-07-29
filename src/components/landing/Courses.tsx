'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { Clock, DollarSign, ArrowRight, Code, Globe, Network, Briefcase } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useAppStore, type Course } from '@/lib/store';

const courseIcons: Record<string, React.ElementType> = {
  'Web Development Programming': Code,
  'CMS Development and Customization': Globe,
  'Computer Networks': Network,
  'Business Development Systems': Briefcase,
};

const courseColors: Record<string, { bg: string; text: string; border: string }> = {
  'Web Development Programming': { bg: 'bg-lta-green/10', text: 'text-lta-green', border: 'border-lta-green/20' },
  'CMS Development and Customization': { bg: 'bg-lta-blue/10', text: 'text-lta-blue', border: 'border-lta-blue/20' },
  'Computer Networks': { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200' },
  'Business Development Systems': { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200' },
};

const fallbackCourses: Course[] = [
  {
    id: '1',
    title: 'Web Development Programming',
    slug: 'web-development-programming',
    description: 'Master modern web development with HTML, CSS, JavaScript, React, and Node.js. Build real-world applications from scratch and deploy them to the web.',
    duration: '3 Months',
    durationMonths: 3,
    price: 300,
    currency: 'M',
    category: 'Programming',
    level: 'Beginner',
    isPublished: true,
    content: '',
    objectives: '[]',
    modules: '[]',
    createdAt: '',
  },
  {
    id: '2',
    title: 'CMS Development and Customization',
    slug: 'cms-development-customization',
    description: 'Learn to build and customize content management systems using WordPress, Joomla, and modern headless CMS platforms for businesses and organizations.',
    duration: '6 Months',
    durationMonths: 6,
    price: 600,
    currency: 'M',
    category: 'Web Development',
    level: 'Intermediate',
    isPublished: true,
    content: '',
    objectives: '[]',
    modules: '[]',
    createdAt: '',
  },
  {
    id: '3',
    title: 'Computer Networks',
    slug: 'computer-networks',
    description: 'Comprehensive training in computer networking fundamentals, TCP/IP, routing, switching, network security, and cloud infrastructure management.',
    duration: '6 Months',
    durationMonths: 6,
    price: 600,
    currency: 'M',
    category: 'Networking',
    level: 'Beginner',
    isPublished: true,
    content: '',
    objectives: '[]',
    modules: '[]',
    createdAt: '',
  },
  {
    id: '4',
    title: 'Business Development Systems',
    slug: 'business-development-systems',
    description: 'Learn to design, develop, and implement business information systems including CRM, ERP, inventory management, and business intelligence dashboards.',
    duration: '6 Months',
    durationMonths: 6,
    price: 600,
    currency: 'M',
    category: 'Business',
    level: 'Intermediate',
    isPublished: true,
    content: '',
    objectives: '[]',
    modules: '[]',
    createdAt: '',
  },
];

export default function Courses() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const { courses, setCourses, selectCourse, setView } = useAppStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch('/api/courses');
        if (res.ok) {
          const data = await res.json();
          if (data.courses && data.courses.length > 0) {
            setCourses(data.courses);
          } else {
            setCourses(fallbackCourses);
          }
        } else {
          setCourses(fallbackCourses);
        }
      } catch {
        setCourses(fallbackCourses);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [setCourses]);

  const displayCourses = courses.length > 0 ? courses : fallbackCourses;

  const handleViewDetails = (course: Course) => {
    selectCourse(course.slug, course.id);
    setView('course-detail');
  };

  return (
    <section id="courses" className="py-20 lg:py-28 relative" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-lta-blue/10 text-lta-blue text-sm font-medium mb-4">
            Our Programs
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Professional IT{' '}
            <span className="gradient-text">Training Courses</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base lg:text-lg">
            Industry-aligned courses designed to give you practical, job-ready skills. 
            Registration fee of M300 applies. Start your tech career today.
          </p>
        </motion.div>

        {/* Course cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <CardContent className="p-6">
                    <Skeleton className="h-48 w-full mb-4 rounded-lg" />
                    <Skeleton className="h-6 w-3/4 mb-3" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                  </CardContent>
                </Card>
              ))
            : displayCourses.map((course, index) => {
                const Icon = courseIcons[course.title] || Code;
                const colors = courseColors[course.title] || { bg: 'bg-lta-green/10', text: 'text-lta-green', border: 'border-lta-green/20' };

                return (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: index * 0.15 }}
                  >
                    <Card className="group h-full overflow-hidden border-lta-green/10 hover:border-lta-green/30 hover:shadow-xl hover:shadow-lta-green/5 transition-all duration-300">
                      {/* Card header with gradient */}
                      <div className={`h-2 bg-gradient-to-r ${
                        course.title === 'Web Development Programming' ? 'from-lta-green to-emerald-400' :
                        course.title === 'CMS Development and Customization' ? 'from-lta-blue to-sky-400' :
                        course.title === 'Computer Networks' ? 'from-amber-500 to-orange-400' :
                        'from-purple-500 to-violet-400'
                      }`} />
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4 mb-4">
                          <div className={`shrink-0 w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                            <Icon className={`h-6 w-6 ${colors.text}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-lg leading-tight mb-1">
                              {course.title}
                            </h3>
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge variant="outline" className={`text-xs ${colors.border} ${colors.text}`}>
                                {course.category}
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                {course.level}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                          {course.description}
                        </p>

                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>{course.duration}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-lta-green font-semibold">
                            <DollarSign className="h-4 w-4" />
                            <span>M{course.price}</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="px-6 pb-6">
                        <Button
                          onClick={() => handleViewDetails(course)}
                          variant="outline"
                          className={`w-full gap-2 ${colors.border} ${colors.text} hover:${colors.bg} transition-colors`}
                        >
                          View Details
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                );
              })}
        </div>
      </div>
    </section>
  );
}
