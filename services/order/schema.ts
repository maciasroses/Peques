import z, { UnknownKeysParam, ZodRawShape } from "zod";

const baseSchema = z.object({
  client: z.string().min(2, {
    message: "El nombre del cliente debe tener al menos 2 caracteres",
  }),
  shipmentType: z.string().min(2, {
    message: "El tipo de envío debe tener al menos 2 caracteres",
  }),
});

const productsSchema = z.object({
  productKey: z.string().min(2, {
    message: "Debes seleccionar un producto para agregar al pedido",
  }),
  quantity: z.number().int().positive({
    message: "La cantidad debe ser un número positivo",
  }),
});

const createSchema = baseSchema.extend({});

const updateSchema = baseSchema.extend({
  isPaid: z.boolean(),
  deliveryStatus: z
    .string(z.enum(["PENDING", "CANCELLED", "DELIVERED"]))
    .min(1, {
      message: "Debes seleccionar un estado de entrega",
    }),
});

const schemas: { [key: string]: z.ZodObject<ZodRawShape, UnknownKeysParam> } = {
  create: createSchema,
  update: updateSchema,
  products: productsSchema,
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
