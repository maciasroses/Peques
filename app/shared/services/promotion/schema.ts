import z, { UnknownKeysParam, ZodRawShape } from "zod";

const baseSchema = z.object({
  title: z.string().min(2, {
    message: "El título debe tener al menos 2 caracteres",
  }),
  endDate: z.date({
    message: "La fecha de fin debe ser una fecha válida",
  }),
  startDate: z.date({
    message: "La fecha de inicio debe ser una fecha válida",
  }),
  description: z.string().optional(),
  discountType: z.enum(["PERCENTAGE", "FIXED"], {
    message: "El tipo de descuento debe ser porcentaje o fijo",
  }),
  discountValue: z.number().positive({
    message: "El valor de descuento debe ser un número positivo",
  }),
});

const createSchema = baseSchema.extend({
  promotionType: z.enum(["product", "collection", "discountCode"], {
    message:
      "El tipo de promoción debe ser producto, colección o código de descuento",
  }),
  discountCodeCode: z.string().nullable().optional(),
  discountCodeUsageLimit: z.number().int().optional(),
});

const addToPromotion = z.object({
  promotionType: z.enum(["product", "collection", "discountCode"], {
    message:
      "El tipo de promoción debe ser producto, colección o código de descuento",
  }),
  discountCodeCode: z.string().nullable().optional(),
  discountCodeUsageLimit: z.number().int().optional(),
});

const updateSchema = baseSchema.extend({});

const schemas: { [key: string]: z.ZodObject<ZodRawShape, UnknownKeysParam> } = {
  create: createSchema,
  update: updateSchema,
  addToPromotion: addToPromotion,
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
