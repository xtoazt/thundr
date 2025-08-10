import React, { useRef } from "react";
import { cn } from "@/lib/utils";

type TiltCardProps = React.HTMLAttributes<HTMLDivElement> & {
  glare?: boolean;
  maxTiltDeg?: number;
};

/**
 * Lightweight tilt/hover parallax card with optional glare.
 */
export const TiltCard: React.FC<TiltCardProps> = ({
  className,
  children,
  glare = true,
  maxTiltDeg = 10,
  ...rest
}) => {
  const ref = useRef<HTMLDivElement | null>(null);

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const rx = (py - 0.5) * 2 * maxTiltDeg; // rotateX
    const ry = (px - 0.5) * -2 * maxTiltDeg; // rotateY
    el.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    if (glare) {
      const glareEl = el.querySelector<HTMLElement>("[data-glare]");
      if (glareEl) {
        const angle = Math.atan2(e.clientY - rect.top, e.clientX - rect.left);
        const deg = (angle * 180) / Math.PI + 180;
        glareEl.style.background = `conic-gradient(from ${deg}deg, hsla(210,100%,80%,0.0), hsla(265,100%,80%,0.12), hsla(320,100%,80%,0.0))`;
      }
    }
  };

  const handleLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "perspective(700px) rotateX(0deg) rotateY(0deg)";
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={cn(
        "relative transition-transform duration-200 ease-out will-change-transform",
        className
      )}
      {...rest}
    >
      {glare && (
        <div
          data-glare
          className="pointer-events-none absolute inset-0 rounded-inherit opacity-70 mix-blend-screen"
        />
      )}
      {children}
    </div>
  );
};

export default TiltCard;


