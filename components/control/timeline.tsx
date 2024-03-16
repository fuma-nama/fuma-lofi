import { MusicManager } from "@/lib/music-manager";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { Slider } from "@/components/ui/slider";

export type DurationControl = (percent: number) => void;

export function Timeline({
  musicManager,
  durationRef,
}: {
  musicManager?: MusicManager;
  durationRef: MutableRefObject<DurationControl | undefined>;
}) {
  const [value, setValue] = useState(0);
  const isDrawingRef = useRef(false);

  useEffect(() => {
    durationRef.current = (percent) => {
      if (isDrawingRef.current) return;

      setValue(percent / 100);
    };
  }, []);

  return (
    <Slider
      value={value}
      aria-valuetext="Time"
      onSlideStart={() => {
        isDrawingRef.current = true;
      }}
      onValueChange={setValue}
      onSlideEnd={(v) => {
        isDrawingRef.current = false;
        setValue(v);

        if (musicManager) {
          musicManager.setTime(v * musicManager.getDuration());
        }
      }}
    />
  );
}
