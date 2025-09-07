"use client";
import '@fortawesome/fontawesome-free/css/all.min.css';

import React, { useState } from 'react';
import '@/Css/Contact.css';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const validateForm = () => {
    const { name, email, message } = formData;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!name || !email || !message) return 'Please fill in all fields.';
    if (!emailRegex.test(email)) return 'Enter a valid email address.';
    return '';
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError('');
    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      console.log(formData); // Replace with real submission logic
    }, 1500);
  };

  return (
    <div className="modernContactContainer">
      <div className="modernContactWrapper">
        <h1 className="modernTitle">Get in Touch</h1>
        <p className="modernDescription">
          Have a question or want to work together? Let's connect.
        </p>

        {submitted ? (
          <div className="successMessage">Thank you! Your message has been sent.</div>
        ) : (
          <form className="modernContactForm" onSubmit={handleSubmit}>
            {error && <div className="modernErrorMessage">{error}</div>}
            <div className="modernFormGroup">
              <input
                type="text"
                id="name"
                name="name"
                className="modernInput"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="modernFormGroup">
              <input
                type="email"
                id="email"
                name="email"
                className="modernInput"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="modernFormGroup">
              <textarea
                id="message"
                name="message"
                className="modernTextarea"
                placeholder="Your Message"
                value={formData.message}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="modernSubmitButton" disabled={loading}>
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        )}

        <div className="modernSocialIcons">
          <a href="#" target="_blank" rel="noopener noreferrer" className="modernIcon">
            <i className="fab fa-linkedin"></i>
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer" className="modernIcon">
            <i className="fab fa-github"></i>
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer" className="modernIcon">
            <i className="fab fa-facebook"></i>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Contact;