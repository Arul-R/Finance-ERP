import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TimeLogDashboard() {
  const [form, setForm] = useState({
    employee_id: '',
    project_id: '',
    date: new Date().toISOString().split('T')[0],
    hours_worked: '',
  });
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });
  const [signupForm, setSignupForm] = useState({
    email: '',
    password: '',
    role: 'Employee'
  });
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [timelogs, setTimelogs] = useState([]);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [employee, setEmployee] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Verify token with auth service
      axios.get('http://localhost:5009/api/auth/verify', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        setIsAuthenticated(true);
        setEmployee(response.data);
        // Auto-fill employee_id
        setForm(prev => ({ ...prev, employee_id: response.data._id }));
      })
      .catch(err => {
        console.error('Auth error:', err);
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setError('Please log in to access the time log system.');
      });
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('http://localhost:5009/api/auth/login', loginForm);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setIsAuthenticated(true);
      setEmployee(user);
      setForm(prev => ({ ...prev, employee_id: user._id }));
    } catch (err) {
      console.error('Login error:', err);
      setError('Invalid email or password');
    }
  };

  const handleLoginChange = (e) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setEmployee(null);
    setForm({ employee_id: '', project_id: '', date: '', hours_worked: '' });
    setTimelogs([]);
  };

  const fetchTimelogs = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5006/api/timelogs', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTimelogs(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch time logs.');
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchTimelogs();
    }
  }, [isAuthenticated]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');

    // Validate form
    if (!form.project_id) {
      setError('Please select a project');
      return;
    }
    if (!form.date) {
      setError('Please select a date');
      return;
    }
    if (!form.hours_worked || form.hours_worked <= 0) {
      setError('Please enter valid hours worked');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const payload = {
        project_id: form.project_id,
        date: new Date(form.date).toISOString(),
        hours_worked: parseFloat(form.hours_worked)
      };
      
      console.log('Sending payload:', payload); // Debug log
      
      const response = await axios.post('http://localhost:5006/api/timelogs', payload, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Response:', response.data); // Debug log
      
      setForm(prev => ({ 
        ...prev, 
        date: new Date().toISOString().split('T')[0],
        hours_worked: '' 
      })); // Reset only date and hours, keep project
      setSuccess('Time log added successfully.');
      fetchTimelogs();
    } catch (err) {
      console.error('Submit error:', err);
      console.error('Error response:', err.response?.data); // Debug log
      setError(err.response?.data?.message || err.response?.data?.error || 'Failed to submit time log');
    }
  };

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('en-IN');

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('http://localhost:5009/api/auth/signup', signupForm);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setIsAuthenticated(true);
      setEmployee(user);
      setForm(prev => ({ ...prev, employee_id: user._id }));
    } catch (err) {
      console.error('Signup error:', err);
      setError(err.response?.data?.message || 'Failed to sign up');
    }
  };

  const handleSignupChange = (e) => {
    setSignupForm({ ...signupForm, [e.target.name]: e.target.value });
  };

  const toggleAuthMode = () => {
    setIsLoginMode(!isLoginMode);
    setError('');
  };

  if (!isAuthenticated) {
    return (
      <div style={styles.container}>
        <h1 style={styles.header}>Time Log Dashboard</h1>
        <div style={styles.authContainer}>
          <div style={styles.authBox}>
            <h2 style={styles.authHeader}>{isLoginMode ? 'Login' : 'Sign Up'}</h2>
            {isLoginMode ? (
              <form onSubmit={handleLogin} style={styles.authForm}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={loginForm.email}
                    onChange={handleLoginChange}
                    style={styles.input}
                    required
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Password</label>
                  <input
                    type="password"
                    name="password"
                    value={loginForm.password}
                    onChange={handleLoginChange}
                    style={styles.input}
                    required
                  />
                </div>
                <button type="submit" style={styles.authButton}>Login</button>
              </form>
            ) : (
              <form onSubmit={handleSignup} style={styles.authForm}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={signupForm.email}
                    onChange={handleSignupChange}
                    style={styles.input}
                    required
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Password</label>
                  <input
                    type="password"
                    name="password"
                    value={signupForm.password}
                    onChange={handleSignupChange}
                    style={styles.input}
                    required
                    minLength="6"
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Role</label>
                  <select
                    name="role"
                    value={signupForm.role}
                    onChange={handleSignupChange}
                    style={styles.input}
                    required
                  >
                    <option value="Employee">Employee</option>
                    <option value="Project Manager">Project Manager</option>
                    <option value="Accountant">Accountant</option>
                  </select>
                </div>
                <button type="submit" style={styles.authButton}>Sign Up</button>
              </form>
            )}
            <div style={styles.authToggle}>
              <p style={styles.authToggleText}>
                {isLoginMode ? "Don't have an account? " : "Already have an account? "}
                <button
                  onClick={toggleAuthMode}
                  style={styles.authToggleButton}
                >
                  {isLoginMode ? 'Sign Up' : 'Login'}
                </button>
              </p>
            </div>
          </div>
        </div>
        {error && <p style={styles.error}>{error}</p>}
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.headerContainer}>
        <h1 style={styles.header}>Time Log Dashboard</h1>
        <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
      </div>
      <p style={styles.welcome}>Welcome, {employee?.name}</p>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="employee_id"
          value={form.employee_id}
          style={{ ...styles.input, backgroundColor: '#f0f0f0' }}
          disabled
        />
        <input
          type="text"
          name="project_id"
          placeholder="Project ID"
          value={form.project_id}
          onChange={handleChange}
          style={styles.input}
          required
        />
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          style={styles.input}
          required
        />
        <input
          type="number"
          name="hours_worked"
          placeholder="Hours Worked"
          value={form.hours_worked}
          onChange={handleChange}
          style={styles.input}
          min="0"
          step="0.1"
          required
        />
        <button type="submit" style={styles.button}>Submit</button>
      </form>

      {success && <p style={styles.success}>{success}</p>}
      {error && <p style={styles.error}>{error}</p>}

      {timelogs.length > 0 && (
        <div style={styles.tableWrapper}>
          <h2 style={styles.subHeader}>Submitted Time Logs</h2>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Employee ID</th>
                <th style={styles.th}>Project ID</th>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Hours Worked</th>
              </tr>
            </thead>
            <tbody>
              {timelogs.map((log, index) => (
                <tr key={log._id} style={index % 2 === 0 ? styles.rowEven : styles.rowOdd}>
                  <td style={styles.td}>{log.employee_id}</td>
                  <td style={styles.td}>{log.project_id}</td>
                  <td style={styles.td}>{formatDate(log.date)}</td>
                  <td style={styles.tdRight}>{log.hours_worked}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    fontFamily: 'Segoe UI, sans-serif',
    padding: '2rem',
    backgroundColor: '#f5f7fa',
    minHeight: '100vh',
  },
  headerContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
  },
  header: {
    fontSize: '2rem',
    color: '#1976d2',
    margin: 0,
  },
  authContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '80vh',
  },
  authBox: {
    width: '100%',
    maxWidth: '400px',
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  authHeader: {
    fontSize: '1.75rem',
    color: '#1976d2',
    marginBottom: '1.5rem',
    textAlign: 'center',
    fontWeight: '600',
  },
  authForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  label: {
    fontSize: '0.9rem',
    color: '#666',
    fontWeight: '500',
  },
  input: {
    padding: '0.75rem',
    fontSize: '1rem',
    borderRadius: '6px',
    border: '1px solid #ddd',
    transition: 'border-color 0.2s',
    '&:focus': {
      borderColor: '#1976d2',
      outline: 'none',
    },
  },
  authButton: {
    padding: '0.75rem',
    backgroundColor: '#1976d2',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '500',
    transition: 'background-color 0.2s',
    marginTop: '0.5rem',
    '&:hover': {
      backgroundColor: '#1565c0',
    },
  },
  authToggle: {
    marginTop: '1.5rem',
    textAlign: 'center',
  },
  authToggleText: {
    color: '#666',
    fontSize: '0.9rem',
  },
  authToggleButton: {
    background: 'none',
    border: 'none',
    color: '#1976d2',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '500',
    padding: '0',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  welcome: {
    fontSize: '1.2rem',
    color: '#666',
    textAlign: 'center',
    marginBottom: '1rem',
  },
  subHeader: {
    fontSize: '1.25rem',
    marginBottom: '1rem',
  },
  form: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem',
    marginBottom: '2rem',
    backgroundColor: '#fff',
    padding: '1rem',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  button: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#1976d2',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  logoutButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
  success: {
    color: 'green',
    marginBottom: '1rem',
    textAlign: 'center',
  },
  error: {
    color: 'red',
    marginBottom: '1rem',
    textAlign: 'center',
  },
  tableWrapper: {
    overflowX: 'auto',
    backgroundColor: '#fff',
    padding: '1rem',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    backgroundColor: '#f0f0f0',
    padding: '12px',
    borderBottom: '1px solid #ccc',
    textAlign: 'left',
  },
  td: {
    padding: '12px',
    borderBottom: '1px solid #eee',
  },
  tdRight: {
    padding: '12px',
    textAlign: 'right',
    borderBottom: '1px solid #eee',
  },
  rowEven: {
    backgroundColor: '#ffffff',
  },
  rowOdd: {
    backgroundColor: '#f9f9f9',
  },
};

export default TimeLogDashboard;
