"use client";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { twMerge } from "tailwind-merge";
function Progress({ className, value, ...props }) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={twMerge(
        "bg-primary/20 relative h-2 w-full overflow-hidden rounded-full",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="h-full w-full flex-1 transition-all"
        style={{
          transform: `translateX(-${100 - (value || 0)}%)`,
          backgroundColor: "var(--progress-color, hsl(var(--primary)))",
        }}
      />
    </ProgressPrimitive.Root>
  );
}
export { Progress };
