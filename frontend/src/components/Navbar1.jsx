import React, { useRef, useEffect, useContext } from 'react';
import { Button } from 'reactstrap';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../assets/images/logo.png';
import './Navbar.css';
import { AuthContext } from '../../context/AuthContext.jsx';

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
        path: '/users',
        display: 'Users'
    },
];

const Navbar = () => {
    const headerRef = useRef(null);
    const menuRef = useRef(null);
    const navigate = useNavigate();
    const { dispatch } = useContext(AuthContext);

    const logout = () => {
        dispatch({ type: 'LOGOUT' });
        navigate('/');
    };

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
                                        <Link to={item.path}>{item.display}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        {/* ======== menu end ========== */}
                        <div className="nav_right mx-3 d-flex align-items-center gap-4">
                            <div className="nav_btns d-flex align-items-center gap-4">
                                <Button className="btn btn-dark" onClick={logout}>
                                    Logout
                                </Button>
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
