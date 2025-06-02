import { useState, useRef, useEffect } from 'react';
import { appointmentSteps, defaultAppointment } from '../utils/appointmentFlow';

const useChatbot = () => {
    const [show, setShow] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [mostrarMasOpciones, setMostrarMasOpciones] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [sugerencias, setSugerencias] = useState([]);
    const messagesEndRef = useRef(null);
    const [appointmentFlow, setAppointmentFlow] = useState({ active: false, step: 0, data: { ...defaultAppointment } });
    const [appointmentError, setAppointmentError] = useState('');
    const [doctorList, setDoctorList] = useState([]);
    const [awaitingDoctorSelection, setAwaitingDoctorSelection] = useState(false);

    const opcionesRapidas = [
        {
            text: "🏥 ¿Qué departamentos tienen disponibles?",
            intent: "departments"
        },
        {
            text: "👨‍⚕️ ¿Cuáles son las especialidades médicas?",
            intent: "specialties"
        },
        {
            text: "👤 ¿Quiénes son los doctores disponibles?",
            intent: "doctors"
        }
    ];

    const opcionesAdicionales = [
        {
            text: "📅 ¿Cómo agendo una cita?",
            intent: "appointments"
        },
        {
            text: "⏰ ¿Cuál es el horario de atención?",
            intent: "hours"
        },
        {
            text: "🚑 ¿Qué hago en caso de emergencia?",
            intent: "emergency"
        }
    ];

    const handleClose = () => {
        setShow(false);
        setMostrarMasOpciones(false);
        setSugerencias([]);
    };
    
    const handleShow = () => {
        setShow(true);
        if (messages.length === 0) {
            setMessages([{
                id: 1,
                text: "¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?",
                sender: 'bot'
            }]);
            setSugerencias(opcionesRapidas);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Efecto para el scroll automático
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const startAppointmentFlow = () => {
        setAppointmentFlow({ active: true, step: 0, data: { ...defaultAppointment } });
        setMessages(prev => [...prev, {
            id: prev.length + 1,
            text: '¡Vamos a agendar una cita! Puedes escribir "cancelar" en cualquier momento para salir.',
            sender: 'bot'
        }, {
            id: prev.length + 2,
            text: appointmentSteps[0].question,
            sender: 'bot'
        }]);
        setSugerencias([]);
    };

    // Utilidad para extraer el nombre del doctor de un mensaje tipo "agendar cita con Dr(a). X"
    const extractDoctorFromMessage = (message, doctors) => {
        if (!doctors || doctors.length === 0) return null;
        const lowerMsg = message.toLowerCase();
        for (const doc of doctors) {
            if (
                lowerMsg.includes(doc.username.toLowerCase()) ||
                lowerMsg.includes((doc.specialty || '').toLowerCase())
            ) {
                return doc;
            }
        }
        return null;
    };

    const handleAppointmentFlow = async (message) => {
        if (message.trim().toLowerCase() === 'cancelar') {
            setAppointmentFlow({ active: false, step: 0, data: { ...defaultAppointment } });
            setAppointmentError('');
            setDoctorList([]);
            setAwaitingDoctorSelection(false);
            setMessages(prev => [...prev, {
                id: prev.length + 1,
                text: 'El proceso de agendar cita ha sido cancelado.',
                sender: 'bot'
            }]);
            setSugerencias(opcionesRapidas);
            return;
        }
        const stepObj = appointmentSteps[appointmentFlow.step];
        if (!stepObj) return;

        // Paso especial: Selección de doctor
        if (stepObj.key === 'doctorUsername') {
            // Si ya hay doctor preseleccionado, saltar este paso
            if (appointmentFlow.data.doctorUsername) {
                // Avanzar al siguiente paso
                if (appointmentFlow.step < appointmentSteps.length - 1) {
                    setAppointmentFlow({ active: true, step: appointmentFlow.step + 1, data: appointmentFlow.data });
                    setMessages(prev => [...prev, {
                        id: prev.length + 1,
                        text: `Doctor seleccionado: ${appointmentFlow.data.doctorUsername}`,
                        sender: 'bot'
                    }, {
                        id: prev.length + 2,
                        text: appointmentSteps[appointmentFlow.step + 1].question,
                        sender: 'bot'
                    }]);
                } else {
                    setAppointmentFlow({ active: false, step: 0, data: { ...defaultAppointment } });
                }
                return;
            }
            // Siempre mostrar la lista numerada de doctores con la instrucción
            let doctors = doctorList;
            if (!awaitingDoctorSelection) {
                if (!doctors || doctors.length === 0) {
                    setIsLoading(true);
                    try {
                        const token = localStorage.getItem('token');
                        const response = await fetch('http://localhost:5000/api/users', {
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json',
                            },
                        });
                        const data = await response.json();
                        if (data.success) {
                            doctors = data.data.filter(user => user.role === 'Doctor');
                            setDoctorList(doctors);
                        } else {
                            setAppointmentError('No se pudieron obtener los doctores.');
                            setIsLoading(false);
                            return;
                        }
                    } catch (error) {
                        setAppointmentError('Error al obtener la lista de doctores.');
                        setIsLoading(false);
                        return;
                    }
                    setIsLoading(false);
                }
                setAwaitingDoctorSelection(true);
                setMessages(prev => [...prev, {
                    id: prev.length + 1,
                    text: doctors.map((doc, idx) => `${idx + 1}. ${doc.username} (${doc.specialty || 'Sin especialidad'})`).join('\n'),
                    sender: 'bot'
                }]);
                return;
            } else {
                // Esperando selección del usuario
                const selectedIdx = parseInt(message.trim(), 10) - 1;
                if (!isNaN(selectedIdx) && doctorList[selectedIdx]) {
                    const selectedDoctor = doctorList[selectedIdx];
                    setAppointmentError('');
                    setDoctorList([]);
                    setAwaitingDoctorSelection(false);
                    const newData = { ...appointmentFlow.data, doctorUsername: selectedDoctor.username };
                    // Avanzar al siguiente paso
                    if (appointmentFlow.step < appointmentSteps.length - 1) {
                        setAppointmentFlow({ active: true, step: appointmentFlow.step + 1, data: newData });
                        setMessages(prev => [...prev, {
                            id: prev.length + 1,
                            text: `Doctor seleccionado: ${selectedDoctor.username}`,
                            sender: 'bot'
                        }, {
                            id: prev.length + 2,
                            text: appointmentSteps[appointmentFlow.step + 1].question,
                            sender: 'bot'
                        }]);
                    } else {
                        setAppointmentFlow({ active: false, step: 0, data: { ...defaultAppointment } });
                    }
                    return;
                } else {
                    setAppointmentError('Por favor, selecciona un número válido de la lista.');
                    setMessages(prev => [...prev, {
                        id: prev.length + 1,
                        text: 'Por favor, selecciona un número válido de la lista:',
                        sender: 'bot'
                    }, {
                        id: prev.length + 2,
                        text: doctorList.map((doc, idx) => `${idx + 1}. ${doc.username} (${doc.specialty || 'Sin especialidad'})`).join('\n'),
                        sender: 'bot'
                    }]);
                    return;
                }
            }
        }
        // Fin paso especial doctor

        // Validación normal para otros pasos
        // Solo mostrar la pregunta textual si NO es el paso de doctor
        if (!stepObj.validate(message)) {
            setAppointmentError(stepObj.error);
            if (stepObj.key !== 'doctorUsername') {
                setMessages(prev => [...prev, {
                    id: prev.length + 1,
                    text: stepObj.error,
                    sender: 'bot'
                }]);
                setMessages(prev => [...prev, {
                    id: prev.length + 2,
                    text: stepObj.question,
                    sender: 'bot'
                }]);
            }
            return;
        }
        setAppointmentError('');
        const newData = { ...appointmentFlow.data, [stepObj.key]: message };
        if (appointmentFlow.step < appointmentSteps.length - 1) {
            setAppointmentFlow({ active: true, step: appointmentFlow.step + 1, data: newData });
            setMessages(prev => [...prev, {
                id: prev.length + 1,
                text: appointmentSteps[appointmentFlow.step + 1].question,
                sender: 'bot'
            }]);
        } else {
            setAppointmentFlow({ active: false, step: 0, data: { ...defaultAppointment } });
            setIsLoading(true);
            setMessages(prev => [...prev, {
                id: prev.length + 1,
                text: 'Procesando tu cita... ⏳',
                sender: 'bot'
            }]);
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:5000/api/citas', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(newData)
                });
                const data = await response.json();
                if (data.success) {
                    setMessages(prev => [...prev, {
                        id: prev.length + 1,
                        text: '¡Cita agendada exitosamente! 🎉',
                        sender: 'bot'
                    }]);
                } else {
                    setMessages(prev => [...prev, {
                        id: prev.length + 1,
                        text: data.message || 'Ocurrió un error al agendar la cita.',
                        sender: 'bot'
                    }]);
                }
            } catch (error) {
                setMessages(prev => [...prev, {
                    id: prev.length + 1,
                    text: 'Ocurrió un error al conectar con el servidor.',
                    sender: 'bot'
                }]);
            } finally {
                setIsLoading(false);
                setSugerencias(opcionesRapidas);
            }
        }
    };

    const handleSendMessage = async (message) => {
        if (!message || typeof message !== 'string' || !message.trim() || isLoading) {
            return;
        }
        if (appointmentFlow.active) {
            setMessages(prev => [...prev, {
                id: prev.length + 1,
                text: message,
                sender: 'user'
            }]);
            await handleAppointmentFlow(message);
            setInputMessage('');
            return;
        }
        // Detectar intención de agendar cita y posible doctor sugerido
        if (message.toLowerCase().includes('agendar') && message.toLowerCase().includes('cita')) {
            setMessages(prev => [...prev, {
                id: prev.length + 1,
                text: message,
                sender: 'user'
            }]);
            // Obtener lista de doctores para buscar coincidencia
            setIsLoading(true);
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:5000/api/users', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();
                if (data.success) {
                    const doctors = data.data.filter(user => user.role === 'Doctor');
                    // Buscar si el mensaje contiene el nombre de algún doctor
                    const suggestedDoctor = extractDoctorFromMessage(message, doctors);
                    if (suggestedDoctor) {
                        // Iniciar flujo con doctor preseleccionado
                        setAppointmentFlow({ active: true, step: 0, data: { ...defaultAppointment, doctorUsername: suggestedDoctor.username } });
                        setMessages(prev => [...prev, {
                            id: prev.length + 2,
                            text: '¡Vamos a agendar una cita! Puedes escribir "cancelar" en cualquier momento para salir.',
                            sender: 'bot'
                        }, {
                            id: prev.length + 3,
                            text: appointmentSteps[0].question,
                            sender: 'bot'
                        }]);
                        setDoctorList([]);
                        setAwaitingDoctorSelection(false);
                        setIsLoading(false);
                        return;
                    } else {
                        // Iniciar flujo normal, pero NO mostrar pregunta textual de doctor, solo la lista cuando toque
                        setAppointmentFlow({ active: true, step: 0, data: { ...defaultAppointment } });
                        setMessages(prev => [...prev, {
                            id: prev.length + 2,
                            text: '¡Vamos a agendar una cita! Puedes escribir "cancelar" en cualquier momento para salir.',
                            sender: 'bot'
                        }, {
                            id: prev.length + 3,
                            text: appointmentSteps[0].question,
                            sender: 'bot'
                        }]);
                        setDoctorList(doctors); // Guardar para uso inmediato en el flujo
                        setAwaitingDoctorSelection(false);
                        setIsLoading(false);
                        return;
                    }
                } else {
                    setIsLoading(false);
                    setMessages(prev => [...prev, {
                        id: prev.length + 2,
                        text: 'No se pudieron obtener los doctores para agendar la cita.',
                        sender: 'bot'
                    }]);
                    return;
                }
            } catch (error) {
                setIsLoading(false);
                setMessages(prev => [...prev, {
                    id: prev.length + 2,
                    text: 'Error al obtener la lista de doctores.',
                    sender: 'bot'
                }]);
                return;
            }
        }
        setIsLoading(true);

        const userMessage = {
            id: messages.length + 1,
            text: message,
            sender: 'user'
        };
        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/chatbot/message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ message })
            });

            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }

            const data = await response.json();
            
            if (data.success) {
                if (Array.isArray(data.data.responses)) {
                    data.data.responses.forEach((responseText, index) => {
                        const botMessage = {
                            id: messages.length + 2 + index,
                            text: responseText,
                            sender: 'bot'
                        };
                        setMessages(prev => [...prev, botMessage]);
                    });
                } else {
                    const botMessage = {
                        id: messages.length + 2,
                        text: data.data.response,
                        sender: 'bot'
                    };
                    setMessages(prev => [...prev, botMessage]);
                }

                if (data.data.suggestions && Array.isArray(data.data.suggestions) && data.data.suggestions.length > 0) {
                    setSugerencias(data.data.suggestions);
                } else {
                    setSugerencias(opcionesRapidas);
                }
                setMostrarMasOpciones(false);
            } else {
                throw new Error(data.message || 'Error al procesar el mensaje');
            }
        } catch (error) {
            console.error('Error:', error);
            const errorMessage = {
                id: messages.length + 2,
                text: 'Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo.',
                sender: 'bot'
            };
            setMessages(prev => [...prev, errorMessage]);
            setSugerencias(opcionesRapidas);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleMasOpciones = () => {
        setMostrarMasOpciones(!mostrarMasOpciones);
    };

    return {
        show,
        messages,
        inputMessage,
        messagesEndRef,
        opcionesRapidas: sugerencias.length > 0 ? sugerencias : opcionesRapidas,
        opcionesAdicionales,
        mostrarMasOpciones,
        isLoading,
        handleClose,
        handleShow,
        handleSendMessage,
        setInputMessage,
        toggleMasOpciones,
        appointmentFlow,
        appointmentError
    };
};

export default useChatbot; 