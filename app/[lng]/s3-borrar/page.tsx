"use client";

import { generateFileKey } from "@/app/shared/utils/generateFileKey";

const S3BORRAR = () => {
  const submitAction: React.FormEventHandler<HTMLFormElement> = async (
    event
  ) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const file = formData.get("file") as File;
    const fileKey = generateFileKey(file);
    const res = await fetch("/api/aws-s3-signed-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileKey, contentType: file.type }),
    });

    const { signedUrl } = await res.json();

    await fetch(signedUrl, {
      method: "PUT",
      body: file,
      headers: { "Content-Type": file.type },
    });
  };

  return (
    <form onSubmit={submitAction} className="pt-40 px-4">
      <h1>S3BORRAR - CLIENT</h1>
      <input type="file" name="file" />
      <button type="submit">Submit</button>
    </form>
  );
};

export default S3BORRAR;
