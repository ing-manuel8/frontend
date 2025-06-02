import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { 
	FaUsers, 
	FaCog, 
	FaChartBar, 
	FaUserCircle,
	FaCalendarAlt,
	FaHospital,
	FaNotesMedical,
	FaAmbulance,
	FaUserMd,
	FaExclamationTriangle
} from 'react-icons/fa';
import Chatbot from '../components/Chatbot';
import '../styles/HomePage.css';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

function HomePage() {
	const { user, isAuthenticated } = useAuth();
	const navigate = useNavigate();

	if (!isAuthenticated) {
		return <Navigate to="/login" replace />;
	}
	/*
	const dashboardItems = [
		{
			title: 'Citas Médicas',
			description: 'Gestionar citas y consultas',
			icon: <FaCalendarAlt size={24} />,
			path: '/citas',
			color: '#4CAF50'
		},
		{
			title: 'Usuarios',
			description: 'Gestión de usuarios del sistema',
			icon: <FaUsers size={24} />,
			path: '/users',
			color: '#2196F3'
		},
		{
			title: 'Departamentos',
			description: 'Administrar áreas médicas',
			icon: <FaHospital size={24} />,
			path: '/departamentos',
			color: '#9C27B0'
		},
		{
			title: 'Historiales',
			description: 'Expedientes médicos',
			icon: <FaNotesMedical size={24} />,
			path: '/records',
			color: '#FF9800'
		},
		{
			title: 'Emergencias',
			description: 'Gestión de urgencias',
			icon: <FaAmbulance size={24} />,
			path: '/emergencies',
			color: '#F44336'
		},
		{
			title: 'Configuración',
			description: 'Ajustes del sistema',
			icon: <FaCog size={24} />,
			path: '/settings',
			color: '#607D8B'
		}
	];
	*/
	return (
		<div className="home-page">
			<Container className="mt-4">
				<Row className="mb-4">
					<Col>
						<h1>Bienvenido al Sistema Médico</h1>
					</Col>
				</Row>
				<Row>
					<Col md={4} className="mb-4">
						<Card className="h-100">
							<Card.Body className="text-center">
								<FaUserMd size={50} className="mb-3 text-primary" />
								<Card.Title>Doctores</Card.Title>
								<Card.Text>
									Administra la información de los doctores y sus especialidades.
								</Card.Text>
								<Button 
									variant="primary" 
									onClick={() => navigate('/users')}
								>
									Ver Doctores
								</Button>
							</Card.Body>
						</Card>
					</Col>
					<Col md={4} className="mb-4">
						<Card className="h-100">
							<Card.Body className="text-center">
								<FaCalendarAlt size={50} className="mb-3 text-success" />
								<Card.Title>Citas</Card.Title>
								<Card.Text>
									Gestiona las citas médicas y el calendario de consultas.
								</Card.Text>
								<Button 
									variant="success" 
									onClick={() => navigate('/citas')}
								>
									Ver Citas
								</Button>
							</Card.Body>
						</Card>
					</Col>
					<Col md={4} className="mb-4">
						<Card className="h-100">
							<Card.Body className="text-center">
								<FaExclamationTriangle size={50} className="mb-3 text-danger" />
								<Card.Title>Especialidades</Card.Title>
								<Card.Text>
									Administra las especialidades médicas y departamentos.
								</Card.Text>
								<Button 
									variant="danger" 
									onClick={() => navigate('/departamentos')}
								>
									Administrar Especialidades
								</Button>
							</Card.Body>
						</Card>
					</Col>
				</Row>
			</Container>
			<Chatbot />
		</div>
	);
}

export default HomePage;
