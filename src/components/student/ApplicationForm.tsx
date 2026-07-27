'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2, Send } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAppStore } from '@/lib/store';
import { toast } from 'sonner';

export default function ApplicationForm() {
  const { selectedCourseSlug, selectedCourseId, courses, setStudentSubView, currentStudent, setApplications } = useAppStore();
  const course = courses.find((c) => c.id === selectedCourseId || c.slug === selectedCourseSlug);

  const [form, setForm] = useState({
    motivationalLetter: '',
    educationLevel: '',
    experience: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!course || !currentStudent) {
      toast.error('Unable to submit application. Please try again.');
      return;
    }

    if (!form.educationLevel) {
      toast.error('Please select your education level');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: currentStudent.id,
          courseId: course.id,
          motivationalLetter: form.motivationalLetter || undefined,
          educationLevel: form.educationLevel,
          experience: form.experience || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Application failed');
      }

      toast.success('Application submitted successfully! We will review it shortly.');

      // Refresh applications
      const appsRes = await fetch(`/api/applications?studentId=${currentStudent.id}`);
      if (appsRes.ok) {
        const appsData = await appsRes.json();
        if (appsData.applications) setApplications(appsData.applications);
      }

      setStudentSubView('my-applications');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Application failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-lta-green/10 shadow-sm">
        <div className="flex items-center gap-4 px-4 lg:px-6 h-16 max-w-3xl mx-auto">
          <button
            onClick={() => setStudentSubView('browse-courses')}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-lta-green transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Courses
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 lg:px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="border-lta-green/10">
            <div className="h-1.5 bg-gradient-to-r from-lta-green to-lta-blue rounded-t-xl" />
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Apply for Course</CardTitle>
              <CardDescription>
                {course?.title}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 lg:p-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="p-4 rounded-xl bg-lta-green/5 border border-lta-green/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">{course?.title}</div>
                      <div className="text-sm text-muted-foreground">{course?.duration} • M{course?.price}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground">Registration Fee</div>
                      <div className="font-bold text-lta-green">M300</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="educationLevel">Education Level *</Label>
                  <Select value={form.educationLevel} onValueChange={(v) => setForm((p) => ({ ...p, educationLevel: v }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your education level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high-school">High School</SelectItem>
                      <SelectItem value="certificate">Certificate</SelectItem>
                      <SelectItem value="diploma">Diploma</SelectItem>
                      <SelectItem value="degree">Bachelor&apos;s Degree</SelectItem>
                      <SelectItem value="postgraduate">Postgraduate</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience">Previous Experience (Optional)</Label>
                  <Input
                    id="experience"
                    placeholder="Any relevant experience in this field"
                    value={form.experience}
                    onChange={(e) => setForm((p) => ({ ...p, experience: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="motivationalLetter">Motivational Letter (Optional)</Label>
                  <Textarea
                    id="motivationalLetter"
                    placeholder="Tell us why you want to join this course and how it will help you achieve your goals..."
                    value={form.motivationalLetter}
                    onChange={(e) => setForm((p) => ({ ...p, motivationalLetter: e.target.value }))}
                    rows={5}
                  />
                </div>

                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-sm">
                  <strong>Payment Note:</strong> After your application is approved, you will need to upload 
                  proof of payment (M300 registration fee) via M-Pesa, EcoCash, or Bank Transfer.
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setStudentSubView('browse-courses')}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-lta-green hover:bg-lta-green-dark text-white btn-glow-green gap-2"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Submit Application
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
