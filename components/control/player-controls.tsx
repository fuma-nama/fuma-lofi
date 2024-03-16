import { cn } from "@/lib/cn";
import { MusicManager } from "@/lib/music-manager";
import { buttonVariants } from "@/components/ui/button";
import { Song } from "@/music/data";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";

export interface TimeControlsProps {
  musicManager: MusicManager;
}

export function PlayerControls({ musicManager }: TimeControlsProps) {
  const randomize = () => {
    const songs = [...musicManager.queueManager.songs];
    const newList: Song[] = [];

    while (songs.length > 0) {
      const idx = Math.floor(Math.random() * songs.length);
      const selected = songs.splice(idx, 1)[0];

      newList.push(selected);
    }

    musicManager.queueManager.setSongs(newList);
  };

  return (
    <div className="flex flex-row items-center gap-2 mt-2">
      {musicManager.isPaused() ? (
        <button
          aria-label="play"
          className={cn(buttonVariants({ variant: "secondary" }))}
          onClick={() => musicManager.play()}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-5"
          >
            <polygon points="6 3 20 12 6 21 6 3" />
          </svg>
        </button>
      ) : (
        <button
          aria-label="pause"
          className={cn(buttonVariants({ variant: "secondary" }))}
          onClick={() => musicManager.pause()}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-5"
          >
            <rect width="4" height="16" x="6" y="4" />
            <rect width="4" height="16" x="14" y="4" />
          </svg>
        </button>
      )}
      <button
        aria-label="Randomize queue"
        className={cn(buttonVariants({ variant: "secondary" }))}
        onClick={randomize}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-5"
        >
          <rect width="12" height="12" x="2" y="10" rx="2" ry="2" />
          <path d="m17.92 14 3.5-3.5a2.24 2.24 0 0 0 0-3l-5-4.92a2.24 2.24 0 0 0-3 0L10 6" />
          <path d="M6 18h.01" />
          <path d="M10 14h.01" />
          <path d="M15 6h.01" />
          <path d="M18 9h.01" />
        </svg>
      </button>
      <VolumeSlider musicManager={musicManager} />
    </div>
  );
}

function VolumeSlider({ musicManager }: { musicManager: MusicManager }) {
  const [value, setValue] = useState(() => musicManager.getVolume());

  return (
    <>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-4"
      >
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
        {value > 0.2 && <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />}
        {value > 0.7 && <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />}
      </svg>
      <Slider
        className="flex-1 rounded-full"
        aria-valuetext="Volume"
        value={value}
        onValueChange={(v) => {
          setValue(v);
          musicManager.setVolume(v);
        }}
      />
    </>
  );
}
