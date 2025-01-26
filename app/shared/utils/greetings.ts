export function getGreeting() {
  const now = new Date();

  const options: Intl.DateTimeFormatOptions = {
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, // Zona horaria local del usuario
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false, // Usamos formato de 24 horas
  };

  // Obtenemos la hora actual en formato 24 horas
  const time = new Intl.DateTimeFormat("es-MX", options).format(now);
  const hour = parseInt(time.split(":")[0], 10); // Extraemos la hora como número

  // Definimos los saludos según los rangos horarios
  if (hour >= 0 && hour < 12) {
    return "Buenos días";
  } else if (hour >= 12 && hour < 18) {
    return "Buenas tardes";
  } else {
    return "Buenas noches";
  }
}
