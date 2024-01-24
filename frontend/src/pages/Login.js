import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; // Updated import
import '../styles/home.css';
import logo from "../assets/images/logo.png"
function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Updated hook

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const URL = `http://localhost:5000/login`;
            const response = await axios.post(URL, {
                email,
                password
            });
            const json = response.data;

            if (json.success) {
                localStorage.setItem('auth-token', json.token);
                // Use the navigate function to redirect
                navigate('/');
            }
        } catch (err) {
            if (err.response && err.response.status === 401) {
                setError('Invalid email or password');
            } else {
                setError('An error occurred during login. Please try again.');
            }
        }
    };

    return (
        <>
            {/* Navbar */}
            <div className="navbar">
                <div className="container flex">
                    <div className="nav" style={{width:"100px"}}>
                        <img src={logo} alt="" />
                    </div>
                    <nav>
                        <ul>
                            <li>
                                <Link to="/">Home</Link>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
            <section className="showcase2">
                <div className="showcase-form card">
                    <h2>Login</h2>
                    <form onSubmit={handleLogin}>
                        {/* action */}
                        {error && <div className="alert alert-danger">{error}</div>}
                        <div className="form-control">
                            <input type="text" name="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
                        </div>

                        <div className="form-control">
                            <input type="password" name="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                        <input type="submit" name="login" value="login" className="btn btn-primary" />
                    </form>
                    <br />
                    <div>
                        <a href="forgot.php">Forgot Password ?</a>
                    </div>
                </div>
            </section>
        </>
    );
}

export default Login;
