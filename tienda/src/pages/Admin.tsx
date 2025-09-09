import '../Styles/Admin.css';
import { useState } from 'react';
import log from '../assets/foto1.png';
import { Search as SearchIcon, Visibility as VisibilityIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

interface Product {
  id: string;
  name: string;
  user: string;
}

const Admin = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<Product[]>([
    { id: '122', name: 'Laura Sofía Mora Ruiz', user: 'Laura Sofía Mora Ruiz' },
    { id: '122', name: 'Laura Sofía Mora Ruiz', user: 'Laura Sofía Mora Ruiz' },
    { id: '122', name: 'Laura Sofía Mora Ruiz', user: 'Laura Sofía Mora Ruiz' },
    { id: '122', name: 'Laura Sofía Mora Ruiz', user: 'Laura Sofía Mora Ruiz' },
    { id: '122', name: 'Laura Sofía Mora Ruiz', user: 'Laura Sofía Mora Ruiz' },
  ]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleView = (id: string) => {
    console.log('View product', id);
  };

  const handleEdit = (id: string) => {
    console.log('Edit product', id);
  };

  const handleDelete = (id: string) => {
    console.log('Delete product', id);
  };

  return (
    <div className="admin">
      <aside className="admin__sidebar">
        <div className="logo-container">
          <img className="logo" src={log} alt="Logo" />
        </div>
        <nav className="sidebar-nav">
          <ul>
            <li className="active">🚲 Bicicletas</li>
            <li>📦 Productos</li>
          </ul>
        </nav>
      </aside>

      <main className="admin__content">
        <header className="admin-header">
          <h1>Venta para Gym</h1>
          <div className="user-info">
            <span className="user-name">Norbey López</span>
            <div className="user-avatar">👤</div>
          </div>
        </header>

        <section className="search-section">
          <div className="search-box">
            <input
              type="text"
              placeholder="Buscar por ID o Nombre"
              value={searchTerm}
              onChange={handleSearch}
            />
            <button>
              <SearchIcon />
            </button>
          </div>
        </section>

        <section className="products-section">
          {filteredProducts.map((product, index) => (
            <div className="product-card" key={index}>
              <div>
                <p className="product-id">ID: {product.id}</p>
                <h3 className="product-name">{product.name}</h3>
              </div>
              <div className="product-actions">
                <button className="view" onClick={() => handleView(product.id)}>
                  <VisibilityIcon />
                </button>
                <button className="edit" onClick={() => handleEdit(product.id)}>
                  <EditIcon />
                </button>
                <button className="delete" onClick={() => handleDelete(product.id)}>
                  <DeleteIcon />
                </button>
              </div>
            </div>
          ))}
        </section>

        <div className="pagination">
          <button className="page-number active">1</button>
          <button className="page-number">2</button>
          <button className="page-number">3</button>
          <button className="next-page">›</button>
        </div>
      </main>
    </div>
  );
};

export default Admin;
