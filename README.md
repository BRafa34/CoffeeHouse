# CoffeeHouse

Demo de una cafetería ficticia en Cochabamba. Incluye Angular, Node.js con Express, MySQL o MariaDB de XAMPP y un chatbot local con Ollama y `gemma3:4b`.

## Estructura

- `frontend/` contiene la aplicación Angular.
- `backend/` contiene la API, autenticación, pedidos, administración y chat.
- `database/` contiene el esquema y los datos ficticios.
- `assets/qr-pago-demo.png` contiene el QR de demostración.
- `AGENTS.md` registra las decisiones del proyecto.
- `DECISIONES_PARA_ESCALAR.md` registra los cambios a evaluar antes de usarlo con una cafetería real.

## Ejecutar en local

1. Inicia **MySQL** desde el panel de XAMPP.
2. Importa `database/schema.sql` y luego `database/seed.sql` desde phpMyAdmin. El script de datos se usa una vez en una base nueva.
3. Copia `backend/.env.example` como `backend/.env`. Ajusta el puerto y usuario de MySQL, `JWT_SECRET`, `ADMIN_USER` y `ADMIN_PASSWORD`. El archivo `.env` se mantiene fuera de Git.
4. Inicia Ollama y descarga el modelo con `ollama pull gemma3:4b` si aún no está instalado.
5. En una terminal dentro de `backend/`, ejecuta `npm install` y `npm run dev`.
6. En otra terminal dentro de `frontend/`, ejecuta `npm install` y `npm start`.
7. Abre [http://localhost:4200](http://localhost:4200). La API responde en [http://localhost:3000/api/health](http://localhost:3000/api/health).

Para entrar al panel, usa los valores `ADMIN_USER` y `ADMIN_PASSWORD` del `.env` en la página «Ingresar». Las cuentas de clientes se crean desde «Registrarse».

## Recorrido de la demo

1. Explora las páginas de Servicios, Productos, Especialidades, Nosotros, Precios y Contactos. El contenido y la navegación llegan desde la API.
2. Registra una cuenta de cliente, agrega productos al carrito y selecciona retiro o envío gratuito.
3. Confirma el pedido y sube un comprobante JPG, PNG o PDF. El QR codifica «CoffeeHouse DEMO · Pago ficticio».
4. El estado cambia a «Pago confirmado» al subir el archivo, «En preparación» a los 15 segundos y «Listo» a los 20 segundos. En domicilio aparece «En camino» a los 25 segundos.
5. Consulta «Mis pedidos» o pregunta al chatbot por los pedidos de la cuenta iniciada. También puedes pedir recomendaciones y confirmar un producto antes de agregarlo al carrito.
6. Entra con la cuenta administradora para crear o editar productos, precios y servicios.

Los comprobantes se guardan en `backend/uploads/` y sus nombres en MySQL. La carpeta está excluida de Git y los archivos no se sirven por una ruta pública.

Las fotos y el video enlazan a Pexels. Sus páginas de origen están en [MEDIA_PEXELS.md](MEDIA_PEXELS.md).
