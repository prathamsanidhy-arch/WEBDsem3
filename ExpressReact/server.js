import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, 'products.json');

const app = express();
app.use(cors());
app.use(express.json());

const ensureDataFile = () => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '[]', 'utf-8');
  }
};

const readProducts = () => {
  ensureDataFile();
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
};

const writeProducts = (products) => {
  fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
};

app.get('/api/products', (req, res) => {
  try {
    const products = readProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Failed to read products', error: error.message });
  }
});

app.post('/api/products', (req, res) => {
  try {
    const products = readProducts();
    const { name, price, category } = req.body || {};

    if (!name || !price || !category) {
      return res.status(400).json({ message: 'All product fields are required.' });
    }

    const newProduct = {
      id: Date.now(),
      name: String(name).trim(),
      price: Number(price),
      category: String(category).trim(),
    };

    products.push(newProduct);
    writeProducts(products);

    return res.status(201).json(newProduct);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to add product', error: error.message });
  }
});

app.delete('/api/products/:id', (req, res) => {
  try {
    const products = readProducts();
    const id = Number(req.params.id);

    const remainingProducts = products.filter((product) => product.id !== id);

    if (remainingProducts.length === products.length) {
      return res.status(404).json({ message: 'Product not found' });
    }

    writeProducts(remainingProducts);
    return res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete product', error: error.message });
  }
});

app.get('/', (req, res) => {
  res.send('Product API is running');
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
