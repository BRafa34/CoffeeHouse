import { query } from '../models/db.js';

function productValues(body) {
  return {
    categoryId: Number(body.category_id),
    name: String(body.name || '').trim(),
    description: String(body.description || '').trim(),
    price: Number(body.price),
    imageUrl: body.image_url ? String(body.image_url).trim() : null,
    specialty: Boolean(body.specialty),
    available: body.available !== false,
  };
}

function validProduct(value) {
  return Number.isInteger(value.categoryId) && value.categoryId > 0 &&
    value.name.length > 0 && value.name.length <= 120 &&
    value.description.length <= 3000 &&
    Number.isFinite(value.price) && value.price >= 0 && value.price <= 999999;
}

export async function saveProduct(request, response) {
  const product = productValues(request.body);
  if (!validProduct(product)) return response.status(400).json({ error: 'Revisa los datos del producto.' });
  const values = [product.categoryId, product.name, product.description, product.price,
    product.imageUrl, product.specialty, product.available];
  if (request.params.id) {
    const result = await query(
      'UPDATE products SET category_id=?, name=?, description=?, price=?, image_url=?, specialty=?, available=? WHERE id=?',
      [...values, Number(request.params.id)]
    );
    if (!result.affectedRows) return response.status(404).json({ error: 'Producto no encontrado.' });
    return response.json({ id: Number(request.params.id) });
  }
  const result = await query(
    'INSERT INTO products (category_id, name, description, price, image_url, specialty, available) VALUES (?, ?, ?, ?, ?, ?, ?)', values
  );
  response.status(201).json({ id: result.insertId });
}

export async function saveService(request, response) {
  const name = String(request.body.name || '').trim();
  const description = String(request.body.description || '').trim();
  const imageUrl = request.body.image_url ? String(request.body.image_url).trim() : null;
  if (!name || name.length > 120 || description.length > 3000) {
    return response.status(400).json({ error: 'Revisa los datos del servicio.' });
  }
  if (request.params.id) {
    const result = await query('UPDATE services SET name=?, description=?, image_url=? WHERE id=?',
      [name, description, imageUrl, Number(request.params.id)]);
    if (!result.affectedRows) return response.status(404).json({ error: 'Servicio no encontrado.' });
    return response.json({ id: Number(request.params.id) });
  }
  const result = await query('INSERT INTO services (name, description, image_url) VALUES (?, ?, ?)',
    [name, description, imageUrl]);
  response.status(201).json({ id: result.insertId });
}
