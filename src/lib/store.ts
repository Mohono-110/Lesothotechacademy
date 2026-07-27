import { create } from 'zustand';

export type AppView = 
  | 'landing'
  | 'login'
  | 'register'
  | 'student-dashboard'
  | 'admin-dashboard'
  | 'course-detail'
  | 'apply-course';

export type StudentSubView = 
  | 'overview'
  | 'my-courses'
  | 'browse-courses'
  | 'my-applications'
  | 'profile'
  | 'payment';

export type AdminSubView = 
  | 'overview'
  | 'students'
  | 'applications'
  | 'payments'
  | 'courses';

export interface Student {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  city: string;
  country: string;
  profileImage?: string;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
}

export interface Admin {
  id: string;
  email: string;
  name: string;
}

export interface Course {
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
  content: string;
  objectives: string;
  modules: string;
  createdAt: string;
}

export interface Application {
  id: string;
  studentId: string;
  courseId: string;
  status: string;
  motivationalLetter?: string;
  educationLevel?: string;
  experience?: string;
  createdAt: string;
  updatedAt: string;
  course?: Course;
  student?: Student;
  payments?: Payment[];
}

export interface Payment {
  id: string;
  applicationId: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  transactionRef?: string;
  screenshotUrl?: string;
  status: string;
  adminNote?: string;
  verifiedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  applicationId: string;
  status: string;
  enrolledAt: string;
  completedAt?: string;
  progress: number;
  course?: Course;
}

interface AppState {
  // Navigation
  currentView: AppView;
  previousView: AppView | null;
  selectedCourseSlug: string | null;
  selectedCourseId: string | null;
  studentSubView: StudentSubView;
  adminSubView: AdminSubView;
  
  // Auth
  currentStudent: Student | null;
  currentAdmin: Admin | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  
  // Data
  courses: Course[];
  applications: Application[];
  enrollments: Enrollment[];
  
  // UI
  isLoading: boolean;
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
  
  // Actions
  setView: (view: AppView) => void;
  goBack: () => void;
  setStudentSubView: (view: StudentSubView) => void;
  setAdminSubView: (view: AdminSubView) => void;
  selectCourse: (slug: string, id?: string) => void;
  setStudent: (student: Student | null) => void;
  setAdmin: (admin: Admin | null) => void;
  logout: () => void;
  setCourses: (courses: Course[]) => void;
  setApplications: (applications: Application[]) => void;
  setEnrollments: (enrollments: Enrollment[]) => void;
  setLoading: (loading: boolean) => void;
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
  clearToast: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Navigation defaults
  currentView: 'landing',
  previousView: null,
  selectedCourseSlug: null,
  selectedCourseId: null,
  studentSubView: 'overview',
  adminSubView: 'overview',
  
  // Auth defaults
  currentStudent: null,
  currentAdmin: null,
  isAuthenticated: false,
  isAdmin: false,
  
  // Data defaults
  courses: [],
  applications: [],
  enrollments: [],
  
  // UI defaults
  isLoading: false,
  toast: null,
  
  // Actions
  setView: (view) => set((state) => ({ 
    previousView: state.currentView, 
    currentView: view 
  })),
  goBack: () => set((state) => ({ 
    currentView: state.previousView || 'landing' 
  })),
  setStudentSubView: (view) => set({ studentSubView: view }),
  setAdminSubView: (view) => set({ adminSubView: view }),
  selectCourse: (slug, id) => set({ selectedCourseSlug: slug, selectedCourseId: id || null }),
  setStudent: (student) => set({ 
    currentStudent: student, 
    isAuthenticated: !!student,
    isAdmin: false,
    currentAdmin: null
  }),
  setAdmin: (admin) => set({ 
    currentAdmin: admin, 
    isAdmin: !!admin,
    isAuthenticated: true,
    currentStudent: null
  }),
  logout: () => set({ 
    currentStudent: null, 
    currentAdmin: null, 
    isAuthenticated: false, 
    isAdmin: false,
    currentView: 'landing',
    studentSubView: 'overview',
    adminSubView: 'overview',
    applications: [],
    enrollments: []
  }),
  setCourses: (courses) => set({ courses }),
  setApplications: (applications) => set({ applications }),
  setEnrollments: (enrollments) => set({ enrollments }),
  setLoading: (loading) => set({ isLoading: loading }),
  showToast: (message, type) => set({ toast: { message, type } }),
  clearToast: () => set({ toast: null }),
}));
