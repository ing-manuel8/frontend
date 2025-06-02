import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Table, Card, Badge } from 'react-bootstrap';
import {
	FaCalendarPlus,
	FaEdit,
	FaTrash,
	FaUserMd,
	FaUserInjured,
	FaArrowLeft
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';

function Citas() {
	const { user } = useAuth();
	const [citas, setCitas] = useState([]);
	const [usuarios, setUsuarios] = useState([]);
	const [doctores, setDoctores] = useState([]);
	const navigate = useNavigate();
	const [showModal, setShowModal] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [citaToDelete, setCitaToDelete] = useState(null);
	const [editMode, setEditMode] = useState(false);
	const [currentCita, setCurrentCita] = useState({
		id: '',
		patientName: '',
		patientUsername: '',
		doctor: '',
		doctorUsername: '',
		department: '',
		date: '',
		time: '',
		consultationType: '',
		reason: '',
		notes: '',
		duration: 30,
		status: 'pendiente'
	});

	const getStatusBadgeVariant = (status) => {
		const variants = {
			pendiente: 'warning',
			confirmada: 'success',
			cancelada: 'danger',
			completada: 'info'
		};
		return variants[status] || 'secondary';
	};

	// Modal handlers
	const handleClose = () => {
		setShowModal(false);
		setEditMode(false);
		setCurrentCita({
			id: '',
			patientName: '',
			patientUsername: '',
			doctor: '',
			doctorUsername: '',
			department: '',
			date: '',
			time: '',
			consultationType: '',
			reason: '',
			notes: '',
			duration: 30,
			status: 'pendiente'
		});
	};

	const handleShow = () =>{ 
		setShowModal(true),
		obtenerUsuarios();

	};

	// Obtener usuarios y doctores
	const obtenerUsuarios = async () => {
		try {
			const token = localStorage.getItem('token');
			const response = await fetch('https://server-uj6u.onrender.com/api/users', {
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
			});
			const data = await response.json();
			if (data.success) {
				// Filtrar usuarios por rol
				const pacientes = data.data.filter(user => user.role === 'patient');
				const medicos = data.data.filter(user => user.role === 'Doctor');
				console.log("obtener pacientes y medicos", data)
				setUsuarios(pacientes);
				setDoctores(medicos);
			}
		} catch (error) {
			console.error('Error al obtener usuarios:', error);
		}
	};

	console.log("pacientes", usuarios);
	console.log("medicos", doctores);

	// Fetch citas on component mount
	useEffect(() => {
		obtenerCitas();
		obtenerUsuarios();
	}, []);

	const obtenerCitas = async () => {
		try {
			const token = localStorage.getItem('token');
			const response = await fetch('https://server-uj6u.onrender.com/api/citas', {
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
			});
			const data = await response.json();

			console.log(response)
			if (data.success) {
				setCitas(data.data);
				console.log("citas obtenidas",data.data);
			} else {
				console.error('Error fetching citas:', data.message);
			}
		} catch (error) {
			console.error('Error:', error);
		}
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		if (name === 'patientUsername') {
			setCurrentCita(prev => ({
				...prev,
				patientUsername: value
			}));
		} else if (name === 'doctorUsername') {
			const selectedDoctor = doctores.find(d => d.username === value);
			setCurrentCita(prev => ({
				...prev,
				doctor: selectedDoctor?._id || '',
				doctorUsername: value
			}));
		} else {
			setCurrentCita(prev => ({
				...prev,
				[name]: value.trim()
			}));
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		
		if ( !currentCita.doctorUsername) {
			alert('Por favor, ingrese tanto el paciente como el doctor');
			return;
		}

		try {
			const token = localStorage.getItem('token');
			const url = editMode
				? `https://server-uj6u.onrender.com/api/citas/${currentCita.id}`
				: 'https://server-uj6u.onrender.com/api/citas';

			const citaData = {
				patientName: currentCita.patientUsername.trim(),
				doctorUsername: currentCita.doctorUsername.trim(),
				department: currentCita.department,
				date: currentCita.date,
				time: currentCita.time,
				consultationType: currentCita.consultationType,
				reason: currentCita.reason,
				notes: currentCita.notes || '',
				duration: currentCita.duration,
				status: currentCita.status
			};
            
			console.log('DATOS PARA CREAR NUEVA CITA:', citaData);
			const response = await fetch(url, {
				method: editMode ? 'PUT' : 'POST',
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(citaData),
			});

			const data = await response.json();

			if (data.success) {
				obtenerCitas();
				handleClose();
			} else {
				alert(data.message || 'Error al procesar la solicitud');
			}
		} catch (error) {
			console.error('Error:', error);
			alert('Error al procesar la solicitud');
		}
	};

	const handleDelete = (cita) => {
		setCitaToDelete(cita);
		setShowDeleteModal(true);
	};

	const confirmDelete = async () => {
		try {
			const token = localStorage.getItem('token');
			const response = await fetch(
				`https://server-uj6u.onrender.com/api/citas/${citaToDelete._id}`,
				{
					method: 'DELETE',
					headers: {
						Authorization: `Bearer ${token}`,
						'Content-Type': 'application/json',
					},
				},
			);

			const data = await response.json();

			if (data.success) {
				setCitas(citas.filter((c) => c._id !== citaToDelete._id));
				setShowDeleteModal(false);
				setCitaToDelete(null);
			} else {
				alert(data.message || 'Error al eliminar cita');
			}
		} catch (error) {
			console.error('Error:', error);
			alert('Error al eliminar cita');
		}
	};

	const handleEdit = (cita) => {
		setCurrentCita({
			id: cita._id,
			patientName: cita.patient?.username || cita.patientName || '',
			patientUsername: cita.patient?.username || cita.patientName || '',
			doctor: cita.doctor?._id || '',
			doctorUsername: cita.doctor?.username || '',
			department: cita.department,
			date: cita.date,
			time: cita.time,
			consultationType: cita.consultationType,
			reason: cita.reason,
			notes: cita.notes || '',
			duration: cita.duration,
			status: cita.status
		});
		setEditMode(true);
		setShowModal(true);
	};

	const handleGoBack = () => {
		navigate(-1);
	};

	return (
		<Card className="shadow-sm">
			<Card.Body>
				<div className="d-flex justify-content-between align-items-center mb-4">
					<button className="back-button" onClick={handleGoBack}>
						<FaArrowLeft size={20} />
						<span>Volver</span>
					</button>
					<div>
						<h2 className="mb-1">Gestión de Citas</h2>
						<p className="text-muted mb-0">
							Administra las citas médicas
						</p>
					</div>
					<Button
						variant="primary"
						onClick={handleShow}
						className="d-flex align-items-center gap-2"
					>
						<FaCalendarPlus />
						Nueva Cita
					</Button>
				</div>

				<Table striped bordered hover responsive className="align-middle">
					<thead className="bg-light">
						<tr>
							<th>Paciente</th>
							<th>Doctor</th>
							<th>Departamento</th>
							<th>Fecha y Hora</th>
							<th>Estado</th>
							<th>Acciones</th>
						</tr>
					</thead>
					<tbody>
						{citas.map((cita) => (
							<tr key={cita._id}>
								<td>
									<div className="d-flex align-items-center">
										<FaUserInjured className="me-2 text-primary" />
										<div>
											<div className="fw-bold">
												{cita.patient?.username}
											</div>
										</div>
									</div>
								</td>
								<td>
									<div className="d-flex align-items-center">
										<FaUserMd className="me-2 text-success" />
										<div>{cita.doctor?.username || 'N/A'}</div>
									</div>
								</td>
								<td>{cita.department}</td>
								<td>
									{new Date(cita.date).toLocaleDateString()} {cita.time}
								</td>
								<td>
									<Badge bg={getStatusBadgeVariant(cita.status)}>
										{cita.status}
									</Badge>
								</td>
								<td>
									<Button
										variant="outline-info"
										size="sm"
										className="me-2"
										onClick={() => handleEdit(cita)}
									>
										<FaEdit /> Editar
									</Button>
									<Button
										variant="outline-danger"
										size="sm"
										onClick={() => handleDelete(cita)}
									>
										<FaTrash /> Eliminar
									</Button>
								</td>
							</tr>
						))}
					</tbody>
				</Table>

				{/* Delete Confirmation Modal */}
				<Modal
					show={showDeleteModal}
					onHide={() => setShowDeleteModal(false)}
					centered
				>
					<Modal.Header closeButton>
						<Modal.Title>Confirmar Eliminación</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<p>
							¿Estás seguro de que deseas eliminar la cita del paciente{' '}
							<strong>{citaToDelete?.patient?.username || 'N/A'}</strong>?
						</p>
						<p className="text-danger mb-0">
							Esta acción no se puede deshacer.
						</p>
					</Modal.Body>
					<Modal.Footer>
						<Button
							variant="outline-secondary"
							onClick={() => setShowDeleteModal(false)}
						>
							Cancelar
						</Button>
						<Button variant="danger" onClick={confirmDelete}>
							Eliminar Cita
						</Button>
					</Modal.Footer>
				</Modal>

				<Modal show={showModal} onHide={handleClose} size="lg">
					<Modal.Header closeButton className="bg-light">
						<Modal.Title>
							{editMode ? 'Editar Cita' : 'Nueva Cita'}
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Form onSubmit={handleSubmit}>
							<div className="row">
								<div className="col-md-6">
									<Form.Group className="mb-3">
										<Form.Label>Paciente</Form.Label>
										<Form.Control
											type="text"
											name="patientUsername"
											value={currentCita.patientUsername}
											onChange={handleInputChange}
											required
											placeholder="Ingrese el nombre del paciente"
										/>
									</Form.Group>
								</div>
								<div className="col-md-6">
									<Form.Group className="mb-3">
										<Form.Label>Doctor</Form.Label>
										<Form.Select
											name="doctorUsername"
											value={currentCita.doctorUsername}
											onChange={handleInputChange}
											required
											disabled={editMode}
										>
											<option value="">Seleccionar Doctor</option>
											{doctores.map(doctor => (
												<option key={doctor._id} value={doctor.username}>
													{doctor.username}
												</option>
											))}
										</Form.Select>
									</Form.Group>
								</div>
							</div>

							<div className="row">
								<div className="col-md-6">
									<Form.Group className="mb-3">
										<Form.Label>Departamento</Form.Label>
										<Form.Select
											name="department"
											value={currentCita.department}
											onChange={handleInputChange}
											required
										>
											<option value="">Seleccionar Departamento</option>
											<option value="Medicina General">Medicina General</option>
											<option value="Pediatría">Pediatría</option>
											<option value="Ginecología">Ginecología</option>
											<option value="Cardiología">Cardiología</option>
											<option value="Dermatología">Dermatología</option>
											<option value="Oftalmología">Oftalmología</option>
											<option value="Ortopedia">Ortopedia</option>
											<option value="Neurología">Neurología</option>
										</Form.Select>
									</Form.Group>
								</div>
								<div className="col-md-6">
									<Form.Group className="mb-3">
										<Form.Label>Tipo de Consulta</Form.Label>
										<Form.Select
											name="consultationType"
											value={currentCita.consultationType}
											onChange={handleInputChange}
											required
										>
											<option value="">Seleccionar Tipo</option>
											<option value="Primera vez">Primera vez</option>
											<option value="Control">Control</option>
											<option value="Urgencia">Urgencia</option>
											<option value="Seguimiento">Seguimiento</option>
										</Form.Select>
									</Form.Group>
								</div>
							</div>

							<div className="row">
								<div className="col-md-6">
									<Form.Group className="mb-3">
										<Form.Label>Fecha</Form.Label>
										<Form.Control
											type="date"
											name="date"
											value={currentCita.date}
											onChange={handleInputChange}
											required
										/>
									</Form.Group>
								</div>
								<div className="col-md-6">
									<Form.Group className="mb-3">
										<Form.Label>Hora</Form.Label>
										<Form.Control
											type="time"
											name="time"
											value={currentCita.time}
											onChange={handleInputChange}
											required
										/>
									</Form.Group>
								</div>
							</div>

							<div className="row">
								<div className="col-md-6">
									<Form.Group className="mb-3">
										<Form.Label>Duración (minutos)</Form.Label>
										<Form.Control
											type="number"
											name="duration"
											value={currentCita.duration}
											onChange={handleInputChange}
											min="15"
											max="120"
											required
										/>
									</Form.Group>
								</div>
								<div className="col-md-6">
									<Form.Group className="mb-3">
										<Form.Label>Estado</Form.Label>
										<Form.Select
											name="status"
											value={currentCita.status}
											onChange={handleInputChange}
											required
										>
											<option value="pendiente">Pendiente</option>
											<option value="confirmada">Confirmada</option>
											<option value="cancelada">Cancelada</option>
											<option value="completada">Completada</option>
										</Form.Select>
									</Form.Group>
								</div>
							</div>

							<Form.Group className="mb-3">
								<Form.Label>Razón de la Consulta</Form.Label>
								<Form.Control
									as="textarea"
									name="reason"
									value={currentCita.reason}
									onChange={handleInputChange}
									rows={3}
									required
								/>
							</Form.Group>

							<Form.Group className="mb-3">
								<Form.Label>Notas Adicionales</Form.Label>
								<Form.Control
									as="textarea"
									name="notes"
									value={currentCita.notes}
									onChange={handleInputChange}
									rows={2}
								/>
							</Form.Group>

							<div className="d-flex justify-content-end gap-2">
								<Button
									variant="outline-secondary"
									onClick={handleClose}
								>
									Cancelar
								</Button>
								<Button variant="primary" type="submit">
									{editMode ? 'Actualizar' : 'Crear'} Cita
								</Button>
							</div>
						</Form>
					</Modal.Body>
				</Modal>
			</Card.Body>
		</Card>
	);
}

export default Citas;
