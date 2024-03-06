// src/components/SignUp.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { urlServerAuth } from '../App';
import './SignUp.css';
import Loading from './Loading';

const SignUp = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const [loading, setLoading] = useState(false)
;
    axios.defaults.withCredentials = true;

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        try {
            setLoading(true);
            const { data } = await axios.post(`${urlServerAuth}/signup`, { username, email, password }, { withCredentials: true });
            login(data); // Update AuthContext state and login the user
            navigate('/'); // Redirect to home page after signup
        } catch (error) {
            setLoading(false);
            console.error("Signup Error:", error.response.data);
            setError(error.response.data.message || 'An error occurred during signup.');
        }
    };

    if (loading) { 
        return <Loading/>;
    }

    return (
        <div className="signup-container">
            <h2>Pure Poker</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                {error && <div className="error-message">{error}</div>}
                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
};

export default SignUp;