'use client';

import { useState } from 'react';

interface ModuleResult {
  id: string;
  code: string;
  name: string;
  credits: number;
  grade: string;
}

interface Semester {
  id: string;
  name: string;
  gpa: number;
  cgpa: number;
  creditsEarned: number;
  cumulativeCredits: number;
  modules: ModuleResult[];
}

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  gender?: string;
  dateOfBirth?: string;
  country?: string;
  city?: string;
  createdAt: string;
  enrollments?: { course: { title: string; slug: string } }[];
}

export default function ResultSlipPage() {
  const [studentId, setStudentId] = useState('');
  const [student, setStudent] = useState<Student | null>(null);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const fetchResults = async (sid: string) => {
    setLoading(true);
    setNotFound(false);
    try {
      const res = await fetch(`/api/admin/results?studentId=${sid}`);
      const data = await res.json();
      if (data.student) {
        setStudent(data.student);
        setSemesters(data.semesters || []);
      } else {
        setNotFound(true);
      }
    } catch {
      setNotFound(true);
    }
    setLoading(false);
  };

  const [initialId] = useState(() => {
    if (typeof window !== 'undefined') {
      return new URLSearchParams(window.location.search).get('studentId') || '';
    }
    return '';
  });

  const [hasFetched, setHasFetched] = useState(false);
  if (initialId && !hasFetched && !loading) {
    setHasFetched(true);
    fetchResults(initialId);
  }

  const handleSearch = () => {
    if (studentId.trim()) fetchResults(studentId.trim());
  };

  const fullName = student ? `${student.firstName} ${student.lastName}` : '';
  const totalCreditsEarned = semesters.reduce((sum, s) => sum + s.creditsEarned, 0);
  const totalCumulativeCredits = semesters.length > 0 ? semesters[semesters.length - 1].cumulativeCredits : 0;
  const finalCgpa = semesters.length > 0 ? semesters[semesters.length - 1].cgpa : 0;
  const enrolledCourse = student?.enrollments?.[0]?.course?.title || 'N/A';

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Search Bar - hidden when printing */}
      <div className="print:hidden bg-white shadow-sm border-b p-4">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <input
            type="text"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            placeholder="Enter Student ID"
            className="flex-1 px-4 py-2 border rounded-lg text-sm"
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button
            onClick={handleSearch}
            className="px-6 py-2 bg-lta-green text-white rounded-lg text-sm font-medium hover:bg-lta-green-dark"
          >
            Search
          </button>
          {student && (
            <button
              onClick={() => window.print()}
              className="px-6 py-2 bg-lta-blue text-white rounded-lg text-sm font-medium hover:bg-lta-blue-dark"
            >
              Print Result Slip
            </button>
          )}
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-lta-green" />
        </div>
      )}

      {notFound && (
        <div className="text-center py-20 text-red-500 font-medium">
          Student not found. Please check the Student ID.
        </div>
      )}

      {/* Result Slip Document */}
      {student && !loading && (
        <div className="max-w-[210mm] mx-auto my-8 bg-white shadow-lg print:shadow-none print:my-0">
          <div className="p-8 sm:p-12">
            {/* ── HEADER ── */}
            <div className="flex items-start justify-between mb-8">
              {/* Left: Institution Identity */}
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-lta-green rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">LTA</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-lta-green tracking-wide">
                    LESOTHOTECHACADEMY
                  </h1>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Leribe 300 District, Lesotho
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Tel: +266 5069 9110 / +266 6283 5137
                  </p>
                </div>
              </div>
              {/* Right: Document Title & Date */}
              <div className="text-right">
                <h2 className="text-lg font-bold text-foreground">
                  Statement of Academic Results
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Date Issued: {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
                </p>
                <p className="text-xs text-muted-foreground">
                  REGISTRAR
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="h-0.5 bg-lta-green mb-6" />

            {/* ── STUDENT INFO ── */}
            <div className="grid grid-cols-2 gap-x-12 gap-y-2 mb-8 text-sm">
              <div className="flex">
                <span className="w-36 font-semibold text-foreground">Student Name:</span>
                <span className="text-foreground">{fullName}</span>
              </div>
              <div className="flex">
                <span className="w-36 font-semibold text-foreground">Student ID:</span>
                <span className="text-foreground">{student.id.slice(-8).toUpperCase()}</span>
              </div>
              <div className="flex">
                <span className="w-36 font-semibold text-foreground">Gender:</span>
                <span className="text-foreground">{student.gender || 'N/A'}</span>
              </div>
              <div className="flex">
                <span className="w-36 font-semibold text-foreground">Nationality:</span>
                <span className="text-foreground">{student.country === 'Lesotho' ? 'Mosotho' : student.country || 'N/A'}</span>
              </div>
              <div className="flex">
                <span className="w-36 font-semibold text-foreground">Programme:</span>
                <span className="text-foreground">{enrolledCourse}</span>
              </div>
              <div className="flex">
                <span className="w-36 font-semibold text-foreground">Date of Admission:</span>
                <span className="text-foreground">
                  {new Date(student.createdAt).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
                </span>
              </div>
            </div>

            {/* ── ACADEMIC RECORD TABLE ── */}
            {semesters.length > 0 ? (
              <div className="mb-8">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-lta-green text-white">
                      <th className="border border-lta-green-dark px-3 py-2 text-left font-semibold w-20">Code</th>
                      <th className="border border-lta-green-dark px-3 py-2 text-left font-semibold">Module Name</th>
                      <th className="border border-lta-green-dark px-3 py-2 text-center font-semibold w-16">Credit</th>
                      <th className="border border-lta-green-dark px-3 py-2 text-center font-semibold w-16">Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {semesters.map((semester, sIdx) => (
                      <StudentSemesterRow key={semester.id} semester={semester} isLast={sIdx === semesters.length - 1} />
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground border border-dashed rounded-lg mb-8">
                No academic results recorded yet.
              </div>
            )}

            {/* ── FINAL SUMMARY ── */}
            {semesters.length > 0 && (
              <div className="flex justify-end mb-8">
                <div className="text-sm space-y-1.5 border p-4 rounded-lg bg-gray-50 min-w-[280px]">
                  <div className="flex justify-between">
                    <span className="font-semibold">Total Credits Earned:</span>
                    <span className="font-mono">{totalCreditsEarned.toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Total Cumulative Credits:</span>
                    <span className="font-mono">{totalCumulativeCredits.toFixed(1)}</span>
                  </div>
                  <div className="h-px bg-gray-300 my-1" />
                  <div className="flex justify-between">
                    <span className="font-semibold">Final CGPA:</span>
                    <span className="font-mono font-bold text-lta-green">{finalCgpa.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* ── FOOTER ── */}
            <div className="h-0.5 bg-lta-green mb-4" />
            <div className="flex justify-between items-end text-xs text-muted-foreground">
              <div>
                <p className="italic">
                  This is not a valid record unless it bears both the stamp and signature
                  on behalf of the institution.
                </p>
              </div>
              <div className="text-right">
                <p>Lesotho Tech Academy</p>
                <p>Leribe 300 District, Lesotho</p>
                <p>Tel: +266 5069 9110 / +266 6283 5137</p>
                <p>www.lesothotechacademy.org</p>
              </div>
            </div>

            {/* Signature line */}
            <div className="mt-8 flex justify-end">
              <div className="text-center">
                <div className="w-48 border-b border-foreground mb-1" />
                <p className="text-xs font-medium">Registrar</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Sub-component: Semester with its modules ─── */
function StudentSemesterRow({ semester, isLast }: { semester: Semester; isLast: boolean }) {
  const gradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'text-green-700 font-semibold';
    if (grade.startsWith('B')) return 'text-blue-700 font-semibold';
    if (grade.startsWith('C')) return 'text-yellow-700 font-semibold';
    if (grade === 'D') return 'text-orange-600';
    if (grade === 'F') return 'text-red-600 font-semibold';
    return 'text-foreground';
  };

  return (
    <>
      {/* Semester Header Row */}
      <tr className="bg-lta-green/10">
        <td colSpan={4} className="border border-gray-300 px-3 py-2 font-bold text-foreground text-sm">
          {semester.name}
        </td>
      </tr>
      {/* Module Rows */}
      {semester.modules.map((mod) => (
        <tr key={mod.id} className="hover:bg-gray-50">
          <td className="border border-gray-300 px-3 py-1.5 font-mono text-xs">{mod.code}</td>
          <td className="border border-gray-300 px-3 py-1.5">{mod.name}</td>
          <td className="border border-gray-300 px-3 py-1.5 text-center">{mod.credits}</td>
          <td className={`border border-gray-300 px-3 py-1.5 text-center ${gradeColor(mod.grade)}`}>{mod.grade}</td>
        </tr>
      ))}
      {/* Semester Summary Row */}
      <tr className="bg-gray-50 font-medium text-xs">
        <td colSpan={2} className="border border-gray-300 px-3 py-1.5 text-right">
          Credits Earned: <span className="font-mono">{semester.creditsEarned.toFixed(2)}</span>
          &nbsp;&nbsp;|&nbsp;&nbsp;
          Cumulative Credits: <span className="font-mono">{semester.cumulativeCredits.toFixed(2)}</span>
        </td>
        <td className="border border-gray-300 px-3 py-1.5 text-center">
          GPA: <span className="font-mono">{semester.gpa.toFixed(2)}</span>
        </td>
        <td className="border border-gray-300 px-3 py-1.5 text-center">
          CGPA: <span className="font-mono">{semester.cgpa.toFixed(2)}</span>
        </td>
      </tr>
    </>
  );
}
