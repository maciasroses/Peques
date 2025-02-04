import {
  Html,
  Head,
  Body,
  Text,
  Button,
  Preview,
  Section,
  Tailwind,
  Container,
} from "@react-email/components";
import { BASE_URL } from "@/app/shared/constants";
import { Footer, Header } from "./components";

interface IPasswordRecoveryEmail {
  resetPasswordToken: string;
}

const PasswordRecoveryEmail: React.FC<IPasswordRecoveryEmail> = ({
  resetPasswordToken,
}) => {
  const recoveryUrl = `${BASE_URL}/es/reset-password?token=${resetPasswordToken}`;
  return (
    <Html lang="es">
      <Preview>Recupera tu contraseña</Preview>
      <Head />
      <Body className="bg-white">
        <Container className="max-w-2xl">
          <Tailwind>
            <Header title="Recuperación de contraseña" />
            <Section className="bg-white rounded-md p-6 shadow-md">
              <Text className="text-gray-600">
                Has solicitado recuperar tu contraseña. Para continuar, por
                favor haz clic en el siguiente botón:
              </Text>
              <div className="text-center my-6">
                <Button
                  href={recoveryUrl}
                  className="bg-blue-600 text-white py-2 px-4 rounded-md"
                >
                  Recuperar contraseña
                </Button>
              </div>
              <Text className="text-gray-600">
                Si no solicitaste este cambio, puedes ignorar este correo.
              </Text>
              <Text className="text-sm text-gray-400 mt-4">
                Si el botón no funciona, copia y pega el siguiente enlace en tu
                navegador:
              </Text>
              <Text className="text-sm text-blue-600">
                <a href={recoveryUrl}>{recoveryUrl}</a>
              </Text>
            </Section>
            <Footer />
          </Tailwind>
        </Container>
      </Body>
    </Html>
  );
};

export default PasswordRecoveryEmail;
