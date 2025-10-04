import "../Styles/Login.css";
import logo from "../assets/foto1.png";
import articulo from "../assets/mujeres.jpg";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { FaUserSecret } from "react-icons/fa";
import { TbPasswordFingerprint } from "react-icons/tb";
import { IoCheckmarkCircle, IoCloseCircle, IoWarning } from "react-icons/io5";

const Login = () => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState("");
  const [clave, setClave] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error" | "warning";
    show: boolean;
  }>({ message: "", type: "success", show: false });

  // Función para mostrar notificaciones
  const showNotification = (
    message: string,
    type: "success" | "error" | "warning"
  ) => {
    setNotification({ message, type, show: true });
    // Auto-hide after 3 seconds
    setTimeout(() => {
      setNotification((prev) => ({ ...prev, show: false }));
    }, 3000);
  };

  // 🔑 Datos del administrador
  const ADMIN_EMAIL = "admin@gmail.com";
  const ADMIN_PASS = "admin1234";

  // Función para validar email
  const validateEmail = (email: string) => {
    if (!email.trim()) {
      return "El correo es obligatorio";
    }
    if (!email.includes("@gmail.com")) {
      return "El correo debe contener @gmail.com";
    }
    if (!email.endsWith("@gmail.com")) {
      return "El correo debe terminar en @gmail.com";
    }
    return "";
  };

  // Función para validar contraseña
  const validatePassword = (password: string) => {
    if (!password.trim()) {
      return "La contraseña es obligatoria";
    }
    if (password.length < 8) {
      return "La contraseña debe tener mínimo 8 caracteres";
    }
    return "";
  };

  // Manejar cambios en tiempo real
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUsuario(value);
    setErrors((prev) => ({ ...prev, email: validateEmail(value) }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setClave(value);
    setErrors((prev) => ({ ...prev, password: validatePassword(value) }));
  };

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validar campos antes de proceder
    const emailError = validateEmail(usuario);
    const passwordError = validatePassword(clave);

    setErrors({ email: emailError, password: passwordError });

    // Si hay errores, no continuar
    if (emailError || passwordError) {
      showNotification(
        "Por favor corrige los errores en el formulario",
        "warning"
      );
      return;
    }

    // Verificar si es administrador
    if (usuario === ADMIN_EMAIL && clave === ADMIN_PASS) {
      showNotification("¡Bienvenido Administrador!", "success");
      // Delay navigation to show notification
      setTimeout(() => {
        navigate("/admin");
      }, 1500);
      return;
    }

    // Si las validaciones pasan, permitir acceso como usuario normal
    showNotification("¡Bienvenido Usuario!", "success");
    // Delay navigation to show notification
    setTimeout(() => {
      navigate("/principal");
    }, 1500);
  };

  return (
    <div className="login-container">
      {/* Toast Notification */}
      {notification.show && (
        <div className={`toast-notification toast-${notification.type}`}>
          <div className="toast-content">
            {notification.type === "success" && (
              <IoCheckmarkCircle className="toast-icon" />
            )}
            {notification.type === "error" && (
              <IoCloseCircle className="toast-icon" />
            )}
            {notification.type === "warning" && (
              <IoWarning className="toast-icon" />
            )}
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      <img src={logo} alt="" className="gym" />
      <h1 className="titulo-login">ActiveHub</h1>
      <h3 className="subtitulo">TrainIn</h3>
      <h3 className="user">User Login</h3>
      <p className="texmoti">
        Push yourself, because no one else is going to do it for you
      </p>

      <form className="formulario" onSubmit={handleLogin}>
        <FaUserSecret className="icono-user" />
        <input
          type="email"
          placeholder="Correo (ejemplo@gmail.com)"
          className={`input-login ${errors.email ? "input-error" : ""}`}
          value={usuario}
          onChange={handleEmailChange}
        />
        {errors.email && <span className="error-message">{errors.email}</span>}

        <TbPasswordFingerprint className="password" />
        <input
          type="password"
          placeholder="Contraseña (mínimo 8 caracteres)"
          className={`input-login ${errors.password ? "input-error" : ""}`}
          value={clave}
          onChange={handlePasswordChange}
        />
        {errors.password && (
          <span className="error-message">{errors.password}</span>
        )}

        <button type="submit" className="boton-login">
          Iniciar Sesión
        </button>

        <button
          type="button"
          className="boton-register"
          onClick={() => navigate("/crear")}
        >
          Registrarse
        </button>

        <button
          type="button"
          className="boton-olvido"
          onClick={() => navigate("/Recuperar")}
        >
          ¿Olvidaste tu contraseña?
        </button>
      </form>

      <p className="informacion">
        Dream big, work hard, and let every step bring you closer to your goals.
      </p>

      <img src={articulo} alt="" className="articulo" />
    </div>
  );
};

export default Login;
