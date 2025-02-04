import { useState, useRef } from "react";

interface ZoomPosition {
  x: number;
  y: number;
}

export const useImageZoom = () => {
  const zoomRef = useRef<HTMLDivElement | null>(null);
  const [zoomPosition, setZoomPosition] = useState<ZoomPosition>({
    x: 0,
    y: 0,
  });
  const [zoomBoxPosition, setZoomBoxPosition] = useState<ZoomPosition>({
    x: 0,
    y: 0,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();

    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;

    const zoomBoxX = e.pageX - left - 75;
    const zoomBoxY = e.pageY - top - 75;

    const clampedX = Math.max(0, Math.min(zoomBoxX, width - 150));
    const clampedY = Math.max(0, Math.min(zoomBoxY, height - 150));

    setZoomPosition({ x, y });
    setZoomBoxPosition({ x: clampedX, y: clampedY });
  };

  const handleMouseLeave = () => {
    setZoomPosition({ x: 0, y: 0 });
  };

  return {
    zoomRef,
    zoomPosition,
    zoomBoxPosition,
    handleMouseMove,
    handleMouseLeave,
  };
};
