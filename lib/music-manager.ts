import { Song } from "@/music/data";
import {
  createQueueManager,
  QueueItem,
  QueueManager,
  QueueManagerOptions,
} from "@/lib/queue-manager";
import { createStorageManager, StorageManager } from "@/lib/storage-manager";

export interface MusicManager {
  storageManager: StorageManager;
  queueManager: QueueManager;
  analyser: AnalyserNode;

  play(): void;
  pause(): void;
  setPlaying(song: Song): void;
  destroy(): void;

  isPaused(): boolean;
  getTime(): number;
  getDuration(): number;
  setTime(time: number): void;

  getVolume(): number;
  setVolume(v: number): void;
}

export interface MusicManagerOptions
  extends Omit<QueueManagerOptions, "onUpdate"> {
  onNext?: (song: QueueItem | undefined) => void;
  onStateChange?: () => void;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
}

export function createMusicManager({
  onSongListUpdated,
  ...options
}: MusicManagerOptions): MusicManager {
  const context = new AudioContext();
  const analyser = context.createAnalyser();
  const audio = new Audio();

  const onStateChange = () => {
    options.onStateChange?.();
  };
  const onTimeUpdate = () => {
    options.onTimeUpdate?.(audio.currentTime, audio.duration);
  };
  const onEnded = () => {
    manager.queueManager.next();
    manager.play();
  };

  const storageManager = createStorageManager();
  const queueManager = createQueueManager({
    onUpdate: (song) => {
      if (song) manager.setPlaying(song);
      options?.onNext?.(song);
      options.onTimeUpdate?.(0, 0);
    },
    onSongListUpdated,
  });

  const init = () => {
    const source = context.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(context.destination);

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("play", onStateChange);
    audio.addEventListener("pause", onStateChange);
    audio.addEventListener("ended", onEnded);
    queueManager.setSongs(storageManager.loadSongs());
  };

  const manager: MusicManager = {
    queueManager,
    storageManager,
    analyser,
    getTime(): number {
      return audio.currentTime;
    },
    getDuration(): number {
      return audio.duration;
    },
    setTime(time: number) {
      audio.currentTime = time;
    },
    isPaused(): boolean {
      return context.state === "suspended" || (audio != null && audio.paused);
    },
    getVolume(): number {
      return audio.volume;
    },
    setVolume(v: number) {
      audio.volume = v;
    },
    async play() {
      // When AudioContext is initialized before the first interaction, it is suspended
      // we have to resume it
      if (context.state === "suspended") {
        await context.resume();
      }

      await audio.play();
    },
    pause() {
      void audio.pause();
    },
    setPlaying(song) {
      const wasPlaying = !this.isPaused();
      audio.src = song.url;

      if (wasPlaying) {
        this.play();
      }
    },
    destroy() {
      this.pause();
      audio.removeEventListener("play", onStateChange);
      audio.removeEventListener("pause", onStateChange);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("ended", onEnded);
    },
  };

  init();

  return manager;
}
