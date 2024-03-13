import { MusicManager } from "@/lib/music-manager";
import { MutableRefObject, useEffect, useRef } from "react";

export type DurationControl = (percent: number) => void;

export function Timeline({
  musicManager,
  durationRef,
}: {
  musicManager?: MusicManager;
  durationRef: MutableRefObject<DurationControl | undefined>;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const isDrawingRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!musicManager || !container) return;

    const setTimeline = (percent: number) => {
      timelineRef.current?.style.setProperty("width", `${percent}%`);
    };

    durationRef.current = (percent) => {
      if (isDrawingRef.current) return;

      setTimeline(percent);
    };

    const getPercent = (x: number) => {
      const bound = container.getBoundingClientRect();
      return Math.min((x - bound.left) / bound.width, 1);
    };

    const onStart = (e: Event) => {
      isDrawingRef.current = true;
      e.preventDefault();
    };

    const onMove = (e: TouchEvent | MouseEvent) => {
      if (!isDrawingRef.current) return;
      const x = "clientX" in e ? e.clientX : e.touches[0].clientX;

      setTimeline(getPercent(x) * 100);
      e.preventDefault();
    };

    const onStop = (e: TouchEvent | MouseEvent) => {
      if (!isDrawingRef.current) return;
      const x = "clientX" in e ? e.clientX : e.changedTouches[0].clientX;

      isDrawingRef.current = false;
      musicManager.setTime(getPercent(x) * musicManager.getDuration());
      e.preventDefault();
    };

    window.addEventListener("pointermove", onMove, { passive: false });
    window.addEventListener("mousemove", onMove, { passive: false });

    window.addEventListener("touchend", onStop, { passive: false });
    window.addEventListener("mouseup", onStop, { passive: false });

    container.addEventListener("touchstart", onStart, { passive: false });
    container.addEventListener("mousedown", onStart, { passive: false });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("mousemove", onMove);

      window.removeEventListener("touchend", onStop);
      window.removeEventListener("mouseup", onStop);

      container.removeEventListener("touchstart", onStart);
      container.removeEventListener("mousedown", onStart);
    };
  }, [musicManager]);

  return (
    <div
      ref={containerRef}
      className="h-2 border border-purple-100/30 cursor-pointer"
    >
      <div ref={timelineRef} className="w-0 h-full bg-purple-100" />
    </div>
  );
}
