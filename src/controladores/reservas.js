function crearControladorReservas(servicio, { salasPermitidas, turnosPermitidos }) {
  function listar(req, res) {
    res.render("reservas/lista", {
      titulo: "Reservas",
      reservas: servicio.listar()
    });
  }

  function nueva(req, res) {
    res.render("reservas/nueva", {
      titulo: "Nueva reserva",
      error: null,
      valores: {},
      salasPermitidas,
      turnosPermitidos
    });
  }

  function detalle(req, res) {
    const id = Number(req.params.id);
    const reserva = servicio.buscarPorId(id);

    if (!reserva) {
      return res.status(404).render("no-encontrado", {
        titulo: "Reserva no encontrada",
        mensaje: "La reserva solicitada no existe."
      });
    }

    res.render("reservas/detalle", {
      titulo: `Reserva #${reserva.id}`,
      reserva
    });
  }

  function crear(req, res) {
    servicio.crear(req.reservaValidada);
    res.redirect("/reservas");
  }

  return {
    listar,
    nueva,
    detalle,
    crear
  };
}

module.exports = { crearControladorReservas };
