"use client";

import { useEffect, useState } from "react";

type Position = {
  x: number;
  y: number;
};

const initialPosition: Position = { x: -100, y: -100 };

export const CrosshairCursor = () => {
  const [enabled, setEnabled] = useState(false);
  const [position, setPosition] = useState<Position>(initialPosition);

  useEffect(() => {
    const finePointerQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const evaluate = () => {
      setEnabled(finePointerQuery.matches && !reduceMotionQuery.matches);
    };

    evaluate();
    finePointerQuery.addEventListener("change", evaluate);
    reduceMotionQuery.addEventListener("change", evaluate);

    return () => {
      finePointerQuery.removeEventListener("change", evaluate);
      reduceMotionQuery.removeEventListener("change", evaluate);
    };
  }, []);

  useEffect(() => {
    if (!enabled) {
      setPosition(initialPosition);
      document.body.classList.remove("cursor-enabled");
      return;
    }

    document.body.classList.add("cursor-enabled");

    const onPointerMove = (event: PointerEvent) => {
      setPosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener("pointermove", onPointerMove);

    return () => {
      document.body.classList.remove("cursor-enabled");
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, [enabled]);

  if (!enabled) {
    return null;
  }

  return (
    <div
      aria-hidden
      className="crosshair-cursor"
      style={{ transform: `translate3d(${position.x}px, ${position.y}px, 0)` }}
    >
      <span className="crosshair-line crosshair-line-x" />
      <span className="crosshair-line crosshair-line-y" />
    </div>
  );
};
