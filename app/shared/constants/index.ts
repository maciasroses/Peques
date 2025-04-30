export const BASE_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";

export const LINKS = {
  profile: `${BASE_URL}/profile`,
  supportEmail: "peques@support.com",
  terms: `${BASE_URL}/terms-of-service`,
  privacy: `${BASE_URL}/privacy-policy`,
  ordersHistory: `${BASE_URL}/profile/orders`,
};

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

// TEMP
// model PickUpAddressSchedule {
//     id        String  @id @default(uuid())
//     value    String  // Horario de atención (Ej. "Lunes a Viernes: 11:00 am- 7:00 pm")

//     pickupAddress PickupAddress @relation(fields: [pickupAddressId], references: [id], onDelete: Cascade)
//     pickupAddressId String

//     createdAt DateTime @default(now())
//     updatedAt DateTime @updatedAt
// }

// model PickUpAddress {
//     id          String  @id @default(uuid())
//     name        String  // Nombre del punto de recolección (Ej. "Sucursal Centro")
//     street      String  // Calle
//     number      String? // Número exterior/interior
//     city        String  // Ciudad
//     state       String  // Estado/Provincia
//     country     String  // País
//     zipCode     String  // Código postal
//     reference   String? // Referencias para llegar al lugar
//     schedule    PickUpAddressSchedule[] // Horario de atención
//     notes       String? // Notas adicionales
//     latitude    Float?  // Coordenadas para geolocalización
//     longitude   Float?
//     phone       String? // Teléfono de contacto
//     email       String? // Correo de contacto
//     createdAt   DateTime @default(now())
//     updatedAt   DateTime @updatedAt
//   }

// “SET” Concept Store
// Hacienda Carrizal 3200 4
// Col. Las Haciendas
// (Frente a Club Britania)
// Horario:
// Lunes a Viernes: 11:00 am- 7:00 pm
// Sábado: 10:00 am - 6:00 pm
// Normalmente esta listo en 3 horas dentro del horario

export const PICK_UP_ADDRESSES = [
  // {
  //   id: 1,
  //   name: "SET Concept Store",
  //   street: "Col. Las Hacienda, Carrizal 3200 4",
  //   city: "Chihuahua",
  //   state: "Chihuahua",
  //   country: "México",
  //   zipCode: "31215",
  //   reference: "Frente a Club Britania",
  //   schedule: [
  //     {
  //       id: 1,
  //       value: "Lunes a Viernes: 11:00 am- 7:00 pm",
  //       pickupAddressId: 1,
  //     },
  //     {
  //       id: 2,
  //       value: "Sábado: 10:00 am - 6:00 pm",
  //       pickupAddressId: 1,
  //     },
  //   ],
  //   notes: "Normalmente está listo en 3 horas dentro del horario",
  //   createdAt: "2025-01-31 17:17:03.417",
  //   updatedAt: "2025-01-31 17:17:03.417",
  // },
  {
    id: 2,
    name: "LUCIANA’S",
    street: "Plaza Albero (Av. Misión del Bosque y Cantera)",
    city: "Chihuahua",
    state: "Chihuahua",
    country: "México",
    zipCode: "31110",
    reference: "Plaza donde está el DQ, la viña, papelería de cantera.",
    schedule: [
      {
        id: 1,
        value: "Lunes a viernes: 7:00 am - 7:00 pm",
        pickupAddressId: 2,
      },
      {
        id: 2,
        value: "Sábado: 9:00 am - 7:00 pm",
        pickupAddressId: 2,
      },
      {
        id: 3,
        value: "Domingo: 9:00 am - 2:00 pm",
        pickupAddressId: 2,
      },
    ],
    notes: "Normalmente está listo en 3 horas dentro del horario",
    createdAt: "2025-04-30 17:17:03.417",
    updatedAt: "2025-04-30 17:17:03.417",
  },
];
