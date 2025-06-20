import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useThemeContext } from '../../context/ThemeContext.tsx';

const Tiling = ({ patternSrc }: { patternSrc: string }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const location = useLocation();
  const { themeMode } = useThemeContext();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    canvas.width = screenWidth * dpr;
    canvas.height = screenHeight * dpr;
    canvas.style.width = `${screenWidth}px`;
    canvas.style.height = `${screenHeight}px`;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    ctx.fillStyle = themeMode === 'dark' ? '#121212' : '#ffffff';
    ctx.fillRect(0, 0, screenWidth, screenHeight);

    const maxTiles = 200;
    const spacing = 2;
    const placedRects: [number, number, number, number][] = [];

    function isOverlapping(rect1: Rect, rect2: Rect) {
      return !(
        rect1[2] + spacing <= rect2[0] ||
        rect1[0] >= rect2[2] + spacing ||
        rect1[3] + spacing <= rect2[1] ||
        rect1[1] >= rect2[3] + spacing
      );
    }

    const image = new Image();
    let isCancelled = false;

    image.src = patternSrc;
    image.onload = () => {
      if (isCancelled) return;

      let attempts = 0;
      const maxAttempts = maxTiles * 50;

      while (placedRects.length < maxTiles && attempts < maxAttempts) {
        attempts++;

        const offCanvas = document.createElement("canvas");
        const flipX = Math.random() < 0.5;
        const flipY = Math.random() < 0.5;
        const rotate = [0, 90, 180, 270][Math.floor(Math.random() * 4)];

        let w = image.width;
        let h = image.height;
        if (rotate === 90 || rotate === 270) [w, h] = [h, w];

        offCanvas.width = w;
        offCanvas.height = h;

        const oCtx = offCanvas.getContext("2d");
        if (!oCtx) continue;

        oCtx.clearRect(0, 0, w, h);
        oCtx.save();
        oCtx.translate(w / 2, h / 2);
        oCtx.rotate((rotate * Math.PI) / 180);
        oCtx.scale(flipX ? -1 : 1, flipY ? -1 : 1);
        oCtx.drawImage(image, -image.width / 2, -image.height / 2);
        oCtx.restore();

        const x = Math.floor(Math.random() * (screenWidth - w));
        const y = Math.floor(Math.random() * (screenHeight - h));
        const newRect: Rect = [x, y, x + w, y + h];

        if (placedRects.some((rect) => isOverlapping(newRect, rect))) continue;

        ctx.drawImage(offCanvas, x, y);
        placedRects.push(newRect);
      }
    };

    return () => {
      isCancelled = true;
    };
  }, [location.pathname, patternSrc, themeMode]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: -1,
        pointerEvents: "none",
        userSelect: "none",
      }}
    />
  );
};

export default Tiling;
