import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import "./App.css";

import NavigationMenu from './components/NavigationMenu';
import CommunityPage from './pages/CommunityPage';
import GroupsPage from './pages/GroupsPage';
import ProfilePage from './pages/ProfilePage';
import PokerGamePage from './pages/PokerGamePage';
import DetailedPostView from './pages/DetailedPostView';
import PostFeed from './components/PostFeed';

export const urlServer = "http://127.0.0.1:8012";

function App() {
    return (
        <Router>
          <div className="app-container">
            <NavigationMenu />
              <Routes>
                  <Route path="/" element={<CommunityPage />}>
                    <Route index element={<PostFeed />} />
                    <Route path="post/:postId" element={<DetailedPostView />} />
                  </Route>
                  <Route path="/groups" element={<GroupsPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/poker-game" element={<PokerGamePage />} />
                  <Route path="/post/:postId" element={<DetailedPostView />} />
              </Routes>
          </div>
        </Router>
    );
}

export default App;
