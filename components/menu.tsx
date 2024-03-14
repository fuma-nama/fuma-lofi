import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SongList } from "@/components/control/song-list";
import { TimeControls } from "@/components/control/time-controls";
import { MusicManager } from "@/lib/music-manager";
import { cn } from "@/lib/cn";
import { buttonVariants } from "@/components/ui/button";

export function Menu({ musicManager }: { musicManager: MusicManager }) {
  return (
    <Popover>
      <PopoverTrigger
        aria-label="Menu"
        className={cn(
          buttonVariants({
            variant: "ghost",
            className: "max-md:absolute max-md:top-8 max-md:right-8",
          }),
        )}
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
          <line x1="4" x2="20" y1="12" y2="12" />
          <line x1="4" x2="20" y1="6" y2="6" />
          <line x1="4" x2="20" y1="18" y2="18" />
        </svg>
        Menu
      </PopoverTrigger>
      <PopoverContent>
        <SongList musicManager={musicManager} />
        <TimeControls musicManager={musicManager} />
        <div className="flex flex-col mt-4">
          <a
            href="https://github.com/fuma-nama/fuma-lofi"
            target="_blank"
            className={cn(
              buttonVariants({
                variant: "secondary",
                className: "justify-center",
              }),
            )}
            rel="noreferrer noopener"
          >
            GitHub
          </a>
        </div>
      </PopoverContent>
    </Popover>
  );
}
