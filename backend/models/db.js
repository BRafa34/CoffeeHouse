import mysql from 'mysql2/promise';

export const db = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'coffeehouse',
  waitForConnections: true,
  connectionLimit: 10,
  decimalNumbers: true,
});

export async function query(sql, params = []) {
  const [rows] = await db.execute(sql, params);
  return rows;
}

export function statusFor(order) {
  if (!order.proof_uploaded_at) return 'Pendiente comprobante';
  const elapsed = Date.now() - new Date(order.proof_uploaded_at).getTime();
  if (order.fulfillment === 'delivery' && elapsed >= 25000) return 'En camino';
  if (elapsed >= 20000) return 'Listo';
  if (elapsed >= 15000) return 'En preparación';
  return 'Pago confirmado';
}
