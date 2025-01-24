import z, { UnknownKeysParam, ZodRawShape } from "zod";

const baseSchema = z.object({
  name: z.string().min(1, {
    message: "El nombre del filtro es requerido",
  }),
  key: z.string().min(1, {
    message: "La clave del filtro es requerida",
  }),
});

const createNUpdateSchema = baseSchema.extend({});

const schemas: { [key: string]: z.ZodObject<ZodRawShape, UnknownKeysParam> } = {
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
