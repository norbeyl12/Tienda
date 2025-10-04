import "../Styles/ClientForm.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/foto1.png";

interface ClientData {
  identification: string;
  email: string;
  firstName: string;
  phone: string;
  secondName: string;
  password: string;
  lastName: string;
  newPassword: string;
  companyName: string;
  fileGuide: string;
  seller: string;
  modificationDate: string;
}

const ClientForm = () => {
  const navigate = useNavigate();
  const [isNewClient, setIsNewClient] = useState(true);
  const [hasAccount, setHasAccount] = useState(false);
  const [clientData, setClientData] = useState<ClientData>({
    identification: "",
    email: "",
    firstName: "",
    phone: "",
    secondName: "",
    password: "",
    lastName: "",
    newPassword: "",
    companyName: "",
    fileGuide: "",
    seller: "",
    modificationDate: new Date().toISOString().split("T")[0],
  });

  const handleInputChange = (field: keyof ClientData, value: string) => {
    setClientData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUpdateData = () => {
    console.log("Actualizando datos:", clientData);
    alert("Datos actualizados correctamente");
  };

  const handleRegister = () => {
    console.log("Registrando cliente:", clientData);
    alert("Cliente registrado correctamente");
  };

  const handleSave = () => {
    // Validar que los campos obligatorios estén llenos
    if (
      !clientData.identification ||
      !clientData.firstName ||
      !clientData.lastName ||
      !clientData.email
    ) {
      alert(
        "Por favor, completa los campos obligatorios: Identificación, Primer Nombre, Apellidos y Email"
      );
      return;
    }

    // Crear un objeto cliente con formato compatible con Admin
    const newClient = {
      id: clientData.identification,
      name: `${clientData.firstName} ${clientData.secondName ? clientData.secondName + " " : ""}${clientData.lastName}`.trim(),
      user: `${clientData.firstName} ${clientData.lastName}`,
      email: clientData.email,
      phone: clientData.phone,
      companyName: clientData.companyName,
      seller: clientData.seller,
      modificationDate: clientData.modificationDate,
    };

    // Obtener clientes adicionales existentes del localStorage
    const existingClients = localStorage.getItem("additionalClients");
    let clients = [];

    if (existingClients) {
      try {
        clients = JSON.parse(existingClients);
      } catch (error) {
        console.error("Error parsing existing clients:", error);
        clients = [];
      }
    }

    // Verificar si el cliente ya existe (por ID)
    const existingClientIndex = clients.findIndex(
      (c: any) => c.id === newClient.id
    );

    if (existingClientIndex !== -1) {
      // Actualizar cliente existente
      clients[existingClientIndex] = {
        ...clients[existingClientIndex],
        ...newClient,
      };
      alert("Cliente actualizado correctamente");
    } else {
      // Agregar nuevo cliente
      clients.push(newClient);
      alert("Cliente guardado correctamente");
    }

    // Guardar en localStorage
    localStorage.setItem("additionalClients", JSON.stringify(clients));

    console.log("Guardando:", newClient);

    // Limpiar formulario
    setClientData({
      identification: "",
      email: "",
      firstName: "",
      phone: "",
      secondName: "",
      password: "",
      lastName: "",
      newPassword: "",
      companyName: "",
      fileGuide: "",
      seller: "",
      modificationDate: new Date().toISOString().split("T")[0],
    });

    // Navegar de vuelta al admin para ver el cliente guardado
    setTimeout(() => {
      navigate("/admin");
    }, 1000);
  };

  return (
    <div className="client-form-container">
      {/* Sidebar con logo y opciones */}
      <div className="client-sidebar">
        <div className="logo-section">
          <img src={logo} alt="ALHBIKE Logo" className="client-logo" />
        </div>

        <div className="action-buttons">
          <button
            className="action-btn back-btn"
            onClick={() => navigate("/admin")}
          >
            ADMIN
          </button>

          <button className="action-btn update-btn" onClick={handleUpdateData}>
            UPDATE
          </button>

          <button className="action-btn register-btn" onClick={handleRegister}>
            REGISTER
          </button>
        </div>

        <div className="client-options">
          <label className="option-label">
            <input
              type="checkbox"
              checked={isNewClient}
              onChange={(e) => setIsNewClient(e.target.checked)}
            />
            <span className="checkmark"></span>
            Cliente Nuevo
          </label>

          <label className="option-label">
            <input
              type="checkbox"
              checked={hasAccount}
              onChange={(e) => setHasAccount(e.target.checked)}
            />
            <span className="checkmark"></span>
            Ya posee cuenta
          </label>
        </div>
      </div>

      {/* Formulario principal */}
      <div className="form-main">
        <div className="form-header">
          <h2>FORMULARIO CLIENTES</h2>
          <p className="form-subtitle">💎 DATOS DEL CLIENTE</p>
        </div>

        <form className="client-form">
          <div className="form-grid">
            {/* Columna izquierda */}
            <div className="form-column">
              <div className="input-group">
                <label>IDENTIFICACIÓN DEL CLIENTE</label>
                <input
                  type="text"
                  placeholder="Type here"
                  value={clientData.identification}
                  onChange={(e) =>
                    handleInputChange("identification", e.target.value)
                  }
                />
              </div>

              <div className="input-group">
                <label>PRIMER NOMBRE</label>
                <input
                  type="text"
                  placeholder="Type here"
                  value={clientData.firstName}
                  onChange={(e) =>
                    handleInputChange("firstName", e.target.value)
                  }
                />
              </div>

              <div className="input-group">
                <label>SEGUNDO NOMBRE</label>
                <input
                  type="text"
                  placeholder="Type here"
                  value={clientData.secondName}
                  onChange={(e) =>
                    handleInputChange("secondName", e.target.value)
                  }
                />
              </div>

              <div className="input-group">
                <label>APELLIDOS</label>
                <input
                  type="text"
                  placeholder="Type here"
                  value={clientData.lastName}
                  onChange={(e) =>
                    handleInputChange("lastName", e.target.value)
                  }
                />
              </div>

              <div className="input-group">
                <label>NOMBRE DE LA COMPAÑÍA</label>
                <input
                  type="text"
                  placeholder="Type here"
                  value={clientData.companyName}
                  onChange={(e) =>
                    handleInputChange("companyName", e.target.value)
                  }
                />
              </div>

              <div className="input-group">
                <label>VENDEDOR</label>
                <input
                  type="text"
                  placeholder="Type here"
                  value={clientData.seller}
                  onChange={(e) => handleInputChange("seller", e.target.value)}
                />
              </div>
            </div>

            {/* Columna derecha */}
            <div className="form-column">
              <div className="input-group">
                <label>EMAIL</label>
                <input
                  type="email"
                  placeholder="Type here"
                  value={clientData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />
              </div>

              <div className="input-group">
                <label>NÚMERO DE TELÉFONO</label>
                <input
                  type="tel"
                  placeholder="Type here"
                  value={clientData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                />
              </div>

              <div className="input-group">
                <label>CONTRASEÑA</label>
                <input
                  type="password"
                  placeholder="Type here"
                  value={clientData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                />
              </div>

              <div className="input-group">
                <label>CONTRASEÑA NUEVA</label>
                <input
                  type="password"
                  placeholder="Type here"
                  value={clientData.newPassword}
                  onChange={(e) =>
                    handleInputChange("newPassword", e.target.value)
                  }
                />
              </div>

              <div className="input-group">
                <label>GUÍA DE FILA</label>
                <input
                  type="text"
                  placeholder="Type here"
                  value={clientData.fileGuide}
                  onChange={(e) =>
                    handleInputChange("fileGuide", e.target.value)
                  }
                />
              </div>

              <div className="input-group">
                <label>FECHA DE MODIFICACIÓN</label>
                <input
                  type="date"
                  value={clientData.modificationDate}
                  onChange={(e) =>
                    handleInputChange("modificationDate", e.target.value)
                  }
                />
              </div>
            </div>
          </div>

          <div className="form-footer">
            <button type="button" className="save-btn" onClick={handleSave}>
              GUARDAR
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClientForm;
