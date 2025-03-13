import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import PatientDashboard from './pages/PatientDashboard';
import ClaimSubmission from './pages/ClaimSubmission';
import InsurerDashboard from './pages/InsurerDashboard';
import ClaimDetail from './pages/ClaimDetail';
import ProtectedRoute from './components/ProtectedRoute';
import PatientClaimDetail from './pages/PatientClaimDetail';
import { AuthContext } from './AuthContext';

function App() {
  const context = useContext(AuthContext);
  console.log("AuthContext value:", context);
  return (
    
   
     <Router>
      <Routes>
         <Route path="/login" element={<LoginPage />} />
         <Route path="/patient/dashboard" element={
           <ProtectedRoute requiredRole="patient">
             <PatientDashboard />
           </ProtectedRoute>
         } />
         <Route path="/patient/submit" element={
           <ProtectedRoute requiredRole="patient">
             <ClaimSubmission />
           </ProtectedRoute>
         } />
         <Route path="/patient/claims/:id" element={
  <ProtectedRoute requiredRole="patient">
    <PatientClaimDetail />
  </ProtectedRoute>
} />

         <Route path="/insurer/dashboard" element={
           <ProtectedRoute requiredRole="insurer">
             <InsurerDashboard />
           </ProtectedRoute>
         } />
         <Route path="/insurer/claims/:id" element={
           <ProtectedRoute requiredRole="insurer">
             <ClaimDetail />
           </ProtectedRoute>
         } />
         <Route path="*" element={<LoginPage />} />
      </Routes>
    </Router> 
   
  );
}

export default App;
