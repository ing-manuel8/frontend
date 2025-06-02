import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Login.css';

function Login() {
	const navigate = useNavigate();
	const { login } = useAuth();

	const [formData, setFormData] = useState({
		// Corregido: setState -> setFormData
		email: '', // Cambiado: username -> email
		password: '',
	});

	const handleSubmit = async (e) => {
		e.preventDefault();
		const result = await login(formData.email, formData.password);

		if (result.success) {
			navigate('/home');
		} else {
			alert(result.message || 'Error al iniciar sesión');
		}
	};

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	return (
		<div className="auth-container">
			<div className="auth-card">
				<h1>Iniciar Sesión</h1>
				<form className="auth-form" onSubmit={handleSubmit}>
					<div className="form-group">
						<label htmlFor="email">Correo Electrónico</label>
						<input
							type="email"
							id="email"
							name="email"
							value={formData.email}
							onChange={handleChange}
							required
						/>
					</div>
					<div className="form-group">
						<label htmlFor="password">Contraseña</label>
						<input
							type="password"
							id="password"
							name="password"
							value={formData.password}
							onChange={handleChange}
							required
						/>
					</div>
					<button type="submit" className="auth-button">
						Iniciar Sesión
					</button>
				</form>
				<p className="auth-link">
					¿No tienes una cuenta?{' '}
					<Link to="/register">Regístrate</Link>
				</p>
			</div>
		</div>
	);
}

export default Login;
