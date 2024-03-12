import { Song } from "@/music/data";
import songs from "@/music/data.json";

export interface QueueItem extends Song {
  /**
   * Absolute index in the queue
   */
  id: number;
}

export interface QueueManagerOptions {
  onUpdate?: (song: QueueItem | undefined) => void;
}

export interface QueueManager {
  currentIndex: number;
  songs: QueueItem[];

  getPendingSongs(): QueueItem[];
  getCurrentSong(): QueueItem | undefined;
  setIndex(id: number): void;

  previous(): void;
  next(): void;
}

export function createQueueManager(options: QueueManagerOptions): QueueManager {
  const items: QueueItem[] = songs.map((song, i) => ({ id: i, ...song }));

  return {
    currentIndex: -1,
    songs: items,
    getPendingSongs() {
      return this.songs.slice(this.currentIndex + 1);
    },
    getCurrentSong() {
      return this.songs[this.currentIndex];
    },
    setIndex(id) {
      let target: number;

      if (id >= this.songs.length) target = 0;
      else if (id < 0) target = songs.length - 1;
      else target = id;

      if (this.currentIndex === target) return;
      this.currentIndex = target;

      options.onUpdate?.(this.getCurrentSong());
    },
    next() {
      this.setIndex(this.currentIndex + 1);
    },
    previous() {
      this.setIndex(this.currentIndex - 1);
    },
  };
}
