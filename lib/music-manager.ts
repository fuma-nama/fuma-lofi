import { Song } from "@/music/data";
import songs from "@/music/data.json";

export interface MusicManager {
  queue: number;
  analyser: AnalyserNode;
  init(): void;
  play(): void;
  previous(): void;
  next(): void;
  isPaused(): boolean;
  setTrack(index: number): void;
  pause(): void;
  destroy(): void;

  getTime(): number;
  setTime(time: number): void;
}

export interface MusicManagerOptions {
  onNext?: (song: Song) => void;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
}

export function createMusicManager({
  ...options
}: MusicManagerOptions): MusicManager {
  const context = new AudioContext();
  const analyser = context.createAnalyser();
  const audio = new Audio();
  let source: MediaElementAudioSourceNode | undefined;

  let onDestroy: () => void;

  return {
    queue: 0,
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
    init() {
      const onTimeUpdate = () => {
        options.onTimeUpdate?.(audio.currentTime, audio.duration);
      };
      const onEnded = () => {
        this.next();
        this.play();
      };

      source = context.createMediaElementSource(audio);
      source.connect(analyser);
      analyser.connect(context.destination);

      audio.addEventListener("timeupdate", onTimeUpdate);
      audio.addEventListener("ended", onEnded);
      this.setTrack(0);

      onDestroy = () => {
        audio.removeEventListener("timeupdate", onTimeUpdate);
        audio.removeEventListener("ended", onEnded);
      };
    },
    play() {
      if (context.state === "suspended") {
        void context.resume();
      }

      void audio.play();
    },
    pause() {
      void audio.pause();
    },
    setTrack(index: number) {
      this.queue = index;
      const wasPlaying = !this.isPaused();
      const song = songs[index];

      audio.src = song.url;
      options?.onNext?.(song);

      if (wasPlaying) {
        this.play();
      }
    },
    previous() {
      this.setTrack(this.queue <= 0 ? songs.length - 1 : this.queue - 1);
    },
    next() {
      this.setTrack(this.queue >= songs.length - 1 ? 0 : this.queue + 1);
    },
    destroy() {
      this.pause();
      onDestroy();
    },
  };
}
