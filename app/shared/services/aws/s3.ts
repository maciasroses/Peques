"use server";

import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

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
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    await s3.send(
      new PutObjectCommand({
        Key: fileKey,
        Body: buffer,
        Bucket: process.env.AWS_S3_BUCKET!,
        ContentType: file.type,
      })
    );

    const fileUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;

    return fileUrl;
  } catch (error) {
    throw new Error("Error al subir el archivo");
  }
}

export async function deleteFile(fileUrl: string) {
  try {
    await s3.send(
      new DeleteObjectCommand({
        Key: fileUrl,
        Bucket: process.env.AWS_S3_BUCKET!,
      })
    );
  } catch (error) {
    throw new Error("Error al eliminar el archivo");
  }
}
