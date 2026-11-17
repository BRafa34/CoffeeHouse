USE coffeehouse;

INSERT INTO site_content (page, content_key, content_value) VALUES
('global', 'brand', 'CoffeeHouse'),
('global', 'login', 'Ingresar'),
('global', 'register', 'Registrarse'),
('global', 'orders', 'Mis pedidos'),
('global', 'cart', 'Carrito'),
('global', 'footer', 'Proyecto de demostración'),
('inicio', 'title', 'CoffeeHouse'),
('inicio', 'location', 'COCHABAMBA · BOLIVIA'),
('inicio', 'tagline', 'Tu pausa favorita en Cochabamba'),
('inicio', 'intro', 'Cafés, infusiones y postres para disfrutar a tu ritmo.'),
('inicio', 'button', 'Explorar menú'),
('servicios', 'title', 'Servicios'),
('servicios', 'intro', 'Disfruta CoffeeHouse como prefieras.'),
('productos', 'title', 'Productos'),
('productos', 'intro', 'Encuentra tu próxima taza favorita.'),
('especialidades', 'title', 'Especialidades'),
('especialidades', 'intro', 'Cuatro favoritos de nuestra casa.'),
('nosotros', 'title', 'Nosotros'),
('nosotros', 'story', 'CoffeeHouse es una cafetería imaginaria de Cochabamba que reúne cafés, infusiones, bebidas frías y postres en un espacio cálido para conversar o tomar una pausa.'),
('nosotros', 'address', 'Pasaje Grano de Oro 123, zona Centro, Cochabamba (dirección ficticia)'),
('nosotros', 'phone', '000 00000 (teléfono ficticio)'),
('nosotros', 'email', 'hola@coffeehouse.example'),
('nosotros', 'hours', 'Lunes a sábado 08:00–20:00 · Domingo 09:00–18:00'),
('precios', 'title', 'Precios'),
('precios', 'intro', 'Consulta el menú en bolivianos.'),
('contactos', 'title', 'Contactos'),
('contactos', 'intro', 'Escríbenos y deja tu mensaje.');

INSERT INTO navigation (label, path, display_order) VALUES
('Inicio', '/', 1),
('Servicios', '/servicios', 2),
('Productos', '/productos', 3),
('Especialidades', '/especialidades', 4),
('Nosotros', '/nosotros', 5),
('Precios', '/precios', 6),
('Contactos', '/contactos', 7);

INSERT INTO categories (name, display_order) VALUES
('Cafés', 1),
('Infusiones', 2),
('Bebidas frías', 3),
('Postres', 4);

INSERT INTO products (category_id, name, description, price, specialty) VALUES
(1, 'Espresso', 'Café corto e intenso.', 16, FALSE),
(1, 'Capuchino', 'Espresso con leche y espuma cremosa.', 24, FALSE),
(1, 'Latte de vainilla', 'Café con leche y un toque de vainilla.', 27, TRUE),
(2, 'Té negro', 'Infusión clásica y aromática.', 16, FALSE),
(2, 'Infusión de frutos rojos', 'Infusión frutal de sabor suave.', 19, TRUE),
(3, 'Cold brew', 'Café extraído en frío.', 25, FALSE),
(3, 'Frappé de moka', 'Bebida fría de café y chocolate.', 30, TRUE),
(4, 'Brownie de chocolate', 'Brownie de chocolate de textura suave.', 22, FALSE),
(4, 'Cheesecake de frutos rojos', 'Tarta de queso con frutos rojos.', 28, TRUE),
(4, 'Torta de zanahoria', 'Porción de torta de zanahoria.', 26, FALSE);

INSERT INTO services (name, description, display_order) VALUES
('Consumo en el local', 'Encuentra un espacio para disfrutar tu pedido.', 1),
('Retiro en cafetería', 'Haz tu pedido en línea y recógelo en CoffeeHouse.', 2),
('Envío a domicilio', 'Recibe tu pedido en la dirección indicada, sin costo de envío en esta demo.', 3);

UPDATE products SET image_url = CASE name
  WHEN 'Espresso' THEN 'https://images.pexels.com/photos/24783440/pexels-photo-24783440.jpeg?auto=compress&cs=tinysrgb&w=900'
  WHEN 'Capuchino' THEN 'https://images.pexels.com/photos/9050519/pexels-photo-9050519.jpeg?auto=compress&cs=tinysrgb&w=900'
  WHEN 'Latte de vainilla' THEN 'https://images.pexels.com/photos/26161036/pexels-photo-26161036.jpeg?auto=compress&cs=tinysrgb&w=900'
  WHEN 'Té negro' THEN 'https://images.pexels.com/photos/12698359/pexels-photo-12698359.jpeg?auto=compress&cs=tinysrgb&w=900'
  WHEN 'Infusión de frutos rojos' THEN 'https://images.pexels.com/photos/2633397/pexels-photo-2633397.jpeg?auto=compress&cs=tinysrgb&w=900'
  WHEN 'Cold brew' THEN 'https://images.pexels.com/photos/34046801/pexels-photo-34046801.jpeg?auto=compress&cs=tinysrgb&w=900'
  WHEN 'Frappé de moka' THEN 'https://images.pexels.com/photos/10027268/pexels-photo-10027268.jpeg?auto=compress&cs=tinysrgb&w=900'
  WHEN 'Brownie de chocolate' THEN 'https://images.pexels.com/photos/33312981/pexels-photo-33312981.jpeg?auto=compress&cs=tinysrgb&w=900'
  WHEN 'Cheesecake de frutos rojos' THEN 'https://images.pexels.com/photos/19048375/pexels-photo-19048375.jpeg?auto=compress&cs=tinysrgb&w=900'
  WHEN 'Torta de zanahoria' THEN 'https://images.pexels.com/photos/5742606/pexels-photo-5742606.jpeg?auto=compress&cs=tinysrgb&w=900'
END;

UPDATE services SET image_url = CASE name
  WHEN 'Consumo en el local' THEN 'https://images.pexels.com/photos/5851732/pexels-photo-5851732.jpeg?auto=compress&cs=tinysrgb&w=900'
  WHEN 'Retiro en cafetería' THEN 'https://images.pexels.com/photos/7162906/pexels-photo-7162906.jpeg?auto=compress&cs=tinysrgb&w=900'
  WHEN 'Envío a domicilio' THEN 'https://images.pexels.com/photos/1833769/pexels-photo-1833769.jpeg?auto=compress&cs=tinysrgb&w=900'
END;

INSERT INTO media (page, kind, source_page_url, file_url, alt_text, display_order) VALUES
('inicio', 'video',
 'https://www.pexels.com/video/cozy-indoor-cafe-with-autumn-decor-and-brick-walls-29003319/',
 'https://videos.pexels.com/video-files/29003319/12542890_3840_2160_30fps.mp4',
 NULL, 1),
('inicio', 'poster',
 'https://www.pexels.com/photo/an-empty-coffee-shop-12570668/',
 'https://images.pexels.com/photos/12570668/pexels-photo-12570668.jpeg?auto=compress&cs=tinysrgb&w=1600',
 'Interior ilustrativo de cafetería', 2),
('nosotros', 'gallery',
 'https://www.pexels.com/photo/the-interior-of-a-coffee-shop-5851732/',
 'https://images.pexels.com/photos/5851732/pexels-photo-5851732.jpeg?auto=compress&cs=tinysrgb&w=1200',
 'Interior ilustrativo de cafetería', 1),
('nosotros', 'gallery',
 'https://www.pexels.com/photo/coffee-shop-1833769/',
 'https://images.pexels.com/photos/1833769/pexels-photo-1833769.jpeg?auto=compress&cs=tinysrgb&w=1200',
 'Mesas de cafetería ilustrativa', 2),
('nosotros', 'gallery',
 'https://www.pexels.com/photo/cozy-cafe-interior-with-vintage-decor-and-lighting-30748242/',
 'https://images.pexels.com/photos/30748242/pexels-photo-30748242.jpeg?auto=compress&cs=tinysrgb&w=1200',
 'Ambiente ilustrativo de cafetería', 3);
