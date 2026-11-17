import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { query } from './models/db.js';
import { optionalUser, requireAdmin, requireUser } from './middleware/auth.js';
import { content, contact } from './controllers/public.js';
import { login, register } from './controllers/auth.js';
import { createOrder, listOrders, uploadProof } from './controllers/orders.js';
import { saveProduct, saveService } from './controllers/admin.js';
import { chat } from './chatbot/chat.js';

const app = express();
const directory = path.dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PORT || 3000);

if (!process.env.JWT_SECRET || !process.env.ADMIN_USER || !process.env.ADMIN_PASSWORD) {
  throw new Error('Configura JWT_SECRET, ADMIN_USER y ADMIN_PASSWORD en backend/.env');
}

app.use(cors({ origin: [process.env.FRONTEND_ORIGIN || 'http://localhost:4200', 'http://127.0.0.1:4200'] }));
app.use(express.json({ limit: '1mb' }));
app.use(optionalUser);
app.use('/assets', express.static(path.resolve(directory, '../assets')));

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_request, file, callback) => {
    callback(null, ['image/jpeg', 'image/png', 'application/pdf'].includes(file.mimetype));
  },
});

app.get('/api/health', async (_request, response) => {
  await query('SELECT 1');
  response.json({ status: 'ok' });
});
app.get('/api/content', content);
app.post('/api/contact', contact);
app.post('/api/auth/register', register);
app.post('/api/auth/login', login);
app.get('/api/auth/me', (request, response) => {
  if (!request.user) return response.status(401).json({ error: 'Sesión no iniciada.' });
  response.json({ user: request.user });
});
app.post('/api/orders', requireUser, createOrder);
app.get('/api/orders', requireUser, listOrders);
app.post('/api/orders/:id/proof', requireUser, upload.single('proof'), uploadProof);
app.post('/api/chat', chat);
app.post('/api/admin/products', requireAdmin, saveProduct);
app.put('/api/admin/products/:id', requireAdmin, saveProduct);
app.post('/api/admin/services', requireAdmin, saveService);
app.put('/api/admin/services/:id', requireAdmin, saveService);

app.use((error, _request, response, _next) => {
  if (error instanceof multer.MulterError) {
    return response.status(400).json({ error: 'El archivo supera el límite de 5 MB.' });
  }
  console.error(error);
  response.status(500).json({ error: 'Ocurrió un error en el servidor.' });
});

app.listen(port, () => console.log(`CoffeeHouse API: http://localhost:${port}`));
