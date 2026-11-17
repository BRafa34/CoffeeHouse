# CoffeeHouse

## Requisitos confirmados

Construir una aplicación web para una cafetería ficticia, con una página para cada una de estas secciones: Inicio, Servicios, Productos, Especialidades, Nosotros, Precios y Contactos. Inicio lleva un video de cafetería de Pexels en bucle. Nosotros incluye historia, dirección, teléfono y fotos de la tienda. Contactos incluye un formulario.

Usar Angular, Node.js y MySQL. Angular obtiene sus datos mediante APIs de Node.js. El backend contempla `models/`, `.env`, `middleware/`, `controllers/`, `app.js` y el módulo de chatbot. Implementar el chatbot con Ollama y Gemma 3. Subir el proyecto a GitHub y compartir el frontend y el backend.

Decisiones respondidas durante la planificación:

- Idioma del sitio: español.
- Moneda del menú: bolivianos (BOB).
- Navegación: agregar la sección Productos a los bloques solicitados.
- Entrega: primero se ejecutará en local y GitHub se abordará después.
- Nombre de la cafetería ficticia: CoffeeHouse.
- Ubicación ficticia: Cochabamba, Bolivia.
- Referencia visual: usar solo los colores y el ambiente de la captura, sin reproducir su composición exacta.
- Estructura: una página por sección.
- Productos: catálogo con filtros, búsqueda y pedidos en línea.
- Contenido ficticio: combinar los datos aportados por el usuario con propuestas del asistente para su revisión.
- Pedidos: permitir retiro en la cafetería y envío a domicilio.
- Clientes: crear cuentas de clientes.
- Pago con QR ficticio: la web muestra el QR y el cliente sube un comprobante.
- Cuentas: registro e inicio de sesión para comprar.
- Gestión de pedidos: guardar los pedidos y mostrar su estado al cliente.
- Envío a domicilio: pedir la dirección del cliente y no cobrar por el envío.
- Productos: un precio por producto.
- Al subir el comprobante, el pedido pasa automáticamente a «Pago confirmado» en esta demo ficticia.
- El formulario de contactos guarda los mensajes en MySQL.
- Las cuentas permiten iniciar sesión con correo o teléfono y contraseña.
- El chatbot responde sobre la cafetería y el menú, ayuda a elegir productos y permite consultar estados de pedidos.
- El chat conserva el contexto solo mientras la página está abierta.
- El chat consulta únicamente los pedidos de la cuenta que inició sesión.
- El chat puede agregar productos al carrito.
- Modelo Ollama elegido: `gemma3:4b`.
- Catálogo inicial: entre 8 y 12 productos.
- Servicios: consumo en el local, retiro en la cafetería y envío a domicilio.
- La historia, dirección, teléfono y horario ficticios de Nosotros quedaron aprobados.
- Catálogo: cafés, infusiones, bebidas frías y postres.
- Especialidades: destacar cuatro productos del catálogo.
- Video elegido: [interior cálido de una cafetería, 10 s](https://www.pexels.com/video/cozy-indoor-cafe-with-autumn-decor-and-brick-walls-29003319/).
- Fotos del sitio: recursos de Pexels.
- Título y eslogan elegidos: «CoffeeHouse · Tu pausa favorita en Cochabamba».
- El menú de diez productos, sus precios y cuatro especialidades quedaron aprobados.
- Contactos: formulario con nombre, teléfono y mensaje.
- Encabezado: botones «Ingresar» y «Registrarse».
- Precios: menú visual con fotos y precios.
- Registro de clientes: nombre, correo, teléfono y contraseña.
- Los clientes ven el pedido en la pantalla de confirmación y en «Mis pedidos».
- Estados del pedido: Pendiente comprobante, Pago confirmado, En preparación y Listo. Para domicilio se añade En camino.
- Todo el contenido de cada página y la navegación se obtienen mediante la API de Node.js.
- Guardar en MySQL enlaces al video y a las fotos de Pexels.
- Registrar en `DECISIONES_PARA_ESCALAR.md` las decisiones de la demo que habría que revisar antes de ofrecer el sistema como producto.
- Entorno local de base de datos: XAMPP con MySQL o MariaDB.
- Framework del backend: Express.
- Simulación de estados: los 15 y 20 segundos se cuentan desde que el cliente sube el comprobante.
- Comprobantes admitidos: JPG, PNG y PDF.
- QR de demostración generado en `assets/qr-pago-demo.png`, con el texto «CoffeeHouse DEMO · Pago ficticio».
- Guardar los comprobantes JPG, PNG y PDF en una carpeta del backend y guardar sus rutas en MySQL.
- Después de la demo local, subir frontend y backend juntos a un repositorio de GitHub.
- Dirección de envío: calle, número, zona y referencia.
- Filtros del catálogo: categoría, precio y especialidades.
- El asistente elegirá fotos de Pexels durante la implementación y se las mostrará al usuario para revisión.
- Crear un panel interno con una cuenta administradora para la demo. Permite editar productos, precios y servicios.
- Conservar el carrito al cerrar y volver a abrir el navegador.
- Para pedidos a domicilio, activar automáticamente «En camino» cinco segundos después de «Listo», es decir, 25 segundos después de subir el comprobante.
- Configurar el usuario y la contraseña de la cuenta administradora en el `.env` del backend.
- «En camino» es el último estado de un pedido a domicilio en la demo. «Listo» es el último estado de un pedido para retiro.
- La recuperación de contraseñas queda para una versión posterior.
- Ollama con `gemma3:4b` se ejecutará en el mismo equipo que la demo local.
- El repositorio de GitHub será público.
- La entrega consiste en una demo local y el enlace al código del repositorio público.
- El sitio debe funcionar en escritorio y móvil.
- El chatbot solicita confirmación antes de agregar un producto al carrito.

## Estado del trabajo

El usuario fijó como objetivo una aplicación local y repositorio público para las 20:15 del 16 de noviembre de 2026, con límite a las 20:30, hora de Cochabamba. Después indicó que la publicación en GitHub quedará pendiente. La conexión del navegador a GitHub fue rechazada por el control de acceso. El usuario creó la base en phpMyAdmin y hará la importación manual de `database/schema.sql` y `database/seed.sql`. Ollama ya está en ejecución según el usuario.

El frontend Angular y la API Express están implementados y arrancados en los puertos 4200 y 3000. El frontend compiló correctamente. Falta verificar la importación, la carga de datos desde MySQL, los flujos de cliente y administrador, y el chat con Ollama. La navegación pública incluye Productos y no incluye Usuarios. El acceso a las cuentas aparece como «Ingresar» y «Registrarse».

## Contenido ficticio aprobado

Estos datos son ficticios y fueron aprobados por el usuario para la demostración.

**Nosotros.** CoffeeHouse es una cafetería imaginaria de Cochabamba que reúne cafés, infusiones, bebidas frías y postres en un espacio cálido para conversar o tomar una pausa. Dirección ficticia: Pasaje Grano de Oro 123, zona Centro, Cochabamba. Teléfono ficticio de demostración: 000 00000. Correo de demostración: hola@coffeehouse.example. Horario: lunes a sábado de 08:00 a 20:00 y domingo de 09:00 a 18:00.

| Categoría | Producto | Precio (BOB) | Especialidad |
| --- | --- | ---: | --- |
| Cafés | Espresso | 16 | No |
| Cafés | Capuchino | 24 | No |
| Cafés | Latte de vainilla | 27 | Sí |
| Infusiones | Té negro | 16 | No |
| Infusiones | Infusión de frutos rojos | 19 | Sí |
| Bebidas frías | Cold brew | 25 | No |
| Bebidas frías | Frappé de moka | 30 | Sí |
| Postres | Brownie de chocolate | 22 | No |
| Postres | Cheesecake de frutos rojos | 28 | Sí |
| Postres | Torta de zanahoria | 26 | No |

## Frontend

Crear una página por sección, con navegación entre ellas y diseño adaptable a escritorio y móvil. Usar los colores y el ambiente de la captura como referencia.

| Página | Contenido y comportamiento |
| --- | --- |
| Inicio | Barra con marca y navegación, título y subtítulo sobre un video de cafetería, y botón «Explorar menú» que lleva a Productos. |
| Servicios | Listado de todos los servicios que ofrece la cafetería, con nombre, descripción e imagen cuando corresponda. |
| Productos | Catálogo con búsqueda, filtros por categoría, precio y especialidades, y pedidos en línea. |
| Especialidades | Productos destacados del mismo catálogo que alimenta Productos y Precios. |
| Nosotros | Historia, dirección, teléfono, horarios y galería con fotos de la tienda. |
| Precios | Menú visual por categorías, con fotos y precios en bolivianos. |
| Contactos | Formulario con nombre, teléfono y mensaje. Mostrar estados de envío, confirmación y error. |

El encabezado incluye «Ingresar» y «Registrarse». La compra incorpora la pantalla de confirmación y una página «Mis pedidos» para el cliente autenticado.

El panel interno permite a una cuenta administradora de demostración editar productos, sus precios y servicios.

El carrito se conserva al cerrar y reabrir el navegador. Antes de agregar un producto solicitado mediante el chatbot, el usuario confirma la acción.

- Cargar mediante `HttpClient` todo el contenido de cada página y la navegación desde la API de Node.js. Esto incluye textos, rótulos, enlaces al video y las fotos, servicios y precios. Mantener en Angular la estructura técnica y los estilos.
- Cargar desde un script de MySQL los datos ficticios que confirme el usuario para la demo.
- Guardar en MySQL los enlaces de las fotos y del [video elegido en Pexels](https://www.pexels.com/video/cozy-indoor-cafe-with-autumn-decor-and-brick-walls-29003319/). La API entrega los enlaces al frontend. Registrar el enlace original y la [licencia del recurso](https://www.pexels.com/license/). Usar reproducción automática sin sonido, en bucle y en línea, con control de pausa y una imagen de portada para movimiento reducido o si el video falla.

## Backend

Usar Node.js con Express. `backend/app.js` configura rutas y middleware. `controllers/` procesa solicitudes, `models/` consulta MySQL, `middleware/` valida acceso y `chatbot/` consume Ollama.

- Usar `backend/.env` para el puerto, la conexión MySQL, el origen permitido del frontend y `OLLAMA_URL` y `OLLAMA_MODEL`. Versionar `backend/.env.example` con valores de ejemplo y excluir `.env` del repositorio. Configurar CORS para el origen de Angular si se ejecuta en otro origen.
- Validar las entradas en el servidor y usar consultas parametrizadas. Guardar los mensajes de contacto en MySQL. Mostrar confirmación tras guardarlos y mantenerlos fuera de las respuestas públicas de la API y del contexto del chat.

### API implementada

| Ruta | Uso |
| --- | --- |
| `GET /api/health` | Comprobar que el backend está disponible. |
| `GET /api/content` | Textos, navegación, servicios, categorías, productos y enlaces multimedia desde MySQL. |
| `POST /api/contact` | Validar y guardar nombre, teléfono y mensaje. |
| `POST /api/auth/register` | Crear cuenta de cliente. |
| `POST /api/auth/login` | Iniciar sesión de cliente o administrador. |
| `GET /api/auth/me` | Consultar la cuenta activa. |
| `POST /api/orders` | Crear pedido y calcular los precios en el servidor. |
| `GET /api/orders` | Listar los pedidos del cliente autenticado con estados calculados por tiempo. |
| `POST /api/orders/:id/proof` | Guardar el comprobante del pedido propio. |
| `POST /api/chat` | Responder con Ollama, consultar pedidos propios o proponer agregar un producto al carrito. |
| `POST /api/admin/products`, `PUT /api/admin/products/:id` | Crear y editar productos con cuenta administradora. |
| `POST /api/admin/services`, `PUT /api/admin/services/:id` | Crear y editar servicios con cuenta administradora. |

El contrato del pedido incluirá la modalidad de retiro o envío, el cliente autenticado y el comprobante de pago. Para envío se pedirá la dirección y el costo de entrega será cero. El estado cambiará automáticamente a Pago confirmado al recibir el comprobante y después avanzará por tiempo a En preparación y Listo.

## Esquema de MySQL

`database/schema.sql` crea la base y las tablas. `database/seed.sql` incorpora los datos ficticios aprobados para una base nueva.

| Tabla | Datos principales |
| --- | --- |
| `site_content` | Textos y rótulos por página. |
| `media` | URL de la página de Pexels, URL del recurso, tipo y texto alternativo. |
| `navigation` | Etiqueta, ruta y orden de los enlaces. |
| `services` | Nombre, descripción, imagen opcional y orden. |
| `categories` | Nombre y orden de las categorías del menú. |
| `products` | Categoría, nombre, descripción, imagen, precio en BOB, disponibilidad y especialidad. |
| `users` | Nombre, correo, teléfono y hash de contraseña de clientes. |
| `orders` | Cliente, modalidad, dirección, total, nombre del comprobante y fecha de subida. |
| `order_items` | Productos, cantidades y precios guardados al crear cada pedido. |
| `contact_messages` | Nombre, teléfono, mensaje y fecha de recepción. |

## Chatbot

- Implementar el chat para CoffeeHouse desde cero, con Ollama y Gemma 3.
- Desde Node.js, construir el contexto con los datos públicos de MySQL y enviar la consulta a `POST /api/chat` de [Ollama](https://docs.ollama.com/api/chat) con `gemma3:4b`. Mantener el nombre del modelo configurable en `.env`.
- Atender en español preguntas sobre productos, precios, servicios, ubicación y horarios. Ayudar a elegir productos, agregar al carrito y consultar exclusivamente el estado de pedidos de la cuenta autenticada. Comprobar en el backend la propiedad del pedido y la existencia y precio de cada producto antes de actuar. Pedir al modelo que indique cuando falten datos. Aplicar límites al mensaje y al tiempo de espera. Si Ollama falla, informar en el chat y permitir reintentar.
- Mantener el historial solo mientras la página está abierta.

## Orden de implementación y entrega

El código está organizado en `frontend/`, `backend/`, `database/` y `README.md`. La publicación en un repositorio público de GitHub queda pendiente según la última indicación del usuario.

1. Importar `database/schema.sql` y `database/seed.sql` en MySQL desde phpMyAdmin y comprobar `GET /api/health`.
2. Revisar las siete páginas públicas, la navegación, el video, las fotos y la vista móvil.
3. Registrar un cliente, crear un pedido, subir un comprobante y comprobar los estados de la simulación.
4. Iniciar sesión como administrador y verificar la edición de productos y servicios.
5. Con Ollama disponible, comprobar preguntas sobre el menú, la propuesta para agregar al carrito y el estado de pedidos propios.
6. Cuando el usuario retome la publicación, subir el repositorio público y compartir el enlace.
