import { Img } from "@react-email/components";

interface IHeader {
  title: string;
}

const Header = ({ title }: IHeader) => {
  return (
    <>
      <style>
        {`
          @media (max-width: 640px) {
            .header-title {
              font-size: 1.25rem; /* 20px */
              color: #9ca3af; /* Gris claro */
            }
          }
          @media (min-width: 641px) {
            .header-title {
              font-size: 2rem; /* 32px */
              color: #6b7280; /* Gris medio */
            }
          }
        `}
      </style>
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Img
          width={150}
          height={70}
          alt="Peques logo"
          src="https://pequesbucket.s3.us-east-2.amazonaws.com/logo-color.webp"
        />
        <p
          className="header-title"
          style={{ margin: 0, fontWeight: 300, textAlign: "right" }}
        >
          {title}
        </p>
      </header>
    </>
  );
};

export default Header;
