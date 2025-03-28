import { Img } from "@react-email/components";
import { PICK_UP_ADDRESSES } from "@/app/shared/constants";
import formatCurrency from "@/app/shared/utils/format-currency";
import { roundUpNumber } from "@/app/shared/utils/roundUpNumber";
import formatDateLatinAmerican from "@/app/shared/utils/formatdate-latin";
import type { IOrderInfoForEmail } from "@/app/shared/interfaces";

const OrderInfo = ({ order }: { order: IOrderInfoForEmail }) => {
  const hasGlobalDiscount = order.order.discount !== 0;

  const subtotal = order.order.products.reduce(
    (acc, product) =>
      acc +
      product.costMXN * product.quantity * (1 - (product.discount ?? 0) / 100),
    0
  );

  return (
    <div style={{ fontSize: "14px" }}>
      {/* Información general */}
      <div
        style={{
          backgroundColor: "#f9fafb",
          borderRadius: "8px",
          padding: "16px",
          marginBottom: "20px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ flex: "1", marginRight: "16px" }}>
            <p>
              <strong>Correo Electrónico:</strong>
              <br />
              <span style={{ color: "#2563eb" }}>{order.email}</span>
            </p>
          </div>
          <div style={{ flex: "2" }}>
            <p>
              <strong>Número de Orden:</strong>
              <br />
              <span style={{ color: "#2563eb" }}>{order.order.id}</span>
            </p>
            <p>
              <strong>Fecha:</strong>
              <br />
              <span>{formatDateLatinAmerican(order.order.createdAt)}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Productos */}
      <div
        style={{
          backgroundColor: "#f9fafb",
          borderRadius: "8px",
          padding: "16px",
        }}
      >
        <h3 style={{ fontSize: "18px", marginBottom: "16px" }}>Productos</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {order.products.map((product) => (
            <div
              key={product.name}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <Img
                  width={80}
                  height={80}
                  alt={product.name}
                  src={product.file}
                  style={{ borderRadius: "4px" }}
                />
                <div>
                  <p style={{ fontSize: "16px", margin: "0" }}>
                    {product.name}
                  </p>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                {product.discount && (
                  <p
                    style={{
                      textDecoration: "line-through",
                      fontSize: "12px",
                      color: "#6b7280",
                      margin: "0",
                    }}
                  >
                    {formatCurrency(product.price, "MXN")}
                  </p>
                )}
                <p style={{ fontSize: "16px", margin: "0" }}>
                  {product.quantity} x{" "}
                  <span style={{ fontWeight: "bold" }}>
                    {formatCurrency(roundUpNumber(product.finalPrice), "MXN")}
                  </span>
                </p>
                {product.discount && (
                  <p
                    style={{
                      fontSize: "12px",
                      color: "#16a34a",
                      fontWeight: "500",
                      margin: "0",
                    }}
                  >
                    Descuento aplicado
                  </p>
                )}
                {product.customRequest && (
                  <div>
                    <p
                      style={{
                        fontWeight: "bold",
                        margin: "0",
                        textAlign: "right",
                      }}
                    >
                      Producto personalizado
                    </p>

                    <p
                      style={{
                        textAlign: "right",
                      }}
                    >
                      <span
                        style={{
                          marginRight: "8px",
                        }}
                      >
                        Nombre:
                      </span>
                      <span>{JSON.parse(product.customRequest).name}</span>
                    </p>
                    <p
                      style={{
                        textAlign: "right",
                      }}
                    >
                      <span
                        style={{
                          marginRight: "8px",
                        }}
                      >
                        Fuente:
                      </span>
                      <span>{JSON.parse(product.customRequest).font}</span>
                    </p>
                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        alignItems: "center",
                        justifyContent: "flex-end",
                      }}
                    >
                      <span
                        style={{
                          marginRight: "8px",
                        }}
                      >
                        Color:
                      </span>
                      <div
                        style={{
                          backgroundColor: JSON.parse(product.customRequest)
                            .color,
                          width: "20px",
                          height: "20px",
                          borderRadius: "100%",
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Subtotales y totales */}
        <div style={{ textAlign: "right", marginTop: "20px" }}>
          <p style={{ fontSize: "16px", margin: "0" }}>
            Envío:{" "}
            <span
              style={{
                fontWeight: "bold",
                color: order.order.shippingCost === 0 ? "#16a34a" : "inherit",
              }}
            >
              {formatCurrency(order.order.shippingCost ?? 190, "MXN")}
            </span>
          </p>
          <p style={{ fontSize: "16px", margin: "0" }}>
            Subtotal:{" "}
            <span
              style={{
                fontWeight: "bold",
                textDecoration: hasGlobalDiscount ? "line-through" : "none",
              }}
            >
              {formatCurrency(roundUpNumber(subtotal), "MXN")}
            </span>
            {hasGlobalDiscount && (
              <span
                style={{
                  marginLeft: "8px",
                  fontWeight: "bold",
                  color: "#16a34a",
                }}
              >
                {formatCurrency(
                  order.order.total - (order.order.shippingCost ?? 190),
                  "MXN"
                )}
              </span>
            )}
          </p>
          <hr style={{ margin: "10px 0" }} />
          <p style={{ fontSize: "18px", fontWeight: "bold", margin: "0" }}>
            Total:{" "}
            <span
              style={{
                fontWeight: "bold",
                textDecoration: hasGlobalDiscount ? "line-through" : "none",
              }}
            >
              {formatCurrency(
                roundUpNumber(subtotal) + (order.order.shippingCost ?? 190),
                "MXN"
              )}
            </span>
            {hasGlobalDiscount && (
              <span
                style={{
                  marginLeft: "8px",
                  fontWeight: "bold",
                  color: "#16a34a",
                }}
              >
                {formatCurrency(order.order.total, "MXN")}
              </span>
            )}
          </p>
        </div>

        {/* Descuento aplicado */}
        {hasGlobalDiscount && (
          <div style={{ marginTop: "16px" }}>
            <p style={{ fontSize: "16px", margin: "0" }}>
              <span style={{ fontWeight: "bold", color: "#16a34a" }}>
                Descuento aplicado:{" "}
              </span>
              {order.order.promotions.find(
                (promo) => promo.promotion.discountCodes.length > 0
              )?.promotion.title ?? ""}
            </p>
          </div>
        )}
      </div>

      {/* Información de Pago y Envío/Recogido */}
      <div
        style={{
          backgroundColor: "#f9fafb",
          borderRadius: "8px",
          padding: "16px",
          marginTop: "20px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ flex: "1", marginRight: "16px" }}>
            {/* Dirección de Envío */}
            <div style={{ marginTop: "16px" }}>
              <h3
                style={{
                  fontSize: "16px",
                  fontWeight: "bold",
                  marginBottom: "8px",
                }}
              >
                {order.order.address
                  ? "Dirección de Envío"
                  : "Dirección de Recogida"}
              </h3>
              {order.order.address ? (
                <>
                  <p>
                    <strong>{order.order.address.fullName}</strong>
                  </p>
                  <p>
                    {order.order.address.address1},{" "}
                    {order.order.address.address2}
                  </p>
                  <p>
                    {order.order.address.city}, {order.order.address.state},{" "}
                    {order.order.address.zipCode}
                  </p>
                  <p>{order.order.address.country}</p>
                  <p>
                    <strong>Teléfono:</strong> {order.order.address.phoneNumber}
                  </p>
                </>
              ) : (
                <>
                  <p>
                    <strong>{PICK_UP_ADDRESSES[0].name}</strong>
                  </p>
                  <p>{PICK_UP_ADDRESSES[0].street}</p>
                  <p>
                    {PICK_UP_ADDRESSES[0].city}, {PICK_UP_ADDRESSES[0].state},{" "}
                    {PICK_UP_ADDRESSES[0].zipCode}
                  </p>
                  <p>{PICK_UP_ADDRESSES[0].country}</p>
                  <p>
                    <strong>Referencia:</strong>{" "}
                    {PICK_UP_ADDRESSES[0].reference}
                  </p>
                  <p>
                    <strong>Horario:</strong>
                    <ul>
                      {PICK_UP_ADDRESSES[0].schedule.map((item) => (
                        <li key={item.id}>{item.value}</li>
                      ))}
                    </ul>
                  </p>
                  <p>
                    <strong>Notas:</strong> {PICK_UP_ADDRESSES[0].notes}
                  </p>
                </>
              )}
            </div>
          </div>
          <div style={{ flex: "1" }}>
            {/* Método de Pago */}
            {order.order.payment && (
              <div style={{ marginTop: "16px" }}>
                <h3
                  style={{
                    fontSize: "16px",
                    fontWeight: "bold",
                    marginBottom: "8px",
                  }}
                >
                  Método de Pago
                </h3>
                <p>
                  <strong>Tarjeta:</strong>{" "}
                  {order.order.payment.brand.toUpperCase()} ****
                  {order.order.payment.last4Digits}
                </p>
                <p>
                  <strong>Expiración:</strong> {order.order.payment.expiryMonth}
                  /{order.order.payment.expiryYear}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderInfo;
