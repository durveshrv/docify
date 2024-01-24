import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import logo from "../assets/images/logo.png";

function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phoneno, setPhoneno] = useState('');
    const [gndr, setGnd] = useState('Male');
    const [isMounted, setIsMounted] = useState(true);

    // Use the useNavigate hook for navigation
    const navigate = useNavigate();

    useEffect(() => {
        return () => {
            // Component will unmount
            setIsMounted(false);
        };
    }, []);

    const Submit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`http://localhost:5000/register`, {
                name,
                email,
                phoneno,
                password,
                gndr,
            });
            console.log(response.data);
            navigate('/login');
        } catch (err) {
            // Handle error as needed
            console.error(err);
        }
    };

    return (
        <div>
            <div className="navbar">
                <div className="container flex">
                    <div className="nav" style={{width:"100px"}}>
                        <img src={logo} alt="" />
                    </div>
                    <nav>
                        <ul>
                            <li><Link to="/">Home</Link></li>
                        </ul>
                    </nav>
                </div>
            </div>

            <section className='showcase2'>
                <div className="showcase-form card" style={{ height: '400px' }}>
                    <h2>Register</h2>
                    <form onSubmit={Submit}>
                        <div className="form-control">
                            <input type="text" name="fullname" placeholder="Full Name" onChange={(e) => setName(e.target.value)} required />
                        </div>
                        <div className="form-control">
                            <input type="text" name="email1" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <div className="form-control">
                            <input type="text" name="phoneno" placeholder="Phone Number" onChange={(e) => setPhoneno(e.target.value)} required />
                        </div>
                        <div className="form-control">
                            <input type="password" name="password1" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                        <div className="gender-details">
                            <input type="radio" name="gndr" id="dot-1" value="Male" checked={gndr === 'Male'} onChange={() => setGnd('Male')} required />
                            <input type="radio" name="gndr" id="dot-2" value="Female" checked={gndr === 'Female'} onChange={() => setGnd('Female')} required />
                            <input type="radio" name="gndr" id="dot-3" value="Prefer not to say" checked={gndr === 'Prefer not to say'} onChange={() => setGnd('Prefer not to say')} required />
                            <span>Gender</span>
                            <div className="category">
                                <label htmlFor="dot-1">
                                    <span className="dot one"></span>
                                    <span className="gender">Male</span>
                                </label>
                                <label htmlFor="dot-2">
                                    <span className="dot two"></span>
                                    <span className="gender">Female</span>
                                </label>
                                <label htmlFor="dot-3">
                                    <span className="dot three"></span>
                                    <span className="gender">Prefer not to say</span>
                                </label>
                            </div>
                        </div>
                        <input type="submit" name="register" value="Register" className="btn btn-primary" />
                    </form>
                    <br />
                </div>
            </section>
        </div>
    );
}

export default Register;
