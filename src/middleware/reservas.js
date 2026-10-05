function crearMiddlewareReservas({ salasPermitidas, turnosPermitidos }) {
  function prepararAreaReservas(req, res, next) {
    res.locals.seccion = "Reservas de salas";
    next();
  }

  function validarReserva(req, res, next) {
    const datos = {
      estudiante: String(req.body.estudiante || "").trim(),
      email: String(req.body.email || "").trim(),
      sala: String(req.body.sala || "").trim(),
      fecha: String(req.body.fecha || "").trim(),
      turno: String(req.body.turno || "").trim(),
      personas: Number(req.body.personas)
    };

    const errores = [];

    if (!datos.estudiante) {
      errores.push("El estudiante es obligatorio.");
    }

    if (!datos.email) {
      errores.push("El email es obligatorio.");
    } else if (!datos.email.includes("@")) {
      errores.push("El email debe contener @.");
    }

    if (!datos.sala) {
      errores.push("La sala es obligatoria.");
    } else if (!salasPermitidas.includes(datos.sala)) {
      errores.push("La sala seleccionada no está permitida.");
    }

    if (!datos.fecha) {
      errores.push("La fecha es obligatoria.");
    }

    if (!datos.turno) {
      errores.push("El turno es obligatorio.");
    } else if (!turnosPermitidos.includes(datos.turno)) {
      errores.push("El turno seleccionado no está permitido.");
    }

    if (
      !Number.isInteger(datos.personas) ||
      datos.personas < 1 ||
      datos.personas > 6
    ) {
      errores.push(
        "La cantidad de personas debe ser un número entero entre 1 y 6."
      );
    }

    if (errores.length > 0) {
      return res.status(400).render("reservas/nueva", {
        titulo: "Nueva reserva",
        error: errores.join(" "),
        valores: {
          estudiante: datos.estudiante,
          email: datos.email,
          sala: datos.sala,
          fecha: datos.fecha,
          turno: datos.turno,
          personas: req.body.personas || ""
        },
        salasPermitidas,
        turnosPermitidos
      });
    }

    req.reservaValidada = datos;
    next();
  }

  return {
    prepararAreaReservas,
    validarReserva
  };
}

module.exports = { crearMiddlewareReservas };
