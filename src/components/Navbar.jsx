import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '/assets/hospital.png';
import '../styles/Navbar.css';

function Navbar() {
	const [showSubmenu, setShowSubmenu] = useState(false);
	const { user, isAuthenticated, logout } = useAuth();
	const navigate = useNavigate();
	const submenuRef = useRef(null);

	const handleShowSubmenu = () => {
		setShowSubmenu(true);
	};

	const handleHideSubmenu = () => {
		setShowSubmenu(false);
	};

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (submenuRef.current && !submenuRef.current.contains(event.target)) {
				setShowSubmenu(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	const handleLogout = () => {
		logout();
		navigate('/');
	};

	const handleLogoClick = () => {
		navigate('/');
	};

	return (
		<div className="container-nav">
			<div className="nav-left">
				<div className="nav-left-logo" onClick={handleLogoClick}>
					<img src={logo} alt="logo" />
				</div>

				{isAuthenticated && (
					<ul className="nav-left-menu">
						<li
							className="nav-left-menu-config"
							onMouseEnter={handleShowSubmenu}
							onMouseLeave={handleHideSubmenu}
							ref={submenuRef}
						>
							<span>Configuración</span>
							<ul
								className={`nav-left-submenus ${showSubmenu ? 'show' : ''}`}
							>
								<li>
									<Link
										to="/parametros"
										style={{
											textDecoration: 'none',
											color: 'inherit',
											display: 'block',
											padding: '8px 16px',
										}}
									>
										Parámetros
									</Link>
								</li>
								<li>
									<Link
										to="/users"
										style={{
											textDecoration: 'none',
											color: 'inherit',
											display: 'block',
											padding: '8px 16px',
										}}
									>
										Usuarios
									</Link>
								</li>
								<li>
									<Link
										to="/roles"
										style={{
											textDecoration: 'none',
											color: 'inherit',
											display: 'block',
											padding: '8px 16px',
										}}
									>
										Roles
									</Link>
								</li>
							</ul>
						</li>
					</ul>
				)}
			</div>

			<div className="nav-sesion-info">
				{isAuthenticated ? (
					<>
						<span className="user-name">
							Bienvenido, {user.username}
						</span>
						<button
							className="btn-sesion-info logout"
							onClick={handleLogout}
						>
							Cerrar Sesión
						</button>
					</>
				) : (
					<>
						<Link className="btn-sesion-info" to="/login">
							Login
						</Link>
						<Link className="btn-sesion-info" to="/register">
							Register
						</Link>
					</>
				)}
			</div>
		</div>
	);
}

export default Navbar;
