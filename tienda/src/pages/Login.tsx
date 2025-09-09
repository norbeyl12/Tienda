import '../Styles/Login.css'
import logo from '../assets/foto1.png'
import articulo from '../assets/mujeres.jpg'
import { useNavigate } from "react-router-dom";
import React, { useState } from "react"; 
import { FaUserSecret } from 'react-icons/fa'
import { TbPasswordFingerprint } from 'react-icons/tb';

const Login = () => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState("");
  const [clave, setClave] = useState("");

  // 🔑 Datos del administrador
  const ADMIN_EMAIL = "admin@admin.com";
  const ADMIN_PASS = "admin";

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); 

    // Verificar si es administrador
    if (usuario === ADMIN_EMAIL && clave === ADMIN_PASS) {
      alert("✅ Bienvenido Administrador");
      navigate("/admin"); 
      return;
    }

    // Si no es admin, entra como usuario normal
    if (usuario.trim() !== "") {
      alert("✅ Bienvenido Usuario");
      navigate("/principal"); 
    } else {
      alert("⚠️ Debes ingresar un correo válido");
    }
  };

  return (
    <div className="login-container">
      <img src={logo} alt="" className='gym' />
      <h1 className='titulo-login'>ActiveHub</h1>
      <h3 className='subtitulo'>TrainIn</h3>
      <h3 className='user'>User Login</h3>
      <p className='texmoti'>
        Push yourself, because no one else is going to do it for you
      </p>

      <form className='formulario' onSubmit={handleLogin}>
        <FaUserSecret className='icono-user' />
        <input 
          type="text" 
          placeholder='Usuario o correo' 
          className='input-login'
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
        />

        <TbPasswordFingerprint className='password' />
        <input 
          type="password" 
          placeholder='Contraseña' 
          className='input-login'
          value={clave}
          onChange={(e) => setClave(e.target.value)}
        />

        <button type="submit" className='boton-login'>
          Iniciar Sesión
        </button>

        <button
          type="button"
          className='boton-register'
          onClick={() => navigate("/crear")}
        >
          Registrarse
        </button>

        <button
          type="button"
          className='boton-olvido'
          onClick={() => navigate("/Recuperar")}
        >
          ¿Olvidaste tu contraseña?
        </button>
      </form>

      <p className='informacion'>
        Dream big, work hard, and let every step bring you closer to your goals.
      </p>

      <img src={articulo} alt="" className='articulo' />
    </div>
  );
};

export default Login;
