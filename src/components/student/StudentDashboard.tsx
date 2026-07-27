'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  BookOpen,
  Search,
  FileText,
  CreditCard,
  UserCircle,
  LogOut,
  Menu,
  X,
  Home,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { useAppStore, type Application, type Course, type Enrollment } from '@/lib/store';
import Image from 'next/image';
import CourseDetail from './CourseDetail';
import ApplicationForm from './ApplicationForm';
import PaymentForm from './PaymentForm';

export default function StudentDashboard() {
  const {
    currentStudent,
    studentSubView,
    setStudentSubView,
    setView,
    logout,
    courses,
    setCourses,
    applications,
    setApplications,
    enrollments,
    setEnrollments,
    selectCourse,
  } = useAppStore();

  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [applicationToPay, setApplicationToPay] = useState<Application | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!currentStudent) return;
      setLoading(true);
      try {
        // Fetch courses
        const coursesRes = await fetch('/api/courses');
        if (coursesRes.ok) {
          const coursesData = await coursesRes.json();
          if (coursesData.courses) setCourses(coursesData.courses);
        }

        // Fetch applications
        const appsRes = await fetch(`/api/applications?studentId=${currentStudent.id}`);
        if (appsRes.ok) {
          const appsData = await appsRes.json();
          if (appsData.applications) setApplications(appsData.applications);
        }
      } catch {
        // silent fail
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentStudent, setCourses, setApplications]);

  const handleApply = (course: Course) => {
    selectCourse(course.slug, course.id);
    setStudentSubView('browse-courses');
    // Set a flag to show application form
    setApplicationToPay(null);
  };

  const handlePayForApplication = (app: Application) => {
    setApplicationToPay(app);
  };

  const handleBackFromPayment = () => {
    setApplicationToPay(null);
  };

  // Sub-views
  if (studentSubView === 'course-detail') {
    return <CourseDetail />;
  }

  if (studentSubView === 'apply-course' || applicationToPay) {
    return applicationToPay ? (
      <PaymentForm application={applicationToPay} onBack={handleBackFromPayment} />
    ) : (
      <ApplicationForm />
    );
  }

  const enrolledCount = applications.filter((a) => a.status === 'enrolled').length;
  const pendingCount = applications.filter((a) => a.status === 'pending').length;
  const approvedCount = applications.filter((a) => a.status === 'approved').length;

  const navItems = [
    { id: 'overview' as const, label: 'Overview', icon: LayoutDashboard },
    { id: 'my-courses' as const, label: 'My Courses', icon: BookOpen },
    { id: 'browse-courses' as const, label: 'Browse Courses', icon: Search },
    { id: 'my-applications' as const, label: 'My Applications', icon: FileText },
    { id: 'payment' as const, label: 'Payments', icon: CreditCard },
    { id: 'profile' as const, label: 'Profile', icon: UserCircle },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'approved': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'enrolled': return 'bg-green-100 text-green-700 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

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
              <span className="font-bold text-sm hidden sm:block">Student Portal</span>
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
                onClick={() => setStudentSubView(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  studentSubView === item.id
                    ? 'bg-lta-green/10 text-lta-green shadow-sm'
                    : 'text-muted-foreground hover:bg-lta-green/5 hover:text-lta-green'
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
                {item.id === 'my-applications' && pendingCount > 0 && (
                  <Badge className="ml-auto bg-yellow-100 text-yellow-700 text-[10px] px-1.5">
                    {pendingCount}
                  </Badge>
                )}
              </button>
            ))}
          </nav>

          {/* User card */}
          <div className="mt-8 p-4 rounded-xl bg-gradient-to-br from-lta-green/5 to-lta-blue/5 border border-lta-green/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-lta-green to-lta-blue flex items-center justify-center text-white font-bold text-sm">
                {currentStudent?.firstName?.[0]}{currentStudent?.lastName?.[0]}
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-sm truncate">{currentStudent?.firstName} {currentStudent?.lastName}</div>
                <div className="text-xs text-muted-foreground truncate">{currentStudent?.email}</div>
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
                      onClick={() => {
                        setStudentSubView(item.id);
                        setSidebarOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        studentSubView === item.id
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
            {studentSubView === 'overview' && (
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
                    <div className="grid sm:grid-cols-3 gap-4">
                      {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-32 rounded-xl" />
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="mb-8">
                      <h1 className="text-2xl lg:text-3xl font-bold">
                        Welcome back, <span className="gradient-text">{currentStudent?.firstName}</span>! 👋
                      </h1>
                      <p className="text-muted-foreground mt-2">
                        Here&apos;s an overview of your learning journey at Lesotho Tech Academy.
                      </p>
                    </div>

                    {/* Stats cards */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                      {[
                        { label: 'Enrolled Courses', value: enrolledCount, iconBg: 'bg-lta-green/10', iconColor: 'text-lta-green', icon: BookOpen },
                        { label: 'Pending Applications', value: pendingCount, iconBg: 'bg-yellow-500/10', iconColor: 'text-yellow-500', icon: FileText },
                        { label: 'Approved Applications', value: approvedCount, iconBg: 'bg-lta-blue/10', iconColor: 'text-lta-blue', icon: LayoutDashboard },
                        { label: 'Available Courses', value: courses.length, iconBg: 'bg-purple-500/10', iconColor: 'text-purple-500', icon: Search },
                      ].map((stat, i) => (
                        <motion.div
                          key={stat.label}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 }}
                        >
                          <Card className="hover:shadow-md transition-shadow">
                            <CardContent className="p-4 flex items-center gap-4">
                              <div className={`w-12 h-12 rounded-xl ${stat.iconBg} flex items-center justify-center shrink-0`}>
                                <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
                              </div>
                              <div>
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <div className="text-xs text-muted-foreground">{stat.label}</div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>

                    {/* Quick actions */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Quick Actions</CardTitle>
                      </CardHeader>
                      <CardContent className="flex flex-wrap gap-3">
                        <Button onClick={() => setStudentSubView('browse-courses')} className="bg-lta-green hover:bg-lta-green-dark text-white gap-2">
                          <Search className="h-4 w-4" />
                          Browse Courses
                        </Button>
                        <Button variant="outline" onClick={() => setStudentSubView('my-applications')} className="gap-2 border-lta-green/30 text-lta-green">
                          <FileText className="h-4 w-4" />
                          My Applications
                        </Button>
                        <Button variant="outline" onClick={() => setStudentSubView('profile')} className="gap-2">
                          <UserCircle className="h-4 w-4" />
                          Edit Profile
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Recent applications */}
                    {applications.length > 0 && (
                      <Card className="mt-6">
                        <CardHeader>
                          <CardTitle className="text-lg">Recent Applications</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {applications.slice(0, 3).map((app) => (
                              <div key={app.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border">
                                <div>
                                  <div className="font-medium text-sm">{app.course?.title || 'Course'}</div>
                                  <div className="text-xs text-muted-foreground">
                                    Applied: {new Date(app.createdAt).toLocaleDateString()}
                                  </div>
                                </div>
                                <Badge variant="outline" className={getStatusColor(app.status)}>
                                  {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </>
                )}
              </motion.div>
            )}

            {studentSubView === 'my-courses' && (
              <motion.div
                key="my-courses"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <h1 className="text-2xl font-bold mb-6">My Courses</h1>
                {enrolledCount === 0 ? (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <BookOpen className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                      <h3 className="font-semibold text-lg mb-2">No enrolled courses yet</h3>
                      <p className="text-muted-foreground mb-4">Browse our courses and apply to get started!</p>
                      <Button onClick={() => setStudentSubView('browse-courses')} className="bg-lta-green hover:bg-lta-green-dark text-white gap-2">
                        <Search className="h-4 w-4" />
                        Browse Courses
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {applications
                      .filter((a) => a.status === 'enrolled')
                      .map((app) => (
                        <Card key={app.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-6">
                            <h3 className="font-semibold text-lg mb-2">{app.course?.title}</h3>
                            <p className="text-sm text-muted-foreground mb-4">{app.course?.description?.slice(0, 100)}...</p>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Duration</span>
                                <span className="font-medium">{app.course?.duration}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Progress</span>
                                <span className="font-medium">0%</span>
                              </div>
                              <Progress value={0} className="h-2" />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                )}
              </motion.div>
            )}

            {studentSubView === 'browse-courses' && (
              <motion.div
                key="browse-courses"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <h1 className="text-2xl font-bold mb-6">Browse Courses</h1>
                <div className="grid sm:grid-cols-2 gap-4">
                  {courses.map((course) => {
                    const hasApplied = applications.some((a) => a.courseId === course.id);
                    const isEnrolled = applications.some(
                      (a) => a.courseId === course.id && (a.status === 'enrolled' || a.status === 'approved')
                    );

                    return (
                      <Card key={course.id} className="hover:shadow-md transition-shadow">
                        <div className="h-1.5 bg-gradient-to-r from-lta-green to-lta-blue rounded-t-xl" />
                        <CardContent className="p-6">
                          <h3 className="font-semibold text-lg mb-2">{course.title}</h3>
                          <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                            {course.description}
                          </p>
                          <div className="flex items-center gap-4 text-sm mb-4">
                            <span className="text-muted-foreground">{course.duration}</span>
                            <span className="text-lta-green font-semibold">M{course.price}</span>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 gap-2 border-lta-blue/30 text-lta-blue hover:bg-lta-blue/5"
                              onClick={() => {
                                selectCourse(course.slug, course.id);
                                setStudentSubView('course-detail');
                              }}
                            >
                              View Details
                            </Button>
                            {isEnrolled || hasApplied ? (
                              <Button size="sm" className="flex-1" disabled>
                                {isEnrolled ? 'Enrolled' : 'Applied'}
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                className="flex-1 bg-lta-green hover:bg-lta-green-dark text-white gap-2"
                                onClick={() => handleApply(course)}
                              >
                                Apply Now
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {studentSubView === 'my-applications' && (
              <motion.div
                key="my-applications"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <h1 className="text-2xl font-bold mb-6">My Applications</h1>
                {applications.length === 0 ? (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <FileText className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                      <h3 className="font-semibold text-lg mb-2">No applications yet</h3>
                      <p className="text-muted-foreground mb-4">Apply for a course to get started!</p>
                      <Button onClick={() => setStudentSubView('browse-courses')} className="bg-lta-green hover:bg-lta-green-dark text-white gap-2">
                        <Search className="h-4 w-4" />
                        Browse Courses
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {applications.map((app) => (
                      <Card key={app.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                              <h3 className="font-semibold text-lg">{app.course?.title || 'Course'}</h3>
                              <p className="text-sm text-muted-foreground">
                                Applied: {new Date(app.createdAt).toLocaleDateString()}
                                {app.updatedAt !== app.createdAt && (
                                  <> • Updated: {new Date(app.updatedAt).toLocaleDateString()}</>
                                )}
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              <Badge variant="outline" className={getStatusColor(app.status)}>
                                {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                              </Badge>
                              {app.status === 'approved' && (
                                <Button
                                  size="sm"
                                  className="bg-lta-green hover:bg-lta-green-dark text-white gap-2"
                                  onClick={() => handlePayForApplication(app)}
                                >
                                  <CreditCard className="h-4 w-4" />
                                  Pay Now
                                </Button>
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

            {studentSubView === 'payment' && (
              <motion.div
                key="payment"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <h1 className="text-2xl font-bold mb-6">Payments</h1>
                <Card>
                  <CardContent className="py-12 text-center">
                    <CreditCard className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                    <h3 className="font-semibold text-lg mb-2">Payment Management</h3>
                    <p className="text-muted-foreground mb-4">
                      Payment uploads are managed through your application. Visit &quot;My Applications&quot; to make payments.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => setStudentSubView('my-applications')}
                      className="gap-2 border-lta-green/30 text-lta-green"
                    >
                      <FileText className="h-4 w-4" />
                      View Applications
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {studentSubView === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <h1 className="text-2xl font-bold mb-6">My Profile</h1>
                <Card className="max-w-2xl">
                  <CardContent className="p-6 lg:p-8">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-lta-green to-lta-blue flex items-center justify-center text-white text-xl font-bold">
                        {currentStudent?.firstName?.[0]}{currentStudent?.lastName?.[0]}
                      </div>
                      <div>
                        <h2 className="text-xl font-bold">
                          {currentStudent?.firstName} {currentStudent?.lastName}
                        </h2>
                        <p className="text-sm text-muted-foreground">{currentStudent?.email}</p>
                        <Badge variant="outline" className="mt-1 bg-lta-green/10 text-lta-green border-lta-green/20">
                          {currentStudent?.isVerified ? 'Verified' : 'Student'}
                        </Badge>
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {[
                        { label: 'Phone', value: currentStudent?.phone || 'Not provided' },
                        { label: 'Date of Birth', value: currentStudent?.dateOfBirth || 'Not provided' },
                        { label: 'Gender', value: currentStudent?.gender || 'Not provided' },
                        { label: 'City', value: currentStudent?.city || 'Leribe' },
                        { label: 'Country', value: currentStudent?.country || 'Lesotho' },
                        { label: 'Member Since', value: currentStudent?.createdAt ? new Date(currentStudent.createdAt).toLocaleDateString() : 'N/A' },
                      ].map((item) => (
                        <div key={item.label} className="p-3 rounded-lg bg-gray-50 border">
                          <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{item.label}</div>
                          <div className="font-medium text-sm">{item.value}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
