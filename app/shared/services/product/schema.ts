import z, { UnknownKeysParam, ZodRawShape } from "zod";

const baseSchema = z.object({
  name: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres",
  }),
  key: z.string().min(2, {
    message: "La clave debe tener al menos 2 caracteres",
  }),
  description: z.string().min(12, {
    message: "La descripción debe tener al menos 2 caracteres",
  }),
  isCustomizable: z.boolean(),
  minimumAcceptableQuantity: z.number().int().positive({
    message: "La cantidad mínima aceptable debe ser un número positivo",
  }),
});

const createNUpdateProductSchema = z.object({
  quantityPerCarton: z.number().int().positive({
    message: "La cantidad por caja debe ser un número positivo",
  }),
  chinesePriceUSD: z.number().positive({
    message: "El precio de china debe ser un número positivo",
  }),
  dollarExchangeRate: z.number().positive({
    message: "El tipo de cambio debe ser un número positivo",
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

const firstCreationSchema = z.object({
  ...baseSchema.shape,
  ...createNUpdateProductSchema.shape,
});

const massiveCreateSchema = firstCreationSchema.extend({
  providerAlias: z.string().min(2, {
    message: "El alias del proveedor debe tener al menos 2 caracteres",
  }),
});

const createSchema = firstCreationSchema.extend({
  providerId: z.string().uuid({
    message: "El proveedor debe ser una opción válida",
  }),
});

const updateSchame = baseSchema.extend({
  providerId: z.string().uuid({
    message: "El proveedor debe ser una opción válida",
  }),
  salePriceMXN: z.number().positive({
    message: "El precio de venta debe ser un número positivo",
  }),
  availableQuantity: z.number().int().min(0, {
    message: "La cantidad disponible debe ser mayor o igual a 0",
  }),
});

const schemas: { [key: string]: z.ZodObject<ZodRawShape, UnknownKeysParam> } = {
  create: createSchema,
  update: updateSchame,
  massiveCreate: massiveCreateSchema,
  addProduct: createNUpdateProductSchema,
  updateProduct: createNUpdateProductSchema,
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
