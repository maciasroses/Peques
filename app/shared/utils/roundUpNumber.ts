export function roundUpNumber(num: number) {
  if (num % 1 === 0) {
    // Si es entero, lo devolvemos tal cual
    return num;
  } else if (num % 1 > 0.5) {
    // Si la parte decimal supera 0.5, subimos al entero
    return Math.ceil(num);
  } else {
    // Sino redondeamos al múltiplo más cercano de 0.5
    return Math.ceil(num / 0.5) * 0.5;
  }
}
