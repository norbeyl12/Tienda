import React, { useState } from "react";
import "../Styles/Recuperar.css";

const RecuperarCuenta: React.FC = () => {
  const [datos, setDatos] = useState({
    email: "",
  });

  const manejarCambio = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDatos({ ...datos, [e.target.name]: e.target.value });
  };

  const manejarEnvio = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Solicitud de recuperación enviada para:", datos.email);
    alert("📩 Si el correo está registrado, recibirás un enlace de recuperación.");
  };

  return (
    <div className="recuperar-page">
      <div className="recuperar-card">
        <div className="recuperar-header">
          <div className="icono">🔑</div>
          <h1>Recuperar Contraseña</h1>
        </div>

        <form onSubmit={manejarEnvio} className="recuperar-form">
          <div className="input-group">
            <label htmlFor="email">Correo</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="ejemplo@correo.com"
              value={datos.email}
              onChange={manejarCambio}
              required
            />
          </div>

          <button type="submit" className="recuperar-btn">
            Enviar Enlace
          </button>
        </form>
      </div>
    </div>
  );
};

export default RecuperarCuenta;
