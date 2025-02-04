import z, { UnknownKeysParam, ZodRawShape } from "zod";

const baseSchema = z.object({
  email: z.string().email({
    message: "Introduce una dirección de correo electrónico válida",
  }),
  password: z.string().min(1, {
    message: "Introduce una contraseña válida",
  }),
});

const userLoginSchema = baseSchema.extend({});

const userRegisterSchema = baseSchema.extend({
  lastName: z
    .string()
    .min(0, {
      message: "El apellido debe tener al menos 2 caracteres",
    })
    .optional(),
  firstName: z
    .string()
    .min(0, {
      message: "El nombre debe tener al menos 2 caracteres",
    })
    .optional(),
  username: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres",
  }),
  confirmPassword: z.string().min(8, {
    message:
      "La contraseña de confirmación debe tener la misma longitud que la contraseña",
  }),
  wantsNewsletter: z.boolean().optional(),
});

const userRecoverPasswordSchema = z.object({
  email: z.string().email({
    message: "Introduce una dirección de correo electrónico válida",
  }),
});

const resetPasswordSchema = z.object({
  password: z.string().min(8, {
    message: "La contraseña debe tener al menos 8 caracteres",
  }),
  confirmPassword: z.string().min(8, {
    message:
      "La contraseña de confirmación debe tener la misma longitud que la contraseña",
  }),
});

const updateMainInfoSchema = z.object({
  firstName: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres",
  }),
  lastName: z.string().min(2, {
    message: "El apellido debe tener al menos 2 caracteres",
  }),
  username: z.string().min(2, {
    message: "El nombre de usuario debe tener al menos 2 caracteres",
  }),
  email: z.string().email({
    message: "Introduce una dirección de correo electrónico válida",
  }),
});

const schemas: { [key: string]: z.ZodObject<ZodRawShape, UnknownKeysParam> } = {
  login: userLoginSchema,
  register: userRegisterSchema,
  resetPassword: resetPasswordSchema,
  updateMainInfo: updateMainInfoSchema,
  recoverPassword: userRecoverPasswordSchema,
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
