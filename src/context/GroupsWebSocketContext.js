// src/context/GroupsWebSocketContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { groupsWebSocketService } from './GroupsWebSocketService';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

import axios from 'axios';

const GroupsWebSocketContext = createContext();

export const GroupsWebSocketProvider = ({ children }) => {
  const [chatState, setChatState] = useState({
    groupId: null,
    messages: [],
    membersList: [],
    usersConnected: []
  });
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();
  let navigate = useNavigate();

  // Define the URL for your REST API
  const urlGetChatState = "https://pa82k8l663.execute-api.us-east-1.amazonaws.com/dev/getChatState";

  useEffect(() => {
    // Assuming a groupId is stored somewhere, e.g., in local storage or passed through URL parameters
    const groupId = localStorage.getItem('groupId');

    if (groupId) {
      // Fetch the initial chat state from your REST API
      setLoading(true);
      axios.get(`${urlGetChatState}?groupId=${groupId}`).then(response => {
        const { data } = response;
        console.log('Chat state fetched:', data);
        // Assuming the response data has the structure { messages, members, usersConnected }
        setChatState({
          groupId,
          groupName: data.groupName,
          messages: data.messages || [],
          membersList: data.members || [],
          usersConnected: data.usersConnected || []
        },  { withCredentials: false });
        setLoading(false);
      }).catch(error => {
        alert('Failed to fetch chat state:', error);
        setLoading(false);
      });

      if (!groupsWebSocketService.ws) {
        groupsWebSocketService.connect(groupId, user.username);
      }
    }

    const handleMessage = (data) => {
        switch (data.action) {
          case 'userJoined':
            setChatState(prevState => ({
              ...prevState,
              usersConnected: [...prevState.usersConnected, data.userId]
            }));
            console.log(data.message);
            break;
          case 'userLeft':
            setChatState(prevState => ({
              ...prevState,
              usersConnected: prevState.usersConnected.filter(userId => userId !== data.userId)
            }));
            console.log(data.message);
            break;
          case 'messageReceived':
            setChatState(prevState => ({
              ...prevState,
              messages: data.messages
            }));
            break;
          default:
            console.log('Unhandled message action:', data.action);
        }
      };

    groupsWebSocketService.addMessageListener(handleMessage);

    return () => {
        if (groupsWebSocketService.ws && groupsWebSocketService.ws.readyState === WebSocket.OPEN) {
            groupsWebSocketService.disconnect();
            groupsWebSocketService.removeMessageListener(handleMessage);
        }
    };
  }, [user.username]);

  const sendChatMessage = (groupId, userId, message) => {
      groupsWebSocketService.sendMessage('sendChatMessage', { groupId, userId, message });
  };

  const joinChat = (groupId, userId) => {
      groupsWebSocketService.sendMessage('joinChat', { groupId, userId });
  };

  const leaveChat = (groupId, userId) => {
      groupsWebSocketService.sendMessage('leaveChat', { groupId: groupId, userId: userId });
  };

  const leaveChatSafely = async (groupId, userId) => {
    if (groupsWebSocketService.isConnected() && !groupsWebSocketService.isLeavingChat) {
      groupsWebSocketService.isLeavingChat = true; // Prevent multiple leaveChat calls
      leaveChat(groupId, userId);
      groupsWebSocketService.isLeavingChat = false;
      navigate('/groups');
    }
  };

  return (
      <GroupsWebSocketContext.Provider value={{ chatState, sendChatMessage, joinChat, leaveChat, leaveChatSafely, loading }}>
          {children}
      </GroupsWebSocketContext.Provider>
  );
};

export const useGroupsWebSocket = () => useContext(GroupsWebSocketContext);
