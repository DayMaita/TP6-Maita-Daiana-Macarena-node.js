# Trabajo práctico 06

## Proyecto de partida y cambios

Este proyecto parte de una copia funcional del TP 05 de reservas de salas de estudio.

El objetivo del TP 06 es reorganizar el código en módulos sin incorporar nuevas funcionalidades. Se conservan las mismas vistas EJS, layout, CSS, datos iniciales, validación, Morgan, identificador de solicitud, medición hasta `finish` y respuestas HTTP.

La copia se llama `tp-06-salas-modular`. No se trasladó la carpeta `.git` del TP 05 ni `node_modules`.

## Instalación y ejecución

```bash
npm install
npm run format
npm run check
npm start
```

La aplicación queda disponible en:

```text
http://localhost:3000
```

## Configuración del entorno

La configuración se encuentra en `src/configuracion.js`.

Variables:

```env
PORT=3000
NODE_ENV=development
```

Si `PORT` no existe, se utiliza `3000`. El valor debe ser un número entero entre `1` y `65535`. Si no cumple esa condición, la aplicación no inicia y muestra un mensaje explícito.

Morgan utiliza:

- `dev` cuando `NODE_ENV` no es `production`.
- `combined` cuando `NODE_ENV=production`.

Esto solamente modifica el formato del registro de solicitudes.

`.env.example` contiene valores de ejemplo y no contiene secretos. El archivo `.env` local está excluido mediante `.gitignore`.

## Mapa de módulos y dependencias

```text
src/index.js
 ├── configuracion.js
 ├── servicios/reservas.js
 └── app.js
      ├── middleware/solicitudes.js
      ├── middleware/reservas.js
      ├── controladores/reservas.js
      └── rutas/reservas.js
```

### `index.js`

Es el punto de arranque. Lee la configuración, crea los datos iniciales, crea una única instancia del servicio, crea la aplicación y ejecuta `listen`.

No declara rutas ni valida formularios.

### `configuracion.js`

Lee `process.env`, convierte `PORT` a número, valida el rango y decide el formato de Morgan.

No crea Express ni imprime secretos.

### `app.js`

Crea Express, configura EJS y el layout, configura el pipeline global, declara las rutas generales, monta el router de reservas y finalmente responde las URL inexistentes con 404.

No ejecuta `listen` ni manipula directamente el arreglo de reservas.

### `rutas/reservas.js`

Relaciona métodos y caminos relativos con middleware y controladores.

Como el router se monta con:

```js
app.use("/reservas", reservasRouter);
```

sus rutas son relativas:

```text
GET /
GET /nueva
GET /:id
POST /
```

y externamente quedan como:

```text
GET /reservas
GET /reservas/nueva
GET /reservas/:id
POST /reservas
```

`/nueva` aparece antes de `/:id` para que sea interpretada como ruta específica y no como un identificador.

### `controladores/reservas.js`

Se ocupa de la capa HTTP: recibe `req` y `res`, obtiene parámetros, renderiza vistas, devuelve JSON, responde 404 cuando corresponde y redirige después de crear una reserva.

El controlador utiliza el servicio para acceder a los datos.

### `servicios/reservas.js`

Contiene la lógica de las reservas en memoria. Permite listar, buscar por ID, contar y crear.

El servicio no utiliza `req`, `res`, EJS ni códigos HTTP porque no debe conocer detalles de Express. Su responsabilidad es trabajar con los datos.

Existe una sola instancia del servicio y es compartida por listado, detalle, `/estado` y creación.

### `middleware/solicitudes.js`

Mantiene el identificador consecutivo de solicitud y la medición de duración mediante el evento `finish`.

### `middleware/reservas.js`

Contiene el middleware específico de reservas: prepara la sección y valida el POST.

La validación normaliza los datos, comprueba los campos y, si todo es correcto, coloca los datos en `req.reservaValidada` y ejecuta `next()`.

Si encuentra errores, responde `400`, vuelve a mostrar el formulario, conserva los valores enviados y no llama a `next()`.

## Pipeline y contrato de rutas

El pipeline conserva la organización del TP 05:

```text
Morgan
  ↓
identificarSolicitud
  ↓
medirDuracion
  ↓
expressLayouts
  ↓
express.static
  ↓
express.urlencoded
  ↓
express.json
  ↓
rutas de aplicación
  ↓
router /reservas
  ↓
404 final
```

Morgan registra las solicitudes que pasan por el pipeline. La medición propia registra el resultado final cuando la respuesta emite `finish`, por lo que permite observar estados `200`, `302`, `400` y `404`.

### Rutas

| Método | Ruta | Resultado |
|---|---|---|
| GET | `/` | 200, inicio |
| GET | `/estado` | 200, JSON con cantidad e ID |
| GET | `/reservas` | 200, listado |
| GET | `/reservas/nueva` | 200, formulario |
| GET | `/reservas/:id` | 200 o 404 HTML |
| POST | `/reservas` | 302 válido / 400 inválido |
| GET | `/css/estilos.css` | 200 |
| GET | URL inexistente | 404 HTML |

La validación conserva los campos y reglas del TP 05: estudiante, email con `@`, sala permitida, fecha, turno permitido y personas enteras entre 1 y 6.

El parser `express.urlencoded` se ejecuta antes del validador porque el validador necesita `req.body`.

El POST válido crea la reserva y responde `302` hacia `/reservas`. Después el navegador realiza un GET y recibe el listado actualizado.

## Matriz antes/después

La línea de base corresponde al comportamiento observado en el TP 05. Después de la refactorización se debe repetir la misma matriz.

| Caso | Antes: TP 05 | Después: TP 06 |
|---|---:|---:|
| GET `/` | 200 | 200 |
| GET `/estado` | 200 | 200 |
| GET `/reservas` | 200 | 200 |
| GET `/reservas/nueva` | 200 | 200 |
| GET `/reservas/:id` existente | 200 | 200 |
| GET `/reservas/:id` inexistente | 404 | 404 |
| POST vacío | 400 | 400 |
| Sala no permitida | 400 | 400 |
| Email sin `@` | 400 | 400 |
| Personas 0, 7 o fraccionarias | 400 | 400 |
| POST válido | 302 | 302 |
| GET posterior al POST | 200 | 200 |
| URL inexistente | 404 | 404 |
| CSS | 200 | 200 |
| Reinicio | semilla inicial | semilla inicial |

La evidencia de la matriz se completa con capturas o registros breves de navegador y terminal. No se agregaron pruebas automatizadas porque están fuera del alcance del TP.

## Formato y análisis estático

Scripts incluidos:

```json
{
  "start": "node src/index.js",
  "format": "prettier --write src",
  "format:check": "prettier --check src",
  "lint": "eslint src",
  "check": "npm run format:check && npm run lint"
}
```

Antes de `npm run check` se ejecuta:

```bash
npm run format
```

Luego:

```bash
npm run check
```

También se entrega `package-lock.json` actualizado.

## Persistencia temporal y límites

Las reservas viven en memoria dentro de la única instancia creada por:

```js
crearServicioReservas(datosIniciales)
```

El arreglo está encapsulado dentro del servicio. `index.js` solamente prepara los datos iniciales y crea el servicio.

El servicio no usa `res` porque no debe encargarse de HTTP ni de las vistas. El controlador es el que conecta la solicitud HTTP con el servicio y decide qué respuesta enviar.

Al reiniciar Node.js se pierde cualquier alta realizada durante la ejecución. El servicio vuelve a crearse con las cuatro reservas iniciales del TP 05.

No se utiliza base de datos, archivos ni ninguna otra forma de persistencia.

## Comandos ejecutados

```bash
npm install
npm run format
npm run check
npm start
```

El proyecto está preparado para que `npm start` funcione sin un archivo `.env`, utilizando `PORT=3000` como valor predeterminado.

## Comprobación final

Antes de entregar:

1. Ejecutar `npm install`.
2. Ejecutar `npm run format`.
3. Ejecutar `npm run check`.
4. Ejecutar `npm start`.
5. Probar inicio, listado, formulario, detalle y `/estado`.
6. Probar POST inválido y comprobar `400` sin alta.
7. Probar POST válido y comprobar `302` seguido de `200`.
8. Probar una URL inexistente y comprobar `404`.
9. Comprobar `/css/estilos.css`.
10. Revisar Morgan y `[MEDICION]` en la terminal.
11. Probar un puerto alternativo válido.
12. Probar un puerto inválido y comprobar que la aplicación no inicia.
13. Reiniciar y verificar que regresan las cuatro reservas iniciales.
14. Confirmar que `.env` y `node_modules/` no estén en Git.
15. Confirmar que `package-lock.json` esté incluido.
