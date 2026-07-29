'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Clock, DollarSign, Target, BookOpen, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/lib/store';
import { toast } from 'sonner';

export default function CourseDetail() {
  const { selectedCourseSlug, selectedCourseId, courses, goBack, setStudentSubView, applications } = useAppStore();
  const course = courses.find((c) => c.id === selectedCourseId || c.slug === selectedCourseSlug);
  const hasApplied = applications.some((a) => a.courseId === course?.id);
  const isEnrolled = applications.some((a) => a.courseId === course?.id && (a.status === 'enrolled' || a.status === 'approved'));

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Course not found</h2>
          <Button onClick={goBack} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const handleApply = () => {
    if (hasApplied || isEnrolled) {
      toast.info('You have already applied for this course');
      return;
    }
    setStudentSubView('apply-course');
  };

  const handleBack = () => {
    setStudentSubView('browse-courses');
  };

  let objectives: string[] = [];
  let modules: string[] = [];
  try {
    objectives = JSON.parse(course.objectives || '[]');
  } catch { objectives = []; }
  try {
    modules = JSON.parse(course.modules || '[]');
  } catch { modules = []; }

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-lta-green/10 shadow-sm">
        <div className="flex items-center gap-4 px-4 lg:px-6 h-16 max-w-5xl mx-auto">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-lta-green transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 lg:px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Course header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <Badge variant="outline" className="bg-lta-green/10 text-lta-green border-lta-green/20">
                {course.category}
              </Badge>
              <Badge variant="secondary">{course.level}</Badge>
              <Badge variant="outline" className="bg-lta-blue/10 text-lta-blue border-lta-blue/20">
                {course.duration}
              </Badge>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold mb-3">{course.title}</h1>
            <p className="text-lg text-muted-foreground max-w-3xl">{course.description}</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Course content */}
              {course.content && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <BookOpen className="h-5 w-5 text-lta-green" />
                      Course Content
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-wrap">
                      {course.content}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Learning objectives */}
              {objectives.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Target className="h-5 w-5 text-lta-blue" />
                      Learning Objectives
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {objectives.map((obj, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-lta-green shrink-0 mt-0.5" />
                          <span className="text-sm text-muted-foreground">{obj}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Modules */}
              {modules.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <BookOpen className="h-5 w-5 text-lta-green" />
                      Course Modules
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {modules.map((mod, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border">
                          <div className="w-8 h-8 rounded-lg bg-lta-green/10 flex items-center justify-center text-lta-green font-bold text-sm">
                            {i + 1}
                          </div>
                          <span className="text-sm font-medium">{mod}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Default content if no data */}
              {!course.content && objectives.length === 0 && modules.length === 0 && (
                <Card>
                  <CardContent className="py-12 text-center">
                    <BookOpen className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Detailed content coming soon</h3>
                    <p className="text-sm text-muted-foreground">
                      Apply now to reserve your spot. Full course details will be available upon enrollment.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Price card */}
              <Card className="border-lta-green/20 bg-gradient-to-br from-lta-green/5 to-lta-blue/5">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold gradient-text mb-1">
                    M{course.price}
                  </div>
                  <div className="text-sm text-muted-foreground mb-4">Course Fee</div>
                  <div className="flex items-center justify-center gap-4 text-sm mb-6">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {course.duration}
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <DollarSign className="h-4 w-4" />
                      {course.currency}
                    </div>
                  </div>
                  {(isEnrolled || hasApplied) ? (
                    <Button className="w-full" disabled>
                      {isEnrolled ? '✓ Enrolled' : 'Application Sent'}
                    </Button>
                  ) : (
                    <Button
                      className="w-full bg-lta-green hover:bg-lta-green-dark text-white btn-glow-green"
                      onClick={handleApply}
                    >
                      Apply for This Course
                    </Button>
                  )}
                  <p className="text-xs text-muted-foreground mt-3">
                    Registration fee: M300 (non-refundable)
                  </p>
                </CardContent>
              </Card>

              {/* Quick info */}
              <Card>
                <CardContent className="p-4 space-y-3">
                  {[
                    { label: 'Category', value: course.category },
                    { label: 'Level', value: course.level },
                    { label: 'Duration', value: course.duration },
                    { label: 'Format', value: 'In-person & Online' },
                    { label: 'Location', value: 'Leribe 300, Lesotho' },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{item.label}</span>
                      <span className="font-medium">{item.value}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
