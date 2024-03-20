import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './GroupsPage.css'; // Ensure you have this CSS file for styling

const urlServer = "https://pa82k8l663.execute-api.us-east-1.amazonaws.com/dev"; // Replace with your actual REST API URL

const GroupsPage = () => {
  const [groupId, setGroupId] = useState('');
  const [userGroups, setUserGroups] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [maxMembers, setMaxMembers] = useState('');

  const { user } = useAuth();

  let navigate = useNavigate();

  useEffect(() => {
    const userId = user.username;
    fetchUserGroups(userId);
  }, []);

  const fetchUserGroups = async (userId) => {
    try {
      const response = await axios.get(`${urlServer}/getUserGroups?userId=${userId}`);
      setUserGroups(response.data);
    } catch (error) {
      console.error('Error fetching user groups:', error);
    }
  };

  const handleJoinGroup = async () => {
    try {
      const response = await axios.post(`${urlServer}/joinGroup`, { groupId, userId: user.username });
      if (response.status === 200) {
        localStorage.setItem('groupId', groupId);
        navigate(`/chat/${groupId}`); // Assume this is your route for the chat page
      }
    } catch (error) {
      console.error('Error joining group:', error);
      // Handle error (e.g., show an error message)
    }
  };

  const handleCreateGroup = async () => {
    try {
      const response = await axios.post(`${urlServer}/createGroup`, { 
        groupName, // Changed from groupId to groupName
        maxMembers: parseInt(maxMembers, 10), // Ensure maxMembers is sent as a number
        creatorId: user.username
      });
      if (response.status === 200 && response.data.groupId) {
        localStorage.setItem('groupId', response.data.groupId);
        navigate(`/chat/${response.data.groupId}`); // Navigate to the chat page for the new group
      }
    } catch (error) {
      console.error('Error creating group:', error.response?.data?.message || error.message);
      // Handle error (e.g., show an error message)
    }
  };

  return (
    <div className="groups-page-container">
      <h1 className="groups-page-title">Your Groups</h1>
      {userGroups.map((group) => (
        <div key={group.groupId} className="group-item">
        {group.groupName} - 
        <button onClick={() => {
          localStorage.setItem('groupId', group.groupId); // Set groupId in localStorage
          navigate(`/chat/${group.groupId}`); // Navigate to the chat page
        }}>Join Chat</button>
      </div>
      ))}
      <input
        className="group-id-input"
        type="text"
        placeholder="Enter Group ID"
        value={groupId}
        onChange={(e) => setGroupId(e.target.value)}
      />
      <button className="join-group-button" onClick={handleJoinGroup}>Join Group</button>
      <button className="toggle-create-form-button" onClick={() => setShowCreateForm(!showCreateForm)}>
        {showCreateForm ? "Cancel" : "Create Group"}
      </button>
      {showCreateForm && (
        <div className="create-group-form">
          <input
            className="group-name-input"
            type="text"
            placeholder="Group Name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
          <input
            className="max-members-input"
            type="number"
            placeholder="Max Members"
            value={maxMembers}
            onChange={(e) => setMaxMembers(e.target.value)}
          />
          <button className="create-group-button" onClick={handleCreateGroup}>Create</button>
        </div>
      )}
    </div>
  );
};

export default GroupsPage;
