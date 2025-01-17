import formatCurrency from "@/app/shared/utils/format-currency";
import formatDateLatinAmerican from "@/app/shared/utils/formatdate-latin";
import { Img, Row, Column, Section, Text } from "@react-email/components";
import type { IOrderInfoForEmail } from "@/app/shared/interfaces";

const OrderInfo = ({ order }: { order: IOrderInfoForEmail }) => {
  return (
    <>
      <Section className="bg-gray-50 rounded-md px-4">
        <Row>
          <Column className="flex justify-start items-start w-1/3">
            <Text>
              CORREO ELECTRÓNICO:
              <br />
              <span className="text-blue-600">{order.email}</span>
            </Text>
          </Column>
          <Column className="w-2/3">
            <Text>
              IDENTIFICADOR:
              <br />
              <span className="text-blue-600">{order.order.id}</span>
            </Text>
            <Text>
              FECHA:
              <br />
              <span>{formatDateLatinAmerican(order.order.createdAt)}</span>
            </Text>
          </Column>
        </Row>
      </Section>
      <Section className="bg-gray-50 rounded-md px-4 mt-10 mb-4">
        <Text>
          <h3>Productos</h3>
          <div className="flex flex-col gap-4">
            {order.products.map((product) => (
              <Row key={product.name}>
                <Column>
                  <Row>
                    <Column className="w-1/2 flex gap-4 items-center">
                      <Img
                        width={100}
                        height={100}
                        alt={product.name}
                        src={product.file}
                      />
                      <div className="ml-4">
                        <Text className="text-lg">{product.name}</Text>
                      </div>
                    </Column>
                    <Column className="w-2/2 text-right">
                      <Text className="text-lg">
                        {product.quantity}
                        {" x "}
                        <span className="font-bold">
                          {formatCurrency(product.price, "MXN")}
                        </span>
                      </Text>
                    </Column>
                  </Row>
                </Column>
              </Row>
            ))}
          </div>
          <div className="w-full text-right">
            <Text className="text-xl">
              Envío: <span className="font-bold">$99.00</span>
              <br />
              Subtotal:{" "}
              <span className="font-bold">
                {formatCurrency(order.totalInCents / 100 - 99, "MXN")}
              </span>
            </Text>
            <hr />
            <Text className="text-2xl">
              Total:{" "}
              <span className="font-bold">
                {formatCurrency(order.totalInCents / 100, "MXN")}
              </span>
            </Text>
          </div>
        </Text>
      </Section>
      <Section>
        <Text>
          <p className="text-center text-sm">
            Si tienes alguna pregunta sobre tu pedido, contáctanos en
            <br />
            <a href="mailto:ecommerce@support.com">
              <span className="text-blue-600">shopeques@support.com</span>
            </a>
          </p>
          <br />
          <br />
          <div className="text-center text-sm">
            <div className="flex items-center justify-center">
              <Img
                width={40}
                height={40}
                alt="Peques logo"
                src="https://ilidf54ifchqqkqe.public.blob.vercel-storage.com/logo-mini-618H1j8ecia4nZOF8sSrr5dM6NlNK1.webp"
              />
            </div>
            <p className="text-center">
              <a href="https://ecommerce.com/profile">
                <span className="text-blue-600">Cuenta de Peques</span>
              </a>
              {" • "}
              <a href="https://ecommerce.com/terms-of-sales">
                <span className="text-blue-600">Términos y Condiciones</span>
              </a>
              {" • "}
              <a href="https://ecommerce.com/privacy-policy">
                <span className="text-blue-600">Política de Privacidad</span>
              </a>
            </p>
          </div>
          <p className="text-center text-sm">
            Copyright © {new Date().getFullYear()} Shopeques
            <br />
            <a href="https://ecommerce.com/legal">
              <span className="text-blue-600">
                Todos los derechos reservados.
              </span>
            </a>
            <br />
            <span>Shopeques 1234 Main St. Anytown, USA 12345</span>
          </p>
        </Text>
      </Section>
    </>
  );
};

export default OrderInfo;
