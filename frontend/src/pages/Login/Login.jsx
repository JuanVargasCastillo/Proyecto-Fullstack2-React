import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [errorEmail, setErrorEmail] = useState('');
  const [errorPassword, setErrorPassword] = useState('');
  const [errorGeneral, setErrorGeneral] = useState('');

  const [showForgotModal, setShowForgotModal] = useState(false);

  const resetErrors = () => {
    setErrorEmail('');
    setErrorPassword('');
    setErrorGeneral('');
  };

  const findUser = (emailToFind) => {
    let raw =
      localStorage.getItem('usuariosRegistrados') ||
      localStorage.getItem('usuarios') ||
      localStorage.getItem('Users') ||
      '[]';

    let users = [];
    try {
      users = JSON.parse(raw);
      if (!Array.isArray(users)) users = [];
    } catch {
      users = [];
    }

    const normalizedEmail = String(emailToFind || '').trim().toLowerCase();

    const user = users.find((u) => {
      const uEmail = (u?.correo || u?.email || u?.usuario || '').toLowerCase();
      return uEmail === normalizedEmail;
    });

    return user || null;
  };

  const getUserPassword = (user) => {
    return user?.contrasena ?? user?.password ?? user?.pass ?? '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    resetErrors();

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      if (!trimmedEmail) setErrorEmail('Por favor ingresa tu correo electrónico.');
      if (!trimmedPassword) setErrorPassword('Por favor ingresa tu contraseña.');
      setErrorGeneral('Completa los campos requeridos.');
      return;
    }

    const user = findUser(trimmedEmail);
    if (!user) {
      setErrorEmail('El correo no está registrado.');
      setErrorGeneral('El correo no existe.');
      return;
    }

    const storedPassword = getUserPassword(user);
    if (String(storedPassword) !== trimmedPassword) {
      setErrorPassword('Contraseña incorrecta.');
      setErrorGeneral('Credenciales inválidas.');
      return;
    }

    const usuarioLogueado = {
      email: user?.correo || user?.email || trimmedEmail,
      nombre: user?.nombre || user?.name || 'Usuario',
      rol: user?.rol || 'ADMIN',
    };
    // Guardar según tu requerimiento
    localStorage.setItem('usuarioLogueado', JSON.stringify(usuarioLogueado));
    // También guardar en 'user' para integrarse con AuthContext existente
    localStorage.setItem('user', JSON.stringify(usuarioLogueado));

    // Forzar recarga para que AuthContext tome el usuario y ProtectedRoute permita /dashboard
    window.location.href = '/dashboard';
    // Como alternativa SPA (si no usas ProtectedRoute con AuthContext):
    // navigate('/dashboard');
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="brand">
          <img src="/img/logo.png" alt="GreenBunny" className="brand-logo" />
          <h1 className="brand-title">GreenBunny</h1>
          <p className="brand-subtitle">Bienvenido de nuevo</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          {errorGeneral ? <div className="alert-error">{errorGeneral}</div> : null}

          <div className="form-group">
            <label htmlFor="email" className="form-label">Correo electrónico</label>
            <input
              id="email"
              type="email"
              className={`form-control ${errorEmail ? 'is-invalid' : ''}`}
              placeholder="ejemplo@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errorEmail ? <div className="invalid-feedback d-block">{errorEmail}</div> : null}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Contraseña</label>
            <input
              id="password"
              type="password"
              className={`form-control ${errorPassword ? 'is-invalid' : ''}`}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errorPassword ? <div className="invalid-feedback d-block">{errorPassword}</div> : null}
          </div>

          <div className="actions">
            <button type="submit" className="btn btn-success w-100">Iniciar sesión</button>
          </div>

          <div className="forgot">
            <button
              type="button"
              className="forgot-link"
              onClick={() => setShowForgotModal(true)}
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>
        </form>
      </div>

      {showForgotModal && (
        <div className="modal-overlay" onClick={() => setShowForgotModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h5>Recuperar contraseña</h5>
              <button
                className="btn btn-close"
                onClick={() => setShowForgotModal(false)}
                aria-label="Cerrar"
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <p className="modal-text">
                Ingresa tu correo y te enviaremos instrucciones para recuperar tu contraseña.
              </p>
              <input
                type="email"
                className="form-control"
                placeholder="tu-correo@gmail.com"
                readOnly={false}
              />
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-outline-pink"
                onClick={() => setShowForgotModal(false)}
              >
                Cancelar
              </button>
              <button
                className="btn btn-success"
                onClick={() => setShowForgotModal(false)}
              >
                Enviar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}