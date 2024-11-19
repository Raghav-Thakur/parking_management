import React from 'react';
import '../styles/Navbar.css';

export const Navbar = () => {
  return (
    <div className="navbar">
      <div className="nav-logo">
        <a href="#">
          <h2>LOGO</h2>
          {/* <img src="#" alt="Logo" /> */}
        </a>
      </div>
      <div className="nav-menu-mobile" data-status="closed">
        <span>MENU</span>
        <i className="menu-toggle fa-solid fa-bars"></i>
      </div>
      <ul className="nav-menu">
        <li>
          <a className="nav-menu-item" href="#">
            Home
          </a>
        </li>
        <li>
          <a className="nav-menu-item" href="#">
            Info
          </a>
        </li>
        <li>
          <a className="nav-menu-item" href="#">
            Contact
          </a>
        </li>
        <li>
          <div className="nav-menu-item nav-dropdown">
            About
            <div className="dropdown-content">
              <a className="dropdown-item" href="#">
                Dropdown Item 1
              </a>
              <a className="dropdown-item" href="#">
                Dropdown Item 2
              </a>
              <a className="dropdown-item" href="#">
                Dropdown Item 3
              </a>
              <a className="dropdown-item" href="#">
                Dropdown Item 4
              </a>
            </div>
          </div>
        </li>
        <li>
          <a className="nav-menu-item" href="#">
            More
          </a>
        </li>
      </ul>
    </div>
  );
};
