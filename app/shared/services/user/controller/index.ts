"use server";

import bcrypt from "bcrypt";
// import { Resend } from "resend";
import { v4 as uuidv4 } from "uuid";
import { cookies } from "next/headers";
import { create, read, update } from "../model";
import { redirect } from "next/navigation";
import { validateSchema } from "../schema";
// import { PasswordRecovery as PasswordRecoveryTemplate } from "@/app/email/PasswordRecovery";
import { getSession, createUserSession } from "@/app/shared/services/auth";
import type { IUser } from "@/app/shared/interfaces";

// const resend = new Resend(process.env.RESEND_API_KEY as string);
// const resend_email = process.env.RESEND_EMAIL as string;

export async function login(formData: FormData) {
  const dataToValidate = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const errors = validateSchema("login", dataToValidate);

  if (Object.keys(errors).length !== 0) {
    return {
      errors,
      success: false,
    };
  }

  try {
    const user = await read({ email: dataToValidate.email as string });

    if (
      !user ||
      !(await bcrypt.compare(
        dataToValidate.password as string,
        (user as IUser).password
      ))
    ) {
      return {
        message: "Correo electrónico o contraseña incorrecto.",
        success: false,
      };
    }

    await createUserSession((user as IUser).id, (user as IUser).role);
    // return { message: "Successfully logged in", success: true };
  } catch (error) {
    console.error(error);
    // throw new Error("Ocurrió un error interno.");
    return { message: "Ocurrió un error interno.", success: false };
  }
  const session = await getSession();
  const lng = cookies().get("i18next")?.value ?? "es";
  redirect(session?.role === "ADMIN" ? `/${lng}/admin/home` : `/${lng}`);
}

export async function register(formData: FormData) {
  const dataToValidate = {
    lastName: formData.get("lastName") ?? "",
    firstName: formData.get("firstName") ?? "",
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
    wantsNewsletter: formData.get("wantsNewsletter") ? true : false,
  };

  const errors = validateSchema("register", dataToValidate);

  if (Object.keys(errors).length !== 0) {
    return {
      errors,
      success: false,
    };
  }

  if (dataToValidate.password !== dataToValidate.confirmPassword)
    return { message: "Las contraseñas no coinciden.", success: false };

  try {
    const userAlreadyExists = await read({
      email: dataToValidate.email as string,
    });
    if (userAlreadyExists)
      return { message: "El usuario ya existe.", success: false };

    const { confirmPassword, ...data } = dataToValidate;

    const newUser = await create({ data });

    await createUserSession((newUser as IUser).id, (newUser as IUser).role);
    // return { message: "Successfully registered", success: true };
  } catch (error) {
    console.error(error);
    // throw new Error("An internal error occurred");
    return { message: "An internal error occurred", success: false };
  }
  const lng = cookies().get("i18next")?.value ?? "es";
  redirect(`/${lng}`);
}

export async function logout() {
  cookies().set("session", "", { expires: new Date(0) });
  const lng = cookies().get("i18next")?.value ?? "es";
  redirect(`/${lng}`);
}

export async function passwordRecovery(formData: FormData) {
  const dataToValidate = {
    email: formData.get("email"),
  };

  const errors = validateSchema("recoverPassword", dataToValidate);

  if (Object.keys(errors).length !== 0) {
    return {
      errors,
      success: false,
    };
  }

  try {
    const user = await read({ email: dataToValidate.email as string });

    if (!user) {
      return {
        message: "El correo electrónico no está registrado.",
        success: false,
      };
    }

    const resetPasswordToken = uuidv4();
    const resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour

    await update({
      id: (user as IUser).id,
      data: {
        resetPasswordToken,
        resetPasswordExpires,
      },
    });

    // const { data, error } = await resend.emails.send({
    //   from: `Peques <${resend_email}>`,
    //   to: (user as IUser).email,
    //   subject: "Recuperación de contraseña",
    //   react: PasswordRecoveryTemplate({ resetPasswordToken }),
    // });

    // console.log(data, error);

    // if (error) {
    //   console.error(error);
    //   return {
    //     message: "Error al enviar el correo de recuperación",
    //     success: false,
    //   };
    // }

    return {
      message:
        "Correo de recuperación enviado. Ya puedes cerrar esta ventana y seguir las instrucciones del correo.",
      success: true,
    };
  } catch (error) {
    console.error(error);
    // throw new Error("An internal error occurred");
    return { message: "An internal error occurred", success: false };
  }
}

export async function verifyTokenExpiration(token: string) {
  try {
    const user = await read({ resetPasswordToken: token });
    if (!user) return false;
    if ((user as IUser).resetPasswordExpires! < new Date()) return false;
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function resetPassword(formData: FormData, token: string) {
  const dataToValidate = {
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  };

  const errors = validateSchema("resetPassword", dataToValidate);

  if (Object.keys(errors).length !== 0) {
    return {
      errors,
      success: false,
    };
  }

  if (dataToValidate.password !== dataToValidate.confirmPassword)
    return { message: "Las contraseñas no coinciden.", success: false };

  try {
    const user = await read({ resetPasswordToken: token });

    if (!user) {
      return {
        message: "Token inválido.",
        success: false,
      };
    }

    const hashedPassword = await bcrypt.hash(
      dataToValidate.password as string,
      10
    );

    await update({
      id: (user as IUser).id,
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
    });

    return {
      message: "Contraseña actualizada correctamente.",
      success: true,
    };
  } catch (error) {
    console.error(error);
    return { message: "An internal error occurred", success: false };
  }
}

export async function updateMyMainInfo(formData: FormData) {
  const dataToValidate = {
    email: formData.get("email"),
    lastName: formData.get("lastName"),
    username: formData.get("username"),
    firstName: formData.get("firstName"),
  };

  const errors = validateSchema("updateMainInfo", dataToValidate);

  if (Object.keys(errors).length !== 0) {
    return {
      errors,
      success: false,
    };
  }

  try {
    const me = (await getMe()) as IUser;

    if (!me) {
      return {
        message: "Usuario no encontrado.",
        success: false,
      };
    }

    const userWithSameEmail = (await read({
      email: dataToValidate.email as string,
    })) as IUser;

    if (userWithSameEmail && userWithSameEmail.id !== me.id) {
      return {
        message: "El correo electrónico ya está en uso.",
        success: false,
      };
    }

    const userWithSameUsername = (await read({
      username: dataToValidate.username as string,
    })) as IUser;

    if (userWithSameUsername && userWithSameUsername.id !== me.id) {
      return {
        message: "El nombre de usuario ya está en uso.",
        success: false,
      };
    }

    await update({
      id: me.id,
      data: {
        email: dataToValidate.email,
        username: dataToValidate.username,
        lastName: dataToValidate.lastName,
        firstName: dataToValidate.firstName,
      },
    });

    return {
      message: "Usuario actualizado correctamente.",
      success: true,
    };
  } catch (error) {
    console.error(error);
    return { message: "Ocurrió un error interno.", success: false };
  }
}

export async function getMe() {
  try {
    const session = await getSession();
    if (!session || !session.userId) return null;
    return await read({
      id: session.userId as string,
    });
  } catch (error) {
    console.error("Error getting user session:", error);
    return null; // Retornar null si ocurre un error
  }
}

export async function addStripeCustomerIdToMe({
  stripeCustomerId,
}: {
  stripeCustomerId: string;
}) {
  try {
    const session = await getSession();
    if (!session || !session.userId) return null;
    return await update({
      id: session.userId as string,
      data: {
        stripeCustomerId,
      },
    });
  } catch (error) {
    console.error("Error getting user session:", error);
    return null; // Retornar null si ocurre un error
  }
}
