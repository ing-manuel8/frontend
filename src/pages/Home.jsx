import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import '../styles/Home.css';
import { Phone, Clock, MapPin, Calendar, Heart, Users, Award, ArrowRight, Mail, Instagram, Facebook, Twitter } from 'lucide-react';

function Home() {
  const { isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    especialidad: '',
    fecha: ''
  });
  const [formError, setFormError] = useState('');

  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nombre || !formData.apellido || !formData.email || !formData.telefono || !formData.especialidad || !formData.fecha) {
      setFormError('Por favor complete todos los campos');
      return;
    }
    console.log('Datos del formulario:', formData);
    setFormError('');
  };

  const services = [
    { 
      id: 1, 
      title: "Atención Primaria", 
      description: "Consultas médicas generales y prevención de enfermedades.", 
      icon: <Heart className="w-10 h-10 text-blue-600" /> 
    },
    { 
      id: 2, 
      title: "Especialidades", 
      description: "Atención especializada en cardiología, pediatría, neurología y más.", 
      icon: <Users className="w-10 h-10 text-blue-600" /> 
    },
    { 
      id: 3, 
      title: "Urgencias 24/7", 
      description: "Servicio de emergencias disponible todos los días del año.", 
      icon: <Clock className="w-10 h-10 text-blue-600" /> 
    },
    { 
      id: 4, 
      title: "Laboratorio Clínico", 
      description: "Análisis y pruebas con tecnología de vanguardia.", 
      icon: <Award className="w-10 h-10 text-blue-600" /> 
    },
  ];

  const testimonials = [
    {
      id: 1,
      name: "María García",
      text: "La atención recibida fue excepcional. El personal médico mostró un gran profesionalismo y empatía durante todo mi tratamiento.",
      role: "Paciente"
    },
    {
      id: 2,
      name: "Roberto Méndez",
      text: "Gracias al equipo de especialistas logré recuperarme rápidamente. Las instalaciones son modernas y cómodas.",
      role: "Paciente"
    },
    {
      id: 3,
      name: "Ana Martínez",
      text: "El proceso de admisión fue rápido y eficiente. Los médicos son muy atentos y explican todo con claridad.",
      role: "Paciente"
    }
  ];

  return (
    <div className="animate-fadeIn">
      {/* Barra de información */}
      <div className="info-bar">
        <div className="container">
          <div className="info-item">
            <Phone className="w-4 h-4" />
            <span>+123 456 7890</span>
          </div>
          <div className="info-item">
            <Mail className="w-4 h-4" />
            <span>contacto@hospital.com</span>
          </div>
          <div className="info-item">
            <Clock className="w-4 h-4" />
            <span>Lun-Vie: 8:00 - 20:00</span>
          </div>
          <div className="info-item">
            <MapPin className="w-4 h-4" />
            <span>Av. Principal 123</span>
          </div>
        </div>
      </div>

      {/* Barra de navegación */}
      <nav className="navbar">
        <div className="container">
          <div className="logo">Hospital San Salud</div>
          <div className="nav-links">
            <a href="#inicio">Inicio</a>
            <a href="#services">Servicios</a>
            <a href="#about">Nosotros</a>
            <a href="#doctors">Doctores</a>
            <a href="#contact">Contacto</a>
          </div>
          <div className="auth-buttons">
            <Link to="/login" className="btn btn-primary">Iniciar Sesión</Link>
            <Link to="/register" className="btn btn-outline">Registrarse</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Su salud es nuestra prioridad</h1>
            <p>Ofrecemos atención médica de calidad con tecnología de vanguardia y un equipo de profesionales altamente capacitados.</p>
            <div className="hero-buttons">
              <Link to="/register" className="btn btn-primary">Regístrate Ahora</Link>
              <Link to="#appointment" className="btn btn-secondary">Agendar Cita</Link>
            </div>
          </div>
          <div className="hero-image">
            <img 
              src="/images/hospital.jpg" 
              alt="Hospital San Salud" 
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/600x400?text=Hospital+San+Salud';
              }}
            />
          </div>
        </div>
      </section>

      {/* Características destacadas */}
      <section className="features">
        <div className="container">
          <div className="section-header">
            <h2>¿Por qué elegirnos?</h2>
            <p>Descubre lo que nos hace diferentes</p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <Award className="w-8 h-8" />
              </div>
              <h3>Profesionales Calificados</h3>
              <p>Nuestro equipo médico cuenta con amplia experiencia y certificaciones internacionales.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Clock className="w-8 h-8" />
              </div>
              <h3>Atención 24/7</h3>
              <p>Estamos disponibles todos los días del año para atender cualquier emergencia.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Heart className="w-8 h-8" />
              </div>
              <h3>Cuidado Personalizado</h3>
              <p>Ofrecemos atención adaptada a las necesidades específicas de cada paciente.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Servicios */}
      <section id="services" className="services">
        <div className="container">
          <div className="section-header">
            <h2>Nuestros Servicios</h2>
            <p>Ofrecemos una amplia gama de servicios médicos</p>
          </div>
          <div className="services-grid">
            {services.map(service => (
              <div key={service.id} className="service-card">
                <div className="service-icon">
                  {service.icon}
                </div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <a href="#" className="service-link">
                  Ver más <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Agendar cita */}
      <section id="appointment" className="appointment">
        <div className="container">
          <div className="appointment-container">
            <div className="appointment-info">
              <h2>Agenda tu cita médica</h2>
              <p>Completa el formulario y nuestro equipo se pondrá en contacto contigo para confirmar tu cita en breve.</p>
              <div className="contact-list">
                <li>
                  <Phone className="w-5 h-5" />
                  <span>+123 456 7890</span>
                </li>
                <li>
                  <Mail className="w-5 h-5" />
                  <span>citas@hospital.com</span>
                </li>
                <li>
                  <MapPin className="w-5 h-5" />
                  <span>Av. Principal 123, Ciudad</span>
                </li>
              </div>
            </div>
            <div className="appointment-form">
              <form onSubmit={handleSubmit}>
                {formError && (
                  <div className="form-error">
                    {formError}
                  </div>
                )}
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Nombre</label>
                    <input 
                      type="text" 
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      className="form-control" 
                      placeholder="Tu nombre" 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Apellido</label>
                    <input 
                      type="text" 
                      name="apellido"
                      value={formData.apellido}
                      onChange={handleInputChange}
                      className="form-control" 
                      placeholder="Tu apellido" 
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Correo electrónico</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="form-control" 
                    placeholder="correo@ejemplo.com" 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Teléfono</label>
                  <input 
                    type="tel" 
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    className="form-control" 
                    placeholder="+123 456 7890" 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Especialidad</label>
                  <select 
                    name="especialidad"
                    value={formData.especialidad}
                    onChange={handleInputChange}
                    className="form-control"
                  >
                    <option value="">Seleccione una especialidad</option>
                    <option value="medicina-general">Medicina General</option>
                    <option value="cardiologia">Cardiología</option>
                    <option value="pediatria">Pediatría</option>
                    <option value="neurologia">Neurología</option>
                    <option value="oftalmologia">Oftalmología</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Fecha preferida</label>
                  <input 
                    type="date" 
                    name="fecha"
                    value={formData.fecha}
                    onChange={handleInputChange}
                    className="form-control" 
                  />
                </div>
                <button type="submit" className="btn btn-primary w-full">
                  Solicitar Cita
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonios */}
      <section className="testimonials">
        <div className="container">
          <div className="section-header">
            <h2>Lo que dicen nuestros pacientes</h2>
            <p>Testimonios de personas que han confiado en nosotros</p>
          </div>
          <div className="testimonials-grid">
            {testimonials.map(testimonial => (
              <div key={testimonial.id} className="testimonial-card">
                <div className="testimonial-header">
                  <div className="testimonial-avatar">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div className="testimonial-user">
                    <h4 className="testimonial-name">{testimonial.name}</h4>
                    <p className="testimonial-role">{testimonial.role}</p>
                  </div>
                </div>
                <p className="testimonial-content">"{testimonial.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="newsletter">
        <div className="container">
          <h2>Mantente informado</h2>
          <p>Suscríbete a nuestro boletín para recibir consejos de salud, noticias y promociones especiales.</p>
          <form className="newsletter-form">
            <input 
              type="email" 
              placeholder="Tu correo electrónico" 
              className="newsletter-input"
            />
            <button type="submit" className="newsletter-button">
              Suscribirse
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-col">
              <h3>Hospital San Salud</h3>
              <p>Comprometidos con tu bienestar desde 1995. Ofrecemos atención médica de calidad con tecnología de vanguardia.</p>
              <div className="social-links">
                <a href="#" className="social-link">
                  <Facebook className="w-6 h-6" />
                </a>
                <a href="#" className="social-link">
                  <Twitter className="w-6 h-6" />
                </a>
                <a href="#" className="social-link">
                  <Instagram className="w-6 h-6" />
                </a>
              </div>
            </div>
            <div className="footer-col">
              <h3>Enlaces rápidos</h3>
              <ul className="footer-links">
                <li><a href="#inicio">Inicio</a></li>
                <li><a href="#services">Servicios</a></li>
                <li><a href="#doctors">Doctores</a></li>
                <li><a href="#departments">Departamentos</a></li>
                <li><a href="#contact">Contacto</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h3>Servicios</h3>
              <ul className="footer-links">
                <li><a href="#general">Medicina General</a></li>
                <li><a href="#cardiology">Cardiología</a></li>
                <li><a href="#pediatrics">Pediatría</a></li>
                <li><a href="#neurology">Neurología</a></li>
                <li><a href="#ophthalmology">Oftalmología</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h3>Contacto</h3>
              <ul className="contact-list">
                <li>
                  <MapPin className="w-5 h-5" />
                  <span>Av. Principal 123, Ciudad</span>
                </li>
                <li>
                  <Phone className="w-5 h-5" />
                  <span>+123 456 7890</span>
                </li>
                <li>
                  <Mail className="w-5 h-5" />
                  <span>contacto@hospital.com</span>
                </li>
                <li>
                  <Clock className="w-5 h-5" />
                  <span>Lun-Vie: 8:00 - 20:00</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} Hospital San Salud. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;