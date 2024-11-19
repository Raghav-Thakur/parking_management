import React from 'react';
import '../styles/Footer.css';

export const Footer = () => {
  return (
    <div>
      <div className="container">
        <div className="content">
          <h2>Sign Up</h2>
          <p>
            The Muzli email digest is a weekly summary of the most popular and
            inspiring design-related content from Muzli publications. We curate the
            best, so you can stay continually informed and inspired.
          </p>
          <form noValidate>
            <input
              type="email"
              placeholder="Enter your email address"
              id="emailInput"
              required
            />
            <button type="submit">Get this newsletter</button>
          </form>
          <p id="emailConfirmation">
            Email will be sent to <span id="emailDisplay">email@address.com</span>.{' '}
            <a href="#">Not you?</a>
          </p>
        </div>
        <div className="social-icons">
          <div className="socials">
            <a href="#" className="social-icon">
              <i className="fa-regular fa-thumbs-up"></i> 82
            </a>
            <a href="#" className="social-icon">
              <i className="fa-regular fa-comment-dots"></i> 2
            </a>
          </div>
          <div className="icons">
            <a href="#" className="social-icon">
              <i className="fa-brands fa-twitter"></i>
            </a>
            <a href="#" className="social-icon">
              <i className="fa-brands fa-facebook"></i>
            </a>
            <a href="#" className="social-icon">
              <i className="fa-solid fa-link"></i>
            </a>
            <a href="#" className="social-icon">
              <i className="fa-solid fa-ellipsis"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
