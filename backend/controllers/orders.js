import { randomUUID } from 'node:crypto';
import { mkdir, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { db, query, statusFor } from '../models/db.js';

const uploadDirectory = path.resolve('uploads');

function formatOrder(order, items) {
  return {
    ...order,
    status: statusFor(order),
    items,
    proof_uploaded_at: order.proof_uploaded_at || null,
  };
}

export async function createOrder(request, response) {
  const fulfillment = request.body.fulfillment;
  const items = Array.isArray(request.body.items) ? request.body.items : [];
  const address = request.body.address || {};
  if (!['pickup', 'delivery'].includes(fulfillment) || !items.length || items.length > 30) {
    return response.status(400).json({ error: 'Revisa el carrito y la modalidad del pedido.' });
  }
  if (fulfillment === 'delivery' && (!address.street || !address.number || !address.zone || !address.reference)) {
    return response.status(400).json({ error: 'Completa calle, número, zona y referencia.' });
  }
  const quantities = new Map();
  for (const item of items) {
    const id = Number(item.productId);
    const quantity = Number(item.quantity);
    if (!Number.isInteger(id) || !Number.isInteger(quantity) || quantity < 1 || quantity > 20) {
      return response.status(400).json({ error: 'Hay un producto o cantidad inválidos.' });
    }
    quantities.set(id, (quantities.get(id) || 0) + quantity);
  }

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const ids = [...quantities.keys()];
    const placeholders = ids.map(() => '?').join(',');
    const [products] = await connection.execute(
      `SELECT id, name, price FROM products WHERE available = 1 AND id IN (${placeholders}) FOR UPDATE`,
      ids
    );
    if (products.length !== ids.length) {
      await connection.rollback();
      return response.status(400).json({ error: 'Un producto ya no está disponible.' });
    }
    const total = products.reduce((sum, product) => sum + Number(product.price) * quantities.get(product.id), 0);
    const [result] = await connection.execute(
      'INSERT INTO orders (user_id, fulfillment, street, street_number, zone, address_reference, total) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [request.user.id, fulfillment, fulfillment === 'delivery' ? address.street : null,
        fulfillment === 'delivery' ? address.number : null,
        fulfillment === 'delivery' ? address.zone : null,
        fulfillment === 'delivery' ? address.reference : null, total]
    );
    for (const product of products) {
      await connection.execute(
        'INSERT INTO order_items (order_id, product_id, product_name, unit_price, quantity) VALUES (?, ?, ?, ?, ?)',
        [result.insertId, product.id, product.name, product.price, quantities.get(product.id)]
      );
    }
    await connection.commit();
    response.status(201).json({ id: result.insertId, total, status: 'Pendiente comprobante' });
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function listOrders(request, response) {
  const orders = await query('SELECT * FROM orders WHERE user_id = ? ORDER BY id DESC', [request.user.id]);
  if (!orders.length) return response.json([]);
  const ids = orders.map((order) => order.id);
  const placeholders = ids.map(() => '?').join(',');
  const items = await query(`SELECT order_id, product_id, product_name, unit_price, quantity FROM order_items WHERE order_id IN (${placeholders})`, ids);
  response.json(orders.map((order) => formatOrder(order, items.filter((item) => item.order_id === order.id))));
}

export async function uploadProof(request, response) {
  const id = Number(request.params.id);
  if (!request.file || !Number.isInteger(id)) {
    return response.status(400).json({ error: 'Selecciona un archivo JPG, PNG o PDF.' });
  }
  const rows = await query('SELECT id, proof_path FROM orders WHERE id = ? AND user_id = ?', [id, request.user.id]);
  if (!rows.length) return response.status(404).json({ error: 'Pedido no encontrado.' });
  if (rows[0].proof_path) return response.status(409).json({ error: 'El pedido ya tiene comprobante.' });
  await mkdir(uploadDirectory, { recursive: true });
  const extension = { 'image/jpeg': '.jpg', 'image/png': '.png', 'application/pdf': '.pdf' }[request.file.mimetype];
  if (!extension) return response.status(400).json({ error: 'Formato de comprobante inválido.' });
  const filename = `${randomUUID()}${extension}`;
  const filepath = path.join(uploadDirectory, filename);
  await writeFile(filepath, request.file.buffer);
  try {
    const result = await query(
      'UPDATE orders SET proof_path = ?, proof_uploaded_at = NOW() WHERE id = ? AND user_id = ? AND proof_path IS NULL',
      [filename, id, request.user.id]
    );
    if (!result.affectedRows) {
      await unlink(filepath);
      return response.status(409).json({ error: 'El pedido ya tiene comprobante.' });
    }
  } catch (error) {
    await unlink(filepath);
    throw error;
  }
  response.json({ status: 'Pago confirmado' });
}
