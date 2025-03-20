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
  Img,
} from "@react-email/components";
import { Footer } from "./components";

const WelcomeEmail = () => {
  return (
    <Html lang="es">
      <Preview>¡Bienvenido a la familia Peques!</Preview>
      <Head />
      <Body className="bg-gray-100">
        <Container className="max-w-2xl bg-white rounded-md shadow-md p-6">
          <Tailwind>
            <Section className="text-center">
              <Text className="text-lg font-semibold">
                ¡Welcome to the peques family!
                <br />
                Gracias por confiar en nosotros
              </Text>
              <Text className="text-gray-600">
                Favorece el desarrollo de tu peque y encuentra todo lo necesario
                para cualquier etapa. Como agradecimiento te queremos regalar el
                10% de descuento usando el código:
              </Text>
              <Text className="font-bold text-lg">WELCOME10</Text>
              <Button
                href="#"
                className="bg-gray-700 text-white py-2 px-4 rounded-md mt-4"
              >
                ¡QUIERO USARLO!
              </Button>
            </Section>

            <Img
              src="/images/toys.jpg"
              alt="Juguetes educativos"
              className="w-full mt-6"
            />

            <Section className="text-center mt-6">
              <Text className="text-gray-600">
                Gracias por darnos la oportunidad de formar parte del
                crecimiento y desarrollo de tu(s) peque(s). Estamos seguras de
                que nuestros productos te serán de mucha ayuda y a tu(s)
                peque(s) le(s) encantarán.
              </Text>
              <Button
                href="#"
                className="bg-gray-700 text-white py-2 px-4 rounded-md mt-4"
              >
                ¡CONOCER MÁS!
              </Button>
            </Section>

            <Img
              src="/images/bowls.jpg"
              alt="Platos para bebé"
              className="w-full mt-6"
            />

            <Footer />
          </Tailwind>
        </Container>
      </Body>
    </Html>
  );
};

export default WelcomeEmail;
