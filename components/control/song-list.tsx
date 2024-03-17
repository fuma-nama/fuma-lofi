import { MusicManager } from "@/lib/music-manager";
import { cn } from "@/lib/cn";
import { QueueItem } from "@/lib/queue-manager";
import { buttonVariants } from "@/components/ui/button";

export interface SongListProps {
  musicManager: MusicManager;
}

export function SongList({ musicManager }: SongListProps) {
  const onPlay = (item: QueueItem) => {
    musicManager.queueManager.setIndex(item.id);
  };

  const onRemove = (item: QueueItem) => {
    musicManager.storageManager.saveCustomSongs(
      musicManager.storageManager
        .getCustomSongs()
        .filter((song) => song.url !== item.url),
    );

    musicManager.queueManager.setSongs(musicManager.storageManager.loadSongs());
  };

  return (
    <div className="flex flex-col -mx-2 -mt-2">
      {musicManager.queueManager.songs.map((song) => (
        <Item
          key={song.id}
          song={song}
          playing={song.id === musicManager.queueManager.currentIndex}
          onPlay={onPlay}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
}

function Item({
  song,
  playing,
  onPlay,
  onRemove,
}: {
  song: QueueItem;
  playing: boolean;
  onPlay: (item: QueueItem) => void;
  onRemove: (item: QueueItem) => void;
}) {
  return (
    <button
      className={cn(
        "relative flex flex-row text-left items-center gap-3 rounded-xl p-2 transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400",
        playing ? "bg-purple-400/20" : "hover:bg-purple-200/5",
      )}
      onClick={() => onPlay(song)}
    >
      {song.picture ? (
        <img alt="picture" src={song.picture} className="size-12 rounded-md" />
      ) : (
        <div className="bg-purple-400/20 size-12 rounded-md" />
      )}
      <div>
        <p className="text-sm font-medium">{song.name}</p>
        <p className="text-xs text-purple-200">{song.author}</p>
      </div>
      {song.isCustom && (
        <div
          aria-label="Delete Custom Song"
          className={cn(
            buttonVariants({
              variant: "destructive",
              className:
                "absolute top-0 right-0 opacity-0 transition-opacity group-hover:opacity-100",
            }),
          )}
          onClick={(e) => {
            onRemove(song);
            e.stopPropagation();
          }}
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
            className="size-4"
          >
            <path d="M3 6h18" />
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            <line x1="10" x2="10" y1="11" y2="17" />
            <line x1="14" x2="14" y1="11" y2="17" />
          </svg>
        </div>
      )}
    </button>
  );
}
