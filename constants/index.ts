export const INITIAL_STATE_RESPONSE = {
  success: false,
  message: "",
  errors: {},
};

export const COLORS_FOR_CHARTS = [
  "#FF5733", // Rojo anaranjado
  "#33FF57", // Verde
  "#3357FF", // Azul
  "#FF33A6", // Rosa
  "#33FFD2", // Turquesa
  "#FFC300", // Amarillo
  "#DAF7A6", // Verde claro
  "#581845", // Violeta oscuro
  "#900C3F", // Rojo oscuro
  "#C70039", // Rojo
  "#FF5733", // Naranja
  "#FFC300", // Amarillo
  "#FF6F61", // Coral
  "#6B5B95", // Morado
  "#88B04B", // Verde lima
  "#F7CAC9", // Rosa pálido
  "#92A8D1", // Azul grisáceo
  "#955251", // Marrón oscuro
  "#B565A7", // Púrpura
  "#009B77", // Verde esmeralda
  "#DD4124", // Rojo tomate
  "#45B8AC", // Verde menta
  "#EFC050", // Amarillo mostaza
  "#5B5EA6", // Azul índigo
  "#9B2335", // Rojo burdeos
  "#DFCFBE", // Beige
  "#55B4B0", // Verde agua
  "#E15D44", // Naranja rojizo
  "#7FCDCD", // Azul claro
  "#BC243C", // Rojo vino
  "#C3447A", // Rosa intenso
  "#98B4D4", // Azul cielo
];

const commonProperties = {
  tradicional: 0,
};
export const SET_INTEGRAL = {
  abierto: 25,
  mantel: 18.1818,
  ...commonProperties,
};
export const COMFORT_SET = {
  manta: 12.8205128,
  cobija: 6.77966102,
};
export const SET_IDEAL = {
  popote: 25,
  aro: 35.7142, // Mordedera
  mantel: 18.18,
  abierto: 12.5,
  ...commonProperties,
};
