import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	// Check session on component mount and token changes
	useEffect(() => {
		checkSession();
	}, []);

	const checkSession = async () => {
		try {
			const token = localStorage.getItem('token');
			const storedUser = localStorage.getItem('user');

			if (!token || !storedUser) {
				setIsLoading(false);
				return;
			}

			// Simulate local verification
			try {
				const userData = JSON.parse(storedUser);
				setUser(userData);
				setIsAuthenticated(true);
			} catch {
				logout();
			}
		} catch (error) {
			console.error('Session check error:', error);
			logout();
		} finally {
			setIsLoading(false);
		}
	};

	const login = async (email, password) => {
		try {
			const response = await fetch(
				'https://server-uj6u.onrender.com/api/auth/login',
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ email, password }),
				},
			);

			const data = await response.json();

			if (data.success) {
				setUser(data.user);
				setIsAuthenticated(true);
				localStorage.setItem('token', data.token);
				localStorage.setItem('user', JSON.stringify(data.user)); // Store user data
				return { success: true };
			} else {
				return { success: false, message: data.message };
			}
		} catch (error) {
			console.error('Error:', error);
			return { success: false, message: 'Error al iniciar sesión' };
		}
	};

	const logout = () => {
		setUser(null);
		setIsAuthenticated(false);
		localStorage.removeItem('token');
		localStorage.removeItem('user'); // Remove stored user data
	};

	const register = async (userData) => {
		try {
			const response = await fetch(
				'https://server-uj6u.onrender.com/api/auth/register',
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(userData),
				},
			);

			const data = await response.json();

			if (data.success) {
				setUser(data.user);
				setIsAuthenticated(true);
				localStorage.setItem('token', data.token);
				return { success: true };
			} else {
				return { success: false, message: data.message };
			}
		} catch (error) {
			console.error('Error:', error);
			return { success: false, message: 'Error al registrar usuario' };
		}
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				isAuthenticated,
				isLoading,
				login,
				logout,
				register,
				checkSession,
			}}
		>
			{!isLoading && children}
		</AuthContext.Provider>
	);
}

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth debe ser usado dentro de un AuthProvider');
	}
	return context;
};
