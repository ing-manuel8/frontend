import React from 'react';
import { FaHospital, FaUserMd, FaStethoscope, FaCalendarAlt, FaClock, FaAmbulance } from 'react-icons/fa';

const QuickOptions = ({ options, additionalOptions, onSelectOption, mostrarMasOpciones, onToggleMasOpciones }) => {
    const iconMap = {
        'departments': <FaHospital className="me-2" />,
        'specialties': <FaStethoscope className="me-2" />,
        'doctors': <FaUserMd className="me-2" />,
        'appointments': <FaCalendarAlt className="me-2" />,
        'hours': <FaClock className="me-2" />,
        'emergency': <FaAmbulance className="me-2" />
    };

    // Función para obtener el icono basado en el texto de la pregunta
    const getIconForQuestion = (question) => {
        if (!question) return <FaUserMd className="me-2" />;
        
        const lowerQuestion = question.toLowerCase();
        if (lowerQuestion.includes('departamento')) return iconMap.departments;
        if (lowerQuestion.includes('especialidad')) return iconMap.specialties;
        if (lowerQuestion.includes('doctor')) return iconMap.doctors;
        if (lowerQuestion.includes('cita')) return iconMap.appointments;
        if (lowerQuestion.includes('horario')) return iconMap.hours;
        if (lowerQuestion.includes('emergencia')) return iconMap.emergency;
        return <FaUserMd className="me-2" />;
    };

    const handleOptionClick = (option) => {
        if (option && onSelectOption) {
            // Asegurarse de que se pase el texto de la opción
            const optionToSend = {
                text: option.text || option.question,
                intent: option.intent
            };
            onSelectOption(optionToSend);
        }
    };

    if (!options || options.length === 0) {
        return null;
    }

    return (
        <div className="quick-options-container">
            <div className="quick-options-grid">
                {options.map((option, index) => (
                    <button
                        key={index}
                        className="quick-option-btn"
                        onClick={() => handleOptionClick(option)}
                        type="button"
                    >
                        {getIconForQuestion(option.text || option.question)}
                        {option.text || option.question}
                    </button>
                ))}
            </div>
            
            {mostrarMasOpciones && additionalOptions && additionalOptions.length > 0 && (
                <div className="additional-options">
                    {additionalOptions.map((option, index) => (
                        <button
                            key={index}
                            className="quick-option-btn"
                            onClick={() => handleOptionClick(option)}
                            type="button"
                        >
                            {getIconForQuestion(option.text || option.question)}
                            {option.text || option.question}
                        </button>
                    ))}
                </div>
            )}
            
            {additionalOptions && additionalOptions.length > 0 && (
                <button 
                    className="more-options-btn"
                    onClick={onToggleMasOpciones}
                    type="button"
                >
                    {mostrarMasOpciones ? 'Ver menos opciones' : 'Ver más opciones'}
                </button>
            )}
        </div>
    );
};

export default QuickOptions; 