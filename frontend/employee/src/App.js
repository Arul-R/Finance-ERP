import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { hasRole } from './utils/auth';

import Dashboard from './pages/Dashboard';
import AddEmployee from './pages/AddEmployee';
import EditEmployee from './pages/EditEmployee';
import ViewEmployee from './Components/EmployeeDetails';
import EmployeeList from './Components/EmployeeList';
import Login from './pages/Login';

// Protected route component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, currentUser, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && !hasRole(currentUser, requiredRole)) {
    return <Navigate to="/" />;
  }
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/add-employee" 
            element={
              <ProtectedRoute requiredRole="Admin">
                <AddEmployee />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/edit-employee/:id" 
            element={
              <ProtectedRoute requiredRole="Admin">
                <EditEmployee />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/employee/:id" 
            element={
              <ProtectedRoute>
                <ViewEmployee />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/employees" 
            element={
              <ProtectedRoute>
                <EmployeeList />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
