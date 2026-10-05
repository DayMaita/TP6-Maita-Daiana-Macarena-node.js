function obtenerConfiguracion(env = process.env) {
  const portTexto = env.PORT;
  const port = portTexto === undefined ? 3000 : Number(portTexto);

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("PORT debe ser un número entero entre 1 y 65535.");
  }

  const nodeEnv = env.NODE_ENV || "development";
  const formatoMorgan = nodeEnv === "production" ? "combined" : "dev";

  return {
    port,
    nodeEnv,
    formatoMorgan
  };
}

module.exports = { obtenerConfiguracion };
