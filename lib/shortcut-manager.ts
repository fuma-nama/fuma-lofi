import { MusicManager } from "@/lib/music-manager";

export interface ShortcutManagerOptions {
  musicManager: MusicManager;
}

export interface ShortcutManager {
  bind(): void;
  onPress(event: KeyboardEvent): void;
  destroy(): void;
}

export function createShortcutManager({
  musicManager,
}: ShortcutManagerOptions): ShortcutManager {
  return {
    onPress(event: KeyboardEvent) {
      switch (event.key) {
        case "ArrowUp":
          musicManager.previous();
          event.preventDefault();
          break;
        case "ArrowDown":
          musicManager.next();
          event.preventDefault();
          break;
        case "ArrowLeft":
          musicManager.setTime(musicManager.getTime() - 1);
          event.preventDefault();
          break;
        case "ArrowRight":
          musicManager.setTime(musicManager.getTime() + 1);
          event.preventDefault();
          break;
        case " ":
          if (musicManager.isPaused()) musicManager.play();
          else musicManager.pause();

          event.preventDefault();
          break;
      }
    },
    bind() {
      window.addEventListener("keydown", this.onPress);
    },
    destroy() {
      window.removeEventListener("keydown", this.onPress);
    },
  };
}
