'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Code,
  Network,
  Globe,
  Briefcase,
  Clock,
  Banknote,
  ChevronRight,
  CheckCircle,
  ArrowRight,
  Monitor,
  Smartphone,
  Building2,
  Wifi,
  GraduationCap,
  Sparkles,
  BookOpen,
  Award,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
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
      'Master modern web development from front-end to back-end. Build responsive, dynamic websites and applications using industry-standard technologies including HTML5, CSS3, JavaScript, React, Node.js, and databases.',
    duration: '3 Months',
    durationMonths: 3,
    price: 2600,
    currency: 'M',
    category: 'Programming',
    level: 'Beginner to Intermediate',
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
        topics: ['Semantic HTML elements', 'CSS Flexbox & Grid layouts', 'Responsive design principles', 'CSS animations & transitions', 'Accessibility best practices'],
      },
      {
        name: 'JavaScript Essentials',
        weeks: 3,
        description: 'Master JavaScript programming from fundamentals to advanced concepts.',
        topics: ['Variables, types & operators', 'Functions & closures', 'DOM manipulation', 'Async programming & Promises', 'ES6+ modern syntax'],
      },
      {
        name: 'React & Front-End Frameworks',
        weeks: 4,
        description: 'Build dynamic, component-based user interfaces with React.',
        topics: ['React components & JSX', 'State management with hooks', 'React Router & navigation', 'API integration & data fetching', 'UI libraries & component design'],
      },
      {
        name: 'Back-End Development with Node.js',
        weeks: 3,
        description: 'Create robust server-side applications and RESTful APIs.',
        topics: ['Node.js & Express fundamentals', 'RESTful API design', 'Database integration (MongoDB/SQL)', 'Authentication & authorization', 'Error handling & middleware'],
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
    ],
    modules: [
      {
        name: 'Networking Fundamentals',
        weeks: 4,
        description: 'Build a solid foundation in networking concepts and protocols.',
        topics: ['OSI & TCP/IP models', 'Network topologies', 'Common network protocols', 'Cabling & physical layer', 'Network devices overview'],
      },
      {
        name: 'IP Addressing & Subnetting',
        weeks: 3,
        description: 'Master IPv4/IPv6 addressing, subnetting, and network segmentation.',
        topics: ['IPv4 addressing', 'Subnetting techniques', 'CIDR & VLSM', 'IPv6 fundamentals', 'NAT & PAT configuration'],
      },
      {
        name: 'Router & Switch Configuration',
        weeks: 6,
        description: 'Hands-on configuration of Cisco routers and switches.',
        topics: ['Cisco IOS CLI navigation', 'VLAN configuration', 'Spanning Tree Protocol', 'Inter-VLAN routing', 'Router configuration & static routes'],
      },
      {
        name: 'Network Security & Administration',
        weeks: 5,
        description: 'Implement security measures and manage network infrastructure.',
        topics: ['Firewall configuration', 'VPN implementation', 'ACLs & access control', 'Network monitoring tools', 'Incident response & recovery'],
      },
      {
        name: 'Wireless & Advanced Networks',
        weeks: 4,
        description: 'Deploy and manage wireless networks and advanced networking technologies.',
        topics: ['Wireless standards (802.11)', 'Wireless security', 'Network virtualization', 'Cloud networking basics', 'Network automation'],
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
    objectives: [
      'Install, configure, and manage WordPress installations',
      'Develop custom themes from scratch',
      'Create custom plugins and widgets',
      'Implement e-commerce solutions with WooCommerce',
      'Optimize websites for speed and SEO',
      'Implement security hardening and backups',
      'Manage multi-site networks',
      'Integrate third-party APIs and services',
      'Deploy and maintain production CMS installations',
    ],
    modules: [
      {
        name: 'WordPress Fundamentals',
        weeks: 4,
        description: 'Master the WordPress ecosystem from installation to content management.',
        topics: ['WordPress installation & setup', 'Dashboard & content management', 'Pages, posts & media', 'User roles & permissions', 'WordPress settings & configuration'],
      },
      {
        name: 'Theme Development',
        weeks: 6,
        description: 'Build custom WordPress themes using modern development practices.',
        topics: ['Theme structure & hierarchy', 'Template files & loops', 'Custom post types', 'Theme customization API', 'Responsive theme design'],
      },
      {
        name: 'Plugin Development',
        weeks: 5,
        description: 'Create custom plugins to extend WordPress functionality.',
        topics: ['Plugin architecture', 'Hooks & filters', 'Custom shortcodes', 'Admin settings pages', 'Plugin security best practices'],
      },
      {
        name: 'E-Commerce & Advanced Features',
        weeks: 5,
        description: 'Build online stores and implement advanced CMS features.',
        topics: ['WooCommerce setup', 'Payment gateway integration', 'Product management', 'Advanced customizations', 'Performance optimization'],
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
    objectives: [
      'Understand business systems architecture and design principles',
      'Implement and configure CRM platforms',
      'Set up and manage ERP systems for small businesses',
      'Analyze business data with BI tools',
      'Design automated workflows and processes',
      'Implement project management systems',
      'Understand digital transformation strategies',
      'Develop business process documentation',
    ],
    modules: [
      {
        name: 'Business Systems Fundamentals',
        weeks: 3,
        description: 'Understand the role of technology in modern business operations.',
        topics: ['Business systems overview', 'Process mapping & analysis', 'System requirements gathering', 'Technology evaluation', 'Implementation planning'],
      },
      {
        name: 'CRM & Customer Management',
        weeks: 3,
        description: 'Implement customer relationship management systems.',
        topics: ['CRM platform selection', 'Contact & lead management', 'Sales pipeline automation', 'Customer analytics', 'Integration strategies'],
      },
      {
        name: 'ERP & Operations',
        weeks: 3,
        description: 'Set up and manage enterprise resource planning systems.',
        topics: ['ERP fundamentals', 'Inventory management', 'Financial modules', 'HR & payroll basics', 'Reporting & dashboards'],
      },
      {
        name: 'Business Intelligence & Automation',
        weeks: 3,
        description: 'Leverage data analytics and automation for business growth.',
        topics: ['BI tool overview', 'Data visualization', 'Workflow automation', 'Digital transformation', 'Project management tools'],
      },
    ],
  },
];

// ─── Course Config ────────────────────────────────────────────────────────────

const courseConfig: Record<
  string,
  {
    icon: React.ElementType;
    gradient: string;
    gradientFrom: string;
    gradientTo: string;
    accentBg: string;
    topics: string[];
  }
> = {
  'web-development-programming': {
    icon: Code,
    gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
    gradientFrom: 'bg-emerald-500',
    gradientTo: 'bg-cyan-500',
    accentBg: 'bg-emerald-50 border-emerald-100',
    topics: ['HTML5 & CSS3', 'JavaScript', 'Database Design', 'Git & Deployment'],
  },
  'computer-networks': {
    icon: Network,
    gradient: 'from-blue-500 via-indigo-500 to-purple-500',
    gradientFrom: 'bg-blue-500',
    gradientTo: 'bg-purple-500',
    accentBg: 'bg-blue-50 border-blue-100',
    topics: ['Cisco Routers & Switches', 'IP Addressing & Subnetting', 'Network Security', 'Wireless Networks', 'Cloud Networking'],
  },
  'cms-development-customization': {
    icon: Globe,
    gradient: 'from-orange-500 via-amber-500 to-yellow-500',
    gradientFrom: 'bg-orange-500',
    gradientTo: 'bg-yellow-500',
    accentBg: 'bg-orange-50 border-orange-100',
    topics: ['WordPress Development', 'Custom Themes & Plugins', 'WooCommerce', 'SEO Optimization', 'Security Hardening'],
  },
  'business-development-systems': {
    icon: Briefcase,
    gradient: 'from-rose-500 via-pink-500 to-fuchsia-500',
    gradientFrom: 'bg-rose-500',
    gradientTo: 'bg-fuchsia-500',
    accentBg: 'bg-rose-50 border-rose-100',
    topics: ['CRM Platforms', 'ERP Systems', 'Business Intelligence', 'Workflow Automation', 'Digital Transformation'],
  },
};

// ─── Animation Variants ──────────────────────────────────────────────────────

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

// ─── Course Card Component ─────────────────────────────────────────────────────

function CourseCard({ course, index }: { course: Course; index: number }) {
  const config = courseConfig[course.slug] || courseConfig['web-development-programming'];
  const IconComp = config.icon;

  return (
    <Card className="group relative overflow-hidden rounded-2xl border border-lta-green/10 bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-lta-green/5 hover:-translate-y-1">
        {/* Gradient Top Bar */}
        <div className={`h-2 bg-gradient-to-r ${config.gradient}`} />

        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${config.gradient} shadow-lg`}>
              <IconComp className="h-6 w-6 text-white" />
            </div>
            <div className="flex gap-2">
              <Badge variant="secondary" className="bg-lta-green/10 text-lta-green border-lta-green/20 text-xs">
                {course.category}
              </Badge>
              <Badge variant="outline" className="text-xs border-border">
                {course.level}
              </Badge>
            </div>
          </div>
          <CardTitle className="text-xl font-bold leading-tight text-foreground mt-3 group-hover:text-lta-green transition-colors">
            {course.title}
          </CardTitle>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-lta-green" />
              {course.duration}
            </span>
            <span className="flex items-center gap-1.5 font-semibold text-lta-green">
              <Banknote className="h-4 w-4" />
              {course.currency}{course.price.toLocaleString()}
            </span>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 pb-2">
          <CardDescription className="text-sm leading-relaxed">
            {course.description}
          </CardDescription>

          {/* Key Topics */}
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Key Topics
            </p>
            <ul className="grid grid-cols-1 gap-1.5">
              {config.topics.map((topic) => (
                <li key={topic} className="flex items-center gap-2 text-sm text-foreground/80">
                  <CheckCircle className="h-3.5 w-3.5 text-lta-green shrink-0" />
                  {topic}
                </li>
              ))}
            </ul>
          </div>

          {/* Registration Fee Note */}
          <div className="flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2 border border-amber-200">
            <Sparkles className="h-4 w-4 text-amber-500 shrink-0" />
            <span className="text-xs text-amber-700 font-medium">
              M300 registration fee & Certificate fee M700
            </span>
          </div>
        </CardContent>

        <CardFooter className="flex gap-3 pt-2">
          <Button asChild variant="outline" className="flex-1 border-lta-green/30 text-lta-green hover:bg-lta-green hover:text-white transition-all">
              <Link href={`/courses/${course.slug}`}>
                View Full Details
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
            <Button asChild className="flex-1 bg-lta-green hover:bg-lta-green-dark text-white btn-glow-green transition-all">
              <Link href="/admissions">
                Apply Now
                <GraduationCap className="h-4 w-4 ml-1" />
              </Link>
            </Button>
        </CardFooter>
      </Card>
  );
}

// ─── Main Page Component ─────────────────────────────────────────────────────

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        const res = await fetch('/api/courses', { signal: controller.signal });
        clearTimeout(timeoutId);
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
    }
    fetchCourses();
  }, []);

  return (
    <div className="min-h-screen">
      {/* ─── Page Header ─────────────────────────────────────────────── */}
      <section className="relative pt-28 pb-16 sm:pt-32 sm:pb-20 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 section-pattern opacity-50" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-lta-green/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-lta-blue/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" animate="visible" variants={containerVariants}>
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
                    <BreadcrumbPage className="text-lta-green font-semibold">Courses</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </motion.div>

            {/* Title */}
            <motion.div variants={fadeUp} className="mt-6 max-w-3xl">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
                <span className="gradient-text">Our Courses</span>
              </h1>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed max-w-2xl">
                Professional IT training programs designed to equip you with in-demand skills.
                From web development to networking, our courses are crafted for real-world success.
              </p>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              variants={fadeUp}
              className="mt-8 flex flex-wrap gap-4 sm:gap-6"
            >
              <div className="flex items-center gap-2 rounded-xl bg-white/80 backdrop-blur-sm border border-lta-green/10 px-4 py-2.5 shadow-sm">
                <BookOpen className="h-5 w-5 text-lta-green" />
                <div>
                  <p className="text-xs text-muted-foreground">Programs</p>
                  <p className="text-sm font-bold text-foreground">4 Courses</p>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-white/80 backdrop-blur-sm border border-lta-green/10 px-4 py-2.5 shadow-sm">
                <Clock className="h-5 w-5 text-lta-green" />
                <div>
                  <p className="text-xs text-muted-foreground">Duration</p>
                  <p className="text-sm font-bold text-foreground">3–6 Months</p>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-white/80 backdrop-blur-sm border border-lta-green/10 px-4 py-2.5 shadow-sm">
                <Banknote className="h-5 w-5 text-lta-green" />
                <div>
                  <p className="text-xs text-muted-foreground">Starting From</p>
                  <p className="text-sm font-bold text-foreground">M2,000</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── Course Cards Grid ───────────────────────────────────────── */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
          >
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <Card key={i} className="rounded-2xl overflow-hidden">
                    <Skeleton className="h-2 w-full" />
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <Skeleton className="h-12 w-12 rounded-xl" />
                        <div className="flex gap-2">
                          <Skeleton className="h-6 w-20 rounded-md" />
                          <Skeleton className="h-6 w-28 rounded-md" />
                        </div>
                      </div>
                      <Skeleton className="h-6 w-3/4 mt-3" />
                      <div className="flex gap-4 mt-2">
                        <Skeleton className="h-5 w-24" />
                        <Skeleton className="h-5 w-20" />
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4 pb-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                      <div className="space-y-2">
                        <Skeleton className="h-3 w-20" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                      </div>
                    </CardContent>
                    <CardFooter className="flex gap-3">
                      <Skeleton className="h-10 flex-1 rounded-md" />
                      <Skeleton className="h-10 flex-1 rounded-md" />
                    </CardFooter>
                  </Card>
                ))
              : courses.map((course, index) => (
                  <motion.div
                    key={course.slug}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <CourseCard course={course} index={index} />
                  </motion.div>
                ))}
          </motion.div>
        </div>
      </section>

      {/* ─── Fees & Payment Section ─────────────────────────────────── */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={fadeUp}
            className="max-w-3xl mx-auto"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold">
                <span className="gradient-text">Fees & Payment</span>
              </h2>
              <p className="mt-2 text-muted-foreground">
                Affordable, flexible payment options for all students
              </p>
            </div>

            <Card className="rounded-2xl border border-lta-green/10 shadow-lg overflow-hidden">
              <div className="h-1.5 bg-gradient-to-r from-lta-green to-lta-blue" />
              <CardContent className="p-6 sm:p-8">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {/* Registration Fee */}
                  <div className="rounded-xl bg-lta-green/5 border border-lta-green/10 p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-lta-green text-white">
                        <GraduationCap className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Registration Fee</p>
                        <p className="text-2xl font-bold text-lta-green">M300</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      One-time registration fee applicable to all courses
                    </p>
                  </div>

                  {/* Certificate Fee */}
                  <div className="rounded-xl bg-amber-50 border border-amber-200 p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-600 text-white">
                        <Award className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Certificate Fee</p>
                        <p className="text-2xl font-bold text-amber-600">M700</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Certificate issued upon successful course completion
                    </p>
                  </div>

                  {/* Payment Methods */}
                  <div className="rounded-xl bg-lta-blue/5 border border-lta-blue/10 p-5 sm:col-span-3">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-lta-blue text-white">
                        <Smartphone className="h-5 w-5" />
                      </div>
                      <p className="text-sm font-semibold text-foreground">Payment Methods</p>
                    </div>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2 text-sm text-foreground/80">
                        <div className="h-2 w-2 rounded-full bg-lta-green" />
                        <span className="font-medium">M-Pesa</span>
                        <span className="text-muted-foreground">— Mobile Money</span>
                      </li>
                      <li className="flex items-center gap-2 text-sm text-foreground/80">
                        <div className="h-2 w-2 rounded-full bg-lta-blue" />
                        <span className="font-medium">EcoCash</span>
                        <span className="text-muted-foreground">— Mobile Money</span>
                      </li>
                      <li className="flex items-center gap-2 text-sm text-foreground/80">
                        <div className="h-2 w-2 rounded-full bg-amber-500" />
                        <span className="font-medium">Bank Transfer</span>
                        <span className="text-muted-foreground">— Direct Deposit</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Building2 className="h-4 w-4" />
                  <span>All prices in Maloti (M)</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* ─── Online Classes Banner ─────────────────────────────────── */}
      <section className="py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-lta-green to-lta-blue p-6 sm:p-8 lg:p-10">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/3" />

              <div className="relative flex flex-col sm:flex-row items-center gap-6">
                <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm shrink-0">
                  <Monitor className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                </div>
                <div className="text-center sm:text-left flex-1">
                  <h3 className="text-xl sm:text-2xl font-bold text-white">
                    Online Classes Now Available!
                  </h3>
                  <p className="mt-2 text-white/80 text-sm sm:text-base max-w-2xl">
                    Our online learning platform is now live. Join from anywhere in Lesotho and study
                    at your own pace with live instructor-led sessions, interactive labs, and community support.
                  </p>
                </div>
                <Button asChild size="lg" className="bg-white text-lta-green hover:bg-white/90 font-semibold shadow-lg transition-all">
                  <Link href="/admissions">
                    Enroll Now
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
