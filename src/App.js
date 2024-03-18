import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import "./App.css";
import { AuthProvider } from './context/AuthContext';
import CommunityPage from './pages/CommunityPage/CommunityPage';
import GroupsPage from './pages/GroupsPage/GroupsPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import PokerLobby from './pages/PokerPage/PokerLobby';
import DetailedPostView from './pages/CommunityPage/DetailedPostView';
import PostFeed from './components/CommunityComponents/PostFeed';
import Login from './components/Login'; 
import SignUp from './components/SignUp';
import PokerGame from './pages/PokerPage/PokerGame';
import { PokerWebSocketProvider } from './context/PokerWebSocketContext';
import { useAuth } from './context/AuthContext';
import Loading from './components/Loading';
import ChatPage from './pages/GroupsPage/ChatPage';

// export const urlServer = "http://127.0.0.1:8012";
export const urlServer = "https://community-api.purepoker.world";
// export const urlServerAuth = "http://127.0.0.1:8013";
export const urlServerAuth = "https://authentication-api.purepoker.world";


const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useAuth();
  if (isLoading) {
    return <Loading />
  }
  if (!user) {
    return <Navigate to="/login" />;
  }
  return children
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
                            <Route path="/groups" element={<GroupsPage />} />                                                   {/* TODO: Add the protectedRoute back */}
                            <Route path="/chat" element={<ChatPage />} />
                            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                            <Route path="/poker-game" element={<PokerWebSocketProvider><PokerLobby /></PokerWebSocketProvider>} />  
                            <Route path="/poker-game/:gameId" element={<PokerWebSocketProvider><PokerGame /></PokerWebSocketProvider>} />                                        {/* TODO: Add the protectedRoute back */}
                            <Route path="/post/:postId" element={<ProtectedRoute><DetailedPostView /></ProtectedRoute>} />
                        </Routes>
                    </div>
                </Router>
        </AuthProvider>
    );
}

export default App;