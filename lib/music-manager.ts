import { Song } from "@/music/data";
import {
  createQueueManager,
  QueueItem,
  QueueManager,
} from "@/lib/queue-manager";
import { createStorageManager, StorageManager } from "@/lib/storage-manager";

export interface MusicManager {
  storageManager: StorageManager;
  queueManager: QueueManager;
  analyser: AnalyserNode;

  play(): void;
  isPaused(): boolean;
  setPlaying(song: Song): void;
  pause(): void;
  destroy(): void;

  getTime(): number;
  setTime(time: number): void;
}

export interface MusicManagerOptions {
  onNext?: (song: QueueItem | undefined) => void;
  onStateChange?: () => void;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
}

export function createMusicManager({
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
    },
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
    setTime(time: number) {
      audio.currentTime = time;
    },
    isPaused(): boolean {
      return context.state === "suspended" || (audio != null && audio.paused);
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
