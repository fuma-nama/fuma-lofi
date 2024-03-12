"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SongList } from "@/components/control/song-list";
import { TimeControls } from "@/components/control/timeline";
import { MusicManager } from "@/lib/music-manager";

export function Menu({ musicManager }: { musicManager: MusicManager }) {
  return (
    <div>
      <Popover>
        <PopoverTrigger
          aria-label="Menu"
          className="inline-flex items-center gap-2 text-sm font-medium p-2 -m-2 rounded-md transition-colors hover:bg-purple-200/20 focus-visible:outline-none"
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
          <div className="flex flex-row mt-4">
            <a
              href="https://github.com/fuma-nama/fuma-lofi"
              target="_blank"
              className="hover:text-purple-50"
              rel="noreferrer noopener"
            >
              GitHub
            </a>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
