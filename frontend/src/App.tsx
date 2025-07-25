import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import StudentForm from "./pages/StudentForm";
import CertificateForm from "./pages/CertificateForm";
import CourseForm from "./pages/CourseForm";
import CenterAffiliationForm from "./pages/CenterAffiliationForm";
import AllCourses from "./pages/AllCourses";
import CertificateSearch from "./pages/CertificateSearch";
import AllCenters from "./pages/AllCenters";
import ManageStudents from './pages/ManageStudents'; 
import CourseDetail from './pages/CourseDetail';
import About from "./pages/About";
import Contact from "./pages/Contact";
import ScrollToTop from './components/ScrollToTop';

// Import authentication utilities. JwtPayload is not directly imported here.
import { isAuthenticated, decodeAccessToken } from './utils/auth';

// PrivateRoute component for authentication and role-based authorization
const PrivateRoute: React.FC<{ children: React.ReactNode; roles?: string[] }> = ({ children, roles }) => {
  const authenticated = isAuthenticated();
  // Infer the type of 'user' from the return type of decodeAccessToken
  const user = decodeAccessToken(); 

  if (!authenticated) {
    return <Navigate to="/login" replace />; // Not authenticated, redirect to login
  }

  // If roles are specified and user's role is not among them, redirect to unauthorized
  // We need to ensure 'user' is not null before accessing 'user.role'
  if (roles && user && !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>; // Authenticated and authorized, render content
};

// Simple Unauthorized component (can be moved to its own file if reused)
const Unauthorized: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-red-100 flex-col">
      <h1 className="text-3xl font-bold text-red-800 mb-4">403 - Unauthorized Access</h1>
      <p className="text-gray-700">You do not have permission to view this page.</p>
      <p className="mt-4"><a href="/" className="text-blue-600 hover:underline">Go to Home</a></p>
    </div>
  );
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/courses" element={<AllCourses />} />
        <Route path="/certificate" element={<CertificateSearch />} />
        <Route path="/center-list" element={<AllCenters />} />
        <Route path="/courses/:courseName" element={<CourseDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        {/* Protected Routes */}
        <Route
          path="/profile"
          element={
            <PrivateRoute roles={['user', 'admin']}>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/studentadmission"
          element={
            <PrivateRoute roles={['admin','user']}>
              <StudentForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/certificate-add"
          element={
            <PrivateRoute roles={['admin']}>
              <CertificateForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/course-add"
          element={
            <PrivateRoute roles={['admin']}>
              <CourseForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/center-affilation"
          element={
            <PrivateRoute roles={['admin']}>
              <CenterAffiliationForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/manage-students"
          element={
            <PrivateRoute roles={['admin']}>
              <ManageStudents />
            </PrivateRoute>
          }
        />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;