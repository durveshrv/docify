import React, { useRef, useEffect, useState } from 'react';
import { Button } from 'reactstrap';
import { NavLink, Link, useNavigate } from 'react-router-dom'; // Updated import
import logo from '../assets/images/logo.png';
import {jwtDecode} from "jwt-decode"; // Updated import
import './Navbar.css';
import axios from 'axios';
const nav_links = [
    {
        path: '/',
        display: 'Home'
    },
    {
        path: '/about',
        display: 'About'
    },
    {
        path: '/login',
        display: 'Users'
    },
];

const Navbar = () => {
    const headerRef = useRef(null);
    const menuRef = useRef(null);
    const navigate = useNavigate(); // Updated hook
    const [user, setUser] = useState(null);

    const callAboutPage = async () => {
        try {
          const res = await axios.get(`http://localhost:5000/about`, {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              "auth-token": localStorage.getItem("auth-token"),
            },
            credentials: "include",
          });
          const data = await res.data;
          setUser(data);
        } catch (err) {
          if (err) {
            // Use navigate to redirect to the login page
            navigate('/');
          }
        }
      };
    
      useEffect(() => {
        callAboutPage();
      }, []);

    const stickyHeaderFunc = () => {
        window.addEventListener('scroll', () => {
            if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
                headerRef.current.classList.add('sticky_header');
            } else {
                headerRef.current.classList.remove('sticky_header');
            }
        });
    };

    useEffect(() => {
        stickyHeaderFunc();
        return () => window.removeEventListener('scroll', stickyHeaderFunc);
    }, []);

    const toggleMenu = () => menuRef.current.classList.toggle('show_menu');

    const handleRedirect = () => {
        // Perform any necessary logic
        // For example, you can set state or perform other actions before redirecting

        // Use the navigate function to redirect
        navigate('/');
    };

    return (
        <header className="header" ref={headerRef}>
            <div className="container">
                <div className="row">
                    <div className="nav_wrapper d-flex align-items-center justify-content-between">
                        {/* ======== logo ========== */}
                        <div className="logo">
                            <img src={logo} alt="" />
                        </div>
                        {/* ======== logo end ========== */}
                        {/* ======== menu start ========== */}
                        <div className="navigation" ref={menuRef} onClick={toggleMenu}>
                            <ul className="menu d-flex align-items-center gap-5">
                                {nav_links.map((item, index) => (
                                    <li className="nav_item" key={index}>
                                        <NavLink to={item.path} className={(navClass) => (navClass.isActive ? 'active_link' : '')}>
                                            {item.display}
                                        </NavLink>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        {/* ======== menu end ========== */}
                        <div className="nav_right d-flex align-items-center gap-4">
                            <div className="nav_btns d-flex align-items-center gap-4">
                                {user ? (
                                    <>
                                        <h5 className="mb-0">{user.username}</h5>
                                        <Link to='/users/logout'><Button className="btn btn-dark" onClick={handleRedirect}>
                                            Logout
                                        </Button></Link>
                                    </>
                                ) : (
                                    <>
                                        <button className="btn btn-light">
                                            <Link style={{ textDecoration: 'none', color: 'black' }} to="/login">
                                                Login
                                            </Link>
                                        </button>
                                        <button type="button" className="btn btn-primary" style={{ borderRadius: '30px' }}>
                                            <Link style={{ textDecoration: 'none', color: 'white' }} to="/register">
                                                Register
                                            </Link>
                                        </button>
                                    </>
                                )}
                            </div>
                            <span className="mobile_menu" onClick={toggleMenu}>
                                <i className="ri-menu-line"></i>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
