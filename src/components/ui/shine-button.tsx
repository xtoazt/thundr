import * as React from "react";
import { cn } from "@/lib/utils";

type ShineButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  glow?: boolean;
};

export const ShineButton = React.forwardRef<HTMLButtonElement, ShineButtonProps>(
  ({ className, children, glow = true, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "relative inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium",
          "bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-white",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/40",
          "transition-transform duration-150 hover:scale-[1.02] active:scale-[0.99]",
          className
        )}
        {...props}
      >
        {glow && (
          <span
            aria-hidden
            className="absolute -inset-0.5 rounded-full blur-md opacity-50 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500"
          />
        )}
        <span className="relative z-10">{children}</span>
      </button>
    );
  }
);

ShineButton.displayName = "ShineButton";

export default ShineButton;


