import z, { UnknownKeysParam, ZodRawShape } from "zod";

const baseSchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  buttonLink: z.string().optional(),
  collectionId: z.string().uuid({
    message: "La colección es requerida",
  }),
});

const createSchema = baseSchema.extend({
  imageUrl: z
    .instanceof(File)
    .refine((file) => file.size > 0, {
      message: "La imagen es requerida",
    })
    .refine((file) => ["image/webp"].includes(file.type), {
      message: "La imagen debe ser de tipo webp",
    }),
});

const updateSchema = baseSchema.extend({
  imageUrl: z.instanceof(File).optional(),
});

const schemas: { [key: string]: z.ZodObject<ZodRawShape, UnknownKeysParam> } = {
  create: createSchema,
  update: updateSchema,
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
