import express from 'express';
import cors from 'cors';
import clientesRoutes from './routes/clientes.routes.js';
import productosRoutes from './routes/productos.routes.js';
import usuariosRoutes from './routes/usuarios.routes.js';
import pedidosRoutes from './routes/pedidos.routes.js';

import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true
};
app.use(cors(corsOptions));

// ✅ aquí recién agregas esta línea
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rutas
app.use('/api', clientesRoutes);
app.use('/api', productosRoutes);
app.use('/api', usuariosRoutes);
app.use('/api', pedidosRoutes);

// Ruta por defecto
app.use((req, resp) => {
  resp.status(400).json({ message: 'Bienvenido' });
});

export default app;

