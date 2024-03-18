// src/pages/ChatPage.js
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { webSocketService } from '../../context/WebSocketService';
import './ChatPage.css'; // Create and import corresponding CSS for ChatPage

const ChatPage = () => {
    const { user } = useAuth();
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);

    const messagesRef = useRef(messages); // Initialize the ref with the messages state


    // Handle incoming WebSocket messages
    const handleIncomingMessage = (incomingMessage) => {
        // Directly use messagesRef.current to access the latest state
        if (!messagesRef.current.some(msg => msg.id === incomingMessage.id)) {
            setMessages(prevMessages => [...prevMessages, incomingMessage]);
        }
    };
    
    
    useEffect(() => {
        messagesRef.current = messages;
    }, [messages]);
    
    useEffect(() => {
        webSocketService.connect(handleIncomingMessage);

        // Disconnect on cleanup
        return () => {
            webSocketService.disconnect();
        };
    }, []);

    const sendMessage = () => {
        if (input.trim()) {
            const uniqueId = Date.now(); // Using the current timestamp as a unique identifier
            const messageToSend = {
                id: uniqueId, // Include the unique identifier
                message: input,
                author: user.username,
                isSentByMe: true,
            };
            
            webSocketService.sendMessage(JSON.stringify(messageToSend));
            console.log("SENT!");
            setMessages(messages => [...messages, messageToSend]);
            console.log(messages)
            setInput('');
        }
    };
    

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) { // Prevent sending on Shift+Enter
            e.preventDefault(); // Prevent the default action to avoid line break in input
            sendMessage();
        }
    };

    return (
        <div className="chat-page">
            <div className="messages-display">
                {messages.map((msg, index) => (
                    <div 
                        key={index} 
                        className="message"
                    >
                        <span className="author">{msg.author}: </span>{msg.message}
                    </div>
                ))}
            </div>
            <div className="message-form">
                <input
                    type="text"
                    className="message-input"
                    placeholder="Type a message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                />
                <button onClick={sendMessage} className="send-button">Send</button>
            </div>
        </div>
    );
};

export default ChatPage;
