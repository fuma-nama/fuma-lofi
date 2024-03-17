import type * as React from "react";
import { forwardRef, useRef } from "react";
import { cn } from "@/lib/cn";
import { composeEventHandlers } from "@radix-ui/primitive";
import { useComposedRefs } from "@radix-ui/react-compose-refs";

export interface SliderProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Value from 0 to 1 (percentage)
   */
  value: number;

  onValueChange: (v: number) => void;
  onSlideEnd?: (v: number) => void;
  onSlideStart?: () => void;
}

export const Slider = forwardRef<HTMLDivElement, SliderProps>(
  ({ value, onValueChange, onSlideEnd, onSlideStart, ...props }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const mergedRef = useComposedRefs(ref, containerRef);

    const getPercent = (x: number) => {
      if (!containerRef.current) return 0;

      const bound = containerRef.current.getBoundingClientRect();
      const percent = (x - bound.left) / bound.width;

      return Math.min(Math.max(percent, 0), 1);
    };

    return (
      <span
        ref={mergedRef}
        {...props}
        className={cn("flex touch-none h-6 py-2", props.className)}
        onPointerDown={composeEventHandlers(props.onPointerDown, (event) => {
          const thumb = containerRef.current?.children[0];
          const target = event.target as HTMLElement;
          target.setPointerCapture(event.pointerId);
          // Prevent browser focus behaviour because we focus a thumb manually when values change.
          event.preventDefault();
          onSlideStart?.();

          // Touch devices have a delay before focusing so won't focus if touch immediately moves
          // away from target (sliding). We want thumb to focus regardless.
          if (thumb && thumb === target) {
            target.focus();
          }
        })}
        onPointerMove={composeEventHandlers(props.onPointerMove, (event) => {
          const target = event.target as HTMLElement;

          if (target.hasPointerCapture(event.pointerId)) {
            onValueChange(getPercent(event.clientX));
          }
        })}
        onPointerUp={composeEventHandlers(props.onPointerUp, (event) => {
          const target = event.target as HTMLElement;
          if (target.hasPointerCapture(event.pointerId)) {
            target.releasePointerCapture(event.pointerId);

            onSlideEnd?.(getPercent(event.clientX));
          }
        })}
      >
        <span className="size-full border rounded-full border-purple-100/30 overflow-hidden">
          <span
            role="slider"
            aria-valuemin={0}
            aria-valuenow={value * 100}
            aria-valuemax={100}
            tabIndex={0}
            className="block h-full bg-purple-100"
            style={{ width: `${value * 100}%` }}
          />
        </span>
      </span>
    );
  },
);
