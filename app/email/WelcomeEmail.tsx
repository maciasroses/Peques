import {
  Img,
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
import { Footer } from "./components";

const WelcomeEmail = () => {
  return (
    <Html lang="es">
      <Preview>¡Bienvenido a la familia Peques!</Preview>
      <Head />
      <Body className="bg-gray-100">
        <Container className="max-w-2xl bg-white">
          <Tailwind>
            <Section className="bg-[#D2D8C0] w-full text-center py-2">
              <Img
                src="https://pequesbucket.s3.us-east-2.amazonaws.com/logo-white.webp"
                alt="Peques"
                className="w-auto h-14 mx-auto"
              />
            </Section>

            <Section className="text-center">
              <Text className="text-lg font-semibold">
                ¡Welcome to the peques family!
                <br />
                Gracias por confiar en nosotros
              </Text>
              <Text className="text-gray-600">
                Favorece el desarrollo de tu peque y encuentra todo lo necesario
                para cualquier etapa.
                <br />
                Como agradecimiento te queremos regalar el 10% de descuento
                usando el código:
              </Text>
              <Text className="font-bold text-lg">WELCOME10</Text>
              <Button
                href="https://shopeques.com"
                className="bg-[#778586] text-white py-2 px-4 rounded-md mt-4"
              >
                ¡QUIERO USARLO!
              </Button>
            </Section>

            <Img
              src="https://pequesbucket.s3.us-east-2.amazonaws.com/Collections/8D168325-8D8B-4548-A22D-4644C10FA93B-1739768466391.webp"
              alt="Juguetes educativos"
              className="w-full mt-6"
            />

            <Section className="text-center mt-6">
              <Text className="text-gray-600">
                Gracias por darnos la oportunidad de formar parte del
                crecimiento y desarrollo de tu(s) peque(s).
                <br />
                Estamos seguras de que nuestros productos te serán de mucha
                ayuda y a tu(s) peque(s) le(s) encantarán.
              </Text>
              <Button
                href="https://shopeques.com"
                className="bg-[#778586] text-white py-2 px-4 rounded-md mt-4"
              >
                ¡CONOCER MÁS!
              </Button>
            </Section>

            <Img
              src="https://pequesbucket.s3.us-east-2.amazonaws.com/Collections/D1ADBAA8-CBE6-4CBD-992C-7AA1B294CCEB-1739682452777.webp"
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
