import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { urlServerAuth } from '../App';
import Loading from './Loading';
import './Login.css';

const Login = () => {
    const [stage, setStage] = useState(1); // 1 for username entry, 2 for password entry
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    useEffect(() => {
        if (stage === 2) {
            setLoading(true);
            const timer = setTimeout(() => {
                setLoading(false);
            }, 1000); // Show loading for 1 second

            return () => clearTimeout(timer);
        }
    }, [stage]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (stage === 1) {
            setStage(2); // Move to password entry stage
        } else {
            try {
                const { data } = await axios.post(`${urlServerAuth}/login`, { username, password });
                login(data); // Update AuthContext state
                navigate('/'); // Navigate to homepage after successful login
            } catch (error) {
                console.error("Login Error:", error);
            }
            console.log('Login attempt with', username, password);
        }
    };

    const navigateToSignUp = () => {
        navigate('/signup');
    };

    const handleBackToUsername = () => {
        setStage(1);
        setPassword(''); // Clear password when going back
    };

    return (
        <div className="login-wrapper">
            <form className={`login-form ${loading ? 'loading' : ''}`} onSubmit={handleSubmit}>
                <h1 className="login-logo">Pure Poker</h1>
                {loading ? (
                    <Loading /> // Replace with your actual loading component
                ) : (
                    <>
                        {stage === 2 && (
                            <div className="username-confirm">
                                <span>Username: {username}</span>
                                <button type="button" className="change-btn" onClick={handleBackToUsername}>
                                    Change
                                </button>
                            </div>
                        )}
                        {stage === 1 ? (
                            <input
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="login-input"
                                autoFocus
                            />
                        ) : (
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="login-input"
                                autoFocus
                            />
                        )}
                        <button type="submit" className="login-btn">
                            {stage === 1 ? 'Next' : 'Login'}
                        </button>
                        <div className="divider">or</div>
                        <button type="button" className="signup-btn" onClick={navigateToSignUp}>Sign Up</button>
                    </>
                )}
            </form>
        </div>
    );
};

export default Login;
