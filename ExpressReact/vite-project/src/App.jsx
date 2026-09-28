import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');

  const getProducts = async () => {
    const response = await fetch('http://localhost:5000/api/products');
    const data = await response.json();
    setProducts(data);
  };

  useEffect(() => {
    getProducts();
  }, []);

  const addProduct = async (event) => {
    event.preventDefault();

    if (!name.trim() || !price || !category.trim()) return;

    const product = {
      name,
      price,
      category,
    };

    await fetch('http://localhost:5000/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    });

    setName('');
    setPrice('');
    setCategory('');
    getProducts();
  };

  const deleteProduct = async (id) => {
    await fetch(`http://localhost:5000/api/products/${id}`, {
      method: 'DELETE',
    });
    getProducts();
  };

  return (
    <div className="app-shell">
      <div className="card">
        <h1>Product Management System</h1>

        <form className="product-form" onSubmit={addProduct}>
          <input
            type="text"
            placeholder="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <input
            type="text"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <button type="submit">Add Product</button>
        </form>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Price</th>
              <th>Category</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>₹{Number(product.price).toFixed(2)}</td>
                <td>{product.category}</td>
                <td>
                  <button className="delete-btn" onClick={() => deleteProduct(product.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;

