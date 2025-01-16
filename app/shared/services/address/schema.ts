import z, { UnknownKeysParam, ZodRawShape } from "zod";

const createAddressSchema = z.object({
  userId: z.string().min(2, {
    message: "User ID is required",
  }),
  fullName: z.string().min(2, {
    message: "El nombre completo es requerido",
  }),
  address1: z.string().min(2, {
    message: "La dirección es requerida",
  }),
  address2: z
    .string()
    .min(0, {
      message: "La dirección 2 es requerida",
    })
    .optional(),
  city: z.string().min(2, {
    message: "La ciudad es requerida",
  }),
  state: z.string().min(2, {
    message: "El estado es requerido",
  }),
  zipCode: z.number().int().min(5, {
    message: "El código postal es requerido",
  }),
  country: z.string().min(2, {
    message: "El país es requerido",
  }),
  phoneNumber: z
    .string()
    .min(2, {
      message: "El número de teléfono es requerido",
    })
    .optional(),
  additionalInfo: z
    .string()
    .min(0, {
      message: "La información adicional es requerida",
    })
    .optional(),
});

const schemas: { [key: string]: z.ZodObject<ZodRawShape, UnknownKeysParam> } = {
  create: createAddressSchema,
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
