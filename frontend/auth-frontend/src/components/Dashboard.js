import React from 'react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { currentUser } = useAuth();

  return (
    <div className="dashboard">
      <div className="card">
        <h2>Dashboard</h2>
        <p>Welcome to your dashboard!</p>
        
        <div className="card">
          <h3>User Information</h3>
          <p><strong>Email:</strong> {currentUser?.email}</p>
          <p><strong>Role:</strong> {currentUser?.role}</p>
          <p><strong>Account Created:</strong> {new Date(currentUser?.createdAt).toLocaleDateString()}</p>
        </div>
        
        <div className="card">
          <h3>Role-Based Access</h3>
          {currentUser?.role === 'Admin' && (
            <div>
              <p>As an Admin, you have access to:</p>
              <ul>
                <li>User Management</li>
                <li>System Settings</li>
                <li>All Reports</li>
              </ul>
            </div>
          )}
          
          {currentUser?.role === 'Project Manager' && (
            <div>
              <p>As a Project Manager, you have access to:</p>
              <ul>
                <li>Project Management</li>
                <li>Team Management</li>
                <li>Project Reports</li>
              </ul>
            </div>
          )}
          
          {currentUser?.role === 'Employee' && (
            <div>
              <p>As an Employee, you have access to:</p>
              <ul>
                <li>Time Tracking</li>
                <li>Task Management</li>
                <li>Personal Reports</li>
              </ul>
            </div>
          )}
          
          {currentUser?.role === 'Accountant' && (
            <div>
              <p>As an Accountant, you have access to:</p>
              <ul>
                <li>Financial Reports</li>
                <li>Invoicing</li>
                <li>Payment Processing</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;