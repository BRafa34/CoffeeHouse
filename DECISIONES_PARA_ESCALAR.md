# Decisiones de la demo para revisar antes de vender CoffeeHouse

Este registro recoge decisiones confirmadas durante la planificación de la demo y la adaptación que habría que evaluar para usarla con una cafetería real. Actualizarlo cuando cambie el alcance. Una propuesta comercial requiere validar los procesos y los datos con el negocio.

| Área | Decisión de la demo | Revisión para un producto comercial |
| --- | --- | --- |
| Identidad y ubicación | CoffeeHouse, historia, dirección, teléfono, correo y horario ficticios en Cochabamba. | Sustituir por datos del negocio, verificar horarios, canales de contacto, ubicación y contenido aprobado por el propietario. |
| Catálogo y precios | Diez productos con precios ficticios en BOB y un precio por producto. | Permitir que la cafetería actualice productos, fotos, disponibilidad y precios. Evaluar tamaños, extras, impuestos y promociones según su operación. |
| Entrega | Retiro y envío a domicilio sin costo. | Definir zonas, cobertura, horarios, tarifa, tiempo estimado, aceptación de pedidos y responsable del reparto. |
| Pago | Se muestra `assets/qr-pago-demo.png`, que codifica «CoffeeHouse DEMO · Pago ficticio». El cliente sube un comprobante y el sistema cambia automáticamente a «Pago confirmado». | Integrar un medio de pago real o una verificación operativa del comprobante. Confirmar el pago únicamente después de la verificación correspondiente. |
| Avance del pedido | El sistema simula «En preparación» 15 segundos después de subir el comprobante y «Listo» a los 20 segundos. Para domicilio, muestra «En camino» a los 25 segundos como último estado. Para retiro, «Listo» es el último estado. | Actualizar estados desde el proceso real del local. Evaluar funciones para personal, avisos al cliente y estados distintos para retiro y reparto. |
| Cuentas | Los clientes se registran con nombre, correo, teléfono y contraseña. La recuperación de contraseña queda para después. Una cuenta administradora se configura desde `.env`. | Definir recuperación de contraseña, verificación de contacto, gestión de sesiones, acceso del personal y política de datos con el negocio. |
| Contactos | El formulario guarda nombre, teléfono y mensaje en MySQL. | Definir quién recibe y responde los mensajes, tiempos de respuesta y conservación de datos. |
| Chatbot | Ollama con `gemma3:4b` corre en el mismo equipo que la demo. Responde sobre la cafetería, recomienda productos, agrega al carrito y consulta pedidos de la cuenta activa. | Medir capacidad, costo y disponibilidad en el entorno de despliegue. Mantener el acceso a pedidos sujeto a autenticación y validar en el backend toda acción sobre el carrito. |
| Fotos y video | MySQL guarda enlaces a fotos y al video de Pexels. | Elegir fotos reales autorizadas del negocio o gestionar archivos propios. Revisar disponibilidad, rendimiento y condiciones de uso de los recursos publicados. |
| Administración | Una cuenta administradora de demostración edita productos, precios y servicios. | Acordar qué personal editará menú, servicios, horarios, pedidos y mensajes, y definir sus permisos. |
| Comprobantes | Los archivos JPG, PNG o PDF se guardan en una carpeta del backend y MySQL registra sus rutas. | Definir almacenamiento persistente con acceso restringido, copias de seguridad, límites y conservación de archivos. |
| Despliegue | La demo local usa Express, XAMPP para MySQL o MariaDB y Ollama en el mismo equipo. La publicación del repositorio público de GitHub quedó pendiente por decisión del usuario. | Definir alojamiento, dominio, copias de seguridad, monitoreo y operación diaria con la cafetería. |

## Pendientes de la planificación actual

- Contrato completo de APIs y modo de gestionar el contenido cargado en MySQL.
- Cuenta y visibilidad para el repositorio final de GitHub.
