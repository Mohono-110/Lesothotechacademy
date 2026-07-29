'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Users, FileText, CreditCard, BookOpen, MessageSquare,
  LogOut, Loader2, CheckCircle, XCircle, Clock, Eye, EyeOff, Trash2,
  ChevronRight, Menu, X, Shield, UserCheck, UserX, DollarSign,
  GraduationCap, Phone, Mail, MapPin, Calendar, AlertCircle, Star,
  TrendingUp, ArrowUpRight, BarChart3, ImageIcon, ExternalLink,
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
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

// ─── Types ───────────────────────────────────────────────────────────────────

interface AdminUser {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

interface StudentData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  city: string;
  country: string;
  profileImage?: string;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  applications?: ApplicationData[];
  enrollments?: EnrollmentData[];
}

interface CourseData {
  id: string;
  title: string;
  slug: string;
  description: string;
  duration: string;
  durationMonths: number;
  price: number;
  currency: string;
  category: string;
  level: string;
  isPublished: boolean;
  image?: string;
  createdAt: string;
}

interface ApplicationData {
  id: string;
  studentId: string;
  courseId: string;
  status: string;
  motivationalLetter?: string;
  educationLevel?: string;
  experience?: string;
  createdAt: string;
  student?: { firstName: string; lastName: string; email: string };
  course?: { title: string; price: number; currency: string };
  payments?: PaymentData[];
}

interface PaymentData {
  id: string;
  applicationId: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  transactionRef?: string;
  screenshotUrl?: string;
  status: string;
  adminNote?: string;
  createdAt: string;
  application?: { course?: { title: string }; student?: { firstName: string; lastName: string; email: string } };
}

interface ContactMessageData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

type AdminTab = 'overview' | 'students' | 'applications' | 'payments' | 'courses' | 'messages';

// ─── Status Colors ──────────────────────────────────────────────────────────

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  approved: 'bg-blue-100 text-blue-800 border-blue-200',
  rejected: 'bg-red-100 text-red-800 border-red-200',
  enrolled: 'bg-green-100 text-green-800 border-green-200',
  active: 'bg-green-100 text-green-800 border-green-200',
  suspended: 'bg-orange-100 text-orange-800 border-orange-200',
  completed: 'bg-purple-100 text-purple-800 border-purple-200',
  closed: 'bg-gray-100 text-gray-800 border-gray-200',
};

const paymentMethodLabels: Record<string, string> = {
  mpesa: 'M-Pesa',
  ecocash: 'EcoCash',
  bank: 'Bank Transfer',
};

// ─── Component ─────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const router = useRouter();
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Data states
  const [students, setStudents] = useState<StudentData[]>([]);
  const [applications, setApplications] = useState<ApplicationData[]>([]);
  const [payments, setPayments] = useState<PaymentData[]>([]);
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [messages, setMessages] = useState<ContactMessageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Dialog states
  const [viewApplication, setViewApplication] = useState<ApplicationData | null>(null);
  const [viewPayment, setViewPayment] = useState<PaymentData | null>(null);
  const [viewMessage, setViewMessage] = useState<ContactMessageData | null>(null);
  const [viewStudent, setViewStudent] = useState<StudentData | null>(null);
  const [adminNoteDialog, setAdminNoteDialog] = useState<{ type: 'payment' | 'application'; id: string; currentNote?: string } | null>(null);
  const [adminNoteText, setAdminNoteText] = useState('');

  // Auth check
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('lta_user');
      const storedRole = localStorage.getItem('lta_role');
      if (storedUser && storedRole === 'admin') {
        setAdmin(JSON.parse(storedUser));
      } else {
        router.push('/login');
      }
    } catch {
      router.push('/login');
    }
  }, [router]);

  // Data fetchers
  const fetchStudents = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/students');
      const data = await res.json();
      if (data.students) setStudents(data.students);
    } catch (err) { console.error('Fetch students error:', err); }
  }, []);

  const fetchApplications = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/applications');
      const data = await res.json();
      if (data.applications) setApplications(data.applications);
    } catch (err) { console.error('Fetch applications error:', err); }
  }, []);

  const fetchPayments = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/payments');
      const data = await res.json();
      if (data.payments) setPayments(data.payments);
    } catch (err) { console.error('Fetch payments error:', err); }
  }, []);

  const fetchCourses = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/courses');
      const data = await res.json();
      if (data.courses) setCourses(data.courses);
    } catch (err) { console.error('Fetch courses error:', err); }
  }, []);

  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/messages');
      const data = await res.json();
      if (data.messages) setMessages(data.messages);
    } catch (err) { console.error('Fetch messages error:', err); }
  }, []);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    await Promise.all([fetchStudents(), fetchApplications(), fetchPayments(), fetchCourses(), fetchMessages()]);
    setLoading(false);
  }, [fetchStudents, fetchApplications, fetchPayments, fetchCourses, fetchMessages]);

  useEffect(() => {
    if (admin) fetchAll();
  }, [admin, fetchAll]);

  // Actions
  const handleLogout = () => {
    localStorage.removeItem('lta_user');
    localStorage.removeItem('lta_role');
    router.push('/login');
  };

  const handleApplicationStatus = async (applicationId: string, status: string, adminNote?: string) => {
    setActionLoading(applicationId);
    try {
      const res = await fetch('/api/admin/applications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId, status, adminNote }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(`Application ${status} successfully`);
        fetchApplications();
        fetchStudents();
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update application');
    } finally {
      setActionLoading(null);
      setViewApplication(null);
      setAdminNoteDialog(null);
    }
  };

  const handlePaymentStatus = async (paymentId: string, status: string) => {
    setActionLoading(paymentId);
    try {
      const res = await fetch('/api/admin/payments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId, status }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(`Payment ${status} successfully`);
        fetchPayments();
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update payment');
    } finally {
      setActionLoading(null);
      setViewPayment(null);
      setAdminNoteDialog(null);
    }
  };

  const handleStudentToggle = async (studentId: string, field: 'isActive' | 'isVerified', value: boolean) => {
    setActionLoading(studentId);
    try {
      const res = await fetch('/api/admin/students', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, [field]: value }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(`Student ${field === 'isActive' ? (value ? 'activated' : 'deactivated') : (value ? 'verified' : 'unverified')}`);
        fetchStudents();
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update student');
    } finally {
      setActionLoading(null);
    }
  };

  const handleCoursePublish = async (courseId: string, isPublished: boolean) => {
    setActionLoading(courseId);
    try {
      const res = await fetch('/api/admin/courses', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId, isPublished }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(`Course ${isPublished ? 'published' : 'unpublished'}`);
        fetchCourses();
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update course');
    } finally {
      setActionLoading(null);
    }
  };

  const handleMessageToggle = async (messageId: string, isRead: boolean) => {
    try {
      await fetch('/api/admin/messages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageId, isRead }),
      });
      fetchMessages();
    } catch (err) { console.error('Toggle message error:', err); }
  };

  const handleMessageDelete = async (messageId: string) => {
    try {
      await fetch(`/api/admin/messages?id=${messageId}`, { method: 'DELETE' });
      toast.success('Message deleted');
      setViewMessage(null);
      fetchMessages();
    } catch (err) {
      toast.error('Failed to delete message');
    }
  };

  // Stats
  const stats = {
    totalStudents: students.length,
    activeStudents: students.filter(s => s.isActive).length,
    totalApplications: applications.length,
    pendingApplications: applications.filter(a => a.status === 'pending').length,
    totalPayments: payments.length,
    pendingPayments: payments.filter(p => p.status === 'pending').length,
    totalRevenue: payments.filter(p => p.status === 'approved').reduce((sum, p) => sum + p.amount, 0),
    unreadMessages: messages.filter(m => !m.isRead).length,
    publishedCourses: courses.filter(c => c.isPublished).length,
  };

  // Sidebar navigation items
  const navItems: { id: AdminTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'overview', label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
    { id: 'students', label: 'Students', icon: <Users className="h-5 w-5" />, badge: stats.totalStudents },
    { id: 'applications', label: 'Applications', icon: <FileText className="h-5 w-5" />, badge: stats.pendingApplications },
    { id: 'payments', label: 'Payments', icon: <CreditCard className="h-5 w-5" />, badge: stats.pendingPayments },
    { id: 'courses', label: 'Courses', icon: <BookOpen className="h-5 w-5" />, badge: courses.length },
    { id: 'messages', label: 'Messages', icon: <MessageSquare className="h-5 w-5" />, badge: stats.unreadMessages },
  ];

  // ─── Tab Content Renderers ────────────────────────────────────────────────

  const renderOverview = () => (
    <motion.div
      key="overview"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Welcome Banner */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-lta-blue to-lta-green p-6 md:p-8 text-white">
        <div className="absolute inset-0 section-pattern opacity-20" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="h-8 w-8" />
            <h1 className="text-2xl md:text-3xl font-bold">Admin Dashboard</h1>
          </div>
          <p className="text-white/80 text-lg">
            Welcome back, {admin?.name || 'Admin'}. Here&apos;s your academy overview.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="border-l-4 border-l-lta-green">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Students</p>
                  <p className="text-3xl font-bold gradient-text">{stats.totalStudents}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stats.activeStudents} active</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-lta-green/10 flex items-center justify-center">
                  <GraduationCap className="h-6 w-6 text-lta-green" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card className="border-l-4 border-l-yellow-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Applications</p>
                  <p className="text-3xl font-bold text-yellow-600">{stats.totalApplications}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stats.pendingApplications} pending</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="border-l-4 border-l-lta-blue">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Revenue</p>
                  <p className="text-3xl font-bold text-lta-blue">M{stats.totalRevenue.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stats.totalPayments} payments</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-lta-blue/10 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-lta-blue" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Messages</p>
                  <p className="text-3xl font-bold text-purple-600">{stats.unreadMessages}</p>
                  <p className="text-xs text-muted-foreground mt-1">{messages.length} total</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Applications */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-lta-green" /> Recent Applications
            </CardTitle>
            <Button variant="ghost" size="sm" className="text-lta-green" onClick={() => setActiveTab('applications')}>
              View All <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            {applications.slice(0, 5).map((app) => (
              <div key={app.id} className="flex items-center justify-between py-3 border-b last:border-0">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-lta-green/10 text-lta-green text-xs">
                      {(app.student?.firstName?.[0] || '?')}{(app.student?.lastName?.[0] || '')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{app.student?.firstName} {app.student?.lastName}</p>
                    <p className="text-xs text-muted-foreground">{app.course?.title}</p>
                  </div>
                </div>
                <Badge className={`text-xs ${statusColors[app.status] || ''}`}>{app.status}</Badge>
              </div>
            ))}
            {applications.length === 0 && (
              <p className="text-muted-foreground text-sm text-center py-4">No applications yet</p>
            )}
          </CardContent>
        </Card>

        {/* Pending Payments */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-lta-blue" /> Pending Payments
            </CardTitle>
            <Button variant="ghost" size="sm" className="text-lta-blue" onClick={() => setActiveTab('payments')}>
              View All <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            {payments.filter(p => p.status === 'pending').slice(0, 5).map((pay) => (
              <div key={pay.id} className="flex items-center justify-between py-3 border-b last:border-0">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-lta-blue/10 flex items-center justify-center">
                    <DollarSign className="h-4 w-4 text-lta-blue" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{pay.application?.student?.firstName} {pay.application?.student?.lastName}</p>
                    <p className="text-xs text-muted-foreground">{paymentMethodLabels[pay.paymentMethod] || pay.paymentMethod} - {pay.transactionRef || 'No ref'}</p>
                  </div>
                </div>
                <Badge className="text-xs">M{pay.amount}</Badge>
              </div>
            ))}
            {payments.filter(p => p.status === 'pending').length === 0 && (
              <p className="text-muted-foreground text-sm text-center py-4">No pending payments</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Course Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-lta-green" /> Course Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {courses.map((course) => {
              const courseApps = applications.filter(a => a.courseId === course.id);
              const courseStudents = courseApps.filter(a => a.status === 'enrolled').length;
              return (
                <div key={course.id} className="p-4 rounded-xl border bg-card hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant={course.isPublished ? 'default' : 'secondary'} className="text-xs">
                      {course.isPublished ? 'Published' : 'Draft'}
                    </Badge>
                    <span className="text-2xl font-bold gradient-text">{courseStudents}</span>
                  </div>
                  <p className="font-medium text-sm line-clamp-2">{course.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">M{course.price} · {course.duration} · {courseApps.length} applications</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const renderStudents = () => (
    <motion.div key="students" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Students</h2>
          <p className="text-muted-foreground">{stats.totalStudents} registered students</p>
        </div>
      </div>

      <div className="space-y-3">
        {students.map((student, index) => (
          <motion.div
            key={student.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
          >
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <Avatar className="h-12 w-12 shrink-0">
                      <AvatarImage src={student.profileImage} />
                      <AvatarFallback className="bg-lta-green/10 text-lta-green font-bold">
                        {student.firstName?.[0]}{student.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold">{student.firstName} {student.lastName}</h3>
                        <Badge variant="outline" className={student.isActive ? 'border-green-200 text-green-700' : 'border-red-200 text-red-700'}>
                          {student.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        {student.isVerified && (
                          <Badge className="bg-lta-green/10 text-lta-green border-lta-green/20">
                            <UserCheck className="h-3 w-3 mr-1" /> Verified
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground flex-wrap">
                        <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{student.email}</span>
                        {student.phone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{student.phone}</span>}
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{student.city}, {student.country}</span>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        <span>{student.enrollments?.length || 0} enrollments</span>
                        <span>·</span>
                        <span>Joined {new Date(student.createdAt).toLocaleDateString('en-LS', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button variant="ghost" size="sm" onClick={() => setViewStudent(student)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStudentToggle(student.id, 'isActive', !student.isActive)}
                      disabled={actionLoading === student.id}
                    >
                      {actionLoading === student.id ? <Loader2 className="h-4 w-4 animate-spin" /> :
                        student.isActive ? <UserX className="h-4 w-4 text-red-500" /> : <UserCheck className="h-4 w-4 text-green-500" />
                      }
                    </Button>
                    {!student.isVerified && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStudentToggle(student.id, 'isVerified', true)}
                        disabled={actionLoading === student.id}
                      >
                        <Shield className="h-4 w-4 text-lta-blue" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
        {students.length === 0 && (
          <Card className="p-12 text-center">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">No Students Yet</h3>
            <p className="text-muted-foreground">Students will appear here once they register.</p>
          </Card>
        )}
      </div>
    </motion.div>
  );

  const renderApplications = () => (
    <motion.div key="applications" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Applications</h2>
          <p className="text-muted-foreground">{stats.totalApplications} total · {stats.pendingApplications} pending</p>
        </div>
      </div>

      <div className="space-y-3">
        {applications.map((app, index) => (
          <motion.div
            key={app.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
          >
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-semibold">{app.student?.firstName} {app.student?.lastName}</h3>
                      <Badge className={`text-xs ${statusColors[app.status] || ''}`}>{app.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{app.course?.title}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground flex-wrap">
                      <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{app.student?.email}</span>
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(app.createdAt).toLocaleDateString('en-LS')}</span>
                      {app.educationLevel && <span>🎓 {app.educationLevel}</span>}
                    </div>
                    {app.motivationalLetter && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-1 italic">&quot;{app.motivationalLetter}&quot;</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button variant="ghost" size="sm" onClick={() => setViewApplication(app)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    {app.status === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          className="bg-lta-green hover:bg-lta-green-dark text-white"
                          onClick={() => handleApplicationStatus(app.id, 'enrolled')}
                          disabled={actionLoading === app.id}
                        >
                          {actionLoading === app.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleApplicationStatus(app.id, 'rejected')}
                          disabled={actionLoading === app.id}
                        >
                          {actionLoading === app.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
        {applications.length === 0 && (
          <Card className="p-12 text-center">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">No Applications Yet</h3>
            <p className="text-muted-foreground">Applications will appear here once students apply.</p>
          </Card>
        )}
      </div>
    </motion.div>
  );

  const renderPayments = () => (
    <motion.div key="payments" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Payments</h2>
          <p className="text-muted-foreground">{stats.totalPayments} total · M{stats.totalRevenue.toLocaleString()} approved</p>
        </div>
      </div>

      <div className="space-y-3">
        {payments.map((pay, index) => (
          <motion.div
            key={pay.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
          >
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-semibold">{pay.application?.student?.firstName} {pay.application?.student?.lastName}</h3>
                      <Badge className={`text-xs ${statusColors[pay.status] || ''}`}>{pay.status}</Badge>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground flex-wrap">
                      <span className="flex items-center gap-1 font-medium text-foreground">M{pay.amount}</span>
                      <Badge variant="outline">{paymentMethodLabels[pay.paymentMethod] || pay.paymentMethod}</Badge>
                      {pay.transactionRef && <span className="text-xs">Ref: {pay.transactionRef}</span>}
                      <span className="text-xs">{new Date(pay.createdAt).toLocaleDateString('en-LS')}</span>
                    </div>
                    {pay.adminNote && (
                      <p className="text-xs text-muted-foreground mt-1 italic">Note: {pay.adminNote}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {pay.screenshotUrl && (
                      <Button variant="ghost" size="sm" onClick={() => window.open(pay.screenshotUrl, '_blank')}>
                        <ImageIcon className="h-4 w-4 mr-1" /> Receipt
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" onClick={() => setViewPayment(pay)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    {pay.status === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          className="bg-lta-green hover:bg-lta-green-dark text-white"
                          onClick={() => handlePaymentStatus(pay.id, 'approved')}
                          disabled={actionLoading === pay.id}
                        >
                          {actionLoading === pay.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handlePaymentStatus(pay.id, 'rejected')}
                          disabled={actionLoading === pay.id}
                        >
                          {actionLoading === pay.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
        {payments.length === 0 && (
          <Card className="p-12 text-center">
            <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">No Payments Yet</h3>
            <p className="text-muted-foreground">Payments will appear here once students submit them.</p>
          </Card>
        )}
      </div>
    </motion.div>
  );

  const renderCourses = () => (
    <motion.div key="courses" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Courses</h2>
          <p className="text-muted-foreground">{courses.length} courses · {stats.publishedCourses} published</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {courses.map((course, index) => {
          const courseApps = applications.filter(a => a.courseId === course.id);
          const courseEnrolled = courseApps.filter(a => a.status === 'enrolled').length;
          const courseRevenue = payments
            .filter(p => p.application?.courseId === course.id && p.status === 'approved')
            .reduce((sum, p) => sum + p.amount, 0);

          return (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="hover:shadow-md transition-shadow overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-lta-green to-lta-blue" />
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg">{course.title}</h3>
                      <p className="text-sm text-muted-foreground">{course.category} · {course.level}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xl font-bold gradient-text">M{course.price.toLocaleString()}</span>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{course.description}</p>

                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="text-center p-2 rounded-lg bg-muted/50">
                      <p className="text-lg font-bold">{courseApps.length}</p>
                      <p className="text-xs text-muted-foreground">Applied</p>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-muted/50">
                      <p className="text-lg font-bold text-lta-green">{courseEnrolled}</p>
                      <p className="text-xs text-muted-foreground">Enrolled</p>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-muted/50">
                      <p className="text-lg font-bold text-lta-blue">M{courseRevenue.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Revenue</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{course.duration}</Badge>
                      <Badge variant="outline">{course.durationMonths} months</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Published</span>
                      <Switch
                        checked={course.isPublished}
                        onCheckedChange={(checked) => handleCoursePublish(course.id, checked)}
                        disabled={actionLoading === course.id}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );

  const renderMessages = () => (
    <motion.div key="messages" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Messages</h2>
          <p className="text-muted-foreground">{messages.length} total · {stats.unreadMessages} unread</p>
        </div>
      </div>

      <div className="space-y-3">
        {messages.map((msg, index) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
          >
            <Card className={`hover:shadow-md transition-shadow ${!msg.isRead ? 'border-l-4 border-l-lta-green bg-lta-green/[0.02]' : ''}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      {!msg.isRead && <span className="h-2 w-2 rounded-full bg-lta-green shrink-0" />}
                      <h3 className="font-semibold">{msg.name}</h3>
                      <Badge variant="outline" className="text-xs">{msg.subject}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{msg.message}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{msg.email}</span>
                      {msg.phone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{msg.phone}</span>}
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(msg.createdAt).toLocaleDateString('en-LS')}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button variant="ghost" size="sm" onClick={() => { setViewMessage(msg); if (!msg.isRead) handleMessageToggle(msg.id, true); }}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleMessageToggle(msg.id, !msg.isRead)}>
                      {msg.isRead ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700" onClick={() => handleMessageDelete(msg.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
        {messages.length === 0 && (
          <Card className="p-12 text-center">
            <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">No Messages Yet</h3>
            <p className="text-muted-foreground">Messages from the contact form will appear here.</p>
          </Card>
        )}
      </div>
    </motion.div>
  );

  // ─── Render Tab Content ───────────────────────────────────────────────────

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview': return renderOverview();
      case 'students': return renderStudents();
      case 'applications': return renderApplications();
      case 'payments': return renderPayments();
      case 'courses': return renderCourses();
      case 'messages': return renderMessages();
      default: return renderOverview();
    }
  };

  if (!admin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-lta-green" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b bg-white sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="LTA" className="h-8 w-8 object-contain" />
            <span className="font-bold text-sm">Admin Panel</span>
          </div>
        </div>
        <Badge className="bg-lta-blue text-white">Admin</Badge>
      </div>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-72 bg-white border-r z-50 transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-5 border-b">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="LTA" className="h-10 w-10 object-contain" />
              <div>
                <h1 className="font-bold text-sm">Lesotho Tech Academy</h1>
                <p className="text-xs text-muted-foreground">Admin Panel</p>
              </div>
            </div>
          </div>

          {/* Admin Info */}
          <div className="p-4 border-b">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-lta-blue/10 text-lta-blue font-bold">
                  {admin.name?.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="font-medium text-sm truncate">{admin.name}</p>
                <p className="text-xs text-muted-foreground truncate">{admin.email}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === item.id
                    ? 'bg-lta-green/10 text-lta-green'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    activeTab === item.id ? 'bg-lta-green text-white' : 'bg-muted text-muted-foreground'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-3 border-t space-y-2">
            <Link href="/" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-all">
              <ExternalLink className="h-5 w-5" />
              <span>View Website</span>
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-all"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-72 p-4 md:p-6 lg:p-8">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <Card key={i}><CardContent className="p-4"><Skeleton className="h-20 w-full" /></CardContent></Card>
                ))}
              </div>
              <Card><CardContent className="p-4"><Skeleton className="h-60 w-full" /></CardContent></Card>
            </motion.div>
          ) : (
            renderTabContent()
          )}
        </AnimatePresence>
      </main>

      {/* View Application Dialog */}
      <Dialog open={!!viewApplication} onOpenChange={() => setViewApplication(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
            <DialogDescription>Review and manage this application</DialogDescription>
          </DialogHeader>
          {viewApplication && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Student</Label>
                  <p className="font-medium">{viewApplication.student?.firstName} {viewApplication.student?.lastName}</p>
                  <p className="text-sm text-muted-foreground">{viewApplication.student?.email}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Course</Label>
                  <p className="font-medium">{viewApplication.course?.title}</p>
                  <p className="text-sm text-muted-foreground">{viewApplication.course?.currency}{viewApplication.course?.price} · {viewApplication.course?.duration}</p>
                </div>
              </div>
              <Separator />
              <div>
                <Label className="text-muted-foreground">Status</Label>
                <Badge className={`ml-2 ${statusColors[viewApplication.status] || ''}`}>{viewApplication.status}</Badge>
              </div>
              <div>
                <Label className="text-muted-foreground">Applied On</Label>
                <p className="text-sm">{new Date(viewApplication.createdAt).toLocaleDateString('en-LS', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
              </div>
              {viewApplication.educationLevel && (
                <div>
                  <Label className="text-muted-foreground">Education Level</Label>
                  <p className="text-sm">{viewApplication.educationLevel}</p>
                </div>
              )}
              {viewApplication.experience && (
                <div>
                  <Label className="text-muted-foreground">Experience</Label>
                  <p className="text-sm">{viewApplication.experience}</p>
                </div>
              )}
              {viewApplication.motivationalLetter && (
                <div>
                  <Label className="text-muted-foreground">Motivational Letter</Label>
                  <p className="text-sm bg-muted/50 p-3 rounded-lg mt-1 italic">&quot;{viewApplication.motivationalLetter}&quot;</p>
                </div>
              )}
              {viewApplication.payments && viewApplication.payments.length > 0 && (
                <div>
                  <Label className="text-muted-foreground">Payments ({viewApplication.payments.length})</Label>
                  <div className="mt-2 space-y-2">
                    {viewApplication.payments.map((p) => (
                      <div key={p.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div>
                          <span className="font-medium">M{p.amount}</span>
                          <span className="text-sm text-muted-foreground ml-2">{paymentMethodLabels[p.paymentMethod]}</span>
                        </div>
                        <Badge className={`text-xs ${statusColors[p.status] || ''}`}>{p.status}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <DialogFooter className="gap-2">
                {viewApplication.status === 'pending' && (
                  <>
                    <Button
                      variant="destructive"
                      onClick={() => handleApplicationStatus(viewApplication.id, 'rejected')}
                      disabled={actionLoading === viewApplication.id}
                    >
                      {actionLoading === viewApplication.id ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <XCircle className="h-4 w-4 mr-2" />}
                      Reject
                    </Button>
                    <Button
                      className="bg-lta-green hover:bg-lta-green-dark text-white"
                      onClick={() => handleApplicationStatus(viewApplication.id, 'enrolled')}
                      disabled={actionLoading === viewApplication.id}
                    >
                      {actionLoading === viewApplication.id ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CheckCircle className="h-4 w-4 mr-2" />}
                      Approve & Enroll
                    </Button>
                  </>
                )}
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* View Payment Dialog */}
      <Dialog open={!!viewPayment} onOpenChange={() => setViewPayment(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Payment Details</DialogTitle>
            <DialogDescription>Review payment information</DialogDescription>
          </DialogHeader>
          {viewPayment && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Student</Label>
                  <p className="font-medium">{viewPayment.application?.student?.firstName} {viewPayment.application?.student?.lastName}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Amount</Label>
                  <p className="font-bold text-xl gradient-text">M{viewPayment.amount}</p>
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Method</Label>
                  <p className="text-sm">{paymentMethodLabels[viewPayment.paymentMethod] || viewPayment.paymentMethod}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <Badge className={`ml-2 ${statusColors[viewPayment.status] || ''}`}>{viewPayment.status}</Badge>
                </div>
              </div>
              {viewPayment.transactionRef && (
                <div>
                  <Label className="text-muted-foreground">Transaction Reference</Label>
                  <p className="text-sm font-mono bg-muted/50 p-2 rounded">{viewPayment.transactionRef}</p>
                </div>
              )}
              <div>
                <Label className="text-muted-foreground">Date</Label>
                <p className="text-sm">{new Date(viewPayment.createdAt).toLocaleDateString('en-LS', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
              </div>
              {viewPayment.screenshotUrl && (
                <div>
                  <Label className="text-muted-foreground">Payment Receipt</Label>
                  <div className="mt-2">
                    <a href={viewPayment.screenshotUrl} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-muted rounded-lg hover:bg-muted/80 text-sm font-medium">
                      <ImageIcon className="h-4 w-4" /> View Receipt Image <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              )}
              {viewPayment.adminNote && (
                <div>
                  <Label className="text-muted-foreground">Admin Note</Label>
                  <p className="text-sm bg-muted/50 p-3 rounded-lg mt-1 italic">{viewPayment.adminNote}</p>
                </div>
              )}
              <DialogFooter className="gap-2">
                {viewPayment.status === 'pending' && (
                  <>
                    <Button
                      variant="destructive"
                      onClick={() => handlePaymentStatus(viewPayment.id, 'rejected')}
                      disabled={actionLoading === viewPayment.id}
                    >
                      {actionLoading === viewPayment.id ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <XCircle className="h-4 w-4 mr-2" />}
                      Reject
                    </Button>
                    <Button
                      className="bg-lta-green hover:bg-lta-green-dark text-white"
                      onClick={() => handlePaymentStatus(viewPayment.id, 'approved')}
                      disabled={actionLoading === viewPayment.id}
                    >
                      {actionLoading === viewPayment.id ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CheckCircle className="h-4 w-4 mr-2" />}
                      Approve
                    </Button>
                  </>
                )}
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* View Student Dialog */}
      <Dialog open={!!viewStudent} onOpenChange={() => setViewStudent(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Student Profile</DialogTitle>
            <DialogDescription>Detailed student information</DialogDescription>
          </DialogHeader>
          {viewStudent && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={viewStudent.profileImage} />
                  <AvatarFallback className="bg-lta-green/10 text-lta-green text-xl font-bold">
                    {viewStudent.firstName?.[0]}{viewStudent.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-bold">{viewStudent.firstName} {viewStudent.lastName}</h3>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={viewStudent.isActive ? 'border-green-200 text-green-700' : 'border-red-200 text-red-700'}>
                      {viewStudent.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                    {viewStudent.isVerified && (
                      <Badge className="bg-lta-green/10 text-lta-green border-lta-green/20">
                        <UserCheck className="h-3 w-3 mr-1" /> Verified
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Email</Label>
                  <p className="text-sm flex items-center gap-1"><Mail className="h-3 w-3" />{viewStudent.email}</p>
                </div>
                {viewStudent.phone && (
                  <div>
                    <Label className="text-muted-foreground">Phone</Label>
                    <p className="text-sm flex items-center gap-1"><Phone className="h-3 w-3" />{viewStudent.phone}</p>
                  </div>
                )}
                <div>
                  <Label className="text-muted-foreground">Location</Label>
                  <p className="text-sm flex items-center gap-1"><MapPin className="h-3 w-3" />{viewStudent.city}, {viewStudent.country}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Joined</Label>
                  <p className="text-sm">{new Date(viewStudent.createdAt).toLocaleDateString('en-LS', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
              </div>
              <Separator />
              <div>
                <Label className="text-muted-foreground">Enrollments ({viewStudent.enrollments?.length || 0})</Label>
                <div className="mt-2 space-y-2">
                  {(viewStudent.enrollments || []).map((e) => (
                    <div key={e.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <span className="text-sm font-medium">{e.course?.title || 'Unknown Course'}</span>
                      <Badge className={`text-xs ${statusColors[e.status] || ''}`}>{e.status}</Badge>
                    </div>
                  ))}
                  {(viewStudent.enrollments || []).length === 0 && (
                    <p className="text-sm text-muted-foreground">No enrollments yet</p>
                  )}
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Applications ({viewStudent.applications?.length || 0})</Label>
                <div className="mt-2 space-y-2">
                  {(viewStudent.applications || []).map((a) => (
                    <div key={a.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <span className="text-sm font-medium">{a.course?.title || 'Unknown Course'}</span>
                      <Badge className={`text-xs ${statusColors[a.status] || ''}`}>{a.status}</Badge>
                    </div>
                  ))}
                  {(viewStudent.applications || []).length === 0 && (
                    <p className="text-sm text-muted-foreground">No applications yet</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* View Message Dialog */}
      <Dialog open={!!viewMessage} onOpenChange={() => setViewMessage(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Message Details</DialogTitle>
            <DialogDescription>Contact form message</DialogDescription>
          </DialogHeader>
          {viewMessage && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">From</Label>
                  <p className="font-medium">{viewMessage.name}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Subject</Label>
                  <p className="font-medium">{viewMessage.subject}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Email</Label>
                  <p className="text-sm flex items-center gap-1"><Mail className="h-3 w-3" />{viewMessage.email}</p>
                </div>
                {viewMessage.phone && (
                  <div>
                    <Label className="text-muted-foreground">Phone</Label>
                    <p className="text-sm flex items-center gap-1"><Phone className="h-3 w-3" />{viewMessage.phone}</p>
                  </div>
                )}
              </div>
              <Separator />
              <div>
                <Label className="text-muted-foreground">Message</Label>
                <p className="text-sm bg-muted/50 p-4 rounded-lg mt-1 whitespace-pre-wrap">{viewMessage.message}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Received</Label>
                <p className="text-sm">{new Date(viewMessage.createdAt).toLocaleDateString('en-LS', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
              </div>
              <DialogFooter className="gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleMessageToggle(viewMessage.id, !viewMessage.isRead)}
                >
                  {viewMessage.isRead ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                  {viewMessage.isRead ? 'Mark Unread' : 'Mark Read'}
                </Button>
                <Button variant="destructive" onClick={() => handleMessageDelete(viewMessage.id)}>
                  <Trash2 className="h-4 w-4 mr-2" /> Delete
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
