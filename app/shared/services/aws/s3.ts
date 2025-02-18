"use server";

import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

interface IUploadFile {
  file: File;
  fileKey: string;
}

export async function uploadFile({ file, fileKey }: IUploadFile) {
  try {
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET!,
      Key: fileKey,
      ContentType: file.type,
    });

    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
    console.log("signedUrl:", signedUrl);

    const response = await fetch(signedUrl, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type,
      },
    });
    console.log("response:", response);
    console.log("response.json", await response.json());

    if (!response.ok) {
      throw new Error("Error al subir el archivo a S3");
    }

    const fileUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;

    return fileUrl;
  } catch (error) {
    console.error("Error en uploadFile:", error);
    throw new Error("No se pudo subir el archivo");
  }
}

export async function deleteFile(fileKey: string) {
  try {
    await s3.send(
      new DeleteObjectCommand({
        Key: fileKey,
        Bucket: process.env.AWS_S3_BUCKET!,
      })
    );
  } catch (error) {
    throw new Error("Error al eliminar el archivo");
  }
}
