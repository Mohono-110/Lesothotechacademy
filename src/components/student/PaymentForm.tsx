'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2, Upload, CreditCard, Smartphone, Building2, FileImage } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAppStore, type Application } from '@/lib/store';
import { toast } from 'sonner';

interface PaymentFormProps {
  application: Application;
  onBack: () => void;
}

const paymentMethods = [
  {
    id: 'mpesa',
    label: 'M-Pesa',
    icon: Smartphone,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    description: 'Send to M-Pesa number: XXXX XXXX',
  },
  {
    id: 'ecocash',
    label: 'EcoCash',
    icon: Smartphone,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    description: 'Send to EcoCash number: XXXX XXXX',
  },
  {
    id: 'bank',
    label: 'Bank Transfer',
    icon: Building2,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    description: 'Transfer to Lesotho Tech Academy bank account',
  },
];

export default function PaymentForm({ application, onBack }: PaymentFormProps) {
  const { currentStudent, setStudentSubView, setApplications } = useAppStore();
  const [paymentMethod, setPaymentMethod] = useState('');
  const [transactionRef, setTransactionRef] = useState('');
  const [amount, setAmount] = useState('300');
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!paymentMethod) {
      toast.error('Please select a payment method');
      return;
    }
    if (!transactionRef) {
      toast.error('Please enter the transaction reference number');
      return;
    }
    if (!screenshot) {
      toast.error('Please upload a screenshot of your payment');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('applicationId', application.id);
      formData.append('amount', amount);
      formData.append('paymentMethod', paymentMethod);
      formData.append('transactionRef', transactionRef);
      if (screenshot) formData.append('screenshot', screenshot);

      const res = await fetch('/api/payments', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Payment submission failed');
      }

      toast.success('Payment proof submitted successfully! We will verify it shortly.');

      // Refresh applications
      if (currentStudent) {
        const appsRes = await fetch(`/api/applications?studentId=${currentStudent.id}`);
        if (appsRes.ok) {
          const appsData = await appsRes.json();
          if (appsData.applications) setApplications(appsData.applications);
        }
      }

      setStudentSubView('my-applications');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Payment submission failed.');
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
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-lta-green transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <span className="font-semibold">Upload Payment</span>
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
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <CreditCard className="h-5 w-5 text-lta-green" />
                Upload Payment Proof
              </CardTitle>
              <CardDescription>
                Course: {application.course?.title} • Registration Fee: M300
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 lg:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Payment method selection */}
                <div className="space-y-3">
                  <Label>Payment Method *</Label>
                  <div className="grid sm:grid-cols-3 gap-3">
                    {paymentMethods.map((method) => (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setPaymentMethod(method.id)}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${
                          paymentMethod === method.id
                            ? `${method.borderColor} ${method.bgColor} shadow-sm`
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <method.icon className={`h-5 w-5 ${paymentMethod === method.id ? method.color : 'text-gray-400'}`} />
                          <span className={`font-semibold text-sm ${paymentMethod === method.id ? method.color : 'text-gray-600'}`}>
                            {method.label}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">{method.description}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Amount */}
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (M) *</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min="1"
                    className="font-semibold"
                  />
                </div>

                {/* Transaction reference */}
                <div className="space-y-2">
                  <Label htmlFor="transactionRef">Transaction Reference Number *</Label>
                  <Input
                    id="transactionRef"
                    placeholder="Enter transaction/confirmation code"
                    value={transactionRef}
                    onChange={(e) => setTransactionRef(e.target.value)}
                  />
                </div>

                {/* Screenshot upload */}
                <div className="space-y-2">
                  <Label>Payment Screenshot *</Label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-lta-green/50 hover:bg-lta-green/5 transition-all flex flex-col items-center gap-3"
                  >
                    {screenshotPreview ? (
                      <div className="relative w-full max-w-xs">
                        <img
                          src={screenshotPreview}
                          alt="Payment screenshot"
                          className="max-h-40 mx-auto rounded-lg object-contain"
                        />
                        <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                          <span className="text-white text-sm font-medium">Click to change</span>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="w-12 h-12 rounded-xl bg-lta-green/10 flex items-center justify-center">
                          <Upload className="h-6 w-6 text-lta-green" />
                        </div>
                        <div className="text-center">
                          <span className="text-sm font-medium">Click to upload screenshot</span>
                          <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 5MB</p>
                        </div>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex gap-3">
                  <Button type="button" variant="outline" className="flex-1" onClick={onBack}>
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
                        <FileImage className="h-4 w-4" />
                        Submit Payment
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
