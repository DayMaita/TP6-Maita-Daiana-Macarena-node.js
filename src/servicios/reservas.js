function crearServicioReservas(datosIniciales) {
  const reservas = datosIniciales.map((reserva) => ({ ...reserva }));
  let siguienteId =
    reservas.reduce((maximo, reserva) => Math.max(maximo, reserva.id), 0) + 1;

  function listar() {
    return reservas;
  }

  function buscarPorId(id) {
    return reservas.find((reserva) => reserva.id === id);
  }

  function contar() {
    return reservas.length;
  }

  function crear(datos) {
    const nuevaReserva = {
      id: siguienteId++,
      ...datos
    };

    reservas.push(nuevaReserva);
    return nuevaReserva;
  }

  return {
    listar,
    buscarPorId,
    contar,
    crear
  };
}

module.exports = { crearServicioReservas };
