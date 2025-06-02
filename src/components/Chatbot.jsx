import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import { FaRobot, FaTimes } from 'react-icons/fa';
import useChatbot from '../hooks/useChatbot';
import ChatMessage from './chatbot/ChatMessage';
import QuickOptions from './chatbot/QuickOptions';
import ChatInput from './chatbot/ChatInput';
import '../styles/Chatbot.css';

const Chatbot = () => {
    const {
        show,
        messages,
        inputMessage,
        messagesEndRef,
        opcionesRapidas,
        opcionesAdicionales,
        mostrarMasOpciones,
        isLoading,
        handleClose,
        handleShow,
        handleSendMessage,
        setInputMessage,
        toggleMasOpciones,
        appointmentError
    } = useChatbot();

    const handleOptionClick = (option) => {
        if (option && option.text) {
            handleSendMessage(option.text);
        }
    };

    return (
        <>
            <Button
                variant="primary"
                className="chatbot-button"
                onClick={handleShow}
            >
                <FaRobot size={24} />
            </Button>

            <Modal
                show={show}
                onHide={handleClose}
                dialogClassName="chatbot-modal"
                contentClassName="chatbot-content"
                centered={false}
                animation={true}
            >
                <Modal.Header className="chatbot-header">
                    <Modal.Title>
                        <FaRobot className="me-2" />
                        Asistente Virtual
                    </Modal.Title>
                    <Button 
                        variant="link" 
                        onClick={handleClose} 
                        className="close-button"
                        aria-label="Cerrar chat"
                    >
                        <FaTimes />
                    </Button>
                </Modal.Header>
                <Modal.Body className="chatbot-body">
                    <div className="messages-container">
                        {messages.length === 0 && (
                            <div className="welcome-message">
                                <h5>¡Bienvenido!</h5>
                                <p>¿En qué puedo ayudarte hoy?</p>
                                <p className="text-muted">Puedes escribir <b>"agendar cita"</b> para iniciar el proceso de agendar una cita médica.</p>
                                <QuickOptions 
                                    options={opcionesRapidas}
                                    additionalOptions={opcionesAdicionales}
                                    mostrarMasOpciones={mostrarMasOpciones}
                                    onSelectOption={handleOptionClick}
                                    onToggleMasOpciones={toggleMasOpciones}
                                />
                            </div>
                        )}
                        {messages.map((message, index) => (
                            <React.Fragment key={message.id || index}>
                                <ChatMessage message={message} />
                                {index === messages.length - 1 && message.sender === 'bot' && (
                                    <div className="quick-options-wrapper">
                                        <QuickOptions 
                                            options={opcionesRapidas}
                                            additionalOptions={opcionesAdicionales}
                                            mostrarMasOpciones={mostrarMasOpciones}
                                            onSelectOption={handleOptionClick}
                                            onToggleMasOpciones={toggleMasOpciones}
                                        />
                                    </div>
                                )}
                            </React.Fragment>
                        ))}
                        {appointmentError && (
                            <div className="chatbot-error-message text-danger mt-2">
                                {appointmentError}
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </Modal.Body>
                <Modal.Footer className="chatbot-footer">
                    <ChatInput
                        value={inputMessage}
                        onChange={setInputMessage}
                        onSubmit={handleSendMessage}
                        isLoading={isLoading}
                    />
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default Chatbot; 