import { useState, useEffect } from 'react';
import axios from 'axios';

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [dashboard, setDashboard] = useState({ totalEnquiries: 0, totalProjects: 0 });
  const [enquiries, setEnquiries] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      setIsLoggedIn(true);
      fetchDashboard();
      fetchEnquiries();
      fetchGallery();
    }
  }, [token]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/login', loginForm);
      localStorage.setItem('token', response.data.token);
      setIsLoggedIn(true);
      fetchDashboard();
      fetchEnquiries();
      fetchGallery();
    } catch (error) {
      alert('Invalid credentials');
    }
  };

  const fetchDashboard = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDashboard(response.data);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    }
  };

  const fetchEnquiries = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/enquiries', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEnquiries(response.data);
    } catch (error) {
      console.error('Error fetching enquiries:', error);
    }
  };

  const fetchGallery = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/gallery');
      setGallery(response.data);
    } catch (error) {
      console.error('Error fetching gallery:', error);
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('image', selectedFile);
    try {
      await axios.post('http://localhost:5000/api/gallery', formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      fetchGallery();
      setSelectedFile(null);
    } catch (error) {
      alert('Error uploading image');
    }
  };

  const handleDeleteImage = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/gallery/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchGallery();
    } catch (error) {
      alert('Error deleting image');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return (
      <div className="admin-login">
        <h1>Admin Login</h1>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={loginForm.username}
            onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={loginForm.password}
            onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
            required
          />
          <button type="submit">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div className="admin">
      <header className="admin-header">
        <h1>Admin Panel</h1>
        <button onClick={handleLogout}>Logout</button>
      </header>

      <section className="dashboard">
        <h2>Dashboard</h2>
        <div className="stats">
          <div className="stat">
            <h3>Total Enquiries</h3>
            <p>{dashboard.totalEnquiries}</p>
          </div>
          <div className="stat">
            <h3>Total Projects</h3>
            <p>{dashboard.totalProjects}</p>
          </div>
        </div>
      </section>

      <section className="enquiries">
        <h2>Enquiry Management</h2>
        <div className="enquiries-list">
          {enquiries.map(enquiry => (
            <div key={enquiry.id} className="enquiry-item">
              <p><strong>Name:</strong> {enquiry.name}</p>
              <p><strong>Phone:</strong> {enquiry.phone}</p>
              <p><strong>Message:</strong> {enquiry.message}</p>
              <p><strong>Date:</strong> {new Date(enquiry.created_at).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="gallery-management">
        <h2>Manage Gallery</h2>
        <form onSubmit={handleFileUpload}>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setSelectedFile(e.target.files[0])}
            required
          />
          <button type="submit">Upload Image</button>
        </form>
        <div className="gallery-grid">
          {gallery.map(image => (
            <div key={image.id} className="gallery-item">
              <img src={`http://localhost:5000/uploads/${image.image}`} alt="Gallery" />
              <button onClick={() => handleDeleteImage(image.id)}>Delete</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Admin;