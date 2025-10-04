import "../Styles/Admin.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import log from "../assets/foto1.png";
import {
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ChevronRight as ChevronRightIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import { obtenerProductos, type Producto } from "../routes/products";
import { obtenerClientes, type Cliente } from "../routes/customers";

interface Bicicleta {
  id: string;
  name: string;
  user: string;
  email?: string;
  phone?: string;
  companyName?: string;
  seller?: string;
  modificationDate?: string;
}

// Usaremos el tipo Cliente para datos de AdventureWorks
type ClienteData = Cliente | Bicicleta;

const Admin = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSection, setActiveSection] = useState<
    "bicicletas" | "productos"
  >("bicicletas");
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Producto | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"view" | "edit" | "delete">(
    "view"
  );
  const [selectedProduct, setSelectedProduct] = useState<Producto | null>(null);
  const [selectedClient, setSelectedClient] = useState<Bicicleta | null>(null);
  const [editingClient, setEditingClient] = useState<Bicicleta | null>(null);
  const [bicicletas, setBicicletas] = useState<Bicicleta[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;

  // Cargar productos cuando se selecciona la sección productos
  useEffect(() => {
    if (activeSection === "productos") {
      loadProductos();
    }
  }, [activeSection]);

  // Cargar clientes desde localStorage cuando el componente se monta
  useEffect(() => {
    loadClients();
  }, []);

  // Recargar clientes cuando regresamos a la sección de clientes
  useEffect(() => {
    if (activeSection === "bicicletas") {
      loadClients();
    }
  }, [activeSection]);

  const loadProductos = async () => {
    setLoading(true);
    try {
      const result = await obtenerProductos();
      if (result.success && result.data) {
        setProductos(result.data);
      }
    } catch (error) {
      console.error("Error loading products:", error);
    }
    setLoading(false);
  };

  const loadClients = async () => {
    // Datos por defecto que siempre deben estar
    const defaultClients: Bicicleta[] = [
      {
        id: "122",
        name: "Laura Sofía Mora Ruiz",
        user: "Laura Sofía Mora Ruiz",
      },
      { id: "124", name: "Carlos Pérez", user: "Carlos Pérez" },
      { id: "128", name: "Marta López", user: "Marta López" },
      { id: "130", name: "Juan Rodríguez", user: "Juan Rodríguez" },
    ];

    // Cargar clientes adicionales desde localStorage
    const savedClients = localStorage.getItem("additionalClients");
    let additionalClients: Bicicleta[] = [];

    if (savedClients) {
      try {
        additionalClients = JSON.parse(savedClients);
      } catch (error) {
        console.error("Error parsing saved clients:", error);
        additionalClients = [];
      }
    }

    let allClients = [...defaultClients];

    try {
      // 💾 Intentar cargar clientes desde AdventureWorks
      console.log("🔍 Cargando clientes desde AdventureWorks...");
      const result = await obtenerClientes();

      if (result.success && result.data) {
        console.log(
          "✅ Clientes de AdventureWorks cargados:",
          result.data.length
        );
        // Agregar clientes de AdventureWorks, evitando duplicados por ID
        result.data.forEach((client) => {
          if (!allClients.find((c) => c.id === client.id)) {
            allClients.push(client);
          }
        });
      } else {
        console.warn(
          "⚠️  No se pudieron cargar clientes de AdventureWorks:",
          result.error
        );
      }
    } catch (error) {
      console.error("❌ Error al conectar con AdventureWorks:", error);
    }

    // Combinar clientes por defecto con los adicionales, evitando duplicados por ID
    additionalClients.forEach((client) => {
      if (!allClients.find((c) => c.id === client.id)) {
        allClients.push(client);
      }
    });

    console.log("👥 Total clientes cargados:", allClients.length);
    setBicicletas(allClients);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const value = e.target.value || "";
      console.log("Searching for:", value); // Para debug
      setSearchTerm(value);
    } catch (error) {
      console.error("Error in handleSearch:", error);
      // Don't let the error crash the component
      setSearchTerm("");
    }
  };

  const filteredBicicletas = (() => {
    try {
      if (!Array.isArray(bicicletas)) return [];

      return bicicletas.filter((b) => {
        if (!searchTerm || searchTerm.trim() === "") return true;

        const search = searchTerm.toLowerCase().trim();

        return (
          (b?.name && b.name.toLowerCase().includes(search)) ||
          (b?.id && String(b.id).toLowerCase().includes(search)) ||
          (b?.user && b.user.toLowerCase().includes(search))
        );
      });
    } catch (error) {
      console.error("Error filtering bicicletas:", error);
      return bicicletas || [];
    }
  })();

  const filteredProductos = (() => {
    try {
      if (!Array.isArray(productos) || productos.length === 0) return [];

      return productos.filter((p) => {
        if (!searchTerm || searchTerm.trim() === "") return true;

        const search = searchTerm.toLowerCase().trim();

        return (
          (p?.name && p.name.toLowerCase().includes(search)) ||
          (p?.id && String(p.id).toLowerCase().includes(search)) ||
          (p?.category && p.category.toLowerCase().includes(search))
        );
      });
    } catch (error) {
      console.error("Error filtering productos:", error);
      return productos || [];
    }
  })();

  // Lógica de paginación with error handling
  const totalPages = Math.max(
    1,
    Math.ceil((filteredProductos?.length || 0) / productsPerPage)
  );
  const startIndex = Math.max(0, (currentPage - 1) * productsPerPage);
  const endIndex = startIndex + productsPerPage;
  const currentProducts = (filteredProductos || []).slice(startIndex, endIndex);

  // Reset página actual cuando cambia la búsqueda
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleView = (id: string) => {
    // Buscar en productos primero
    const product = productos.find((p) => p.id === id);
    if (product) {
      setSelectedProduct(product);
      setSelectedClient(null);
      setModalType("view");
      setShowModal(true);
      return;
    }

    // Si no es producto, buscar en clientes
    const client = bicicletas.find((b) => b.id === id);
    if (client) {
      setSelectedClient(client);
      setSelectedProduct(null);
      setModalType("view");
      setShowModal(true);
    }
  };

  const handleEdit = (id: string) => {
    // Buscar en productos primero
    const product = productos.find((p) => p.id === id);
    if (product) {
      setSelectedProduct(product);
      setEditingProduct({ ...product });
      setSelectedClient(null);
      setModalType("edit");
      setShowModal(true);
      return;
    }

    // Si no es producto, buscar en clientes
    const client = bicicletas.find((b) => b.id === id);
    if (client) {
      setSelectedClient(client);
      setEditingClient({ ...client });
      setSelectedProduct(null);
      setModalType("edit");
      setShowModal(true);
    }
  };

  const handleDelete = (id: string) => {
    // Buscar en productos primero
    const product = productos.find((p) => p.id === id);
    if (product) {
      setSelectedProduct(product);
      setSelectedClient(null);
      setModalType("delete");
      setShowModal(true);
      return;
    }

    // Si no es producto, buscar en clientes
    const client = bicicletas.find((b) => b.id === id);
    if (client) {
      setSelectedClient(client);
      setSelectedProduct(null);
      setModalType("delete");
      setShowModal(true);
    }
  };

  const handleSaveEdit = () => {
    if (editingProduct) {
      setProductos((prev) =>
        prev.map((p) => (p.id === editingProduct.id ? editingProduct : p))
      );
      setShowModal(false);
      setEditingProduct(null);
      alert("Producto actualizado exitosamente");
    } else if (editingClient) {
      // Determinar si es un cliente por defecto o adicional
      const defaultIds = ["122", "124", "128", "130"];
      const isDefaultClient = defaultIds.includes(editingClient.id);

      if (isDefaultClient) {
        // Solo actualizar en el estado local para clientes por defecto
        const updatedClients = bicicletas.map((c) =>
          c.id === editingClient.id ? editingClient : c
        );
        setBicicletas(updatedClients);
      } else {
        // Para clientes adicionales, actualizar en localStorage
        const additionalClients = localStorage.getItem("additionalClients");
        if (additionalClients) {
          try {
            let clients = JSON.parse(additionalClients);
            clients = clients.map((c: any) =>
              c.id === editingClient.id ? editingClient : c
            );
            localStorage.setItem("additionalClients", JSON.stringify(clients));
            loadClients(); // Recargar para reflejar cambios
          } catch (error) {
            console.error("Error updating additional client:", error);
          }
        }
      }

      setShowModal(false);
      setEditingClient(null);
      alert("Cliente actualizado exitosamente");
    }
  };

  const handleConfirmDelete = () => {
    if (selectedProduct) {
      setProductos((prev) => prev.filter((p) => p.id !== selectedProduct.id));
      setShowModal(false);
      setSelectedProduct(null);
      alert("Producto eliminado exitosamente");
    } else if (selectedClient) {
      // Determinar si es un cliente por defecto o adicional
      const defaultIds = ["122", "124", "128", "130"];
      const isDefaultClient = defaultIds.includes(selectedClient.id);

      if (isDefaultClient) {
        alert("No se pueden eliminar los clientes por defecto");
      } else {
        // Solo eliminar clientes adicionales
        const additionalClients = localStorage.getItem("additionalClients");
        if (additionalClients) {
          try {
            let clients = JSON.parse(additionalClients);
            clients = clients.filter((c: any) => c.id !== selectedClient.id);
            localStorage.setItem("additionalClients", JSON.stringify(clients));
            loadClients(); // Recargar para reflejar cambios
            alert("Cliente eliminado exitosamente");
          } catch (error) {
            console.error("Error deleting additional client:", error);
          }
        }
      }

      setShowModal(false);
      setSelectedClient(null);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
    setSelectedClient(null);
    setEditingProduct(null);
    setEditingClient(null);
  };

  return (
    <div className="admin">
      {/* Sidebar */}
      <aside className="admin__sidebar">
        <div className="logo-container">
          <img className="logo-improved" src={log} alt="Logo" />
        </div>
        <nav className="sidebar-nav">
          <ul>
            <li
              className={activeSection === "bicicletas" ? "active" : ""}
              onClick={() => setActiveSection("bicicletas")}
            >
              <PersonIcon /> CLIENTES
            </li>
            <li
              className="form-client-btn"
              onClick={() => navigate("/client-form")}
            >
              📝 FORMULARIO CLIENTES
            </li>
            <li
              className={activeSection === "productos" ? "active" : ""}
              onClick={() => setActiveSection("productos")}
            >
              <div className="productos-icon">🏷️</div> PRODUCTOS
            </li>
          </ul>
        </nav>
      </aside>

      {/* Contenido */}
      <main className="admin__content">
        <header className="admin-header">
          <h1>
            {activeSection === "bicicletas"
              ? "Venta para Gym"
              : "DATOS PRODUCTOS"}
          </h1>
          <div className="user-info">
            <div className="user-details">
              <span className="user-name">Norbey lópez</span>
              <span className="user-role">Admin</span>
            </div>
            <div className="user-avatar">
              <PersonIcon />
            </div>
          </div>
        </header>

        <section className="search-section">
          <div className="search-box">
            <input
              type="text"
              placeholder={
                activeSection === "bicicletas"
                  ? "Buscar por ID o Nombre"
                  : "Buscar por ID, Nombre o Categoría"
              }
              value={searchTerm}
              onChange={handleSearch}
            />
            <button>
              <SearchIcon />
            </button>
          </div>
        </section>

        {/* Renderizado condicional */}
        {activeSection === "bicicletas" && (
          <section className="products-section">
            {Array.isArray(filteredBicicletas) &&
            filteredBicicletas.length > 0 ? (
              filteredBicicletas.map((bici) => (
                <div className="product-card" key={bici?.id || Math.random()}>
                  <div>
                    <p className="product-id">ID: {bici?.id || "N/A"}</p>
                    <h3 className="product-name">
                      {bici?.name || "Nombre no disponible"}
                    </h3>
                  </div>
                  <div className="product-actions">
                    <button
                      className="view"
                      onClick={() => handleView(bici?.id || "")}
                    >
                      <VisibilityIcon />
                    </button>
                    <button
                      className="edit"
                      onClick={() => handleEdit(bici?.id || "")}
                    >
                      <EditIcon />
                    </button>
                    <button
                      className="delete"
                      onClick={() => handleDelete(bici?.id || "")}
                    >
                      <DeleteIcon />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div
                style={{
                  textAlign: "center",
                  padding: "40px",
                  background: "#f8f9fa",
                  borderRadius: "8px",
                  margin: "20px 0",
                }}
              >
                {searchTerm ? (
                  <>
                    <h3>No se encontraron clientes</h3>
                    <p>No hay clientes que coincidan con "{searchTerm}"</p>
                    <button
                      onClick={() => setSearchTerm("")}
                      style={{
                        background: "#7b68ee",
                        color: "white",
                        border: "none",
                        padding: "8px 16px",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      Limpiar búsqueda
                    </button>
                  </>
                ) : (
                  <p>No hay clientes disponibles</p>
                )}
              </div>
            )}
          </section>
        )}

        {activeSection === "productos" && (
          <section className="table-section">
            {loading ? (
              <div style={{ textAlign: "center", padding: "40px" }}>
                <p>Cargando productos...</p>
              </div>
            ) : currentProducts.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "40px",
                  background: "#f8f9fa",
                  borderRadius: "8px",
                }}
              >
                {searchTerm ? (
                  <>
                    <h3>No se encontraron productos</h3>
                    <p>No hay productos que coincidan con "{searchTerm}"</p>
                    <button
                      onClick={() => setSearchTerm("")}
                      style={{
                        background: "#7b68ee",
                        color: "white",
                        border: "none",
                        padding: "8px 16px",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      Limpiar búsqueda
                    </button>
                  </>
                ) : (
                  <p>No hay productos disponibles</p>
                )}
              </div>
            ) : (
              <div className="table-wrapper">
                <table className="products-table">
                  <thead>
                    <tr>
                      <th className="col-actions">Actions</th>
                      <th className="col-id">ID</th>
                      <th>Nombre</th>
                      <th className="col-number">Categoría</th>
                      <th className="col-color">Precio</th>
                      <th className="col-more"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentProducts.map((prod) => (
                      <tr key={prod.id}>
                        <td>
                          <div className="product-actions">
                            <button
                              className="action-btn view"
                              onClick={() => handleView(prod.id)}
                            >
                              <VisibilityIcon />
                            </button>
                            <button
                              className="action-btn edit"
                              onClick={() => handleEdit(prod.id)}
                            >
                              <EditIcon />
                            </button>
                            <button
                              className="action-btn delete"
                              onClick={() => handleDelete(prod.id)}
                            >
                              <DeleteIcon />
                            </button>
                          </div>
                        </td>
                        <td>{prod.id}</td>
                        <td>{prod.name}</td>
                        <td>{prod.category}</td>
                        <td>
                          {prod.currency} {prod.price.toLocaleString()}
                        </td>
                        <td>
                          <button className="chev-btn">
                            <ChevronRightIcon />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {/* Paginación funcional */}
        {activeSection === "productos" && totalPages > 1 && (
          <div className="pagination">
            <span className="page-label">Page</span>

            {/* Botón anterior */}
            {currentPage > 1 && (
              <button
                className="page-prev"
                onClick={() => handlePageChange(currentPage - 1)}
              >
                ‹
              </button>
            )}

            {/* Números de página */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`page-number ${currentPage === page ? "active" : ""}`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            ))}

            {/* Botón siguiente */}
            {currentPage < totalPages && (
              <button
                className="page-next"
                onClick={() => handlePageChange(currentPage + 1)}
              >
                ›
              </button>
            )}

            {/* Info de productos */}
            <span className="page-info">
              Mostrando {startIndex + 1}-
              {Math.min(endIndex, filteredProductos.length)} de{" "}
              {filteredProductos.length} productos
            </span>
          </div>
        )}
      </main>

      {/* Modal para acciones */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="modal-header">
              <h3>
                {modalType === "view" && selectedProduct && "👁️ Ver Producto"}
                {modalType === "view" && selectedClient && "👁️ Ver Cliente"}
                {modalType === "edit" &&
                  selectedProduct &&
                  "✏️ Editar Producto"}
                {modalType === "edit" && selectedClient && "✏️ Editar Cliente"}
                {modalType === "delete" &&
                  selectedProduct &&
                  "🗑️ Eliminar Producto"}
                {modalType === "delete" &&
                  selectedClient &&
                  "🗑️ Eliminar Cliente"}
              </h3>
              <button className="modal-close" onClick={closeModal}>
                ×
              </button>
            </div>

            {/* Modal Body */}
            <div className="modal-body">
              {modalType === "view" && selectedProduct && (
                <div className="product-details">
                  <div className="detail-row">
                    <strong>ID:</strong> {selectedProduct.id}
                  </div>
                  <div className="detail-row">
                    <strong>Nombre:</strong> {selectedProduct.name}
                  </div>
                  <div className="detail-row">
                    <strong>Categoría:</strong> {selectedProduct.category}
                  </div>
                  <div className="detail-row">
                    <strong>Precio:</strong> {selectedProduct.currency}{" "}
                    {selectedProduct.price.toLocaleString()}
                  </div>
                  <div className="detail-row">
                    <strong>Stock:</strong> {selectedProduct.stock}
                  </div>
                  <div className="detail-row">
                    <strong>Marca:</strong> {selectedProduct.brand}
                  </div>
                  <div className="detail-row">
                    <strong>Descripción:</strong> {selectedProduct.description}
                  </div>
                  {selectedProduct.image_url && (
                    <div className="detail-row">
                      <strong>Imagen:</strong>
                      <img
                        src={selectedProduct.image_url}
                        alt={selectedProduct.name}
                        className="product-image"
                      />
                    </div>
                  )}
                </div>
              )}

              {modalType === "view" && selectedClient && (
                <div className="product-details">
                  <div className="detail-row">
                    <strong>ID:</strong> {selectedClient.id}
                  </div>
                  <div className="detail-row">
                    <strong>Nombre:</strong> {selectedClient.name}
                  </div>
                  <div className="detail-row">
                    <strong>Usuario:</strong> {selectedClient.user}
                  </div>
                  {selectedClient.email && (
                    <div className="detail-row">
                      <strong>Email:</strong> {selectedClient.email}
                    </div>
                  )}
                  {selectedClient.phone && (
                    <div className="detail-row">
                      <strong>Teléfono:</strong> {selectedClient.phone}
                    </div>
                  )}
                  {selectedClient.companyName && (
                    <div className="detail-row">
                      <strong>Compañía:</strong> {selectedClient.companyName}
                    </div>
                  )}
                  {selectedClient.seller && (
                    <div className="detail-row">
                      <strong>Vendedor:</strong> {selectedClient.seller}
                    </div>
                  )}
                  {selectedClient.modificationDate && (
                    <div className="detail-row">
                      <strong>Fecha de Modificación:</strong>{" "}
                      {selectedClient.modificationDate}
                    </div>
                  )}
                  <div className="detail-row">
                    <strong>Tipo:</strong> Cliente de Gimnasio
                  </div>
                  <div className="detail-row">
                    <strong>Estado:</strong> Activo
                  </div>
                </div>
              )}

              {modalType === "edit" && editingProduct && (
                <div className="edit-form">
                  <div className="form-group">
                    <label>Nombre:</label>
                    <input
                      type="text"
                      value={editingProduct.name}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          name: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Categoría:</label>
                    <input
                      type="text"
                      value={editingProduct.category}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          category: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Precio:</label>
                    <input
                      type="number"
                      value={editingProduct.price}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          price: parseFloat(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Stock:</label>
                    <input
                      type="number"
                      value={editingProduct.stock}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          stock: parseInt(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Marca:</label>
                    <input
                      type="text"
                      value={editingProduct.brand}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          brand: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Descripción:</label>
                    <textarea
                      value={editingProduct.description}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          description: e.target.value,
                        })
                      }
                      rows={3}
                    />
                  </div>
                </div>
              )}

              {modalType === "edit" && editingClient && (
                <div className="edit-form">
                  <div className="form-group">
                    <label>Nombre:</label>
                    <input
                      type="text"
                      value={editingClient.name}
                      onChange={(e) =>
                        setEditingClient({
                          ...editingClient,
                          name: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Usuario:</label>
                    <input
                      type="text"
                      value={editingClient.user}
                      onChange={(e) =>
                        setEditingClient({
                          ...editingClient,
                          user: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Email:</label>
                    <input
                      type="email"
                      value={editingClient.email || ""}
                      onChange={(e) =>
                        setEditingClient({
                          ...editingClient,
                          email: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Teléfono:</label>
                    <input
                      type="tel"
                      value={editingClient.phone || ""}
                      onChange={(e) =>
                        setEditingClient({
                          ...editingClient,
                          phone: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Compañía:</label>
                    <input
                      type="text"
                      value={editingClient.companyName || ""}
                      onChange={(e) =>
                        setEditingClient({
                          ...editingClient,
                          companyName: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Vendedor:</label>
                    <input
                      type="text"
                      value={editingClient.seller || ""}
                      onChange={(e) =>
                        setEditingClient({
                          ...editingClient,
                          seller: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              )}

              {modalType === "delete" && selectedProduct && (
                <div className="delete-confirmation">
                  <p>¿Estás seguro de que quieres eliminar este producto?</p>
                  <div className="product-summary">
                    <strong>{selectedProduct.name}</strong>
                    <br />
                    <span>ID: {selectedProduct.id}</span>
                    <br />
                    <span>Categoría: {selectedProduct.category}</span>
                  </div>
                  <p className="warning-text">
                    Esta acción no se puede deshacer.
                  </p>
                </div>
              )}

              {modalType === "delete" && selectedClient && (
                <div className="delete-confirmation">
                  <p>¿Estás seguro de que quieres eliminar este cliente?</p>
                  <div className="product-summary">
                    <strong>{selectedClient.name}</strong>
                    <br />
                    <span>ID: {selectedClient.id}</span>
                    <br />
                    <span>Usuario: {selectedClient.user}</span>
                  </div>
                  <p className="warning-text">
                    Esta acción no se puede deshacer.
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="modal-footer">
              {modalType === "view" && (
                <button className="btn btn-secondary" onClick={closeModal}>
                  Cerrar
                </button>
              )}

              {modalType === "edit" && (
                <>
                  <button className="btn btn-secondary" onClick={closeModal}>
                    Cancelar
                  </button>
                  <button className="btn btn-primary" onClick={handleSaveEdit}>
                    Guardar Cambios
                  </button>
                </>
              )}

              {modalType === "delete" && (
                <>
                  <button className="btn btn-secondary" onClick={closeModal}>
                    Cancelar
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={handleConfirmDelete}
                  >
                    Eliminar
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
