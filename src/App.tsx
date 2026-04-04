
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import AppShell from './components/AppShell'

// Public
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'

// Student
import StudentDashboard from './pages/student/Dashboard'
import StudentClasses from './pages/student/MyClasses'
import StudentPayments from './pages/student/MyPayments'

// Teacher
import TeacherDashboard from './pages/teacher/Dashboard'
import TeacherClasses from './pages/teacher/MyClasses'
import TeacherStudents from './pages/teacher/Students'

// Admin
import AdminDashboard from './pages/admin/Dashboard'
import AdminCourses from './pages/admin/Courses'
import AdminClasses from './pages/admin/Classes'
import AdminUsers from './pages/admin/Users'
import AdminPayments from './pages/admin/Payments'

function RoleRedirect() {
  const { profile, loading } = useAuth()
  if (loading) return null
  if (!profile) return <Navigate to="/login" replace />
  if (profile.role === 'teacher') return <Navigate to="/teacher/dashboard" replace />
  if (profile.role === 'admin') return <Navigate to="/admin/dashboard" replace />
  return <Navigate to="/student/dashboard" replace />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<ProtectedRoute><RoleRedirect /></ProtectedRoute>} />

        {/* Student */}
        <Route path="/student/dashboard" element={
          <ProtectedRoute roles={['student']}>
            <AppShell><StudentDashboard /></AppShell>
          </ProtectedRoute>
        } />
        <Route path="/student/classes" element={
          <ProtectedRoute roles={['student']}>
            <AppShell><StudentClasses /></AppShell>
          </ProtectedRoute>
        } />
        <Route path="/student/payments" element={
          <ProtectedRoute roles={['student']}>
            <AppShell><StudentPayments /></AppShell>
          </ProtectedRoute>
        } />

        {/* Teacher */}
        <Route path="/teacher/dashboard" element={
          <ProtectedRoute roles={['teacher']}>
            <AppShell><TeacherDashboard /></AppShell>
          </ProtectedRoute>
        } />
        <Route path="/teacher/classes" element={
          <ProtectedRoute roles={['teacher']}>
            <AppShell><TeacherClasses /></AppShell>
          </ProtectedRoute>
        } />
        <Route path="/teacher/students" element={
          <ProtectedRoute roles={['teacher']}>
            <AppShell><TeacherStudents /></AppShell>
          </ProtectedRoute>
        } />

        {/* Admin */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute roles={['admin']}>
            <AppShell><AdminDashboard /></AppShell>
          </ProtectedRoute>
        } />
        <Route path="/admin/courses" element={
          <ProtectedRoute roles={['admin']}>
            <AppShell><AdminCourses /></AppShell>
          </ProtectedRoute>
        } />
        <Route path="/admin/classes" element={
          <ProtectedRoute roles={['admin']}>
            <AppShell><AdminClasses /></AppShell>
          </ProtectedRoute>
        } />
        <Route path="/admin/users" element={
          <ProtectedRoute roles={['admin']}>
            <AppShell><AdminUsers /></AppShell>
          </ProtectedRoute>
        } />
        <Route path="/admin/payments" element={
          <ProtectedRoute roles={['admin']}>
            <AppShell><AdminPayments /></AppShell>
          </ProtectedRoute>
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
