const ContactPage = () => {
  return (
    <article className="pt-28 px-4 pb-8 container mx-auto max-w-3xl">
      <h1 className="text-center text-lg md:text-2xl font-black">Contacto</h1>
      <p className="mt-4">
        Si tienes alguna pregunta sobre nuestros productos o sobre el manejo de
        tus datos personales, no dudes en contactarnos a través de:
      </p>
      <ul className="mt-4 list-disc list-inside">
        <li>
          <strong>Correo electrónico: </strong>
          <a href="mailto:support@shopeques.com" className="text-blue-500">
            support@shopeques.com
          </a>
        </li>
        <li>
          <strong>Teléfono:</strong> 614-253-23-35 / 614-115-71-34
        </li>
        <li>
          <strong>Dirección:</strong> CP. 31215 Chihuahua, Chih. México.
        </li>
      </ul>
    </article>
  );
};

export default ContactPage;
