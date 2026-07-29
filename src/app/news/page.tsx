'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Trophy,
  Calendar,
  ArrowRight,
  BookOpen,
  CreditCard,
  UserPlus,
  Megaphone,
  Handshake,
  GraduationCap,
  Mail,
  Star,
  Clock,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

const featuredArticle = {
  title: 'Millicent Academy Students Claim Top Prizes at LSMTA Fair 2026',
  date: '24 July 2026',
  category: 'Achievement',
  icon: Trophy,
  content: `We are thrilled to announce that an instructor at Lesotho Tech Academy mentored three students from Millicent Academy Junior School for the Lesotho Science, Mathematics, and Technology Association (LSMTA) Science Fair 2026, held from 22nd to 24th July 2026.

Out of the three students who competed in the Technology Category, two qualified at the national level — securing both 1st Prize and 2nd Prize positions. Their projects demonstrated remarkable creativity, technical skill, and problem-solving abilities that impressed the judges and stood out among numerous competitors from across the country.

This achievement is a testament to the quality of mentorship and IT education provided at Lesotho Tech Academy. Our comprehensive curriculum in Web Development, Computer Networks, and CMS Development empowers young Basotho learners to compete at the highest levels in science and technology.

We extend our heartfelt congratulations to these remarkable students from Millicent Academy Junior School and their dedicated instructor from Lesotho Tech Academy. Their success inspires us to continue our mission of bridging the technology gap in Lesotho through accessible, high-quality IT education.`,
  link: 'https://millicentacademy.co.ls',
};

const newsItems = [
  {
    title: 'Online Classes Now in Progress',
    date: '10 April 2026',
    category: 'Announcement',
    icon: BookOpen,
    color: 'bg-lta-green/10 text-lta-green',
    excerpt:
      'Our online learning platform is now live! Students can attend classes from anywhere in Lesotho. All four courses are available online with interactive sessions, video lectures, and hands-on projects.',
  },
  {
    title: 'New Course: Business Development Systems',
    date: '1 April 2026',
    category: 'New Course',
    icon: GraduationCap,
    color: 'bg-lta-blue/10 text-lta-blue',
    excerpt:
      'We are excited to announce the launch of our newest 3-month programme — Business Development Systems. This course covers entrepreneurship, digital marketing, project management, and business strategy for the modern economy.',
  },
  {
    title: 'M-Pesa & EcoCash Payment Now Available',
    date: '20 March 2026',
    category: 'Update',
    icon: CreditCard,
    color: 'bg-lta-green/10 text-lta-green',
    excerpt:
      'Paying for your registration and tuition fees is now easier than ever! We now accept M-Pesa and EcoCash payments alongside bank transfers. Simply use the reference number provided after submitting your application.',
  },
  {
    title: 'Registration Open for 2026 Intake',
    date: '5 March 2026',
    category: 'Enrollment',
    icon: UserPlus,
    color: 'bg-lta-blue/10 text-lta-blue',
    excerpt:
      'Registration is now open for the 2026 academic intake. Secure your spot in Web Development, Computer Networks, CMS Development, or Business Development Systems. Pay only M300 to register!',
  },
  {
    title: 'Founder Relebohile Mohono Featured in Tech',
    date: '15 February 2026',
    category: 'Spotlight',
    icon: Megaphone,
    color: 'bg-lta-green/10 text-lta-green',
    excerpt:
      'Our founder, Relebohile Joseph Mohono, has been featured in leading technology publications for his vision of transforming IT education in Lesotho. Read about his journey from Leribe to building one of the country\'s premier tech academies.',
  },
  {
    title: 'Lesotho Tech Academy Partners with Local Schools',
    date: '1 February 2026',
    category: 'Community',
    icon: Handshake,
    color: 'bg-lta-blue/10 text-lta-blue',
    excerpt:
      'We are proud to announce new partnerships with local schools across Leribe District. Through these collaborations, we aim to introduce coding and technology skills to secondary school students, building the next generation of Basotho tech leaders.',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

export default function NewsPage() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = () => {
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <div className="pt-20">
      {/* Page Header */}
      <section className="relative bg-gradient-to-br from-lta-green/5 via-lta-blue/5 to-lta-green/5 section-pattern overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/80" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Breadcrumb className="mb-6">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/" className="text-lta-green hover:text-lta-green-dark">
                      Home
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>News & Events</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-lta-green/10 rounded-xl">
                <Megaphone className="h-8 w-8 text-lta-green" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
                  News & <span className="gradient-text">Events</span>
                </h1>
                <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                  Stay updated with the latest from Lesotho Tech Academy
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Article */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          {/* Featured Label */}
          <div className="flex items-center gap-2 mb-6">
            <div className="h-px flex-1 bg-gradient-to-r from-yellow-400/60 to-transparent" />
            <Badge className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white hover:from-yellow-600 hover:to-amber-600 px-4 py-1.5 text-xs font-semibold tracking-wide uppercase shadow-sm">
              <Star className="h-3 w-3 mr-1.5" />
              Featured Story
            </Badge>
            <div className="h-px flex-1 bg-gradient-to-l from-yellow-400/60 to-transparent" />
          </div>

          {/* Main Featured Card */}
          <Card className="overflow-hidden border-0 shadow-2xl shadow-yellow-900/10">
            <div className="grid lg:grid-cols-[340px_1fr]">
              {/* Left Visual Panel */}
              <div className="relative bg-gradient-to-br from-lta-green via-lta-green to-lta-blue p-8 sm:p-10 flex flex-col items-center justify-center text-center min-h-[320px] lg:min-h-[480px]">
                {/* Decorative elements */}
                <div className="absolute top-0 left-0 w-24 h-24 bg-white/5 rounded-br-[60px]" />
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/5 rounded-tl-[80px]" />

                {/* Trophy & Achievement Visual */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="relative mb-6"
                >
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-white/15 backdrop-blur-sm border-2 border-white/25 flex items-center justify-center shadow-xl">
                    <Trophy className="h-14 w-14 sm:h-16 sm:w-16 text-yellow-300 drop-shadow-lg" />
                  </div>
                  {/* Floating medals */}
                  <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center shadow-lg animate-pulse">
                    <span className="text-white text-xs font-black">#1</span>
                  </div>
                  <div className="absolute -bottom-1 -right-4 w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center shadow-lg">
                    <span className="text-gray-700 text-xs font-bold">#2</span>
                  </div>
                </motion.div>

                <h3 className="text-white font-bold text-lg sm:text-xl mb-2">LSMTA Fair 2026</h3>
                <p className="text-white/70 text-sm">22nd – 24th July</p>

                <div className="mt-6 flex items-center gap-3">
                  <Badge className="bg-white/15 text-white border-white/20 backdrop-blur-sm text-xs">
                    <Calendar className="h-3 w-3 mr-1" />
                    {featuredArticle.date}
                  </Badge>
                  <Badge className="bg-yellow-400/20 text-yellow-200 border-yellow-400/20 backdrop-blur-sm text-xs">
                    {featuredArticle.category}
                  </Badge>
                </div>
              </div>

              {/* Right Content Panel */}
              <div className="p-6 sm:p-8 lg:p-10 xl:p-12 flex flex-col justify-center">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground leading-tight mb-6">
                  {featuredArticle.title}
                </h2>

                <div className="space-y-4 text-muted-foreground text-sm sm:text-base leading-relaxed text-justify mb-8">
                  {featuredArticle.content.split('\n\n').map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>

                {/* CTA and stats */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-6 border-t border-border/50">
                  <a
                    href={featuredArticle.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-lta-green hover:bg-lta-green-dark text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg hover:shadow-lta-green/20"
                  >
                    Visit Millicent Academy
                    <ArrowRight className="h-4 w-4" />
                  </a>
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-yellow-500" />
                      <span>1st &amp; 2nd Prize</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-lta-blue" />
                      <span>2 of 3 Qualified</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </section>

      {/* News Cards Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 lg:pb-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {newsItems.map((item, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="group h-full hover:shadow-lg hover:border-lta-green/30 transition-all duration-300 glass-card">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg ${item.color}`}>
                      <item.icon className="h-5 w-5" />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {item.category}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg leading-tight group-hover:text-lta-green transition-colors">
                    {item.title}
                  </CardTitle>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{item.date}</span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.excerpt}
                  </p>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button
                    variant="ghost"
                    className="text-lta-green hover:text-lta-green-dark hover:bg-lta-green/5 p-0 h-auto font-medium"
                  >
                    Read More
                    <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Newsletter Signup */}
      <section className="section-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="bg-gradient-to-r from-lta-green to-lta-blue text-white overflow-hidden shadow-xl">
              <CardContent className="p-8 lg:p-12">
                <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-10">
                  <div className="flex-1 text-center lg:text-left">
                    <div className="flex items-center justify-center lg:justify-start gap-3 mb-3">
                      <Mail className="h-8 w-8" />
                      <h2 className="text-2xl lg:text-3xl font-bold">Stay in the Loop</h2>
                    </div>
                    <p className="text-white/80 text-sm lg:text-base">
                      Subscribe to our newsletter for the latest news, course updates, and special offers
                      from Lesotho Tech Academy.
                    </p>
                  </div>
                  <div className="w-full lg:w-auto lg:min-w-[400px]">
                    {subscribed ? (
                      <div className="flex items-center justify-center gap-2 py-3 px-6 bg-white/20 rounded-lg">
                        <Star className="h-5 w-5 text-yellow-300" />
                        <span className="font-medium">Thank you for subscribing!</span>
                      </div>
                    ) : (
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Input
                          type="email"
                          placeholder="Enter your email address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus-visible:ring-white/30 focus-visible:border-white/40 h-12"
                          onKeyDown={(e) => e.key === 'Enter' && handleSubscribe()}
                        />
                        <Button
                          onClick={handleSubscribe}
                          className="bg-white text-lta-green hover:bg-white/90 font-semibold h-12 px-6 btn-glow-green shrink-0"
                        >
                          Subscribe
                          <ArrowRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
