'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  FileText,
  CreditCard,
  BookOpen,
  LogOut,
  Home,
  Menu,
  X,
  Search,
  Check,
  XCircle,
  Eye,
  ChevronDown,
  ChevronUp,
  Loader2,
  Image as ImageIcon,
  DollarSign,
  GraduationCap,
  UserCheck,
  TrendingUp,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useAppStore, type Student, type Application, type Payment, type Course } from '@/lib/store';
import Image from 'next/image';
import { toast } from 'sonner';

interface AdminStudent extends Student {
  _count?: { applications: number; enrollments: number };
}

function AnimatedCounter({ value, duration = 2 }: { value: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, y: 10 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
    >
      <motion.span
        initial={0}
        animate={isInView ? value : 0}
        transition={{ duration, ease: 'easeOut' }}
        className="text-3xl lg:text-4xl font-bold"
      >
        {isInView ? value : 0}
      </motion.span>
    </motion.span>
  );
}

export default function AdminDashboard() {
  const {
    adminSubView,
    setAdminSubView,
    setView,
    logout,
    currentAdmin,
    courses,
    setCourses,
  } = useAppStore();

  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Data
  const [students, setStudents] = useState<AdminStudent[]>([]);
  const [applications, setApplicationsLocal] = useState<Application[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [adminCourses, setAdminCourses] = useState<Course[]>([]);

  // Search
  const [studentSearch, setStudentSearch] = useState('');
  const [appSearch, setAppSearch] = useState('');

  // Dialogs
  const [screenshotDialog, setScreenshotDialog] = useState<string | null>(null);
  const [rejectPaymentDialog, setRejectPaymentDialog] = useState<string | null>(null);
  const [rejectNote, setRejectNote] = useState('');

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [studentsRes, appsRes, paymentsRes, coursesRes] = await Promise.all([
        fetch('/api/admin/students'),
        fetch('/api/admin/applications'),
        fetch('/api/admin/payments'),
        fetch('/api/courses'),
      ]);

      if (studentsRes.ok) {
        const data = await studentsRes.json();
        setStudents(data.students || []);
      }
      if (appsRes.ok) {
        const data = await appsRes.json();
        setApplicationsLocal(data.applications || []);
      }
      if (paymentsRes.ok) {
        const data = await paymentsRes.json();
        setPayments(data.payments || []);
      }
      if (coursesRes.ok) {
        const data = await coursesRes.json();
        const fetched = data.courses || [];
        setAdminCourses(fetched);
        if (fetched.length > 0) setCourses(fetched);
      }
    } catch {
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleToggleStudentStatus = async (studentId: string, isActive: boolean) => {
    try {
      const res = await fetch('/api/admin/students', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, isActive: !isActive }),
      });
      if (res.ok) {
        setStudents(students.map((s) => s.id === studentId ? { ...s, isActive: !isActive } : s));
        toast.success(`Student ${isActive ? 'deactivated' : 'activated'} successfully`);
      }
    } catch {
      toast.error('Failed to update student status');
    }
  };

  const handleApplicationAction = async (applicationId: string, status: string) => {
    try {
      const res = await fetch('/api/admin/applications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId, status }),
      });
      if (res.ok) {
        setApplicationsLocal(applications.map((a) =>
          a.id === applicationId ? { ...a, status } : a
        ));
        toast.success(`Application ${status} successfully`);
        fetchAllData();
      }
    } catch {
      toast.error('Failed to update application');
    }
  };

  const handlePaymentAction = async (paymentId: string, status: string, adminNote?: string) => {
    try {
      const res = await fetch('/api/admin/payments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId, status, adminNote }),
      });
      if (res.ok) {
        setPayments(payments.map((p) =>
          p.id === paymentId ? { ...p, status, adminNote } : p
        ));
        toast.success(`Payment ${status} successfully`);
        setRejectPaymentDialog(null);
        setRejectNote('');
        fetchAllData();
      }
    } catch {
      toast.error('Failed to update payment');
    }
  };

  const handleToggleCoursePublished = async (courseId: string, isPublished: boolean) => {
    try {
      const res = await fetch('/api/admin/courses', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId, isPublished: !isPublished }),
      });
      if (res.ok) {
        setAdminCourses(adminCourses.map((c) => c.id === courseId ? { ...c, isPublished: !isPublished } : c));
        toast.success(`Course ${!isPublished ? 'published' : 'unpublished'} successfully`);
      }
    } catch {
      toast.error('Failed to update course');
    }
  };

  const filteredStudents = students.filter(
    (s) =>
      s.firstName.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.lastName.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.email.toLowerCase().includes(studentSearch.toLowerCase())
  );

  const filteredApps = applications.filter(
    (a) =>
      (a.student?.firstName || '').toLowerCase().includes(appSearch.toLowerCase()) ||
      (a.student?.lastName || '').toLowerCase().includes(appSearch.toLowerCase()) ||
      (a.course?.title || '').toLowerCase().includes(appSearch.toLowerCase())
  );

  const totalRevenue = payments.filter((p) => p.status === 'approved').reduce((sum, p) => sum + p.amount, 0);
  const pendingPayments = payments.filter((p) => p.status === 'pending').length;
  const pendingApps = applications.filter((a) => a.status === 'pending').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'approved': case 'enrolled': return 'bg-green-100 text-green-700 border-green-200';
      case 'rejected': case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const navItems = [
    { id: 'overview' as const, label: 'Overview', icon: LayoutDashboard },
    { id: 'students' as const, label: 'Students', icon: Users },
    { id: 'applications' as const, label: 'Applications', icon: FileText },
    { id: 'payments' as const, label: 'Payments', icon: CreditCard },
    { id: 'courses' as const, label: 'Courses', icon: BookOpen },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Top header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-lta-green/10 shadow-sm">
        <div className="flex items-center justify-between px-4 lg:px-6 h-16">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-lta-green/5"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <div className="flex items-center gap-2">
              <Image src="/logo.png" alt="LTA" width={32} height={32} className="rounded-full" />
              <span className="font-bold text-sm hidden sm:block">Admin Portal</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => setView('landing')} className="gap-2 text-muted-foreground hover:text-lta-green">
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Home</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={logout} className="gap-2 text-red-500 hover:text-red-600 hover:bg-red-50">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar - desktop */}
        <aside className="hidden lg:block w-64 min-h-[calc(100vh-64px)] bg-white border-r border-lta-green/10 p-4">
          <nav className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setAdminSubView(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  adminSubView === item.id
                    ? 'bg-lta-green/10 text-lta-green shadow-sm'
                    : 'text-muted-foreground hover:bg-lta-green/5 hover:text-lta-green'
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
                {item.id === 'applications' && pendingApps > 0 && (
                  <Badge className="ml-auto bg-yellow-100 text-yellow-700 text-[10px] px-1.5">
                    {pendingApps}
                  </Badge>
                )}
                {item.id === 'payments' && pendingPayments > 0 && (
                  <Badge className="ml-auto bg-yellow-100 text-yellow-700 text-[10px] px-1.5">
                    {pendingPayments}
                  </Badge>
                )}
              </button>
            ))}
          </nav>
          <div className="mt-8 p-4 rounded-xl bg-gradient-to-br from-lta-blue/5 to-lta-green/5 border border-lta-blue/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-lta-blue to-lta-green flex items-center justify-center text-white font-bold text-sm">
                AD
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-sm truncate">{currentAdmin?.name}</div>
                <div className="text-xs text-muted-foreground truncate">Administrator</div>
              </div>
            </div>
          </div>
        </aside>

        {/* Sidebar - mobile */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
              <motion.aside
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                className="fixed top-16 left-0 bottom-0 w-64 bg-white z-50 lg:hidden p-4 shadow-xl"
              >
                <nav className="space-y-1">
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => { setAdminSubView(item.id); setSidebarOpen(false); }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        adminSubView === item.id
                          ? 'bg-lta-green/10 text-lta-green'
                          : 'text-muted-foreground hover:bg-lta-green/5'
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.label}
                    </button>
                  ))}
                </nav>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main content */}
        <main className="flex-1 p-4 lg:p-8 max-w-6xl mx-auto w-full">
          <AnimatePresence mode="wait">
            {/* Overview */}
            {adminSubView === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {loading ? (
                  <div className="space-y-6">
                    <Skeleton className="h-8 w-64" />
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className="h-36 rounded-xl" />
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="mb-8">
                      <h1 className="text-2xl lg:text-3xl font-bold">
                        Admin <span className="gradient-text">Dashboard</span>
                      </h1>
                      <p className="text-muted-foreground mt-2">
                        Manage students, applications, payments, and courses.
                      </p>
                    </div>

                    {/* Stats grid */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                      {[
                        {
                          label: 'Total Students',
                          value: students.length,
                          icon: GraduationCap,
                          color: 'lta-green',
                          bgColor: 'bg-lta-green/10',
                          textColor: 'text-lta-green',
                        },
                        {
                          label: 'Total Applications',
                          value: applications.length,
                          icon: FileText,
                          color: 'lta-blue',
                          bgColor: 'bg-lta-blue/10',
                          textColor: 'text-lta-blue',
                          sub: `${pendingApps} pending`,
                        },
                        {
                          label: 'Total Revenue',
                          value: totalRevenue,
                          icon: TrendingUp,
                          color: 'emerald-500',
                          bgColor: 'bg-emerald-500/10',
                          textColor: 'text-emerald-500',
                          prefix: 'M',
                        },
                        {
                          label: 'Active Courses',
                          value: adminCourses.filter((c) => c.isPublished).length,
                          icon: BookOpen,
                          color: 'purple-500',
                          bgColor: 'bg-purple-500/10',
                          textColor: 'text-purple-500',
                        },
                      ].map((stat, i) => (
                        <motion.div
                          key={stat.label}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 }}
                        >
                          <Card className="hover:shadow-md transition-shadow overflow-hidden">
                            <div className="h-1 bg-gradient-to-r from-lta-green to-lta-blue" style={{ opacity: 0.3 + i * 0.15 }} />
                            <CardContent className="p-5">
                              <div className="flex items-center justify-between mb-3">
                                <div className={`w-11 h-11 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                                  <stat.icon className={`h-5 w-5 ${stat.textColor}`} />
                                </div>
                                {stat.sub && (
                                  <Badge variant="outline" className="text-[10px] bg-yellow-50 text-yellow-600 border-yellow-200">
                                    {stat.sub}
                                  </Badge>
                                )}
                              </div>
                              <div className={`text-3xl font-bold ${stat.textColor}`}>
                                {stat.prefix}{stat.value}
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>

                    {/* Recent activity */}
                    <div className="grid lg:grid-cols-2 gap-6">
                      {/* Recent applications */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <FileText className="h-5 w-5 text-lta-blue" />
                            Recent Applications
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {applications.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-4">No applications yet</p>
                          ) : (
                            <div className="space-y-3 max-h-96 overflow-y-auto">
                              {applications.slice(0, 5).map((app) => (
                                <div key={app.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border">
                                  <div className="min-w-0">
                                    <div className="font-medium text-sm truncate">
                                      {app.student?.firstName} {app.student?.lastName}
                                    </div>
                                    <div className="text-xs text-muted-foreground truncate">
                                      {app.course?.title}
                                    </div>
                                  </div>
                                  <Badge variant="outline" className={`shrink-0 ml-2 ${getStatusColor(app.status)}`}>
                                    {app.status}
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      {/* Recent payments */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <CreditCard className="h-5 w-5 text-lta-green" />
                            Recent Payments
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {payments.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-4">No payments yet</p>
                          ) : (
                            <div className="space-y-3 max-h-96 overflow-y-auto">
                              {payments.slice(0, 5).map((pay) => (
                                <div key={pay.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border">
                                  <div className="min-w-0">
                                    <div className="font-medium text-sm">{pay.paymentMethod.toUpperCase()}</div>
                                    <div className="text-xs text-muted-foreground">
                                      M{pay.amount} • {new Date(pay.createdAt).toLocaleDateString()}
                                    </div>
                                  </div>
                                  <Badge variant="outline" className={`shrink-0 ml-2 ${getStatusColor(pay.status)}`}>
                                    {pay.status}
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </>
                )}
              </motion.div>
            )}

            {/* Students */}
            {adminSubView === 'students' && (
              <motion.div
                key="students"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                  <h1 className="text-2xl font-bold">Students ({students.length})</h1>
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search students..."
                      value={studentSearch}
                      onChange={(e) => setStudentSearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {loading ? (
                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Skeleton key={i} className="h-16 rounded-xl" />
                    ))}
                  </div>
                ) : filteredStudents.length === 0 ? (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <Users className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                      <h3 className="font-semibold mb-2">No students found</h3>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {filteredStudents.map((student) => (
                      <Card key={student.id} className="hover:shadow-sm transition-shadow">
                        <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-lta-green to-lta-blue flex items-center justify-center text-white font-bold text-sm shrink-0">
                              {student.firstName[0]}{student.lastName[0]}
                            </div>
                            <div>
                              <div className="font-medium text-sm">
                                {student.firstName} {student.lastName}
                              </div>
                              <div className="text-xs text-muted-foreground">{student.email}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className={student.isActive ? getStatusColor('enrolled') : getStatusColor('rejected')}>
                              {student.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                            <Switch
                              checked={student.isActive}
                              onCheckedChange={() => handleToggleStudentStatus(student.id, student.isActive)}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Applications */}
            {adminSubView === 'applications' && (
              <motion.div
                key="applications"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                  <h1 className="text-2xl font-bold">Applications ({applications.length})</h1>
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search applications..."
                      value={appSearch}
                      onChange={(e) => setAppSearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {loading ? (
                  <div className="space-y-3">
                    {[1, 2, 3, 4].map((i) => (
                      <Skeleton key={i} className="h-24 rounded-xl" />
                    ))}
                  </div>
                ) : filteredApps.length === 0 ? (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <FileText className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                      <h3 className="font-semibold mb-2">No applications found</h3>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {filteredApps.map((app) => (
                      <Card key={app.id} className="hover:shadow-sm transition-shadow">
                        <CardContent className="p-5">
                          <div className="flex flex-col gap-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-lta-green/10 flex items-center justify-center shrink-0">
                                  <UserCheck className="h-5 w-5 text-lta-green" />
                                </div>
                                <div>
                                  <div className="font-medium">
                                    {app.student?.firstName} {app.student?.lastName}
                                  </div>
                                  <div className="text-xs text-muted-foreground">{app.student?.email}</div>
                                </div>
                              </div>
                              <Badge variant="outline" className={getStatusColor(app.status)} w-fit>
                                {app.status}
                              </Badge>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-3 text-sm">
                              <div>
                                <span className="text-muted-foreground">Course: </span>
                                <span className="font-medium">{app.course?.title}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Education: </span>
                                <span className="font-medium">{app.educationLevel || 'N/A'}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Applied: </span>
                                <span className="font-medium">{new Date(app.createdAt).toLocaleDateString()}</span>
                              </div>
                              {app.motivationalLetter && (
                                <div className="sm:col-span-2">
                                  <span className="text-muted-foreground">Motivation: </span>
                                  <span className="font-medium">{app.motivationalLetter}</span>
                                </div>
                              )}
                            </div>
                            {app.status === 'pending' && (
                              <div className="flex gap-2 pt-2 border-t">
                                <Button
                                  size="sm"
                                  className="gap-1 bg-lta-green hover:bg-lta-green-dark text-white"
                                  onClick={() => handleApplicationAction(app.id, 'approved')}
                                >
                                  <Check className="h-4 w-4" />
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  className="gap-1"
                                  onClick={() => handleApplicationAction(app.id, 'rejected')}
                                >
                                  <XCircle className="h-4 w-4" />
                                  Reject
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="gap-1 border-lta-blue/30 text-lta-blue"
                                  onClick={() => handleApplicationAction(app.id, 'enrolled')}
                                >
                                  <GraduationCap className="h-4 w-4" />
                                  Enroll
                                </Button>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Payments */}
            {adminSubView === 'payments' && (
              <motion.div
                key="payments"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <h1 className="text-2xl font-bold mb-6">Payments ({payments.length})</h1>

                {loading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-24 rounded-xl" />
                    ))}
                  </div>
                ) : payments.length === 0 ? (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <CreditCard className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                      <h3 className="font-semibold mb-2">No payments yet</h3>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {payments.map((pay) => (
                      <Card key={pay.id} className="hover:shadow-sm transition-shadow">
                        <CardContent className="p-5">
                          <div className="flex flex-col gap-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-lta-green/10 flex items-center justify-center shrink-0">
                                  <DollarSign className="h-5 w-5 text-lta-green" />
                                </div>
                                <div>
                                  <div className="font-medium">M{pay.amount} — {pay.paymentMethod.toUpperCase()}</div>
                                  <div className="text-xs text-muted-foreground">
                                    Ref: {pay.transactionRef || 'N/A'} • {new Date(pay.createdAt).toLocaleDateString()}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className={getStatusColor(pay.status)}>
                                  {pay.status}
                                </Badge>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              {pay.screenshotUrl && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="gap-1 border-lta-blue/30 text-lta-blue"
                                  onClick={() => setScreenshotDialog(pay.screenshotUrl || null)}
                                >
                                  <ImageIcon className="h-4 w-4" />
                                  View Screenshot
                                </Button>
                              )}
                              {pay.status === 'pending' && (
                                <>
                                  <Button
                                    size="sm"
                                    className="gap-1 bg-lta-green hover:bg-lta-green-dark text-white"
                                    onClick={() => handlePaymentAction(pay.id, 'approved')}
                                  >
                                    <Check className="h-4 w-4" />
                                    Approve
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    className="gap-1"
                                    onClick={() => setRejectPaymentDialog(pay.id)}
                                  >
                                    <XCircle className="h-4 w-4" />
                                    Reject
                                  </Button>
                                </>
                              )}
                              {pay.adminNote && (
                                <span className="text-xs text-muted-foreground italic ml-2">
                                  Note: {pay.adminNote}
                                </span>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Courses */}
            {adminSubView === 'courses' && (
              <motion.div
                key="courses"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <h1 className="text-2xl font-bold mb-6">Manage Courses</h1>

                {loading ? (
                  <div className="space-y-3">
                    {[1, 2, 3, 4].map((i) => (
                      <Skeleton key={i} className="h-20 rounded-xl" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {adminCourses.map((course) => (
                      <Card key={course.id} className="hover:shadow-sm transition-shadow">
                        <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div>
                            <h3 className="font-semibold text-lg">{course.title}</h3>
                            <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                              <span>{course.duration}</span>
                              <span>•</span>
                              <span>M{course.price}</span>
                              <span>•</span>
                              <span>{course.category}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className={course.isPublished ? getStatusColor('enrolled') : getStatusColor('rejected')}>
                              {course.isPublished ? 'Published' : 'Unpublished'}
                            </Badge>
                            <Switch
                              checked={course.isPublished}
                              onCheckedChange={() => handleToggleCoursePublished(course.id, course.isPublished)}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Screenshot viewer dialog */}
      <Dialog open={!!screenshotDialog} onOpenChange={() => setScreenshotDialog(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Payment Screenshot</DialogTitle>
            <DialogDescription>Verification screenshot uploaded by the student</DialogDescription>
          </DialogHeader>
          {screenshotDialog && (
            <div className="flex justify-center">
              <img
                src={screenshotDialog}
                alt="Payment screenshot"
                className="max-h-[60vh] rounded-lg object-contain border"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reject payment dialog */}
      <Dialog open={!!rejectPaymentDialog} onOpenChange={() => setRejectPaymentDialog(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Reject Payment</DialogTitle>
            <DialogDescription>Provide a reason for rejecting this payment.</DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Reason for rejection..."
            value={rejectNote}
            onChange={(e) => setRejectNote(e.target.value)}
            rows={3}
          />
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => setRejectPaymentDialog(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              onClick={() => rejectPaymentDialog && handlePaymentAction(rejectPaymentDialog, 'rejected', rejectNote)}
            >
              Reject Payment
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
