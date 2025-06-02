import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Login.css';

function Register() {
	const navigate = useNavigate();
	const { register } = useAuth();

	const [formData, setFormData] = useState({
		username: '',
		email: '',
		password: '',
		confirmPassword: '',
	});

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (formData.password !== formData.confirmPassword) {
			alert('Las contraseñas no coinciden');
			return;
		}

		const result = await register({
			username: formData.username,
			email: formData.email,
			password: formData.password,
		});

		if (result.success) {
			navigate('/home');
		} else {
			alert(result.message || 'Error al registrar usuario');
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
				<h1>Registro</h1>
				<form className="auth-form" onSubmit={handleSubmit}>
					<div className="form-group">
						<label htmlFor="username">Usuario</label>
						<input
							type="text"
							id="username"
							name="username"
							value={formData.username}
							onChange={handleChange}
							required
						/>
					</div>
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
					<div className="form-group">
						<label htmlFor="confirmPassword">
							Confirmar Contraseña
						</label>
						<input
							type="password"
							id="confirmPassword"
							name="confirmPassword"
							value={formData.confirmPassword}
							onChange={handleChange}
							required
						/>
					</div>
					<button type="submit" className="auth-button">
						Registrarse
					</button>
				</form>
				<p className="auth-link">
					¿Ya tienes una cuenta?{' '}
					<Link to="/login">Inicia Sesión</Link>
				</p>
			</div>
		</div>
	);
}

export default Register;
