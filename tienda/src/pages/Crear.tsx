import React, { useState } from "react";
import '../Styles/Craer.css'

const CrearUsuario: React.FC = () => {
  const [formData, setFormData] = useState({
    correo: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("⚠️ Las contraseñas no coinciden");
      return;
    }
    console.log("Usuario creado:", formData);
  };

  return (
    <div className="crear-usuario-page">
      <div className="crear-usuario-card">
        <div className="crear-usuario-header">
          <div className="icono">👤</div>
          <h1>Crear Usuario</h1>
        </div>

        <form onSubmit={handleSubmit} className="crear-usuario-form">
          <div className="input-group">
            <label htmlFor="correo">Correo</label>
            <input
              type="email"
              id="correo"
              name="correo"
              placeholder="ejemplo@correo.com"
              value={formData.correo}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="********"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="confirmPassword">Confirmar Contraseña</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="********"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="crear-btn">
            Crear Usuario
          </button>
        </form>
      </div>
    </div>
  );
};

export default CrearUsuario;
