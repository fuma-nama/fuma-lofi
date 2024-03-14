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
  onSongListUpdated?: (songs: QueueItem[]) => void;
}

export interface QueueManager {
  currentIndex: number;
  songs: QueueItem[];

  getPendingSongs(): QueueItem[];
  getCurrentSong(): QueueItem | undefined;
  setIndex(id: number): void;
  setSongs(songs: Song[]): void;

  previous(): void;
  next(): void;
}

export function createQueueManager(options: QueueManagerOptions): QueueManager {
  return {
    currentIndex: -1,
    songs: [],
    setSongs(songs: Song[]) {
      this.songs = songs.map((song, i) => ({ ...song, id: i }));

      // Ensure index is in the songs list, or is the song replaced
      this.setIndex(this.currentIndex === -1 ? 0 : this.currentIndex);
      options.onSongListUpdated?.(this.songs);
    },
    getPendingSongs() {
      return this.songs.slice(this.currentIndex + 1);
    },
    getCurrentSong() {
      return this.songs[this.currentIndex];
    },
    setIndex(id) {
      let target: number;

      if (this.songs.length === 0) target = -1;
      else if (id >= this.songs.length) target = 0;
      else if (id < 0) target = songs.length - 1;
      else target = id;

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
