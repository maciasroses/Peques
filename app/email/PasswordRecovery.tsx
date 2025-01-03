interface IPasswordRecovery {
  resetPasswordToken: string;
}

export const PasswordRecovery: React.FC<Readonly<IPasswordRecovery>> = ({
  resetPasswordToken,
}) => (
  <div>
    <h1>Recuperación de contraseña</h1>
    <p>
      Para recuperar tu contraseña, por favor haz click en el siguiente enlace:
    </p>
    <a
      href={`http://localhost:3000/es/reset-password?token=${resetPasswordToken}`}
    >
      Recuperar contraseña
    </a>
  </div>
);
