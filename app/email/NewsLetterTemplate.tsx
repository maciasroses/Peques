import {
  Img,
  Html,
  Head,
  Body,
  Preview,
  Section,
  Tailwind,
  Container,
} from "@react-email/components";
import { Footer } from "./components";

const NewsLetterTemplate = ({ html }: { html: string }) => {
  return (
    <Html lang="es">
      <Preview>Aquí tienes nuestro Newsletter</Preview>
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
            <div
              className="ql-editor"
              dangerouslySetInnerHTML={{ __html: html }}
            />
            <Footer />
          </Tailwind>
        </Container>
      </Body>
    </Html>
  );
};

export default NewsLetterTemplate;
