import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Badge, Alert } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

const AdminEspecialidades = () => {
    const [especialidades, setEspecialidades] = useState([]);
    const [departamentos, setDepartamentos] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedEspecialidad, setSelectedEspecialidad] = useState(null);
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        departamento: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        obtenerEspecialidades();
        obtenerDepartamentos();
    }, []);

    const obtenerDepartamentos = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('https://server-uj6u.onrender.com/api/chatbot/departments', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            if (data.success) {
                setDepartamentos(data.data);
            } else {
                setError(data.message || 'Error al obtener departamentos');
            }
        } catch (error) {
            setError('Error al obtener departamentos: ' + error.message);
        }
    };

    const obtenerEspecialidades = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/specialty', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            if (data.success) {
                setEspecialidades(data.data);
            } else {
                setError(data.message || 'Error al obtener especialidades');
            }
        } catch (error) {
            setError('Error al obtener especialidades: ' + error.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const token = localStorage.getItem('token');
            const url = selectedEspecialidad 
                ? `https://server-uj6u.onrender.com/api/specialty/${selectedEspecialidad._id}`
                : 'https://server-uj6u.onrender.com/api/specialty';
            
            const method = selectedEspecialidad ? 'PUT' : 'POST';
            
            const response = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            if (data.success) {
                setSuccess(selectedEspecialidad ? 'Especialidad actualizada exitosamente' : 'Especialidad creada exitosamente');
                await obtenerEspecialidades();
                setTimeout(() => {
                    setShowModal(false);
                    resetForm();
                }, 1500);
            } else {
                setError(data.message || 'Error al procesar la solicitud');
            }
        } catch (error) {
            setError('Error al procesar la solicitud: ' + error.message);
        }
    };

    const handleDelete = async () => {
        setError('');
        setSuccess('');

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`https://server-uj6u.onrender.com/api/specialty/${selectedEspecialidad._id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();
            if (data.success) {
                setSuccess('Especialidad eliminada exitosamente');
                setShowDeleteModal(false);
                await obtenerEspecialidades();
            } else {
                setError(data.message || 'Error al eliminar la especialidad');
            }
        } catch (error) {
            setError('Error al eliminar especialidad: ' + error.message);
        }
    };

    const handleEdit = (especialidad) => {
        setSelectedEspecialidad(especialidad);
        setFormData({
            nombre: especialidad.nombre,
            descripcion: especialidad.descripcion,
            departamento: especialidad.departamento
        });
        setShowModal(true);
    };

    const resetForm = () => {
        setSelectedEspecialidad(null);
        setFormData({
            nombre: '',
            descripcion: '',
            departamento: ''
        });
        setError('');
        setSuccess('');
    };

    return (
        <div>
            {error && <Alert variant="danger" className="mb-3">{error}</Alert>}
            {success && <Alert variant="success" className="mb-3">{success}</Alert>}
            <div className="d-flex justify-content-end mb-3">
                <Button variant="light" size="sm" onClick={() => {
                    resetForm();
                    setShowModal(true);
                }}>
                    <FaPlus className="me-2" />
                    Nueva Especialidad
                </Button>
            </div>
            <Table striped bordered hover responsive className="mb-0">
                <thead className="table-light">
                    <tr>
                        <th>Nombre</th>
                        <th>Descripción</th>
                        <th>Departamento</th>
                        <th className="text-center" style={{ width: '120px' }}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {especialidades.map((especialidad) => (
                        <tr key={especialidad._id}>
                            <td className="align-middle">{especialidad.nombre}</td>
                            <td className="align-middle">{especialidad.descripcion}</td>
                            <td className="align-middle">
                                <Badge bg="info">
                                    {especialidad.departamento}
                                </Badge>
                            </td>
                            <td className="text-center align-middle">
                                <Button
                                    variant="warning"
                                    size="sm"
                                    className="me-2"
                                    onClick={() => handleEdit(especialidad)}
                                >
                                    <FaEdit />
                                </Button>
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => {
                                        setSelectedEspecialidad(especialidad);
                                        setShowDeleteModal(true);
                                    }}
                                >
                                    <FaTrash />
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Modal para crear/editar especialidad */}
            <Modal show={showModal} onHide={() => {
                setShowModal(false);
                resetForm();
            }} centered>
                <Modal.Header closeButton className="bg-primary text-white">
                    <Modal.Title>
                        {selectedEspecialidad ? 'Editar Especialidad' : 'Nueva Especialidad'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {success && <Alert variant="success">{success}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.nombre}
                                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                                required
                                placeholder="Ingrese el nombre de la especialidad"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Descripción</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={formData.descripcion}
                                onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                                required
                                placeholder="Ingrese la descripción de la especialidad"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Departamento</Form.Label>
                            <Form.Select
                                value={formData.departamento}
                                onChange={(e) => setFormData({...formData, departamento: e.target.value})}
                                required
                            >
                                <option value="">Seleccione un departamento</option>
                                {departamentos.map((dept) => (
                                    <option key={dept._id} value={dept.nombre}>{dept.nombre}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <div className="d-flex justify-content-end">
                            <Button variant="secondary" className="me-2" onClick={() => {
                                setShowModal(false);
                                resetForm();
                            }}>
                                Cancelar
                            </Button>
                            <Button variant="primary" type="submit">
                                {selectedEspecialidad ? 'Actualizar' : 'Crear'}
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Modal de confirmación para eliminar */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
                <Modal.Header closeButton className="bg-danger text-white">
                    <Modal.Title>Confirmar Eliminación</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {success && <Alert variant="success">{success}</Alert>}
                    ¿Está seguro que desea eliminar la especialidad "{selectedEspecialidad?.nombre}"?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Cancelar
                    </Button>
                    <Button variant="danger" onClick={handleDelete}>
                        Eliminar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default AdminEspecialidades; 