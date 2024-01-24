import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import "./App.css";

import NavigationMenu from './components/NavigationMenu';
import CommunityPage from './pages/CommunityPage';
import GroupsPage from './pages/GroupsPage';
import ProfilePage from './pages/ProfilePage';
import PokerGamePage from './pages/PokerGamePage';

export const urlServer = "http://127.0.0.1:8012";

function App() {
    return (
        <Router>
          <div className="app-container">
            <NavigationMenu />
              <Routes>
                  <Route path="/" element={<CommunityPage />} />
                  <Route path="/groups" element={<GroupsPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/poker-game" element={<PokerGamePage />} />
              </Routes>
          </div>
        </Router>
    );
}

export default App;