// Utilidades para el flujo conversacional de agendar cita en el chatbot

export const appointmentSteps = [
  {
    key: 'patientName',
    question: '¿Cuál es el nombre del paciente?',
    validate: (value) => value && value.trim().length > 0,
    error: 'Por favor, ingresa el nombre del paciente.'
  },
  {
    key: 'doctorUsername',
    question: '¿Con qué doctor deseas agendar la cita? (Escribe el nombre de usuario del doctor)',
    validate: (value) => value && value.trim().length > 0,
    error: 'Por favor, ingresa el nombre de usuario del doctor.'
  },
  {
    key: 'department',
    question: '¿A qué departamento pertenece la cita? (Ejemplo: Medicina General, Pediatría, etc.)',
    validate: (value) => value && value.trim().length > 0,
    error: 'Por favor, ingresa el departamento.'
  },
  {
    key: 'date',
    question: '¿Para qué fecha deseas la cita? (Formato: AAAA-MM-DD)',
    validate: (value) => /^\d{4}-\d{2}-\d{2}$/.test(value),
    error: 'Por favor, ingresa una fecha válida en formato AAAA-MM-DD.'
  },
  {
    key: 'time',
    question: '¿A qué hora? (Formato: HH:MM, 24 horas)',
    validate: (value) => /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value),
    error: 'Por favor, ingresa una hora válida en formato HH:MM.'
  },
  {
    key: 'consultationType',
    question: '¿Qué tipo de consulta es? (Primera vez, Control, Urgencia, Seguimiento)',
    validate: (value) => ['Primera vez', 'Control', 'Urgencia', 'Seguimiento'].includes(value),
    error: 'Por favor, elige un tipo válido: Primera vez, Control, Urgencia, Seguimiento.'
  },
  {
    key: 'reason',
    question: '¿Cuál es la razón de la consulta? (mínimo 10 caracteres)',
    validate: (value) => value && value.trim().length >= 10,
    error: 'La razón debe tener al menos 10 caracteres.'
  },
  {
    key: 'notes',
    question: '¿Deseas agregar alguna nota adicional? (Opcional, puedes dejarlo vacío)',
    validate: () => true,
    error: ''
  },
  {
    key: 'duration',
    question: '¿Cuánto tiempo durará la cita? (en minutos, entre 15 y 120)',
    validate: (value) => !isNaN(Number(value)) && Number(value) >= 15 && Number(value) <= 120,
    error: 'La duración debe ser un número entre 15 y 120.'
  },
  {
    key: 'status',
    question: '¿Cuál es el estado de la cita? (pendiente, confirmada, cancelada, completada)',
    validate: (value) => ['pendiente', 'confirmada', 'cancelada', 'completada'].includes(value),
    error: 'El estado debe ser: pendiente, confirmada, cancelada o completada.'
  }
];

export const defaultAppointment = {
  patientName: '',
  doctorUsername: '',
  department: '',
  date: '',
  time: '',
  consultationType: '',
  reason: '',
  notes: '',
  duration: 30,
  status: 'pendiente'
}; 