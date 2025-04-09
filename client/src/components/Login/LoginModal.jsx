import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LoginModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [submittedData, setSubmittedData] = useState(null);

  useEffect(() => {
    if (submittedData) {
      console.log("Login submitted:", submittedData);
      // ici tu pourrais aussi envoyer ça à un backend ou le stocker localement
    }
  }, [submittedData]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // requête avec axios ou fetch pour envoyer les données au backend
    axios.post( 'http://localhost:8080' + '/login', formData)
        .then(response => {
            const token = response.data;
            console.log("Token received:", token);
            // Stocker le token dans le localStorage
            localStorage.setItem('token', token);
            console.log("Login successful:", response.data);
            setSubmittedData(formData);
        })
        .catch(error => {
            console.error("Login failed:", error.response.data);
            alert("Erreur de connexion : " + error.response.data.error);
        })
    onClose();
  };

  return (
    <div>
      <div>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Username</label>
            <input type="text" name="username" value={formData.username} onChange={handleChange} />
          </div>
          <div>
            <label>Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} />
          </div>
          <div>
            <button type="submit">Login</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
