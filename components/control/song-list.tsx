import { MusicManager } from "@/lib/music-manager";
import { cn } from "@/lib/cn";
import { QueueItem } from "@/lib/queue-manager";

export interface SongListProps {
  musicManager: MusicManager;
}

export function SongList({ musicManager }: SongListProps) {
  const onPlay = (item: QueueItem) => {
    musicManager.queueManager.setIndex(item.id);
  };

  return (
    <div className="flex flex-col -mx-2 -mt-2">
      {musicManager.queueManager.songs.map((song) => (
        <Item
          key={song.id}
          song={song}
          playing={song.id === musicManager.queueManager.currentIndex}
          onPlay={onPlay}
        />
      ))}
    </div>
  );
}

function Item({
  song,
  playing,
  onPlay,
}: {
  song: QueueItem;
  playing: boolean;
  onPlay: (item: QueueItem) => void;
}) {
  return (
    <button
      className={cn(
        "flex flex-row text-left items-center gap-3 rounded-xl p-2 transition-colors",
        playing ? "bg-purple-400/20" : "hover:bg-purple-200/5",
      )}
      onClick={() => onPlay(song)}
    >
      {song.picture && (
        <img alt="picture" src={song.picture} className="size-12 rounded-md" />
      )}
      <div>
        <p className="text-sm font-medium">{song.name}</p>
        <p className="text-xs text-purple-200">{song.author}</p>
      </div>
    </button>
  );
}
