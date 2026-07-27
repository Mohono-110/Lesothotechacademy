'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, BookOpen, FileText, CreditCard, User, LogOut,
  Home, Loader2, Upload, Smartphone, Building2, ArrowRight, CheckCircle,
  Clock, AlertCircle, XCircle, Eye,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

interface StudentUser { id: string; email: string; firstName: string; lastName: string; phone?: string; city: string; country: string; isActive: boolean; isVerified: boolean; createdAt: string; }
interface App { id: string; courseId: string; status: string; createdAt: string; course?: { id: string; title: string; slug: string; duration: string; price: number; }; payments?: { id: string; status: string; amount: number; paymentMethod: string; screenshotUrl?: string; createdAt: string; }[]; }

export default function DashboardPage() {
  const router = useRouter();
  const [student, setStudent] = useState<StudentUser | null>(null);
  const [applications, setApplications] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Payment form
  const [selectedAppId, setSelectedAppId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [transactionRef, setTransactionRef] = useState('');
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);

  useEffect(() => {
    try {
      const userStr = localStorage.getItem('lta_user');
      const role = localStorage.getItem('lta_role');
      if (!userStr || role !== 'student') { router.push('/login'); return; }
      const user = JSON.parse(userStr);
      setStudent(user);
      fetchApplications(user.id);
    } catch { router.push('/login'); }
    finally { setLoading(false); }
  }, []);

  const fetchApplications = async (studentId: string) => {
    try {
      const res = await fetch(`/api/applications?studentId=${studentId}`);
      if (res.ok) { const data = await res.json(); setApplications(data.applications || []); }
    } catch { /* silent */ }
  };

  const handleLogout = () => {
    localStorage.removeItem('lta_user');
    localStorage.removeItem('lta_role');
    router.push('/');
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppId || !paymentMethod || !transactionRef || !screenshot) {
      toast.error('Please fill all payment fields and upload screenshot'); return;
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
      setSelectedAppId(''); setPaymentMethod(''); setTransactionRef(''); setScreenshot(null); setScreenshotPreview(null);
      if (student) fetchApplications(student.id);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Payment submission failed');
    } finally { setPaymentLoading(false); }
  };

  const statusColors: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-800 border-amber-200',
    approved: 'bg-blue-100 text-blue-800 border-blue-200',
    rejected: 'bg-red-100 text-red-800 border-red-200',
    enrolled: 'bg-green-100 text-green-800 border-green-200',
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-lta-green" /></div>;

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Dashboard Header */}
      <header className="sticky top-16 lg:top-20 z-40 bg-white/95 backdrop-blur-md border-b border-lta-green/10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-lta-green to-lta-blue flex items-center justify-center text-white font-bold text-sm">
              {(student?.firstName?.[0] || '')}{(student?.lastName?.[0] || '')}
            </div>
            <div>
              <p className="font-semibold text-sm">{student?.firstName} {student?.lastName}</p>
              <p className="text-xs text-muted-foreground">Student Portal</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/courses"><Button variant="ghost" size="sm" className="gap-1"><BookOpen className="h-4 w-4" /><span className="hidden sm:inline">Courses</span></Button></Link>
            <Button variant="outline" size="sm" onClick={handleLogout} className="gap-1 border-lta-green/30 text-lta-green hover:bg-lta-green/5">
              <LogOut className="h-4 w-4" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 h-auto">
            {[
              { value: 'overview', label: 'Overview', icon: LayoutDashboard },
              { value: 'applications', label: 'Applications', icon: FileText },
              { value: 'courses', label: 'My Courses', icon: BookOpen },
              { value: 'payment', label: 'Payment', icon: CreditCard },
              { value: 'profile', label: 'Profile', icon: User },
            ].map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value} className="gap-1.5 py-2.5 text-xs sm:text-sm">
                <tab.icon className="h-4 w-4 hidden sm:block" />
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="rounded-2xl bg-gradient-to-r from-lta-green to-lta-blue p-6 lg:p-8 text-white">
                <h2 className="text-2xl font-bold mb-2">Welcome back, {student?.firstName}! 👋</h2>
                <p className="text-white/80 mb-4">Track your applications, upload payments, and manage your learning journey.</p>
                <div className="flex flex-wrap gap-3">
                  <Link href="/admissions"><Button size="sm" className="bg-white text-lta-green hover:bg-white/90 gap-1"><BookOpen className="h-4 w-4" /> Apply for Course</Button></Link>
                  <Link href="/courses"><Button size="sm" variant="outline" className="border-white/30 text-white hover:bg-white/10 gap-1">Browse Courses</Button></Link>
                </div>
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { label: 'Applications', value: applications.length, icon: FileText, color: 'text-lta-green bg-lta-green/10' },
                  { label: 'Enrolled', value: applications.filter((a) => a.status === 'enrolled').length, icon: CheckCircle, color: 'text-lta-blue bg-lta-blue/10' },
                  { label: 'Pending', value: applications.filter((a) => a.status === 'pending').length, icon: Clock, color: 'text-amber-600 bg-amber-50' },
                ].map((stat) => (
                  <Card key={stat.label}>
                    <CardContent className="p-5 flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                        <stat.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{stat.value}</p>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          </TabsContent>

          {/* Applications */}
          <TabsContent value="applications">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <Card>
                <CardHeader><CardTitle>My Applications</CardTitle><CardDescription>Track your course applications and their status</CardDescription></CardHeader>
                <CardContent>
                  {applications.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto mb-4 opacity-30" />
                      <p className="mb-4">You haven&apos;t applied for any courses yet.</p>
                      <Link href="/admissions"><Button className="bg-lta-green hover:bg-lta-green-dark text-white gap-1"><BookOpen className="h-4 w-4" /> Apply Now</Button></Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {applications.map((app) => (
                        <Card key={app.id} className="border-lta-green/10">
                          <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-sm">{app.course?.title || 'Course'}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                Applied: {new Date(app.createdAt).toLocaleDateString('en-LS', { year: 'numeric', month: 'short', day: 'numeric' })}
                                {app.payments && app.payments.length > 0 && ` • Payment: ${app.payments[0].status}`}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className={statusColors[app.status] || ''}>{app.status.charAt(0).toUpperCase() + app.status.slice(1)}</Badge>
                              {app.status === 'pending' && !app.payments?.length && (
                                <Link href="#payment"><Button size="sm" className="bg-lta-green hover:bg-lta-green-dark text-white text-xs gap-1" onClick={() => setSelectedAppId(app.id)}><CreditCard className="h-3 w-3" /> Pay M300</Button></Link>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* My Courses */}
          <TabsContent value="courses">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Card>
                <CardHeader><CardTitle>My Enrolled Courses</CardTitle><CardDescription>Courses you are currently enrolled in</CardDescription></CardHeader>
                <CardContent>
                  {applications.filter((a) => a.status === 'enrolled').length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-30" />
                      <p className="mb-4">No enrolled courses yet. Apply and complete payment to get started!</p>
                      <Link href="/admissions"><Button className="bg-lta-green hover:bg-lta-green-dark text-white gap-1"><ArrowRight className="h-4 w-4" /> Apply for a Course</Button></Link>
                    </div>
                  ) : (
                    <div className="grid sm:grid-cols-2 gap-4">
                      {applications.filter((a) => a.status === 'enrolled').map((app) => (
                        <Card key={app.id} className="border-lta-green/20 overflow-hidden">
                          <div className="h-1.5 bg-gradient-to-r from-lta-green to-lta-blue" />
                          <CardContent className="p-5">
                            <h3 className="font-semibold mb-1">{app.course?.title}</h3>
                            <p className="text-sm text-muted-foreground mb-3">{app.course?.duration}</p>
                            <div className="space-y-2">
                              <div className="flex justify-between text-xs text-muted-foreground"><span>Progress</span><span>0%</span></div>
                              <div className="h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-lta-green rounded-full" style={{ width: '0%' }} /></div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Payment */}
          <TabsContent value="payment">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <Card>
                <CardHeader><CardTitle>Upload Payment Proof</CardTitle><CardDescription>Upload a screenshot of your M300 registration fee payment</CardDescription></CardHeader>
                <CardContent>
                  {applications.filter((a) => a.status === 'pending' && !a.payments?.length).length === 0 && applications.filter((a) => a.status === 'pending' && a.payments?.some((p) => p.status === 'pending')).length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-30" />
                      <p>No pending payments. Apply for a course first!</p>
                      <Link href="/admissions" className="inline-block mt-4"><Button className="bg-lta-green hover:bg-lta-green-dark text-white gap-1"><ArrowRight className="h-4 w-4" /> Apply Now</Button></Link>
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
                            { id: 'mpesa', label: 'M-Pesa', icon: Smartphone, color: 'border-green-200 bg-green-50 text-green-600' },
                            { id: 'ecocash', label: 'EcoCash', icon: Smartphone, color: 'border-blue-200 bg-blue-50 text-blue-600' },
                            { id: 'bank', label: 'Bank Transfer', icon: Building2, color: 'border-purple-200 bg-purple-50 text-purple-600' },
                          ].map((m) => (
                            <button key={m.id} type="button" onClick={() => setPaymentMethod(m.id)}
                              className={`p-4 rounded-xl border-2 text-left transition-all ${paymentMethod === m.id ? m.color : 'border-gray-200 hover:border-gray-300'}`}>
                              <m.icon className={`h-5 w-5 mb-1 ${paymentMethod === m.id ? '' : 'text-gray-400'}`} />
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
                        <input type="file" ref={fileInputRef} onChange={(e) => { const f = e.target.files?.[0]; if (f) { if (f.size > 5 * 1024 * 1024) { toast.error('File must be under 5MB'); return; } setScreenshot(f); const r = new FileReader(); r.onloadend = () => setScreenshotPreview(r.result as string); r.readAsDataURL(f); } }} accept="image/*" className="hidden" />
                        <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-lta-green/50 hover:bg-lta-green/5 transition-all flex flex-col items-center gap-3">
                          {screenshotPreview ? (
                            <div className="relative"><img src={screenshotPreview} alt="Preview" className="max-h-40 mx-auto rounded-lg object-contain" /><div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center"><span className="text-white text-sm">Click to change</span></div></div>
                          ) : (<><Upload className="h-6 w-6 text-lta-green" /><span className="text-sm">Click to upload screenshot (PNG, JPG, max 5MB)</span></>)}
                        </button>
                      </div>

                      <Button type="submit" className="w-full bg-lta-green hover:bg-lta-green-dark text-white btn-glow-green" disabled={paymentLoading}>
                        {paymentLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Submitting...</> : 'Submit Payment Proof'}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Profile */}
          <TabsContent value="profile">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Card>
                <CardHeader><CardTitle>My Profile</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { label: 'Full Name', value: `${student?.firstName} ${student?.lastName}` },
                      { label: 'Email', value: student?.email },
                      { label: 'Phone', value: student?.phone || 'Not provided' },
                      { label: 'City', value: student?.city || 'Leribe' },
                      { label: 'Country', value: student?.country || 'Lesotho' },
                      { label: 'Member Since', value: student?.createdAt ? new Date(student.createdAt).toLocaleDateString('en-LS', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A' },
                      { label: 'Account Status', value: student?.isActive ? 'Active' : 'Inactive' },
                      { label: 'Verified', value: student?.isVerified ? 'Yes' : 'Pending' },
                    ].map((item) => (
                      <div key={item.label} className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-gray-100 last:border-0">
                        <span className="text-sm text-muted-foreground">{item.label}</span>
                        <span className="font-medium text-sm">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
