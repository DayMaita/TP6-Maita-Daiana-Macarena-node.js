const { crearApp } = require("./app");
const { obtenerConfiguracion } = require("./configuracion");
const { crearServicioReservas } = require("./servicios/reservas");

const configuracion = obtenerConfiguracion();

const salasPermitidas = ["Sala Norte", "Sala Sur", "Sala Multimedia"];
const turnosPermitidos = ["Mañana", "Tarde", "Noche"];

const datosIniciales = [
  {
    id: 1,
    estudiante: "Ana López",
    email: "ana@example.com",
    sala: "Sala Norte",
    fecha: "2026-09-22",
    turno: "Mañana",
    personas: 2
  },
  {
    id: 2,
    estudiante: "Bruno Díaz",
    email: "bruno@example.com",
    sala: "Sala Sur",
    fecha: "2026-09-22",
    turno: "Tarde",
    personas: 4
  },
  {
    id: 3,
    estudiante: "Carla Pérez",
    email: "carla@example.com",
    sala: "Sala Multimedia",
    fecha: "2026-09-23",
    turno: "Noche",
    personas: 3
  },
  {
    id: 4,
    estudiante: "Diego Ruiz",
    email: "diego@example.com",
    sala: "Sala Norte",
    fecha: "2026-09-24",
    turno: "Tarde",
    personas: 1
  }
];

const servicio = crearServicioReservas(datosIniciales);

const app = crearApp({
  servicio,
  formatoMorgan: configuracion.formatoMorgan,
  salasPermitidas,
  turnosPermitidos
});

app.listen(configuracion.port, () => {
  console.log(`Servidor iniciado en http://localhost:${configuracion.port}`);
});
