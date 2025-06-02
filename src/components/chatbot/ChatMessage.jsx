import React from 'react';

const ChatMessage = ({ message }) => {
    return (
        <div className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}>
            <div className="message-content">
                {message.text.split('\n').map((line, i) => (
                    <p key={i} className="mb-1">{line}</p>
                ))}
            </div>
            <div className="message-timestamp">
                {message.timestamp}
            </div>
        </div>
    );
};

export default ChatMessage; 