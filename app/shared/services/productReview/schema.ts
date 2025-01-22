import z, { UnknownKeysParam, ZodRawShape } from "zod";

const baseSchema = z.object({
  rating: z.number().int().min(1, {
    message: "La calificación debe ser de 1 a 5 estrellas",
  }),
  content: z.string().optional(),
});

const createSchema = baseSchema.extend({
  productId: z.string().uuid({
    message: "El producto debe ser una opción válida",
  }),
});

const schemas: { [key: string]: z.ZodObject<ZodRawShape, UnknownKeysParam> } = {
  create: createSchema,
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
