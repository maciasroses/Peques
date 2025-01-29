const PrivacyPolicyPage = () => {
  return (
    <article className="pt-40 px-4 pb-8 container mx-auto max-w-3xl">
      <h1 className="text-center text-lg md:text-2xl font-black">
        Aviso de privacidad
      </h1>
      <small>
        Versión vigente: <time dateTime="2025-01-27">27 de Enero de 2025</time>
      </small>
      <p className="mt-4">
        Samira de las Casas “Peques”, respetamos tu privacidad y nos
        comprometemos a proteger la información personal que compartes con
        nosotros. Este Aviso de Privacidad describe cómo recopilamos, utilizamos
        y protegemos tus datos personales cuando visitas nuestro sitio web
        www.shopeques.com
      </p>
      <h2 className="mt-4 text-lg md:text-xl font-semibold">
        1. Información que recopilamos
      </h2>
      <p className="mt-4">Recopilamos dos tipos principales de información:</p>
      <ul className="mt-4 list-disc list-inside">
        <li>
          <strong>Información personal proporcionada por el usuario:</strong>{" "}
          Esto incluye datos como nombre, dirección de correo electrónico,
          número de teléfono, etc., que nos proporcionas cuando te registras en
          nuestro sitio, realizas una compra, te suscribes a nuestro boletín o
          nos contactas.
        </li>
        <li>
          <strong>Información recopilada automáticamente:</strong> Cuando
          navegas por nuestro sitio web, podemos recopilar información de manera
          automática a través de cookies o tecnologías similares. Esto incluye
          tu dirección IP, el tipo de navegador, las páginas que visitas, el
          tiempo de permanencia en el sitio, etc.
        </li>
      </ul>
      <h2 className="mt-4 text-lg md:text-xl font-semibold">
        2. ¿Cómo utilizamos tu información?
      </h2>
      <p className="mt-4">Utilizamos la información que recopilamos para:</p>
      <ul className="mt-4 list-disc list-inside">
        <li>Proporcionar y mejorar nuestros servicios.</li>
        <li>
          Enviar actualizaciones, boletines y promociones, si has dado tu
          consentimiento.
        </li>
        <li>Procesar pagos y gestionar transacciones.</li>
        <li>Procesar envíos, entrega de productos y servicios.</li>
        <li>
          Mejorar la funcionalidad de nuestro sitio web y la experiencia de
          usuario.
        </li>
        <li>
          Cumplir con las obligaciones legales y responder a solicitudes
          legales.
        </li>
      </ul>
      <h2 className="mt-4 text-lg md:text-xl font-semibold">
        3. ¿Con quién compartimos tu información?
      </h2>
      <p className="mt-4">
        No vendemos ni alquilamos tu información personal a terceros. Sin
        embargo, podemos compartir tu información con proveedores de servicios
        que nos ayuden a operar nuestro sitio web o a realizar funciones
        relacionadas, como procesadores de pagos o servicios de análisis web.
        Estas partes sólo pueden usar tu información para los fines específicos
        para los que fueron contratados.
      </p>
      <h2 className="mt-4 text-lg md:text-xl font-semibold">
        4. Seguridad de la información
      </h2>
      <p className="mt-4">
        Tomamos medidas razonables para proteger tu información personal
        mediante tecnologías de seguridad, como el cifrado de datos y protocolos
        de seguridad en el sitio web. Sin embargo, ningún sistema de seguridad
        es completamente infalible y no podemos garantizar la protección total
        contra accesos no autorizados.
      </p>
      <h2 className="mt-4 text-lg md:text-xl font-semibold">
        5. Tus derechos sobre la información
      </h2>
      <p className="mt-4">
        Tienes derecho a acceder, corregir o eliminar la información personal
        que hemos recopilado sobre tí. Si deseas ejercer alguno de estos
        derechos, puedes ponerte en contacto con nosotros a través de
        <a href="mailto:support@shopeques.com" className="text-blue-500">
          {" "}
          support@shopeques.com
        </a>
      </p>
      <h2 className="mt-4 text-lg md:text-xl font-semibold">
        6. Uso de cookies
      </h2>
      <p className="mt-4">
        Nuestro sitio web utiliza cookies para mejorar la experiencia del
        usuario. Las cookies son pequeños archivos que se almacenan en tu
        dispositivo para recordar tus preferencias y personalizar tu
        experiencia. Puedes configurar tu navegador para bloquear las cookies,
        pero algunas funcionalidades del sitio pueden no funcionar
        correctamente.
      </p>
      <h2 className="mt-4 text-lg md:text-xl font-semibold">
        7. Cambios a este Aviso de Privacidad
      </h2>
      <p className="mt-4">
        Nos reservamos el derecho de actualizar este Aviso de Privacidad en
        cualquier momento. Cualquier cambio será publicado en esta página, por
        lo que te recomendamos revisarlo periódicamente.
      </p>
    </article>
  );
};

export default PrivacyPolicyPage;
