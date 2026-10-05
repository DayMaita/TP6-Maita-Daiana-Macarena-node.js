const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const morgan = require("morgan");

const { identificarSolicitud, medirDuracion } = require("./middleware/solicitudes");
const { crearRouterReservas } = require("./rutas/reservas");
const { crearControladorReservas } = require("./controladores/reservas");
const { crearMiddlewareReservas } = require("./middleware/reservas");

function crearApp({ servicio, formatoMorgan, salasPermitidas, turnosPermitidos }) {
  const app = express();

  app.set("view engine", "ejs");
  app.set("views", __dirname + "/../views");

  app.use(morgan(formatoMorgan));
  app.use(identificarSolicitud);
  app.use(medirDuracion);
  app.use(expressLayouts);
  app.use(express.static("public"));
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  app.get("/", (req, res) => {
    res.render("inicio", {
      titulo: "Inicio",
      mensaje: "Sistema de consulta y reserva temporal de salas de estudio."
    });
  });

  app.get("/estado", (req, res) => {
    res.json({
      servicio: "activo",
      reservas: servicio.contar(),
      solicitudId: res.locals.solicitudId
    });
  });

  const controlador = crearControladorReservas(servicio, {
    salasPermitidas,
    turnosPermitidos
  });

  const middleware = crearMiddlewareReservas({
    salasPermitidas,
    turnosPermitidos
  });

  const reservasRouter = crearRouterReservas(controlador, middleware);

  app.use("/reservas", reservasRouter);

  app.use((req, res) => {
    res.status(404).render("no-encontrado", {
      titulo: "Página no encontrada",
      mensaje: "La dirección solicitada no existe."
    });
  });

  return app;
}

module.exports = { crearApp };
