import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import "./App.css";
import { AuthProvider } from './context/AuthContext';
import CommunityPage from './pages/CommunityPage';
import GroupsPage from './pages/GroupsPage';
import ProfilePage from './pages/ProfilePage';
import PokerGamePage from './pages/PokerGamePage';
import DetailedPostView from './pages/DetailedPostView';
import PostFeed from './components/PostFeed';
import Login from './components/Login'; 
import SignUp from './components/SignUp';

import { useAuth } from './context/AuthContext';

// export const urlServer = "http://127.0.0.1:8012";
export const urlServer = "https://community-api.purepoker.world";
// export const urlServerAuth = "http://127.0.0.1:8013";
export const urlServerAuth = "https://authentication-api.purepoker.world";

const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();
    return user ? children : <Navigate to="/login" />;
    // return children;
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="app-container">
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<SignUp />} />
                        <Route path="/" element={<ProtectedRoute><CommunityPage /></ProtectedRoute>}>
                            <Route index element={<PostFeed />} />
                            <Route path="post/:postId" element={<DetailedPostView />} />
                        </Route>
                        <Route path="/groups" element={<ProtectedRoute><GroupsPage /></ProtectedRoute>} />
                        <Route path="/profile" element={<ProfilePage />} /> {/*TODO: Add protected route!!!! */}
                        <Route path="/poker-game" element={<ProtectedRoute><PokerGamePage /></ProtectedRoute>} />
                        <Route path="/post/:postId" element={<ProtectedRoute><DetailedPostView /></ProtectedRoute>} />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;


