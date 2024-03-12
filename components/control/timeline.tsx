import { cva } from "cva";
import { cn } from "@/lib/cn";
import { MusicManager } from "@/lib/music-manager";

const buttonVariants = cva(
  "*:size-5 rounded-full p-1.5 bg-purple-200/10 hover:bg-purple-200/20",
);

export interface TimeControlsProps {
  musicManager: MusicManager;
}

export function TimeControls({ musicManager }: TimeControlsProps) {
  return (
    <div className="flex flex-row gap-2 mt-2">
      {musicManager.isPaused() ? (
        <button
          aria-label="play"
          className={cn(buttonVariants())}
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
          >
            <polygon points="6 3 20 12 6 21 6 3" />
          </svg>
        </button>
      ) : (
        <button
          aria-label="pause"
          className={cn(buttonVariants())}
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
          >
            <rect width="4" height="16" x="6" y="4" />
            <rect width="4" height="16" x="14" y="4" />
          </svg>
        </button>
      )}
    </div>
  );
}
