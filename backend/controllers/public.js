import { query } from '../models/db.js';

export async function content(_request, response) {
  const [contentRows, navigation, categories, products, services, media] = await Promise.all([
    query('SELECT page, content_key, content_value FROM site_content'),
    query('SELECT label, path FROM navigation ORDER BY display_order'),
    query('SELECT id, name FROM categories ORDER BY display_order'),
    query('SELECT id, category_id, name, description, price, image_url, specialty, available FROM products ORDER BY id'),
    query('SELECT id, name, description, image_url FROM services ORDER BY display_order'),
    query('SELECT id, page, kind, source_page_url, file_url, alt_text FROM media ORDER BY display_order'),
  ]);
  const pages = {};
  for (const row of contentRows) {
    pages[row.page] ??= {};
    pages[row.page][row.content_key] = row.content_value;
  }
  response.json({ pages, navigation, categories, products, services, media });
}

export async function contact(request, response) {
  const name = String(request.body.name || '').trim();
  const phone = String(request.body.phone || '').trim();
  const message = String(request.body.message || '').trim();
  if (!name || !phone || !message || name.length > 120 || phone.length > 40 || message.length > 3000) {
    return response.status(400).json({ error: 'Completa nombre, teléfono y mensaje.' });
  }
  await query('INSERT INTO contact_messages (name, phone, message) VALUES (?, ?, ?)', [name, phone, message]);
  response.status(201).json({ message: 'Mensaje recibido.' });
}
