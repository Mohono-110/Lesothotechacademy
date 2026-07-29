'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, BookOpen, FileText, CreditCard, User, LogOut,
  Loader2, Upload, Smartphone, Building2, ArrowRight, CheckCircle,
  Clock, Eye, Bell, Menu, X, Settings,
  ChevronRight, Edit3, Camera, CalendarDays, Newspaper,
  GraduationCap, Wallet, MapPin, Mail, Phone, Globe, Briefcase,
  Save, ArrowLeft, Shield, UserCheck, Star,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

// ─── Types ───────────────────────────────────────────────────────────────────

interface StudentUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  city?: string;
  country?: string;
  bio?: string;
  profileImage?: string;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
}

interface App {
  id: string;
  courseId: string;
  status: string;
  createdAt: string;
  course?: {
    id: string;
    title: string;
    slug: string;
    duration: string;
    price: number;
  };
  payments?: {
    id: string;
    status: string;
    amount: number;
    paymentMethod: string;
    transactionRef?: string;
    screenshotUrl?: string;
    createdAt: string;
  }[];
}

interface EditForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  city: string;
  country: string;
  bio: string;
  password: string;
  confirmPassword: string;
}

// ─── Placeholder News Data ───────────────────────────────────────────────────

const NEWS_ITEMS = [
  {
    id: '1',
    title: 'New Web Development Cohort Starting Soon',
    excerpt: 'We are excited to announce a new cohort for our Web Development course beginning next month. Register now to secure your spot!',
    date: '2025-01-10',
    category: 'Announcement',
  },
  {
    id: '2',
    title: 'LTA Partners with Tech Companies for Internships',
    excerpt: 'Lesotho Tech Academy has signed partnerships with leading tech firms to provide internship opportunities for our graduates.',
    date: '2025-01-05',
    category: 'Partnership',
  },
  {
    id: '3',
    title: 'Student Success Story: From LTA to Software Engineer',
    excerpt: 'Meet Thabo, a graduate from our first cohort who now works as a full-stack developer at a leading company.',
    date: '2024-12-28',
    category: 'Success Story',
  },
  {
    id: '4',
    title: 'Free Coding Workshop This Saturday',
    excerpt: 'Join us for a free introductory coding workshop. No experience needed — just bring your laptop and curiosity!',
    date: '2024-12-20',
    category: 'Event',
  },
  {
    id: '5',
    title: 'Scholarship Opportunities Available',
    excerpt: 'Thanks to our sponsors, we are offering partial scholarships for deserving students. Apply before the deadline.',
    date: '2024-12-15',
    category: 'Scholarship',
  },
  {
    id: '6',
    title: 'Holiday Break Schedule',
    excerpt: 'Please note the academy holiday schedule. Classes resume on January 6th. Happy holidays from the LTA team!',
    date: '2024-12-10',
    category: 'Notice',
  },
];

// ─── Navigation Items ────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'applications', label: 'Applications', icon: FileText },
  { id: 'courses', label: 'My Courses', icon: BookOpen },
  { id: 'payments', label: 'Payments', icon: CreditCard },
  { id: 'news', label: 'News & Events', icon: Newspaper },
  { id: 'profile', label: 'Profile', icon: User },
];

// ─── Main Component ──────────────────────────────────────────────────────────

export default function DashboardPage() {
  const router = useRouter();

  // Auth & student state
  const [student, setStudent] = useState<StudentUser | null>(null);
  const [applications, setApplications] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);

  // UI state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Payment state
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [transactionRef, setTransactionRef] = useState('');
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Profile edit state
  const [editMode, setEditMode] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [editForm, setEditForm] = useState<EditForm>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    city: '',
    country: '',
    bio: '',
    password: '',
    confirmPassword: '',
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const profileImageInputRef = useRef<HTMLInputElement>(null);

  // ─── Auth Check ─────────────────────────────────────────────────────────
  useEffect(() => {
    try {
      const userStr = localStorage.getItem('lta_user');
      const role = localStorage.getItem('lta_role');
      if (!userStr || role !== 'student') {
        router.push('/login');
        return;
      }
      const user = JSON.parse(userStr);
      setStudent(user);
      fetchApplications(user.id);
    } catch {
      router.push('/login');
    } finally {
      setLoading(false);
    }
  }, []);

  // ─── Close sidebar on resize ────────────────────────────────────────────
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setSidebarOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ─── Data Fetching ──────────────────────────────────────────────────────
  const fetchApplications = async (studentId: string) => {
    try {
      const res = await fetch(`/api/applications?studentId=${studentId}`);
      if (res.ok) {
        const data = await res.json();
        setApplications(data.applications || []);
      }
    } catch {
      /* silent */
    }
  };

  // ─── Handlers ───────────────────────────────────────────────────────────
  const handleLogout = () => {
    localStorage.removeItem('lta_user');
    localStorage.removeItem('lta_role');
    router.push('/');
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppId || !paymentMethod || !transactionRef || !screenshot) {
      toast.error('Please fill all payment fields and upload screenshot');
      return;
    }
    setPaymentLoading(true);
    try {
      const formData = new FormData();
      formData.append('applicationId', selectedAppId);
      formData.append('amount', '300');
      formData.append('paymentMethod', paymentMethod);
      formData.append('transactionRef', transactionRef);
      formData.append('screenshot', screenshot);
      const res = await fetch('/api/payments', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Payment failed');
      toast.success('Payment proof submitted! Our team will verify it shortly.');
      setSelectedAppId('');
      setPaymentMethod('');
      setTransactionRef('');
      setScreenshot(null);
      setScreenshotPreview(null);
      if (student) fetchApplications(student.id);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Payment submission failed');
    } finally {
      setPaymentLoading(false);
    }
  };

  // ─── Profile Edit Handlers ──────────────────────────────────────────────
  const openEditMode = () => {
    if (!student) return;
    setEditForm({
      firstName: student.firstName || '',
      lastName: student.lastName || '',
      email: student.email || '',
      phone: student.phone || '',
      dateOfBirth: student.dateOfBirth || '',
      gender: student.gender || '',
      address: student.address || '',
      city: student.city || '',
      country: student.country || '',
      bio: student.bio || '',
      password: '',
      confirmPassword: '',
    });
    setProfileImage(null);
    setProfileImagePreview(student.profileImage || null);
    setEditMode(true);
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!student) return;

    if (editForm.password && editForm.password !== editForm.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (editForm.password && editForm.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setProfileLoading(true);
    try {
      const formData = new FormData();
      formData.append('firstName', editForm.firstName);
      formData.append('lastName', editForm.lastName);
      formData.append('email', editForm.email);
      formData.append('phone', editForm.phone);
      formData.append('dateOfBirth', editForm.dateOfBirth);
      formData.append('gender', editForm.gender);
      formData.append('address', editForm.address);
      formData.append('city', editForm.city);
      formData.append('country', editForm.country);
      formData.append('bio', editForm.bio);
      if (editForm.password) {
        formData.append('password', editForm.password);
      }
      if (profileImage) {
        formData.append('profileImage', profileImage);
      }

      const res = await fetch('/api/student/profile', {
        method: 'PUT',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Profile update failed');

      const updatedUser = { ...student, ...data.user };
      setStudent(updatedUser);
      localStorage.setItem('lta_user', JSON.stringify(updatedUser));
      setEditMode(false);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

  // ─── Status colors ──────────────────────────────────────────────────────
  const statusColors: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-800 border-amber-200',
    approved: 'bg-blue-100 text-blue-800 border-blue-200',
    rejected: 'bg-red-100 text-red-800 border-red-200',
    enrolled: 'bg-green-100 text-green-800 border-green-200',
  };

  // ─── Computed values ────────────────────────────────────────────────────
  const enrolledApps = applications.filter((a) => a.status === 'enrolled');
  const pendingApps = applications.filter(
    (a) => a.status === 'pending' && !a.payments?.length
  );
  const paybleApps = applications.filter(
    (a) => a.status === 'pending' && !a.payments?.length
  );

  const initials =
    (student?.firstName?.[0] || '') + (student?.lastName?.[0] || '');

  const breadcrumbLabel =
    NAV_ITEMS.find((n) => n.id === activeTab)?.label || 'Dashboard';

  // ─── Loading Screen ─────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-lta-green" />
          <p className="text-muted-foreground text-sm">Loading your portal...</p>
        </div>
      </div>
    );
  }

  // ─── Sidebar Content ────────────────────────────────────────────────────
  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-5 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-lta-green to-lta-blue flex items-center justify-center flex-shrink-0">
          <GraduationCap className="h-5 w-5 text-white" />
        </div>
        <div className="min-w-0">
          <h2 className="font-bold text-sm gradient-text">Lesotho Tech</h2>
          <p className="text-[10px] text-muted-foreground font-medium tracking-wide uppercase">Academy</p>
        </div>
        <button
          onClick={() => setSidebarOpen(false)}
          className="ml-auto lg:hidden p-1.5 rounded-lg hover:bg-muted transition-colors"
          aria-label="Close sidebar"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <Separator />

      {/* User info */}
      <div className="p-4">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-lta-green/5 border border-lta-green/10">
          <Avatar className="h-10 w-10 flex-shrink-0">
            {student?.profileImage ? (
              <AvatarImage src={student.profileImage} alt={student.firstName} />
            ) : null}
            <AvatarFallback className="bg-gradient-to-br from-lta-green to-lta-blue text-white text-sm font-semibold">
              {initials || 'ST'}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="font-semibold text-sm truncate">
              {student?.firstName} {student?.lastName}
            </p>
            <p className="text-xs text-muted-foreground truncate">{student?.email}</p>
          </div>
        </div>
      </div>

      <Separator />

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-lta-green text-white shadow-md shadow-lta-green/25'
                  : 'text-muted-foreground hover:bg-lta-green/5 hover:text-foreground'
              }`}
            >
              <item.icon className={`h-[18px] w-[18px] flex-shrink-0 ${isActive ? 'text-white' : ''}`} />
              <span className="truncate">{item.label}</span>
              {isActive && (
                <ChevronRight className="h-3.5 w-3.5 ml-auto" />
              )}
            </button>
          );
        })}
      </nav>

      <Separator />

      {/* Bottom actions */}
      <div className="p-3 space-y-1">
        <button
          onClick={() => {
            setActiveTab('profile');
            setSidebarOpen(false);
          }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:bg-lta-green/5 hover:text-foreground transition-all duration-200"
        >
          <Edit3 className="h-[18px] w-[18px]" />
          <span>Edit Profile</span>
        </button>
        <button
          onClick={() => {
            setSidebarOpen(false);
            toast.info('Settings coming soon!');
          }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:bg-lta-green/5 hover:text-foreground transition-all duration-200"
        >
          <Settings className="h-[18px] w-[18px]" />
          <span>Settings</span>
        </button>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 transition-all duration-200"
        >
          <LogOut className="h-[18px] w-[18px]" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  // ─── Tab Content Renderers ──────────────────────────────────────────────

  const renderDashboard = () => (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Welcome Banner */}
      <div className="rounded-2xl bg-gradient-to-br from-lta-green via-lta-green-dark to-lta-blue p-6 lg:p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 section-pattern opacity-20" />
        <div className="relative z-10">
          <h2 className="text-2xl lg:text-3xl font-bold mb-2">
            Welcome back, {student?.firstName}! 👋
          </h2>
          <p className="text-white/80 mb-5 max-w-xl">
            Track your applications, upload payments, and manage your learning journey at Lesotho Tech Academy.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/admissions">
              <Button
                size="sm"
                className="bg-white text-lta-green hover:bg-white/90 gap-1.5 shadow-lg"
              >
                <BookOpen className="h-4 w-4" /> Apply for Course
              </Button>
            </Link>
            <Link href="/courses">
              <Button
                size="sm"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 gap-1.5"
              >
                Browse Courses
              </Button>
            </Link>
          </div>
        </div>
        <div className="absolute -right-8 -top-8 w-40 h-40 bg-white/10 rounded-full" />
        <div className="absolute -right-4 bottom-0 w-24 h-24 bg-white/5 rounded-full" />
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Applications', value: applications.length, icon: FileText, color: 'text-lta-green', bg: 'bg-lta-green/10', border: 'border-lta-green/20' },
          { label: 'Enrolled', value: enrolledApps.length, icon: CheckCircle, color: 'text-lta-blue', bg: 'bg-lta-blue/10', border: 'border-lta-blue/20' },
          { label: 'Pending', value: pendingApps.length, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
          { label: 'Payments', value: applications.filter((a) => a.payments && a.payments.length > 0).length, icon: Wallet, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.08 }}
          >
            <Card className={`${stat.border} hover:shadow-md transition-shadow`}>
              <CardContent className="p-4 lg:p-5 flex items-center gap-3 lg:gap-4">
                <div
                  className={`w-11 h-11 lg:w-12 lg:h-12 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center flex-shrink-0`}
                >
                  <stat.icon className="h-5 w-5 lg:h-6 lg:w-6" />
                </div>
                <div>
                  <p className="text-xl lg:text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs lg:text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* News & Recent Applications Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Latest News */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Latest News</CardTitle>
              <button
                onClick={() => setActiveTab('news')}
                className="text-xs text-lta-green hover:underline font-medium flex items-center gap-1"
              >
                View All <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {NEWS_ITEMS.slice(0, 3).map((news) => (
              <div
                key={news.id}
                className="flex gap-3 p-2.5 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => setActiveTab('news')}
              >
                <div className="w-2 h-2 rounded-full bg-lta-green mt-2 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{news.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {new Date(news.date).toLocaleDateString('en-LS', { month: 'short', day: 'numeric' })}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Applications */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Recent Applications</CardTitle>
              <button
                onClick={() => setActiveTab('applications')}
                className="text-xs text-lta-green hover:underline font-medium flex items-center gap-1"
              >
                View All <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </CardHeader>
          <CardContent>
            {applications.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">No applications yet</p>
            ) : (
              <div className="space-y-2.5">
                {applications.slice(0, 4).map((app) => (
                  <div
                    key={app.id}
                    className="flex items-center justify-between gap-3 p-2.5 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{app.course?.title || 'Course'}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(app.createdAt).toLocaleDateString('en-LS', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={`${statusColors[app.status] || ''} text-[11px] flex-shrink-0`}
                    >
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );

  const renderApplications = () => (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <Card>
        <CardHeader>
          <CardTitle>My Applications</CardTitle>
          <CardDescription>Track your course applications and their current status</CardDescription>
        </CardHeader>
        <CardContent>
          {applications.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p className="mb-4">You haven&apos;t applied for any courses yet.</p>
              <Link href="/admissions">
                <Button className="bg-lta-green hover:bg-lta-green-dark text-white gap-1.5">
                  <BookOpen className="h-4 w-4" /> Apply Now
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {applications.map((app) => (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="border-lta-green/10 hover:border-lta-green/25 hover:shadow-sm transition-all">
                    <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm">{app.course?.title || 'Course'}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Applied:{' '}
                          {new Date(app.createdAt).toLocaleDateString('en-LS', { year: 'numeric', month: 'short', day: 'numeric' })}
                          {app.payments && app.payments.length > 0
                            ? ` \u2022 Payment: ${app.payments[0].status}`
                            : ''}
                        </p>
                        {app.course?.duration && (
                          <p className="text-xs text-muted-foreground mt-0.5">Duration: {app.course.duration}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Badge variant="outline" className={statusColors[app.status] || ''}>
                          {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                        </Badge>
                        {app.status === 'pending' && !app.payments?.length && (
                          <Button
                            size="sm"
                            className="bg-lta-green hover:bg-lta-green-dark text-white text-xs gap-1"
                            onClick={() => {
                              setSelectedAppId(app.id);
                              setActiveTab('payments');
                            }}
                          >
                            <CreditCard className="h-3 w-3" /> Pay M300
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );

  const renderCourses = () => (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>My Enrolled Courses</CardTitle>
          <CardDescription>Courses you are currently enrolled in</CardDescription>
        </CardHeader>
        <CardContent>
          {enrolledApps.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p className="mb-4">No enrolled courses yet. Apply and complete payment to get started!</p>
              <Link href="/admissions">
                <Button className="bg-lta-green hover:bg-lta-green-dark text-white gap-1.5">
                  <ArrowRight className="h-4 w-4" /> Apply for a Course
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {enrolledApps.map((app, i) => (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: i * 0.1 }}
                >
                  <Card className="border-lta-green/20 overflow-hidden hover:shadow-md transition-shadow">
                    <div className="h-1.5 bg-gradient-to-r from-lta-green to-lta-blue" />
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-10 h-10 rounded-lg bg-lta-green/10 flex items-center justify-center">
                          <GraduationCap className="h-5 w-5 text-lta-green" />
                        </div>
                        <Badge className="bg-lta-green/10 text-lta-green border-lta-green/20">Enrolled</Badge>
                      </div>
                      <h3 className="font-semibold mb-1">{app.course?.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{app.course?.duration}</p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Progress</span>
                          <span className="font-medium">0%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-lta-green to-lta-blue rounded-full transition-all duration-500" style={{ width: '0%' }} />
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full mt-4 border-lta-green/20 text-lta-green hover:bg-lta-green/5 gap-1.5"
                      >
                        <Eye className="h-3.5 w-3.5" /> View Course
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );

  const renderPayments = () => (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <Card>
        <CardHeader>
          <CardTitle>Upload Payment Proof</CardTitle>
          <CardDescription>Upload a screenshot of your M300 registration fee payment</CardDescription>
        </CardHeader>
        <CardContent>
          {paybleApps.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p>No pending payments. Apply for a course first!</p>
              <Link href="/admissions" className="inline-block mt-4">
                <Button className="bg-lta-green hover:bg-lta-green-dark text-white gap-1.5">
                  <ArrowRight className="h-4 w-4" /> Apply Now
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handlePaymentSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label>Select Application *</Label>
                <Select value={selectedAppId} onValueChange={setSelectedAppId}>
                  <SelectTrigger><SelectValue placeholder="Choose application" /></SelectTrigger>
                  <SelectContent>
                    {applications.filter((a) => a.status === 'pending').map((app) => (
                      <SelectItem key={app.id} value={app.id}>{app.course?.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label>Payment Method *</Label>
                <div className="grid sm:grid-cols-3 gap-3">
                  {[
                    { id: 'mpesa', label: 'M-Pesa', icon: Smartphone, activeColor: 'border-green-300 bg-green-50 text-green-700 shadow-sm' },
                    { id: 'ecocash', label: 'EcoCash', icon: Smartphone, activeColor: 'border-blue-300 bg-blue-50 text-blue-700 shadow-sm' },
                    { id: 'bank', label: 'Bank Transfer', icon: Building2, activeColor: 'border-purple-300 bg-purple-50 text-purple-700 shadow-sm' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMethod(m.id)}
                      className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                        paymentMethod === m.id ? m.activeColor : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <m.icon className={`h-5 w-5 mb-1.5 ${paymentMethod === m.id ? '' : 'text-gray-400'}`} />
                      <span className="font-semibold text-sm">{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Transaction Reference *</Label>
                  <Input placeholder="Enter reference code" value={transactionRef} onChange={(e) => setTransactionRef(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Amount</Label>
                  <Input value="M300" disabled className="bg-gray-50" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Payment Screenshot *</Label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) {
                      if (f.size > 5 * 1024 * 1024) { toast.error('File must be under 5MB'); return; }
                      setScreenshot(f);
                      const r = new FileReader();
                      r.onloadend = () => setScreenshotPreview(r.result as string);
                      r.readAsDataURL(f);
                    }
                  }}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-lta-green/50 hover:bg-lta-green/5 transition-all flex flex-col items-center gap-3"
                >
                  {screenshotPreview ? (
                    <div className="relative">
                      <img src={screenshotPreview} alt="Preview" className="max-h-40 mx-auto rounded-lg object-contain" />
                      <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm">Click to change</span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Upload className="h-6 w-6 text-lta-green" />
                      <span className="text-sm">Click to upload screenshot (PNG, JPG, max 5MB)</span>
                    </>
                  )}
                </button>
              </div>

              <Button
                type="submit"
                className="w-full bg-lta-green hover:bg-lta-green-dark text-white btn-glow-green"
                disabled={paymentLoading}
              >
                {paymentLoading ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Submitting...</>
                ) : (
                  'Submit Payment Proof'
                )}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>

      {/* Payment History */}
      {applications.some((a) => a.payments && a.payments.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Payment History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2.5">
              {applications
                .filter((a) => a.payments && a.payments.length > 0)
                .map((app) =>
                  app.payments!.map((pay) => (
                    <div
                      key={pay.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-gray-100"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-lta-green/10 flex items-center justify-center">
                          <CreditCard className="h-4 w-4 text-lta-green" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{app.course?.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {pay.paymentMethod}{pay.transactionRef ? ` \u2022 ${pay.transactionRef}` : ''}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold">M{pay.amount}</p>
                        <Badge variant="outline" className={`${statusColors[pay.status] || ''} text-[10px]`}>
                          {pay.status.charAt(0).toUpperCase() + pay.status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );

  const renderNews = () => (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-xl font-bold">News & Events</h2>
        <p className="text-sm text-muted-foreground mt-1">Stay updated with the latest from Lesotho Tech Academy</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {NEWS_ITEMS.map((news, i) => (
          <motion.div
            key={news.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.08 }}
          >
            <Card className="h-full overflow-hidden hover:shadow-md transition-all duration-300 group">
              <div className="h-36 bg-gradient-to-br from-lta-green/10 to-lta-blue/10 flex items-center justify-center relative">
                <Newspaper className="h-10 w-10 text-lta-green/30" />
                <Badge className="absolute top-3 left-3 bg-white/90 text-foreground shadow-sm text-[10px]">
                  {news.category}
                </Badge>
              </div>
              <CardContent className="p-4 flex flex-col">
                <p className="text-xs text-muted-foreground mb-1.5 flex items-center gap-1">
                  <CalendarDays className="h-3 w-3" />
                  {new Date(news.date).toLocaleDateString('en-LS', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
                <h3 className="font-semibold text-sm mb-2 line-clamp-2 group-hover:text-lta-green transition-colors">
                  {news.title}
                </h3>
                <p className="text-xs text-muted-foreground mb-4 line-clamp-3 flex-1">{news.excerpt}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-lta-green hover:bg-lta-green/5 hover:text-lta-green-dark text-xs font-semibold gap-1"
                  onClick={() => toast.info('Full article coming soon!')}
                >
                  READ MORE <ArrowRight className="h-3 w-3" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  const renderProfile = () => (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Profile Header */}
      <Card className="overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-lta-green to-lta-blue relative">
          <div className="absolute inset-0 section-pattern opacity-20" />
        </div>
        <CardContent className="p-6 relative">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-10">
            <div className="relative">
              <Avatar className="h-20 w-20 border-4 border-white shadow-lg">
                {student?.profileImage ? (
                  <AvatarImage src={student.profileImage} alt={student.firstName} />
                ) : null}
                <AvatarFallback className="bg-gradient-to-br from-lta-green to-lta-blue text-white text-xl font-bold">
                  {initials || 'ST'}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-lta-green rounded-full flex items-center justify-center border-2 border-white">
                <UserCheck className="h-3 w-3 text-white" />
              </div>
            </div>
            <div className="flex-1 pt-2 sm:pt-0">
              <h2 className="text-lg font-bold">{student?.firstName} {student?.lastName}</h2>
              <p className="text-sm text-muted-foreground">{student?.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge
                  variant="outline"
                  className={student?.isActive ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}
                >
                  {student?.isActive ? 'Active' : 'Inactive'}
                </Badge>
                <Badge
                  variant="outline"
                  className={student?.isVerified ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-amber-50 text-amber-700 border-amber-200'}
                >
                  <Shield className="h-3 w-3 mr-1" />
                  {student?.isVerified ? 'Verified' : 'Unverified'}
                </Badge>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-lta-green/20 text-lta-green hover:bg-lta-green/5 gap-1.5"
              onClick={editMode ? () => setEditMode(false) : openEditMode}
            >
              {editMode ? (
                <><ArrowLeft className="h-4 w-4" /> Cancel</>
              ) : (
                <><Edit3 className="h-4 w-4" /> Edit Profile</>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Profile Content */}
      <AnimatePresence mode="wait">
        {!editMode ? (
          <motion.div
            key="view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Personal Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-0">
                  {[
                    { label: 'Full Name', value: `${student?.firstName} ${student?.lastName}`, icon: User },
                    { label: 'Email', value: student?.email, icon: Mail },
                    { label: 'Phone', value: student?.phone || 'Not provided', icon: Phone },
                    { label: 'Date of Birth', value: student?.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString('en-LS', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Not provided', icon: CalendarDays },
                    { label: 'Gender', value: student?.gender || 'Not provided', icon: User },
                    { label: 'Address', value: student?.address || 'Not provided', icon: MapPin },
                    { label: 'City', value: student?.city || 'Not provided', icon: MapPin },
                    { label: 'Country', value: student?.country || 'Lesotho', icon: Globe },
                    { label: 'Bio', value: student?.bio || 'Not provided', icon: Briefcase },
                    { label: 'Member Since', value: student?.createdAt ? new Date(student.createdAt).toLocaleDateString('en-LS', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A', icon: Star },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-start gap-3 p-4 border-b border-r border-gray-100 last:border-0"
                    >
                      <div className="w-8 h-8 rounded-lg bg-lta-green/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <item.icon className="h-4 w-4 text-lta-green" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground mb-0.5">{item.label}</p>
                        <p className="text-sm font-medium break-words">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="edit"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Edit Profile</CardTitle>
                <CardDescription>Update your personal information</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileSubmit} className="space-y-5">
                  {/* Profile Image Upload */}
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Avatar className="h-16 w-16">
                        {profileImagePreview ? (
                          <AvatarImage src={profileImagePreview} />
                        ) : null}
                        <AvatarFallback className="bg-gradient-to-br from-lta-green to-lta-blue text-white font-semibold">
                          {initials || 'ST'}
                        </AvatarFallback>
                      </Avatar>
                      <button
                        type="button"
                        onClick={() => profileImageInputRef.current?.click()}
                        className="absolute -bottom-1 -right-1 w-7 h-7 bg-lta-green rounded-full flex items-center justify-center border-2 border-white shadow-sm hover:bg-lta-green-dark transition-colors"
                      >
                        <Camera className="h-3 w-3 text-white" />
                      </button>
                      <input
                        type="file"
                        ref={profileImageInputRef}
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) {
                            if (f.size > 5 * 1024 * 1024) { toast.error('Image must be under 5MB'); return; }
                            setProfileImage(f);
                            const r = new FileReader();
                            r.onloadend = () => setProfileImagePreview(r.result as string);
                            r.readAsDataURL(f);
                          }
                        }}
                        accept="image/*"
                        className="hidden"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Profile Photo</p>
                      <p className="text-xs text-muted-foreground">JPG, PNG. Max 5MB.</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input id="firstName" value={editForm.firstName} onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })} placeholder="First name" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input id="lastName" value={editForm.lastName} onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })} placeholder="Last name" required />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="editEmail">Email *</Label>
                      <Input id="editEmail" type="email" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} placeholder="Email address" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="editPhone">Phone</Label>
                      <Input id="editPhone" value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} placeholder="Phone number" />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dob">Date of Birth</Label>
                      <Input id="dob" type="date" value={editForm.dateOfBirth} onChange={(e) => setEditForm({ ...editForm, dateOfBirth: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Gender</Label>
                      <Select value={editForm.gender} onValueChange={(v) => setEditForm({ ...editForm, gender: v })}>
                        <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                          <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" value={editForm.address} onChange={(e) => setEditForm({ ...editForm, address: e.target.value })} placeholder="Street address" />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="editCity">City</Label>
                      <Input id="editCity" value={editForm.city} onChange={(e) => setEditForm({ ...editForm, city: e.target.value })} placeholder="City" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="editCountry">Country</Label>
                      <Input id="editCountry" value={editForm.country} onChange={(e) => setEditForm({ ...editForm, country: e.target.value })} placeholder="Country" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea id="bio" value={editForm.bio} onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })} placeholder="Tell us about yourself..." rows={3} />
                  </div>

                  <Separator />

                  <div className="space-y-1.5">
                    <p className="text-sm font-medium">Change Password</p>
                    <p className="text-xs text-muted-foreground">Leave blank to keep your current password</p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input id="newPassword" type="password" value={editForm.password} onChange={(e) => setEditForm({ ...editForm, password: e.target.value })} placeholder="New password" autoComplete="new-password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input id="confirmPassword" type="password" value={editForm.confirmPassword} onChange={(e) => setEditForm({ ...editForm, confirmPassword: e.target.value })} placeholder="Confirm password" autoComplete="new-password" />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button type="submit" className="flex-1 bg-lta-green hover:bg-lta-green-dark text-white btn-glow-green" disabled={profileLoading}>
                      {profileLoading ? (
                        <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</>
                      ) : (
                        <><Save className="h-4 w-4" /> Save Changes</>
                      )}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setEditMode(false)}>Cancel</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );

  // ─── Main Layout ───────────────────────────────────────────────────────

  const tabContent: Record<string, () => React.ReactNode> = {
    dashboard: renderDashboard,
    applications: renderApplications,
    courses: renderCourses,
    payments: renderPayments,
    news: renderNews,
    profile: renderProfile,
  };

  const CurrentTabIcon = NAV_ITEMS.find((n) => n.id === activeTab)?.icon || LayoutDashboard;

  return (
    <div className="min-h-screen bg-gray-50/50 flex">
      {/* ─── Mobile Overlay ─── */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ─── Sidebar ───*/}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-72 bg-white border-r border-gray-200/80 shadow-xl lg:shadow-none lg:translate-x-0 transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* ─── Main Content ───*/}
      <div className="flex-1 lg:ml-72 min-h-screen flex flex-col">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200/80 h-14">
          <div className="h-full px-4 lg:px-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Hamburger (mobile) */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
                aria-label="Open sidebar"
              >
                <Menu className="h-5 w-5" />
              </button>

              {/* Breadcrumb */}
              <nav className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Student Portal</span>
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="font-medium flex items-center gap-1.5">
                  <CurrentTabIcon className="h-4 w-4 text-lta-green" />
                  {breadcrumbLabel}
                </span>
              </nav>
            </div>

            <div className="flex items-center gap-2">
              {/* Notification Bell */}
              <button
                className="relative p-2 rounded-lg hover:bg-muted transition-colors"
                onClick={() => toast.info('No new notifications')}
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5 text-muted-foreground" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-lta-green rounded-full" />
              </button>

              {/* User Avatar (top bar) */}
              <Avatar className="h-8 w-8 border border-gray-200">
                {student?.profileImage ? (
                  <AvatarImage src={student.profileImage} alt={student.firstName} />
                ) : null}
                <AvatarFallback className="bg-gradient-to-br from-lta-green to-lta-blue text-white text-[10px] font-semibold">
                  {initials || 'ST'}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6 max-w-5xl w-full mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.2 }}
            >
              {tabContent[activeTab]?.()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
