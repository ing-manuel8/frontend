import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import HomePage from './pages/HomePage';
import Home from './pages/Home';
import Users from './pages/actions/Users';
import Citas from './pages/actions/Citas';
import AdminDepartamentos from './pages/actions/AdminDepartamentos';
import AdminEspecialidades from './pages/actions/AdminEspecialidades';
import { Button } from 'react-bootstrap';
import { FaExclamationTriangle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function AppRoutes() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const navigate = useNavigate();

  return (
    <>
      {!isHomePage && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/" element={<Home />} />
        <Route path="/users" element={<Users />} />
        <Route path="/citas" element={<Citas />} />
        <Route path="/departamentos" element={<AdminDepartamentos />} />
      </Routes>
      <Outlet />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;