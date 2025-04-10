"use client";

import "react-quill/dist/quill.snow.css";
import { useState } from "react";
import dynamic from "next/dynamic";
import { Toast } from "@/app/shared/components";
import { sendNewsLetter } from "@/app/shared/services/user/controller";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const modules = {
  toolbar: {
    container: [
      [{ header: [1, 2, 3, 4, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ script: "sub" }, { script: "super" }],
      ["image", "link"],
      ["clean"],
    ],
    handlers: {
      image: () => {},
    },
  },
};

interface IEmailEditor {
  emailUsers: string[];
  onClose: () => void;
}

const EmailEditor = ({ emailUsers, onClose }: IEmailEditor) => {
  const [error, setError] = useState("");
  const [content, setContent] = useState("");

  const sendEmail = async () => {
    if (!content) {
      setError("El contenido del correo no puede estar vacío");
      return;
    }

    const res = await sendNewsLetter({
      emailUsers,
      html: content,
    });

    if (res.success) {
      Toast({
        type: "success",
        message: "Newsletter enviado con éxito",
        theme: "light",
      });
      onClose();
    } else {
      setError("Error al enviar el newsletter");
    }
  };

  return (
    <>
      <h2 className="text-xl font-bold mb-2">Editor de Correo</h2>
      {error && <small className="text-red-500">{error}</small>}
      <ReactQuill
        value={content}
        onChange={setContent}
        modules={{
          toolbar: {
            container: modules.toolbar.container,
          },
        }}
      />
      <div className="text-center mt-4">
        <button
          className="bg-accent text-white px-4 py-2 rounded-md"
          onClick={sendEmail}
        >
          Enviar Correo
        </button>
      </div>
    </>
  );
};

export default EmailEditor;
