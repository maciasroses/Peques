"use client";

import { useState } from "react";
import RichTextEditor from "./Form/RichTextEditor";

const AuxiliarComponentToDelete = () => {
  const [description, setDescription] = useState("");

  const submitAction: React.FormEventHandler<HTMLFormElement> = async (
    event
  ) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formData.append("description", description);

    console.log(description);
    console.log(formData.get("description"));
  };

  return (
    <form onSubmit={submitAction}>
      <div>
        <label>Descripción:</label>
        <RichTextEditor value={description} onChange={setDescription} />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default AuxiliarComponentToDelete;
