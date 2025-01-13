import Image from "next/image";
import { cn } from "@/app/shared/utils/cn";
import { PlayIcon } from "@/app/shared/icons";
import type { IProductFile } from "@/app/shared/interfaces";

const MediaPreview = ({
  alt,
  file,
  isAllGallery,
  onMouseEnter,
}: {
  alt: string;
  file: IProductFile;
  isAllGallery?: boolean;
  onMouseEnter?: () => void;
}) => {
  if (file.type === "IMAGE") {
    return (
      <Image
        priority
        alt={alt}
        src={file.url}
        width={isAllGallery ? 64 : 500}
        height={isAllGallery ? 64 : 300}
        className={cn(
          "object-contain",
          isAllGallery ? "size-full" : "size-auto"
        )}
        onMouseEnter={onMouseEnter}
      />
    );
  }
  if (file.type === "VIDEO") {
    if (isAllGallery) {
      return (
        <div
          className="flex items-center justify-center w-full h-full"
          onMouseEnter={onMouseEnter}
        >
          <PlayIcon size="size-8" />
        </div>
      );
    } else {
      return (
        <video
          muted
          autoPlay
          width={500}
          height={300}
          src={file.url}
          className="size-auto object-contain"
          onMouseEnter={onMouseEnter}
        />
      );
    }
  }
  return null;
};

export default MediaPreview;
