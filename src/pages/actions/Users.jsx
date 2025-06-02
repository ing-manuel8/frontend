import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Table, Card, Badge } from 'react-bootstrap';
import {
	FaUserPlus,
	FaEdit,
	FaTrash,
	FaUserMd,
	FaUserNurse,
	FaArrowLeft
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';

function Users() {
	const { user } = useAuth();
	const [users, setUsers] = useState([]);
	const [specialties, setSpecialties] = useState([]);
	const navigate = useNavigate();
	const [showModal, setShowModal] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [userToDelete, setUserToDelete] = useState(null);
	const [editMode, setEditMode] = useState(false);
	const [currentUser, setCurrentUser] = useState({
		id: '',
		username: '',
		email: '',
		password: '',
		role: '',
		specialty: '',
		status: 'active',
	});

	const getRoleBadgeVariant = (role) => {
		const variants = {
			Doctor: 'primary',
			Admin: 'danger',
			Nurse: 'success',
			Receptionist: 'info',
		};
		return variants[role] || 'secondary';
	};

	// Modal handlers
	const handleClose = () => {
		setShowModal(false);
		setEditMode(false);
		setCurrentUser({
			id: '',
			username: '',
			email: '',
			role: '',
			specialty: '',
			password: '',
			status: 'active',
		});
	};

	const handleShow = () => setShowModal(true);

	// Form handlers
	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setCurrentUser({ ...currentUser, [name]: value });
	};

	// Fetch users and specialties on component mount
	useEffect(() => {
		fetchUsers();
		fetchSpecialties();
	}, []);

	const fetchSpecialties = async () => {
		try {
			const token = localStorage.getItem('token');
			const response = await fetch('https://server-uj6u.onrender.com/api/specialty', {
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
			});
			const data = await response.json();

			if (data.success) {
				console.log('Especialidades obtenidas:', data.data); // Para debugging
				setSpecialties(data.data);
			} else {
				console.error('Error al obtener especialidades:', data.message);
			}
		} catch (error) {
			console.error('Error:', error);
		}
	};

	const fetchUsers = async () => {
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
				setUsers(data.data);
			} else {
				console.error('Error al obtener usuarios:', data.message);
			}
		} catch (error) {
			console.error('Error:', error);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const token = localStorage.getItem('token');
			const url = editMode
				? `https://server-uj6u.onrender.com/api/users/${currentUser.id}`
				: 'https://server-uj6u.onrender.com/api/users';

			const userData = {
				username: currentUser.username,
				email: currentUser.email,
				role: currentUser.role,
				specialty: currentUser.specialty,
				status: currentUser.status,
			};

			if (currentUser.password || !editMode) {
				userData.password = currentUser.password;
			}

			const response = await fetch(url, {
				method: editMode ? 'PUT' : 'POST',
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(userData),
			});

			const data = await response.json();

			if (data.success) {
				fetchUsers();
				handleClose();
			} else {
				alert(data.message || 'Error al procesar la solicitud');
			}
		} catch (error) {
			console.error('Error:', error);
			alert('Error al procesar la solicitud');
		}
	};

	const handleDelete = (user) => {
		setUserToDelete(user);
		setShowDeleteModal(true);
	};

	const confirmDelete = async () => {
		try {
			const token = localStorage.getItem('token');
			const response = await fetch(
				`https://server-uj6u.onrender.com/api/users/${userToDelete._id}`,
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
				setUsers(users.filter((u) => u._id !== userToDelete._id));
				setShowDeleteModal(false);
				setUserToDelete(null);
			} else {
				alert(data.message || 'Error al eliminar usuario');
			}
		} catch (error) {
			console.error('Error:', error);
			alert('Error al eliminar usuario');
		}
	};

	const handleEdit = (user) => {
		setCurrentUser({
			id: user._id,
			username: user.username,
			email: user.email,
			role: user.role,
			specialty: user.specialty || '',
			status: user.status || 'active',
			password: '',
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
						<h2 className="mb-1">Gestión de Personal</h2>
						<p className="text-muted mb-0">
							Administra el personal de la clínica y sus roles
						</p>
					</div>
					<Button
						variant="primary"
						onClick={handleShow}
						className="d-flex align-items-center gap-2"
					>
						<FaUserPlus />
						Agregar Nuevo Personal
					</Button>
				</div>

				<Table
					striped
					bordered
					hover
					responsive
					className="align-middle"
				>
					<thead className="bg-light">
						<tr>
							<th>Personal</th>
							<th>Rol y Especialidad</th>
							<th>Contacto</th>
							<th>Estado</th>
							<th>Acciones</th>
						</tr>
					</thead>
					<tbody>
						{users.map((user) => (
							<tr key={user._id}>
								<td>
									<div className="d-flex align-items-center">
										{user.role === 'Doctor' ? (
											<FaUserMd className="me-2 text-primary" />
										) : user.role === 'Nurse' ? (
											<FaUserNurse className="me-2 text-success" />
										) : null}
										<div>
											<div className="fw-bold">
												{user.username}
											</div>
											<small className="text-muted">
												{user.id}
											</small>
										</div>
									</div>
								</td>
								<td>
									<Badge
										bg={getRoleBadgeVariant(user.role)}
										className="me-2"
									>
										{user.role}
									</Badge>
									<small className="text-muted d-block">
										{user.specialty}
									</small>
								</td>
								<td>{user.email}</td>
								<td>
									<Badge
										bg={
											user.status === 'active'
												? 'success'
												: 'warning'
										}
									>
										{user.status === 'active' ? 'Activo' : 'Inactivo'}
									</Badge>
								</td>
								<td>
									<Button
										variant="outline-info"
										size="sm"
										className="me-2"
										onClick={() => handleEdit(user)}
									>
										<FaEdit /> Editar
									</Button>
									<Button
										variant="outline-danger"
										size="sm"
										onClick={() => handleDelete(user)}
									>
										<FaTrash /> Eliminar
									</Button>
								</td>
							</tr>
						))}
					</tbody>
				</Table>

				{/* Modal de Confirmación de Eliminación */}
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
							¿Estás seguro de que deseas eliminar al usuario{' '}
							<strong>{userToDelete?.username}</strong>?
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
							Eliminar Usuario
						</Button>
					</Modal.Footer>
				</Modal>

				{/* Modal de Usuario */}
				<Modal show={showModal} onHide={handleClose} size="lg">
					<Modal.Header closeButton className="bg-light">
						<Modal.Title>
							{editMode
								? 'Editar Personal'
								: 'Agregar Nuevo Personal'}
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Form onSubmit={handleSubmit}>
							<div className="row">
								<div className="col-md-6">
									<Form.Group className="mb-3">
										<Form.Label>Nombre de Usuario</Form.Label>
										<Form.Control
											type="text"
											name="username"
											value={currentUser.username || ''}
											onChange={handleInputChange}
											required
										/>
									</Form.Group>
								</div>
								<div className="col-md-6">
									<Form.Group className="mb-3">
										<Form.Label>Correo Electrónico</Form.Label>
										<Form.Control
											type="email"
											name="email"
											value={currentUser.email || ''}
											onChange={handleInputChange}
											required
										/>
									</Form.Group>
								</div>
							</div>

							<div className="row">
								<div className="col-md-6">
									<Form.Group className="mb-3">
										<Form.Label>
											Contraseña{' '}
											{editMode &&
												'(Dejar en blanco para mantener la actual)'}
										</Form.Label>
										<Form.Control
											type="password"
											name="password"
											value={currentUser.password || ''}
											onChange={handleInputChange}
											required={!editMode}
										/>
									</Form.Group>
								</div>
								<div className="col-md-6">
									<Form.Group className="mb-3">
										<Form.Label>Rol</Form.Label>
										<Form.Select
											name="role"
											value={currentUser.role || ''}
											onChange={handleInputChange}
											required
										>
											<option value="">
												Seleccionar Rol
											</option>
											<option value="Doctor">
												Doctor
											</option>
											<option value="Admin">
												Administrador
											</option>
											<option value="Nurse">Enfermero</option>
											<option value="Receptionist">
												Recepcionista
											</option>
										</Form.Select>
									</Form.Group>
								</div>
							</div>

							<div className="row">
								<div className="col-md-6">
									<Form.Group className="mb-3">
										<Form.Label>Especialidad</Form.Label>
										<Form.Select
											name="specialty"
											value={currentUser.specialty || ''}
											onChange={handleInputChange}
											required={
												currentUser.role === 'Doctor' ||
												currentUser.role === 'Nurse'
											}
										>
											<option value="">
												Seleccionar Especialidad
											</option>
											{specialties.map((specialty) => (
												<option key={specialty._id} value={specialty.nombre}>
													{specialty.nombre}
												</option>
											))}
										</Form.Select>
									</Form.Group>
								</div>
								<div className="col-md-6">
									<Form.Group className="mb-3">
										<Form.Label>Estado</Form.Label>
										<Form.Select
											name="status"
											value={
												currentUser.status || 'active'
											}
											onChange={handleInputChange}
											required
										>
											<option value="active">
												Activo
											</option>
											<option value="inactive">
												Inactivo
											</option>
										</Form.Select>
									</Form.Group>
								</div>
							</div>

							<div className="d-flex justify-content-end gap-2">
								<Button
									variant="outline-secondary"
									onClick={handleClose}
								>
									Cancelar
								</Button>
								<Button variant="primary" type="submit">
									{editMode ? 'Actualizar' : 'Crear'} Personal
								</Button>
							</div>
						</Form>
					</Modal.Body>
				</Modal>
			</Card.Body>
		</Card>
	);
}

export default Users;
