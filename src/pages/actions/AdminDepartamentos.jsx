import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, Badge, Row, Col, Container, Alert } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import AdminEspecialidades from './AdminEspecialidades';

const AdminDepartamentos = () => {
    const [departamentos, setDepartamentos] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedDepartamento, setSelectedDepartamento] = useState(null);
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const token = localStorage.getItem('token');
            const url = selectedDepartamento 
                ? `https://server-uj6u.onrender.com/api/chatbot/departments/${selectedDepartamento._id}`
                : 'https://server-uj6u.onrender.com/api/chatbot/departments';
            
            const method = selectedDepartamento ? 'PUT' : 'POST';
            
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
                setSuccess(selectedDepartamento ? 'Departamento actualizado exitosamente' : 'Departamento creado exitosamente');
                await obtenerDepartamentos();
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
            const response = await fetch(`https://server-uj6u.onrender.com/api/chatbot/departments/${selectedDepartamento._id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();
            if (data.success) {
                setSuccess('Departamento eliminado exitosamente');
                setShowDeleteModal(false);
                await obtenerDepartamentos();
            } else {
                setError(data.message || 'Error al eliminar el departamento');
            }
        } catch (error) {
            setError('Error al eliminar departamento: ' + error.message);
        }
    };

    const handleEdit = (departamento) => {
        setSelectedDepartamento(departamento);
        setFormData({
            nombre: departamento.nombre,
            descripcion: departamento.descripcion
        });
        setShowModal(true);
    };

    const resetForm = () => {
        setSelectedDepartamento(null);
        setFormData({
            nombre: '',
            descripcion: ''
        });
        setError('');
        setSuccess('');
    };

    return (
        <Container fluid className="p-4">
            {error && <Alert variant="danger" className="mb-3">{error}</Alert>}
            {success && <Alert variant="success" className="mb-3">{success}</Alert>}
            <Row className="g-4">
                <Col md={6}>
                    <Card className="h-100 shadow-sm">
                        <Card.Header className="bg-primary text-white">
                            <div className="d-flex justify-content-between align-items-center">
                                <h4 className="mb-0">Departamentos</h4>
                                <Button 
                                    variant="light" 
                                    size="sm"
                                    onClick={() => {
                                        resetForm();
                                        setShowModal(true);
                                    }}
                                >
                                    <FaPlus className="me-2" />
                                    Nuevo Departamento
                                </Button>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <Table striped bordered hover responsive className="mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>Nombre</th>
                                        <th>Descripción</th>
                                        <th className="text-center" style={{ width: '120px' }}>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {departamentos.map((departamento) => (
                                        <tr key={departamento._id}>
                                            <td className="align-middle">{departamento.nombre}</td>
                                            <td className="align-middle">{departamento.descripcion}</td>
                                            <td className="text-center align-middle">
                                                <Button
                                                    variant="warning"
                                                    size="sm"
                                                    className="me-2"
                                                    onClick={() => handleEdit(departamento)}
                                                >
                                                    <FaEdit />
                                                </Button>
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    onClick={() => {
                                                        setSelectedDepartamento(departamento);
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
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6}>
                    <Card className="h-100 shadow-sm">
                        <Card.Header className="bg-primary text-white">
                            <h4 className="mb-0">Especialidades</h4>
                        </Card.Header>
                        <Card.Body>
                            <AdminEspecialidades />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Modal para crear/editar departamento */}
            <Modal show={showModal} onHide={() => {
                setShowModal(false);
                resetForm();
            }} centered>
                <Modal.Header closeButton className="bg-primary text-white">
                    <Modal.Title>
                        {selectedDepartamento ? 'Editar Departamento' : 'Nuevo Departamento'}
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
                                placeholder="Ingrese el nombre del departamento"
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
                                placeholder="Ingrese la descripción del departamento"
                            />
                        </Form.Group>
                        <div className="d-flex justify-content-end">
                            <Button variant="secondary" className="me-2" onClick={() => {
                                setShowModal(false);
                                resetForm();
                            }}>
                                Cancelar
                            </Button>
                            <Button variant="primary" type="submit">
                                {selectedDepartamento ? 'Actualizar' : 'Crear'}
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
                    ¿Está seguro que desea eliminar el departamento "{selectedDepartamento?.nombre}"?
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
        </Container>
    );
};

export default AdminDepartamentos; 