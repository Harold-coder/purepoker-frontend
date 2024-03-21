import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Loading from '../../components/Loading';
import { useAuth } from '../../context/AuthContext';
import { useGroupsWebSocket } from '../../context/GroupsWebSocketContext'; 
import { groupsWebSocketService} from '../../context/GroupsWebSocketService';
import './ChatPage.css';

const ChatPage = () => {
    const [newMessage, setNewMessage] = useState('');
    const { groupId } = useParams();
    const { chatState, sendChatMessage, leaveChatSafely, loading } = useGroupsWebSocket();

    const { user } = useAuth();
    const userId = user.username;

    useEffect(() => {
        const userId = user.username;
      
        // Ensure the user is in the chat on component mount
        if (!groupsWebSocketService.isConnected() && groupId && userId) {
          groupsWebSocketService.connect(groupId, userId);
        }

        // Handle the browser's back button or navigation
        const handleBeforeUnload = (e) => {
            leaveChatSafely(groupId, userId); // Ensure leaveChat is called before navigating away
            // Prevent the default unload behavior to ensure async leaveChat finishes
            e.preventDefault();
            e.returnValue = '';
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        
        console.log(chatState);
      
        return () => {
          // Cleanup: remove the event listener and leave chat when the component unmounts
          window.removeEventListener('beforeunload', handleBeforeUnload);
        };
      }, [user.username, groupId, leaveChatSafely]);

    const handleSendMessage = () => {
        let message = newMessage;
    
        if (message.trim() !== '') {
            console.log("Sending message:", { groupId, userId: userId, message: message }); // Debugging log
            sendChatMessage(
                groupId,
                userId,
                message
            );
            setNewMessage('');
        }
    };

    // Function to handle leaving chat and navigating back to the groups page
    const handleLeaveChat = () => {
        if (groupsWebSocketService.isConnected()) {
            leaveChatSafely(groupId, user.username);
        }
    };

    if (loading) {
        return <Loading />;
    }
    
    return (
        <div className="chat-container">
            <button className="homeButton" onClick={handleLeaveChat} title="Go to home">
                <i className="fas fa-home"></i>
            </button>
            <h1 className='chat-title'>{chatState.groupName}</h1>
            <div className="messages-container">
                {chatState.messages.map((msg, index) => (
                    <div key={index} className="message">
                        <span className="message-author">{msg.userId}</span>
                        <span className="message-timestamp">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                        <p className="message-content">{msg.message}</p>
                    </div>
                ))}
            </div>
            <div className="message-input-container">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message here..."
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button onClick={handleSendMessage}>Send</button>
            </div>
        </div>
    );
};

export default ChatPage;
