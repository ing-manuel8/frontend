import React from 'react';
import { Form, Button } from 'react-bootstrap';
import { FaPaperPlane } from 'react-icons/fa';

const ChatInput = ({ value, onChange, onSubmit, isLoading }) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isLoading) {
            onSubmit(value);
        }
    };

    return (
        <Form onSubmit={handleSubmit} className="d-flex align-items-center">
            <Form.Control
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Escribe tu mensaje..."
                disabled={isLoading}
            />
            <Button 
                type="submit" 
                disabled={isLoading || !value.trim()}
                className="ms-2"
            >
                <FaPaperPlane />
            </Button>
        </Form>
    );
};

export default ChatInput; 