'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import type { ReactNode } from 'react';
import {
  Code,
  Network,
  Globe,
  Briefcase,
  Clock,
  Banknote,
  ChevronRight,
  CheckCircle2,
  ArrowLeft,
  GraduationCap,
  BarChart3,
  Smartphone,
  Building2,
  BookOpen,
  Loader2,
  AlertTriangle,
  Award,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

// ─── Types ───────────────────────────────────────────────────────────────────

interface CourseModule {
  name: string;
  weeks: number;
  description: string;
  topics: string[];
}

interface Course {
  id?: string;
  title: string;
  slug: string;
  description: string;
  duration: string;
  durationMonths: number;
  price: number;
  currency: string;
  category: string;
  level: string;
  content?: string;
  objectives: string[];
  modules: CourseModule[];
  isPublished?: boolean;
  image?: string;
}

// ─── Fallback Data ────────────────────────────────────────────────────────────

const fallbackCourses: Course[] = [
  {
    title: 'Web Development Programming',
    slug: 'web-development-programming',
    description:
      'Master modern web development from front-end to back-end. Build responsive, dynamic websites and applications using industry-standard technologies including HTML5, CSS3, JavaScript, React, Node.js, and databases. This comprehensive program takes you from foundational skills to building production-ready applications.',
    duration: '3 Months',
    durationMonths: 3,
    price: 2600,
    currency: 'M',
    category: 'Programming',
    level: 'Beginner to Intermediate',
    content:
      'Our Web Development Programming course is designed for aspiring developers who want to build a strong foundation in modern web technologies. Whether you are a complete beginner or have some experience, this course will take you through the complete web development journey.\n\nYou will learn front-end development with HTML5, CSS3, and JavaScript, then advance to React for building dynamic user interfaces. On the back-end, you will master Node.js and Express to create robust APIs, and learn database management with both SQL and NoSQL databases.\n\nThe course emphasizes hands-on projects, real-world scenarios, and industry best practices. By the end of the program, you will have a portfolio of projects and the skills needed to start a career in web development.',
    objectives: [
      'Build responsive websites using HTML5, CSS3, and modern frameworks',
      'Write clean, efficient JavaScript and TypeScript code',
      'Develop interactive front-end applications with React',
      'Build server-side applications with Node.js and Express',
      'Design and manage relational and NoSQL databases',
      'Deploy applications using version control and cloud platforms',
      'Understand web security best practices',
      'Collaborate on projects using Git and agile methodologies',
    ],
    modules: [
      {
        name: 'HTML5 & CSS3 Fundamentals',
        weeks: 3,
        description: 'Learn the building blocks of the web — semantic HTML and modern CSS techniques.',
        topics: ['Semantic HTML elements & document structure', 'CSS Flexbox & Grid layouts', 'Responsive design & media queries', 'CSS animations & transitions', 'Accessibility best practices (WCAG)'],
      },
      {
        name: 'JavaScript Essentials',
        weeks: 3,
        description: 'Master JavaScript programming from fundamentals to advanced concepts.',
        topics: ['Variables, data types & operators', 'Functions, closures & scope', 'DOM manipulation & event handling', 'Async programming, Promises & async/await', 'ES6+ modern syntax & features'],
      },
      {
        name: 'React & Front-End Frameworks',
        weeks: 4,
        description: 'Build dynamic, component-based user interfaces with React.',
        topics: ['React components & JSX', 'State management with hooks (useState, useEffect, useContext)', 'React Router & client-side navigation', 'API integration & data fetching', 'UI component libraries & design systems'],
      },
      {
        name: 'Back-End Development with Node.js',
        weeks: 3,
        description: 'Create robust server-side applications and RESTful APIs.',
        topics: ['Node.js runtime & Express framework', 'RESTful API design & implementation', 'Database integration (MongoDB & PostgreSQL)', 'Authentication & authorization (JWT)', 'Error handling, logging & middleware'],
      },
    ],
  },
  {
    title: 'Computer Networks',
    slug: 'computer-networks',
    description:
      'Gain comprehensive knowledge of computer networking from fundamentals to advanced administration. Learn to design, configure, troubleshoot, and secure modern network infrastructure in enterprise environments.',
    duration: '6 Months',
    durationMonths: 6,
    price: 3500,
    currency: 'M',
    category: 'Networking',
    level: 'Beginner to Advanced',
    content:
      'Our Computer Networks course provides an in-depth understanding of modern networking technologies and prepares you for industry-recognized certifications. This six-month program covers everything from basic networking concepts to advanced enterprise-level network administration.\n\nYou will work with real Cisco equipment, learn IP addressing and subnetting, configure VLANs and routing protocols, and implement network security measures. The course also covers wireless networking, cloud networking, and network automation.\n\nGraduates will be well-prepared for roles such as Network Administrator, Network Engineer, Systems Administrator, and IT Support Specialist, with a strong foundation for CCNA and CompTIA Network+ certifications.',
    objectives: [
      'Understand networking fundamentals and OSI/TCP-IP models',
      'Configure and manage Cisco routers and switches',
      'Implement IP addressing and subnetting schemes',
      'Design and troubleshoot LAN/WAN networks',
      'Configure VLANs, STP, and inter-VLAN routing',
      'Implement network security with firewalls and VPNs',
      'Manage wireless networks and mobility solutions',
      'Monitor and optimize network performance',
      'Prepare for CompTIA Network+ and CCNA certifications',
      'Understand cloud networking and virtualization',
    ],
    modules: [
      {
        name: 'Networking Fundamentals',
        weeks: 4,
        description: 'Build a solid foundation in networking concepts and protocols.',
        topics: ['OSI & TCP/IP models', 'Network topologies & architectures', 'Common network protocols (TCP, UDP, ICMP, ARP)', 'Cabling standards & physical layer', 'Network devices (hubs, switches, routers)'],
      },
      {
        name: 'IP Addressing & Subnetting',
        weeks: 3,
        description: 'Master IPv4/IPv6 addressing, subnetting, and network segmentation.',
        topics: ['IPv4 addressing classes & structure', 'Subnetting techniques & practice', 'CIDR & Variable Length Subnet Masking (VLSM)', 'IPv6 fundamentals & transition', 'NAT, PAT & address translation'],
      },
      {
        name: 'Router & Switch Configuration',
        weeks: 6,
        description: 'Hands-on configuration of Cisco routers and switches.',
        topics: ['Cisco IOS CLI navigation & commands', 'VLAN configuration & management', 'Spanning Tree Protocol (STP)', 'Inter-VLAN routing methods', 'Static & dynamic routing (RIP, OSPF)'],
      },
      {
        name: 'Network Security & Administration',
        weeks: 5,
        description: 'Implement security measures and manage network infrastructure.',
        topics: ['Firewall configuration & policies', 'VPN implementation & tunneling', 'Access Control Lists (ACLs)', 'Network monitoring & SNMP', 'Incident response & disaster recovery'],
      },
      {
        name: 'Wireless & Advanced Networks',
        weeks: 4,
        description: 'Deploy and manage wireless networks and advanced networking technologies.',
        topics: ['Wireless standards (802.11a/b/g/n/ac/ax)', 'Wireless security (WPA2, WPA3)', 'Network virtualization (NFV, SDN)', 'Cloud networking basics (AWS, Azure)', 'Network automation & scripting'],
      },
    ],
  },
  {
    title: 'CMS Development & Customization',
    slug: 'cms-development-customization',
    description:
      'Learn to build, customize, and manage professional websites using popular Content Management Systems. Master theme development, plugin creation, and advanced customization techniques for WordPress and other CMS platforms.',
    duration: '6 Months',
    durationMonths: 6,
    price: 4000,
    currency: 'M',
    category: 'CMS',
    level: 'Intermediate',
    content:
      'Our CMS Development & Customization course is designed for students who want to become professional WordPress developers and CMS specialists. This program covers everything from basic WordPress usage to advanced theme and plugin development.\n\nYou will learn to build custom themes from scratch, create plugins that extend WordPress functionality, implement e-commerce solutions, and optimize websites for performance and search engines. The course also covers security best practices, multi-site management, and integration with third-party services.\n\nThis intermediate-level course assumes basic knowledge of HTML, CSS, and PHP. By the end, you will be able to build any type of WordPress website — from simple blogs to complex e-commerce platforms.',
    objectives: [
      'Install, configure, and manage WordPress installations',
      'Develop custom themes from scratch',
      'Create custom plugins and widgets',
      'Implement e-commerce solutions with WooCommerce',
      'Optimize websites for speed and SEO',
      'Implement security hardening and regular backups',
      'Manage multi-site WordPress networks',
      'Integrate third-party APIs and services',
      'Deploy and maintain production CMS installations',
    ],
    modules: [
      {
        name: 'WordPress Fundamentals',
        weeks: 4,
        description: 'Master the WordPress ecosystem from installation to content management.',
        topics: ['WordPress installation & setup', 'Dashboard navigation & settings', 'Pages, posts & media management', 'User roles & permissions', 'WordPress settings & configuration'],
      },
      {
        name: 'Theme Development',
        weeks: 6,
        description: 'Build custom WordPress themes using modern development practices.',
        topics: ['Theme structure & template hierarchy', 'Template files & The Loop', 'Custom post types & taxonomies', 'WordPress Customizer API', 'Responsive theme design principles'],
      },
      {
        name: 'Plugin Development',
        weeks: 5,
        description: 'Create custom plugins to extend WordPress functionality.',
        topics: ['Plugin architecture & best practices', 'Action hooks & filter hooks', 'Custom shortcodes & widgets', 'Admin settings pages & options', 'Plugin security & sanitization'],
      },
      {
        name: 'E-Commerce & Advanced Features',
        weeks: 5,
        description: 'Build online stores and implement advanced CMS features.',
        topics: ['WooCommerce installation & setup', 'Payment gateway integration', 'Product catalog management', 'Advanced theme customizations', 'Performance optimization & caching'],
      },
    ],
  },
  {
    title: 'Business Development Systems',
    slug: 'business-development-systems',
    description:
      'Learn to design, implement, and manage business systems that drive growth and efficiency. Master CRM platforms, ERP solutions, business intelligence tools, and digital transformation strategies for modern enterprises.',
    duration: '3 Months',
    durationMonths: 3,
    price: 2000,
    currency: 'M',
    category: 'Business',
    level: 'Beginner to Intermediate',
    content:
      'Our Business Development Systems course teaches you how technology drives business success. This program covers the essential business systems that modern organizations rely on — from Customer Relationship Management (CRM) to Enterprise Resource Planning (ERP) and Business Intelligence (BI).\n\nYou will learn to select, implement, and customize business systems for different organizational needs. The course covers workflow automation, data analysis, project management tools, and digital transformation strategies.\n\nThis course is ideal for aspiring business analysts, IT consultants, office managers, and entrepreneurs who want to leverage technology for business growth. No prior technical experience is required.',
    objectives: [
      'Understand business systems architecture and design principles',
      'Implement and configure CRM platforms',
      'Set up and manage ERP systems for small businesses',
      'Analyze business data with BI tools',
      'Design automated workflows and business processes',
      'Implement project management systems',
      'Understand digital transformation strategies',
      'Develop business process documentation',
    ],
    modules: [
      {
        name: 'Business Systems Fundamentals',
        weeks: 3,
        description: 'Understand the role of technology in modern business operations.',
        topics: ['Business systems overview & types', 'Process mapping & analysis', 'System requirements gathering', 'Technology evaluation & selection', 'Implementation planning & strategy'],
      },
      {
        name: 'CRM & Customer Management',
        weeks: 3,
        description: 'Implement customer relationship management systems.',
        topics: ['CRM platform comparison & selection', 'Contact & lead management', 'Sales pipeline automation', 'Customer analytics & reporting', 'Integration with marketing tools'],
      },
      {
        name: 'ERP & Operations',
        weeks: 3,
        description: 'Set up and manage enterprise resource planning systems.',
        topics: ['ERP fundamentals & modules', 'Inventory management systems', 'Financial management modules', 'HR & payroll basics', 'Reporting & dashboard creation'],
      },
      {
        name: 'Business Intelligence & Automation',
        weeks: 3,
        description: 'Leverage data analytics and automation for business growth.',
        topics: ['BI tool overview (Power BI, Google Data Studio)', 'Data visualization & storytelling', 'Workflow automation tools (Zapier, Make)', 'Digital transformation roadmap', 'Project management tools & methodologies'],
      },
    ],
  },
];

// ─── Course Config ────────────────────────────────────────────────────────────

const courseConfig: Record<string, { icon: React.ElementType; gradient: string }> = {
  'web-development-programming': { icon: Code, gradient: 'from-emerald-500 via-teal-500 to-cyan-500' },
  'computer-networks': { icon: Network, gradient: 'from-blue-500 via-indigo-500 to-purple-500' },
  'cms-development-customization': { icon: Globe, gradient: 'from-orange-500 via-amber-500 to-yellow-500' },
  'business-development-systems': { icon: Briefcase, gradient: 'from-rose-500 via-pink-500 to-fuchsia-500' },
};

// ─── Animation Variants ──────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const staggerItem = {
  hidden: { opacity: 0, x: -15 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

// ─── Main Page Component ─────────────────────────────────────────────────────

export default function CourseDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function fetchCourse() {
      try {
        const res = await fetch('/api/courses');
        if (res.ok) {
          const data = await res.json();
          if (data.courses && data.courses.length > 0) {
            const found = data.courses.find((c: Course) => c.slug === slug);
            if (found) {
              setCourse(found);
            } else {
              const fallback = fallbackCourses.find((c) => c.slug === slug);
              if (fallback) {
                setCourse(fallback);
              } else {
                setNotFound(true);
              }
            }
          } else {
            const fallback = fallbackCourses.find((c) => c.slug === slug);
            if (fallback) {
              setCourse(fallback);
            } else {
              setNotFound(true);
            }
          }
        } else {
          const fallback = fallbackCourses.find((c) => c.slug === slug);
          if (fallback) {
            setCourse(fallback);
          } else {
            setNotFound(true);
          }
        }
      } catch {
        const fallback = fallbackCourses.find((c) => c.slug === slug);
        if (fallback) {
          setCourse(fallback);
        } else {
          setNotFound(true);
        }
      } finally {
        setLoading(false);
      }
    }
    if (slug) {
      fetchCourse();
    }
  }, [slug]);

  // ─── Loading State ────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen pt-28 pb-16 sm:pt-32 sm:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-6">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Loader2 className="h-5 w-5 animate-spin text-lta-green" />
              Loading course details...
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── Not Found State ─────────────────────────────────────────────────
  if (notFound || !course) {
    return (
      <div className="min-h-screen pt-28 pb-16 sm:pt-32 sm:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
            <AlertTriangle className="h-16 w-16 text-amber-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-2">Course Not Found</h1>
            <p className="text-muted-foreground mb-6">The course you are looking for does not exist or has been removed.</p>
            <Link href="/courses">
              <Button className="bg-lta-green hover:bg-lta-green-dark text-white">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Courses
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  const config = courseConfig[course.slug] || courseConfig['web-development-programming'];
  const IconComp = config.icon;
  const totalWeeks = course.modules.reduce((sum, mod) => sum + mod.weeks, 0);

  // ─── Course Detail Layout ────────────────────────────────────────────
  return (
    <div className="min-h-screen">
      {/* ─── Page Header ─────────────────────────────────────────── */}
      <section className="relative pt-28 pb-12 sm:pt-32 sm:pb-16 overflow-hidden">
        <div className="absolute inset-0 section-pattern opacity-40" />
        <div className="absolute top-0 right-0 w-80 h-80 bg-lta-green/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-lta-blue/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
            {/* Breadcrumb */}
            <motion.div variants={fadeUp}>
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/" className="text-muted-foreground hover:text-lta-green">
                      Home
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/courses" className="text-muted-foreground hover:text-lta-green">
                      Courses
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-lta-green font-semibold max-w-[200px] truncate">
                      {course.title}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </motion.div>

            {/* Title & Badges */}
            <motion.div variants={fadeUp} className="mt-6">
              <div className="flex items-start gap-4">
                <div className={`hidden sm:flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${config.gradient} shadow-lg shrink-0`}>
                  <IconComp className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
                    {course.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-3 mt-3">
                    <Badge className="bg-lta-green text-white border-0">{course.category}</Badge>
                    <Badge variant="outline" className="border-border">{course.level}</Badge>
                    <Badge variant="secondary" className="bg-lta-blue/10 text-lta-blue border-lta-blue/20">
                      <Clock className="h-3 w-3 mr-1" />
                      {course.duration}
                    </Badge>
                    <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                      <BookOpen className="h-3 w-3 mr-1" />
                      {totalWeeks} Weeks
                    </Badge>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── Main Content & Sidebar ──────────────────────────────── */}
      <section className="pb-16 sm:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* ─── Left: Main Content ────────────────────────────── */}
            <div className="flex-1 min-w-0">
              {/* Course Overview */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
                variants={fadeUp}
              >
                <Card className="rounded-2xl border border-lta-green/10 overflow-hidden">
                  <div className="h-1.5 bg-gradient-to-r from-lta-green to-lta-blue" />
                  <CardHeader>
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-lta-green" />
                      Course Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-muted-foreground leading-relaxed">
                      <ReactMarkdown
                        components={{
                          h1: ({ children }) => <h1 className="text-2xl font-bold text-foreground mt-6 mb-3">{children as ReactNode}</h1>,
                          h2: ({ children }) => <h2 className="text-xl font-bold text-foreground mt-5 mb-2">{children as ReactNode}</h2>,
                          h3: ({ children }) => <h3 className="text-lg font-semibold text-foreground mt-4 mb-2">{children as ReactNode}</h3>,
                          p: ({ children }) => <p className="text-muted-foreground leading-relaxed mb-3">{children as ReactNode}</p>,
                          strong: ({ children }) => <strong className="text-foreground font-semibold">{children as ReactNode}</strong>,
                          em: ({ children }) => <em className="text-foreground/80 italic">{children as ReactNode}</em>,
                          ul: ({ children }) => <ul className="list-disc list-inside space-y-1 mb-3 ml-4">{children as ReactNode}</ul>,
                          ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 mb-3 ml-4">{children as ReactNode}</ol>,
                          li: ({ children }) => <li className="text-muted-foreground leading-relaxed">{children as ReactNode}</li>,
                        }}
                      >
                        {course.content}
                      </ReactMarkdown>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* What You Will Learn */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
                variants={fadeUp}
                className="mt-8"
              >
                <Card className="rounded-2xl border border-lta-green/10 overflow-hidden">
                  <div className="h-1.5 bg-gradient-to-r from-emerald-400 to-lta-green" />
                  <CardHeader>
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-lta-green" />
                      What You Will Learn
                    </CardTitle>
                    <CardDescription>
                      By the end of this course, you will be able to:
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <motion.ul
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      variants={staggerContainer}
                      className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                    >
                      {course.objectives.map((objective, idx) => (
                        <motion.li
                          key={idx}
                          variants={staggerItem}
                          className="flex items-start gap-3 text-sm text-foreground/80 p-3 rounded-lg hover:bg-lta-green/5 transition-colors"
                        >
                          <CheckCircle2 className="h-5 w-5 text-lta-green shrink-0 mt-0.5" />
                          <span>{objective}</span>
                        </motion.li>
                      ))}
                    </motion.ul>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Course Curriculum / Modules */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
                variants={fadeUp}
                className="mt-8"
              >
                <Card className="rounded-2xl border border-lta-green/10 overflow-hidden">
                  <div className="h-1.5 bg-gradient-to-r from-lta-blue to-indigo-500" />
                  <CardHeader>
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-lta-blue" />
                      Course Curriculum
                    </CardTitle>
                    <CardDescription>
                      {course.modules.length} modules · {totalWeeks} weeks of comprehensive training
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      {course.modules.map((module, idx) => (
                        <AccordionItem
                          key={idx}
                          value={`module-${idx}`}
                          className="border-border/60"
                        >
                          <AccordionTrigger className="hover:no-underline py-4">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-left">
                              <div className="flex items-center gap-3">
                                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-lta-green to-lta-blue text-white text-xs font-bold shrink-0">
                                  {idx + 1}
                                </span>
                                <span className="font-semibold text-foreground text-sm sm:text-base">
                                  {module.name}
                                </span>
                              </div>
                              <span className="flex items-center gap-1.5 text-xs text-muted-foreground sm:ml-auto">
                                <Clock className="h-3.5 w-3.5" />
                                {module.weeks} week{module.weeks > 1 ? 's' : ''}
                              </span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="pl-0 sm:pl-11 space-y-3 pb-2">
                              <p className="text-sm text-muted-foreground">
                                {module.description}
                              </p>
                              <ul className="space-y-2">
                                {module.topics.map((topic, topicIdx) => (
                                  <li
                                    key={topicIdx}
                                    className="flex items-center gap-2.5 text-sm text-foreground/80"
                                  >
                                    <div className="h-1.5 w-1.5 rounded-full bg-lta-green shrink-0" />
                                    {topic}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* ─── Right: Sidebar ─────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="w-full lg:w-[340px] shrink-0"
            >
              <div className="lg:sticky lg:top-28">
                {/* Pricing Card */}
                <Card className="rounded-2xl border border-lta-green/10 shadow-lg overflow-hidden">
                  <div className="h-2 bg-gradient-to-r from-lta-green to-lta-blue" />
                  <CardContent className="p-6 space-y-5">
                    {/* Price */}
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Course Fee</p>
                      <p className="text-4xl font-bold gradient-text mt-1">
                        {course.currency}{course.price.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">{course.duration}</p>
                    </div>

                    <Separator />

                    {/* Details */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground flex items-center gap-2">
                          <Clock className="h-4 w-4 text-lta-green" />
                          Duration
                        </span>
                        <span className="font-semibold text-foreground">{course.duration}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground flex items-center gap-2">
                          <BarChart3 className="h-4 w-4 text-lta-green" />
                          Level
                        </span>
                        <span className="font-semibold text-foreground">{course.level}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-lta-green" />
                          Modules
                        </span>
                        <span className="font-semibold text-foreground">{course.modules.length} Modules</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground flex items-center gap-2">
                          <GraduationCap className="h-4 w-4 text-lta-green" />
                          Registration
                        </span>
                        <span className="font-semibold text-lta-green">M300</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground flex items-center gap-2">
                          <Award className="h-4 w-4 text-amber-600" />
                          Certificate Fee
                        </span>
                        <span className="font-semibold text-amber-600">M700</span>
                      </div>
                    </div>

                    <Separator />

                    {/* Payment Methods */}
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                        Payment Methods
                      </p>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="flex flex-col items-center gap-1.5 rounded-lg bg-lta-green/5 p-2.5 border border-lta-green/10">
                          <Smartphone className="h-4 w-4 text-lta-green" />
                          <span className="text-xs font-medium text-foreground">M-Pesa</span>
                        </div>
                        <div className="flex flex-col items-center gap-1.5 rounded-lg bg-lta-blue/5 p-2.5 border border-lta-blue/10">
                          <Smartphone className="h-4 w-4 text-lta-blue" />
                          <span className="text-xs font-medium text-foreground">EcoCash</span>
                        </div>
                        <div className="flex flex-col items-center gap-1.5 rounded-lg bg-amber-50 p-2.5 border border-amber-200">
                          <Building2 className="h-4 w-4 text-amber-600" />
                          <span className="text-xs font-medium text-foreground">Bank</span>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* CTA */}
                    <Link href="/admissions" className="block">
                      <Button
                        size="lg"
                        className="w-full bg-lta-green hover:bg-lta-green-dark text-white btn-glow-green font-semibold text-base"
                      >
                        <GraduationCap className="h-5 w-5 mr-2" />
                        Apply for This Course
                      </Button>
                    </Link>

                    <Link href="/courses" className="block">
                      <Button
                        variant="ghost"
                        className="w-full text-muted-foreground hover:text-lta-green"
                      >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Courses
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                {/* Quick Info Card */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 }}
                >
                  <Card className="mt-4 rounded-2xl border border-lta-green/10 bg-gradient-to-br from-lta-green/5 to-lta-blue/5">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-lta-green/10 shrink-0">
                          <IconComp className="h-5 w-5 text-lta-green" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">{course.category} Program</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {totalWeeks} weeks · {course.modules.length} modules · Hands-on projects included
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
