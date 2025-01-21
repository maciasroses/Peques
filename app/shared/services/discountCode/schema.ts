import z, { UnknownKeysParam, ZodRawShape } from "zod";

const baseSchema = z.object({
  code: z.string().min(1, {
    message: "El código es requerido",
  }),
});

const createNUpdateSchema = baseSchema.extend({
  usageLimit: z.number().int().optional(),
  promotionId: z.string().uuid({
    message: "La promoción es requerida",
  }),
});

const schemas: { [key: string]: z.ZodObject<ZodRawShape, UnknownKeysParam> } = {
  validate: baseSchema,
  create: createNUpdateSchema,
  update: createNUpdateSchema,
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
