import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../models/db.js';

function issueToken(user) {
  return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '12h' });
}

export async function register(request, response) {
  const name = String(request.body.name || '').trim();
  const email = String(request.body.email || '').trim().toLowerCase();
  const phone = String(request.body.phone || '').trim();
  const password = String(request.body.password || '');
  if (!name || !email.includes('@') || !phone || password.length < 8) {
    return response.status(400).json({ error: 'Ingresa nombre, correo, teléfono y contraseña de al menos 8 caracteres.' });
  }
  const hash = await bcrypt.hash(password, 12);
  try {
    const result = await query('INSERT INTO users (name, email, phone, password_hash) VALUES (?, ?, ?, ?)', [name, email, phone, hash]);
    const user = { id: result.insertId, name, role: 'customer' };
    response.status(201).json({ user, token: issueToken(user) });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') return response.status(409).json({ error: 'El correo o teléfono ya está registrado.' });
    throw error;
  }
}

export async function login(request, response) {
  const identifier = String(request.body.identifier || '').trim();
  const password = String(request.body.password || '');
  if (identifier === process.env.ADMIN_USER && password === process.env.ADMIN_PASSWORD) {
    const user = { id: 0, name: identifier, role: 'admin' };
    return response.json({ user, token: issueToken(user) });
  }
  const rows = await query('SELECT id, name, password_hash FROM users WHERE email = ? OR phone = ? LIMIT 1', [identifier.toLowerCase(), identifier]);
  const row = rows[0];
  if (!row || !(await bcrypt.compare(password, row.password_hash))) {
    return response.status(401).json({ error: 'Credenciales incorrectas.' });
  }
  const user = { id: row.id, name: row.name, role: 'customer' };
  response.json({ user, token: issueToken(user) });
}
