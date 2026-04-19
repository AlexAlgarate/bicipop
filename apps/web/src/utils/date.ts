export const timeAgo = (input: Date | string): string => {
  const date = typeof input === 'string' ? new Date(input) : input;
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const rtf = new Intl.RelativeTimeFormat('es', { numeric: 'auto' });

  // Manejo de tiempos futuros o muy recientes
  if (seconds < 0) return 'Hace un momento';

  let value = 0;
  let unit: Intl.RelativeTimeFormatUnit = 'second';

  if (seconds < 60) {
    value = -seconds;
    unit = 'second';
  } else if (seconds < 3600) {
    value = -Math.floor(seconds / 60);
    unit = 'minute';
  } else if (seconds < 86400) {
    value = -Math.floor(seconds / 3600);
    unit = 'hour';
  } else if (seconds < 2592000) {
    // 30 días aprox
    value = -Math.floor(seconds / 86400);
    unit = 'day';
  } else if (seconds < 31536000) {
    // 12 meses aprox
    value = -Math.floor(seconds / 2592000);
    unit = 'month';
  } else {
    value = -Math.floor(seconds / 31536000);
    unit = 'year';
  }

  // Obtenemos el texto en minúscula ("hace 2 días")
  const relativeTime = rtf.format(value, unit);

  // Devolvemos con la primera letra mayúscula
  return relativeTime.charAt(0).toUpperCase() + relativeTime.slice(1);
};
