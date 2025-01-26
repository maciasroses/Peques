import { Img } from "@react-email/components";

const Footer = () => {
  return (
    <>
      {/* Estilos en línea con media queries */}
      <style>
        {`
          @media (max-width: 640px) {
            .footer-text {
              font-size: 12px; /* Tamaño pequeño para pantallas estrechas */
              text-align: center;
            }
            .footer-links {
              display: block;
              margin-top: 10px;
            }
          }
          @media (min-width: 641px) {
            .footer-text {
              font-size: 14px; /* Tamaño más grande en pantallas anchas */
              text-align: center;
            }
            .footer-links {
              display: inline;
            }
          }
        `}
      </style>
      <footer style={{ padding: "20px 0" }}>
        {/* Contacto */}
        <p
          style={{
            margin: "0 0 10px",
            fontSize: "14px",
            color: "#6b7280",
            textAlign: "center",
          }}
        >
          Si tienes alguna duda, contáctanos en
          <br />
          <a
            href="mailto:support@shopeques.com"
            style={{
              color: "#2563eb",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            support@shopeques.com
          </a>
        </p>

        {/* Logo y links */}
        <div style={{ textAlign: "center", margin: "20px 0" }}>
          {/* Logo */}
          <div style={{ marginBottom: "10px" }}>
            <Img
              width={40}
              height={40}
              alt="Peques logo"
              src="https://ilidf54ifchqqkqe.public.blob.vercel-storage.com/logo-mini-618H1j8ecia4nZOF8sSrr5dM6NlNK1.webp"
              style={{
                display: "block", // Esto asegura que esté centrado en su contenedor
                margin: "0 auto", // Centra horizontalmente dentro del div
                borderRadius: "50%",
              }}
            />
          </div>
          {/* Links */}
          <p
            className="footer-links"
            style={{
              margin: "10px 0 0",
              color: "#2563eb",
              fontSize: "14px",
              lineHeight: "1.6", // Ajusta la separación entre líneas para mejor legibilidad
            }}
          >
            <a
              href="https://ecommerce.com/profile"
              style={{
                color: "#2563eb",
                textDecoration: "none",
                margin: "0 5px",
              }}
            >
              Cuenta de Peques
            </a>
            •
            <a
              href="https://ecommerce.com/terms-of-sales"
              style={{
                color: "#2563eb",
                textDecoration: "none",
                margin: "0 5px",
              }}
            >
              Términos y Condiciones
            </a>
            •
            <a
              href="https://ecommerce.com/privacy-policy"
              style={{
                color: "#2563eb",
                textDecoration: "none",
                margin: "0 5px",
              }}
            >
              Política de Privacidad
            </a>
          </p>
        </div>

        {/* Copyright */}
        <p
          className="footer-text"
          style={{ margin: "20px 0 0", color: "#6b7280", fontSize: "14px" }}
        >
          Copyright © {new Date().getFullYear()} Shopeques
          <br />
          <span
            style={{
              fontWeight: "bold",
            }}
          >
            Todos los derechos reservados.
          </span>
          <br />
          <span style={{ display: "block", marginTop: "5px" }}>
            Shopeques, 1234 Main St., Anytown, USA 12345
          </span>
        </p>
      </footer>
    </>
  );
};

export default Footer;
