import { query, statusFor } from '../models/db.js';

export async function chat(request, response) {
  const message = String(request.body.message || '').trim();
  if (!message || message.length > 500) {
    return response.status(400).json({ error: 'Escribe un mensaje de hasta 500 caracteres.' });
  }
  const lower = message.toLocaleLowerCase('es');
  const products = await query('SELECT id, name, description, price FROM products WHERE available = 1 ORDER BY id');

  if (/pedido|estado|orden/i.test(lower) && request.user?.role === 'customer') {
    const orders = await query('SELECT id, fulfillment, proof_uploaded_at FROM orders WHERE user_id = ? ORDER BY id DESC LIMIT 5', [request.user.id]);
    if (!orders.length) return response.json({ reply: 'Todavía no tienes pedidos registrados.' });
    const summary = orders.map((order) => `#${order.id}: ${statusFor(order)}`).join(', ');
    return response.json({ reply: `Tus pedidos recientes son ${summary}.` });
  }
  if (/pedido|estado|orden/i.test(lower) && !request.user) {
    return response.json({ reply: 'Inicia sesión para consultar tus pedidos.' });
  }
  if (/agrega|añade|pon en.*carrito/i.test(lower)) {
    const found = products.find((product) => lower.includes(product.name.toLocaleLowerCase('es')));
    if (found) {
      return response.json({
        reply: `¿Quieres agregar ${found.name} al carrito por Bs ${Number(found.price).toFixed(2)}?`,
        action: { type: 'confirm_add_to_cart', productId: found.id },
      });
    }
  }

  const content = await query("SELECT content_key, content_value FROM site_content WHERE page = 'nosotros'");
  const cafe = Object.fromEntries(content.map((row) => [row.content_key, row.content_value]));
  const services = await query('SELECT name, description FROM services ORDER BY display_order');
  const context = JSON.stringify({ cafe, services, products });
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 25000);
  try {
    const ollama = await fetch(`${process.env.OLLAMA_URL || 'http://127.0.0.1:11434'}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: process.env.OLLAMA_MODEL || 'gemma3:4b',
        stream: false,
        messages: [
          { role: 'system', content: `Eres el asistente de CoffeeHouse. Responde en español y usa exclusivamente estos datos. Si falta información, dilo. No inventes precios, disponibilidad ni estados de pedidos. Datos: ${context}` },
          { role: 'user', content: message },
        ],
      }),
      signal: controller.signal,
    });
    if (!ollama.ok) throw new Error('Ollama no respondió correctamente.');
    const result = await ollama.json();
    response.json({ reply: result.message?.content || 'No pude responder ahora.' });
  } catch {
    response.status(503).json({ error: 'El chat no está disponible. Intenta de nuevo.' });
  } finally {
    clearTimeout(timer);
  }
}
