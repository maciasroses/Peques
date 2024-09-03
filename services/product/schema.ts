import z, { UnknownKeysParam, ZodRawShape } from "zod";

const baseSchema = z.object({
  dollarExchangeRate: z.number().positive({
    message: "El tipo de cambio debe ser un número positivo",
  }),
  name: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres",
  }),
  key: z.string().min(2, {
    message: "La clave debe tener al menos 2 caracteres",
  }),
  quantityPerCarton: z.number().int().positive({
    message: "La cantidad por caja debe ser un número positivo",
  }),
  chinesePriceUSD: z.number().positive({
    message: "El precio de china debe ser un número positivo",
  }),
  shippingCostMXN: z.number().positive({
    message: "El costo de envío debe ser un número positivo",
  }),
  salePriceMXN: z.number().positive({
    message: "El precio de venta debe ser un número positivo",
  }),
  orderDate: z.date({
    message: "La fecha de orden debe ser una fecha válida",
  }),
});

const massiveCreateSchema = baseSchema.extend({
  providerAlias: z.string().min(2, {
    message: "El alias del proveedor debe tener al menos 2 caracteres",
  }),
});

const createNUpdateSchema = baseSchema.extend({
  providerId: z.string().uuid({
    message: "El proveedor debe ser una opción válida",
  }),
});

const schemas: { [key: string]: z.ZodObject<ZodRawShape, UnknownKeysParam> } = {
  create: createNUpdateSchema,
  update: createNUpdateSchema,
  massiveCreate: massiveCreateSchema,
};

export function validateSchema(action: string, data: unknown) {
  const schema = schemas[action];

  if (!schema) {
    throw new Error("Invalid action");
  }

  const result = schema.safeParse(data);

  if (result.success) {
    return {};
  } else {
    const errors = result.error.errors.reduce(
      (acc: { [key: string]: string }, error) => {
        acc[error.path[0]] = error.message;
        return acc;
      },
      {}
    );
    return errors;
  }
}
