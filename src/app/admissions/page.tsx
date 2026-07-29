'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  GraduationCap,
  ClipboardList,
  CreditCard,
  UserPlus,
  ArrowRight,
  Loader2,
  CheckCircle2,
  Upload,
  X,
  Image as ImageIcon,
  ShieldCheck,
  Smartphone,
  Building2,
  Info,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';

const courses = [
  {
    id: 'web-dev',
    title: 'Web Development Programming',
    duration: '3 Months',
    price: 'M2,600',
  },
  {
    id: 'networks',
    title: 'Computer Networks',
    duration: '6 Months',
    price: 'M3,500',
  },
  {
    id: 'cms',
    title: 'CMS Development & Customization',
    duration: '6 Months',
    price: 'M4,000',
  },
  {
    id: 'business',
    title: 'Business Development Systems',
    duration: '3 Months',
    price: 'M2,000',
  },
];

const paymentMethods = [
  { id: 'mpesa', label: 'M-Pesa', icon: Smartphone, color: 'border-green-500/50 bg-green-50/50 dark:bg-green-950/20' },
  { id: 'ecocash', label: 'EcoCash', icon: Smartphone, color: 'border-blue-500/50 bg-blue-50/50 dark:bg-blue-950/20' },
  { id: 'bank', label: 'Bank Transfer', icon: Building2, color: 'border-purple-500/50 bg-purple-50/50 dark:bg-purple-950/20' },
];

const steps = [
  {
    number: 1,
    title: 'Register',
    description: 'Create your student account',
    icon: UserPlus,
    link: '/register',
    linkLabel: 'Go to Registration',
  },
  {
    number: 2,
    title: 'Choose & Apply',
    description: 'Select a course and submit this form',
    icon: ClipboardList,
  },
  {
    number: 3,
    title: 'Pay M300 Fee',
    description: 'Complete registration via M-Pesa, EcoCash, or Bank',
    icon: CreditCard,
  },
];

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  course: string;
  educationLevel: string;
  priorExperience: string;
  motivationLetter: string;
  paymentMethod: string;
  transactionRef: string;
}

interface FormErrors {
  [key: string]: string | undefined;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
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

export default function AdmissionsPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    course: '',
    educationLevel: '',
    priorExperience: '',
    motivationLetter: '',
    paymentMethod: '',
    transactionRef: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.course) newErrors.course = 'Please select a course';
    if (!formData.motivationLetter.trim()) {
      newErrors.motivationLetter = 'Please tell us why you want to join';
    } else if (formData.motivationLetter.trim().length < 20) {
      newErrors.motivationLetter = 'Please write at least 20 characters';
    }
    if (!formData.paymentMethod) newErrors.paymentMethod = 'Please select a payment method';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Invalid File', {
          description: 'Please upload an image file (PNG, JPG, JPEG)',
        });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File Too Large', {
          description: 'Please upload an image smaller than 5MB',
        });
        return;
      }
      setScreenshot(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeScreenshot = () => {
    setScreenshot(null);
    setScreenshotPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Validation Error', {
        description: 'Please fill in all required fields correctly.',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Submit application
      const appRes = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          dateOfBirth: formData.dateOfBirth,
          gender: formData.gender,
          courseTitle: courses.find((c) => c.id === formData.course)?.title || formData.course,
          educationLevel: formData.educationLevel,
          experience: formData.priorExperience,
          motivationalLetter: formData.motivationLetter,
        }),
      });

      const appData = await appRes.json();

      if (!appRes.ok) {
        toast.error('Application Error', {
          description: appData.error || 'Failed to submit application.',
        });
        setIsSubmitting(false);
        return;
      }

      // Upload payment screenshot if present
      if (screenshot && formData.paymentMethod) {
        const paymentFormData = new FormData();
        paymentFormData.append('amount', '300');
        paymentFormData.append('paymentMethod', formData.paymentMethod);
        paymentFormData.append('transactionRef', formData.transactionRef);
        paymentFormData.append('screenshot', screenshot);
        if (appData.application?.id) {
          paymentFormData.append('applicationId', appData.application.id);
        }

        try {
          const payRes = await fetch('/api/payments', {
            method: 'POST',
            body: paymentFormData,
          });
          const payData = await payRes.json();
          if (payRes.ok) {
            toast.success('Payment Submitted', {
              description: payData.message,
            });
          } else {
            toast.warning('Payment Upload Issue', {
              description: payData.error || 'Application submitted but payment upload failed. Please contact support.',
            });
          }
        } catch {
          toast.warning('Payment Upload Issue', {
            description: 'Application submitted but payment upload failed. Please try uploading later.',
          });
        }
      }

      toast.success('Application Submitted!', {
        description:
          'Your application has been received. Our team will review it and contact you via email within 48 hours.',
        icon: <CheckCircle2 className="h-5 w-5 text-lta-green" />,
        duration: 6000,
      });
    } catch {
      toast.error('Network Error', {
        description: 'Please check your connection and try again.',
      });
    } finally {
      setIsSubmitting(false);
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
                  <BreadcrumbPage>Admissions</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-lta-green/10 rounded-xl">
                <GraduationCap className="h-8 w-8 text-lta-green" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
                  <span className="gradient-text">Admissions</span>
                </h1>
                <p className="text-muted-foreground mt-1 text-sm sm:text-base max-w-2xl">
                  Join Lesotho Tech Academy and take the first step towards a career in technology.
                  Complete the form below to apply.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How to Apply */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
            How to <span className="gradient-text">Apply</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
              >
                <Card
                  className={`relative glass-card text-center transition-all hover:shadow-lg ${
                    step.link ? 'hover:border-lta-green/40 cursor-pointer' : 'hover:border-lta-blue/40'
                  }`}
                >
                  {step.link ? (
                    <Link href={step.link} className="absolute inset-0 z-10" aria-label={step.linkLabel} />
                  ) : null}
                  <CardContent className="p-6">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-lta-green/10 text-lta-green mb-4 relative z-0">
                      <step.icon className="h-7 w-7" />
                    </div>
                    <div className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-lta-blue text-white text-xs font-bold mb-3 relative z-0">
                      {step.number}
                    </div>
                    <h3 className="font-bold text-lg text-foreground relative z-0">{step.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1 relative z-0">{step.description}</p>
                    {step.link && (
                      <span className="inline-flex items-center gap-1 text-sm font-medium text-lta-green mt-3 relative z-0">
                        {step.linkLabel}
                        <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      <Separator className="max-w-7xl mx-auto" />

      {/* Enrollment Form + Fee Info */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Form */}
          <div className="lg:col-span-2">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
            >
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Section 1: Personal Information */}
                <motion.div variants={itemVariants}>
                  <Card className="glass-card shadow-md">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <UserPlus className="h-5 w-5 text-lta-green" />
                        Personal Information
                      </CardTitle>
                      <CardDescription>Provide your basic personal details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {/* First Name */}
                        <div className="space-y-2">
                          <Label htmlFor="firstName">
                            First Name <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="firstName"
                            name="firstName"
                            placeholder="Enter first name"
                            value={formData.firstName}
                            onChange={handleChange}
                            className={errors.firstName ? 'border-red-400' : ''}
                          />
                          {errors.firstName && <p className="text-xs text-red-500">{errors.firstName}</p>}
                        </div>

                        {/* Last Name */}
                        <div className="space-y-2">
                          <Label htmlFor="lastName">
                            Last Name <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="lastName"
                            name="lastName"
                            placeholder="Enter last name"
                            value={formData.lastName}
                            onChange={handleChange}
                            className={errors.lastName ? 'border-red-400' : ''}
                          />
                          {errors.lastName && <p className="text-xs text-red-500">{errors.lastName}</p>}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {/* Email */}
                        <div className="space-y-2">
                          <Label htmlFor="email">
                            Email Address <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            className={errors.email ? 'border-red-400' : ''}
                          />
                          {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                        </div>

                        {/* Phone */}
                        <div className="space-y-2">
                          <Label htmlFor="phone">
                            Phone Number <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="phone"
                            name="phone"
                            placeholder="+266 XX XXX XXX"
                            value={formData.phone}
                            onChange={handleChange}
                            className={errors.phone ? 'border-red-400' : ''}
                          />
                          {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {/* Date of Birth */}
                        <div className="space-y-2">
                          <Label htmlFor="dateOfBirth">Date of Birth</Label>
                          <Input
                            id="dateOfBirth"
                            name="dateOfBirth"
                            type="date"
                            value={formData.dateOfBirth}
                            onChange={handleChange}
                          />
                        </div>

                        {/* Gender */}
                        <div className="space-y-2">
                          <Label>Gender</Label>
                          <Select
                            value={formData.gender}
                            onValueChange={(val) => handleSelectChange('gender', val)}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Section 2: Course Selection */}
                <motion.div variants={itemVariants}>
                  <Card className="glass-card shadow-md">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <ClipboardList className="h-5 w-5 text-lta-blue" />
                        Course Selection
                      </CardTitle>
                      <CardDescription>Choose the programme you wish to enroll in</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <Label>
                          Select Course <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          value={formData.course}
                          onValueChange={(val) => handleSelectChange('course', val)}
                        >
                          <SelectTrigger className={`w-full ${errors.course ? 'border-red-400' : ''}`}>
                            <SelectValue placeholder="Choose a course..." />
                          </SelectTrigger>
                          <SelectContent>
                            {courses.map((course) => (
                              <SelectItem key={course.id} value={course.id}>
                                <span className="flex items-center gap-2">
                                  <span className="font-medium">{course.title}</span>
                                  <Badge variant="outline" className="text-xs ml-1">
                                    {course.duration}
                                  </Badge>
                                  <Badge className="bg-lta-green/10 text-lta-green hover:bg-lta-green/20 text-xs">
                                    {course.price}
                                  </Badge>
                                </span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.course && <p className="text-xs text-red-500">{errors.course}</p>}

                        {/* Selected course info */}
                        {formData.course && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mt-3 p-3 bg-lta-green/5 rounded-lg border border-lta-green/10"
                          >
                            <div className="flex items-center gap-2 text-sm">
                              <GraduationCap className="h-4 w-4 text-lta-green" />
                              <span className="font-medium text-foreground">
                                {courses.find((c) => c.id === formData.course)?.title}
                              </span>
                              <span className="text-muted-foreground">
                                — {courses.find((c) => c.id === formData.course)?.duration}
                              </span>
                              <Badge className="bg-lta-blue text-white text-xs ml-auto">
                                {courses.find((c) => c.id === formData.course)?.price}
                              </Badge>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Section 3: Additional Information */}
                <motion.div variants={itemVariants}>
                  <Card className="glass-card shadow-md">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Info className="h-5 w-5 text-lta-green" />
                        Additional Information
                      </CardTitle>
                      <CardDescription>Help us understand your background and goals</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-5">
                      {/* Education Level */}
                      <div className="space-y-2">
                        <Label>Highest Education Level</Label>
                        <Select
                          value={formData.educationLevel}
                          onValueChange={(val) => handleSelectChange('educationLevel', val)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select your education level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="primary">Primary</SelectItem>
                            <SelectItem value="secondary">Secondary</SelectItem>
                            <SelectItem value="diploma">Diploma</SelectItem>
                            <SelectItem value="degree">Degree</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Prior Experience */}
                      <div className="space-y-2">
                        <Label htmlFor="priorExperience">Prior Experience</Label>
                        <Textarea
                          id="priorExperience"
                          name="priorExperience"
                          placeholder="Describe any relevant prior experience in IT, technology, or related fields..."
                          rows={3}
                          value={formData.priorExperience}
                          onChange={handleChange}
                          className="min-h-[80px]"
                        />
                      </div>

                      {/* Motivation Letter */}
                      <div className="space-y-2">
                        <Label htmlFor="motivationLetter">
                          Why do you want to join Lesotho Tech Academy?{' '}
                          <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                          id="motivationLetter"
                          name="motivationLetter"
                          placeholder="Tell us about your goals and motivation for joining our programme..."
                          rows={4}
                          value={formData.motivationLetter}
                          onChange={handleChange}
                          className={`min-h-[100px] ${errors.motivationLetter ? 'border-red-400' : ''}`}
                        />
                        {errors.motivationLetter && (
                          <p className="text-xs text-red-500">{errors.motivationLetter}</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Section 4: Payment Information */}
                <motion.div variants={itemVariants}>
                  <Card className="glass-card shadow-md">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <CreditCard className="h-5 w-5 text-lta-blue" />
                        Payment Information
                      </CardTitle>
                      <CardDescription>
                        Pay the M300 one-time registration fee to complete your application
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-5">
                      {/* Payment Method */}
                      <div className="space-y-3">
                        <Label>
                          Payment Method <span className="text-red-500">*</span>
                        </Label>
                        <RadioGroup
                          value={formData.paymentMethod}
                          onValueChange={(val) => handleSelectChange('paymentMethod', val)}
                          className="grid grid-cols-1 sm:grid-cols-3 gap-3"
                        >
                          {paymentMethods.map((method) => (
                            <label
                              key={method.id}
                              htmlFor={`method-${method.id}`}
                              className={`relative flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all hover:shadow-sm ${
                                formData.paymentMethod === method.id
                                  ? `${method.color} shadow-sm`
                                  : 'border-border hover:border-lta-green/30'
                              }`}
                            >
                              <RadioGroupItem
                                value={method.id}
                                id={`method-${method.id}`}
                                className="sr-only"
                              />
                              <div
                                className={`p-2 rounded-lg ${
                                  formData.paymentMethod === method.id
                                    ? 'bg-lta-green text-white'
                                    : 'bg-muted text-muted-foreground'
                                } transition-colors`}
                              >
                                <method.icon className="h-4 w-4" />
                              </div>
                              <span className="font-medium text-sm">{method.label}</span>
                            </label>
                          ))}
                        </RadioGroup>
                        {errors.paymentMethod && (
                          <p className="text-xs text-red-500">{errors.paymentMethod}</p>
                        )}
                      </div>

                      {/* Transaction Reference */}
                      <div className="space-y-2">
                        <Label htmlFor="transactionRef">Transaction Reference Number</Label>
                        <Input
                          id="transactionRef"
                          name="transactionRef"
                          placeholder="Enter your transaction/reference number"
                          value={formData.transactionRef}
                          onChange={handleChange}
                        />
                      </div>

                      {/* Screenshot Upload */}
                      <div className="space-y-3">
                        <Label>Payment Screenshot Upload</Label>
                        <p className="text-xs text-muted-foreground">
                          Upload a screenshot of your M300 registration fee payment (image only, max 5MB)
                        </p>

                        {screenshotPreview ? (
                          <div className="relative inline-block">
                            <div className="relative rounded-lg overflow-hidden border border-border">
                              <img
                                src={screenshotPreview}
                                alt="Payment screenshot preview"
                                className="max-h-48 max-w-full object-contain"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={removeScreenshot}
                              className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-md"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ) : (
                          <label
                            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-lta-green/50 hover:bg-lta-green/5 transition-all"
                          >
                            <div className="flex flex-col items-center gap-2 text-muted-foreground">
                              <ImageIcon className="h-8 w-8" />
                              <p className="text-sm font-medium">
                                Click to upload screenshot
                              </p>
                              <p className="text-xs">PNG, JPG, JPEG (max 5MB)</p>
                            </div>
                            <input
                              ref={fileInputRef}
                              type="file"
                              accept="image/png,image/jpeg,image/jpg"
                              onChange={handleFileChange}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>

                      {/* Amount (disabled) */}
                      <div className="space-y-2">
                        <Label htmlFor="amount">Amount</Label>
                        <div className="relative">
                          <Input
                            id="amount"
                            value="M300"
                            disabled
                            className="bg-muted cursor-not-allowed pl-8 font-semibold"
                          />
                          <ShieldCheck className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-lta-green" />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          One-time, non-refundable registration fee
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Submit Button */}
                <motion.div variants={itemVariants}>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    size="lg"
                    className="w-full h-14 bg-lta-green hover:bg-lta-green-dark text-white font-bold text-base btn-glow-green"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Submitting Application...
                      </>
                    ) : (
                      <>
                        <GraduationCap className="h-5 w-5 mr-2" />
                        Submit Application
                        <ArrowRight className="h-5 w-5 ml-1" />
                      </>
                    )}
                  </Button>
                </motion.div>
              </form>
            </motion.div>
          </div>

          {/* Fee Information Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="sticky top-24 space-y-6"
            >
              {/* Registration Fee Box */}
              <Card className="border-2 border-lta-green/30 bg-gradient-to-br from-lta-green/5 to-lta-blue/5 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-lta-green" />
                    Registration Fee
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center p-4 bg-white/80 dark:bg-card/80 rounded-xl">
                    <p className="text-sm text-muted-foreground">One-time fee</p>
                    <p className="text-4xl font-bold gradient-text mt-1">M300</p>
                    <p className="text-xs text-muted-foreground mt-1">Non-refundable</p>
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Your M300 registration fee will be verified by our team. Upon approval, you
                    will receive enrollment confirmation via email.
                  </p>

                  <Separator />

                  <div>
                    <p className="text-sm font-semibold text-foreground mb-2">
                      Accepted Payment Methods:
                    </p>
                    <div className="space-y-2">
                      {paymentMethods.map((method) => (
                        <div
                          key={method.id}
                          className="flex items-center gap-2 text-sm text-muted-foreground"
                        >
                          <div className="p-1.5 bg-lta-green/10 rounded">
                            <method.icon className="h-3.5 w-3.5 text-lta-green" />
                          </div>
                          {method.label}
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div className="p-3 bg-lta-blue/5 rounded-lg border border-lta-blue/10">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      <span className="font-semibold text-lta-blue">Note:</span> Course tuition
                      fees are paid after enrollment approval. Total tuition varies by programme
                      (M2,000 – M4,000).
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Course Reference */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-lta-blue" />
                    Course Fees
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {courses.map((course) => (
                      <div
                        key={course.id}
                        className="flex items-center justify-between py-2 border-b border-border/50 last:border-0"
                      >
                        <div>
                          <p className="text-sm font-medium text-foreground">{course.title}</p>
                          <p className="text-xs text-muted-foreground">{course.duration}</p>
                        </div>
                        <Badge variant="outline" className="text-lta-green border-lta-green/30">
                          {course.price}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Need Help */}
              <Card className="glass-card">
                <CardContent className="p-5 text-center">
                  <p className="text-sm font-medium text-foreground mb-1">Need Help?</p>
                  <p className="text-xs text-muted-foreground mb-3">
                    Contact us for assistance with your application
                  </p>
                  <Button asChild variant="outline" size="sm" className="w-full border-lta-green/30 text-lta-green hover:bg-lta-green/5">
                    <Link href="/contact">
                      Contact Support
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
