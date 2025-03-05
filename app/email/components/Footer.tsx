import { Img } from "@react-email/components";
import { BASE_URL } from "@/app/shared/constants";

const Footer = () => {
  return (
    <>
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
            href="mailto:helloshopeques@gmail.com"
            style={{
              color: "#2563eb",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            helloshopeques@gmail.com
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
              src="https://pequesbucket.s3.us-east-2.amazonaws.com/logo-mini.webp"
              style={{
                display: "block",
                margin: "0 auto",
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
              lineHeight: "1.6",
            }}
          >
            <a
              href={`${BASE_URL}/profile`}
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
              href={`${BASE_URL}/terms-of-service`}
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
              href={`${BASE_URL}/privacy-policy`}
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
          Copyright © {new Date().getFullYear()} Peques
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
            Peques, Chihuahua, Chih. México. 31215
          </span>
        </p>
      </footer>
    </>
  );
};

export default Footer;
