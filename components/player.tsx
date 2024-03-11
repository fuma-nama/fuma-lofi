"use client";
import { useEffect, useRef, useState } from "react";
import Gradient from "@/components/gradient";
import { Song } from "@/music/data";
import { createMusicManager, MusicManager } from "@/lib/music-manager";
import { createShortcutManager } from "@/lib/shortcut-manager";
import { MusicVisualizer } from "@/components/music-visualizer";

export default function MusicPlayer() {
  const durationRef = useRef<HTMLDivElement>(null);
  const managerRef = useRef<MusicManager>();
  const [song, setSong] = useState<Song>();
  const [analyser, setAnalyser] = useState<AnalyserNode>();

  useEffect(() => {
    const duration = durationRef.current;
    if (!duration) return;

    const manager = createMusicManager({
      duration,
      onNext: (song) => {
        setSong(song);
      },
    });

    const shortcut = createShortcutManager({ musicManager: manager });
    managerRef.current = manager;

    manager.init();
    shortcut.bind();
    setAnalyser(manager.analyser);

    return () => {
      shortcut.destroy();
      manager.destroy();
    };
  }, []);

  const onClick = () => {
    if (!managerRef.current) return;
    const manager = managerRef.current;

    if (manager.isPaused()) manager.play();
    else manager.pause();
  };

  return (
    <main
      className="relative flex flex-col h-screen p-12 z-[2] text-purple-100 sm:p-24"
      onClick={onClick}
    >
      <h1 className="text-9xl font-light leading-[0.9] tracking-[-0.1em]">
        Lofi Fuma
      </h1>
      <div className="w-full max-w-[480px] mt-2">
        <div className="h-1 border border-purple-100/30">
          <div ref={durationRef} className="w-0 h-full bg-purple-100" />
        </div>
        {song ? (
          <div className="flex flex-row items-center gap-4 mt-2 rounded-xl p-3">
            {song.picture && (
              <img
                alt="picture"
                src={song.picture}
                className="size-14 rounded-md"
              />
            )}
            <div>
              <p className="font-medium">{song.name}</p>
              <p className="text-xs text-purple-200">{song.author}</p>
            </div>
          </div>
        ) : null}
      </div>
      <div className="mt-auto mx-auto w-full max-w-[250px] h-[100px] sm:mr-0">
        {analyser && (
          <MusicVisualizer
            className="size-full"
            analyser={analyser}
            fftSize={4096}
            barWidth={2}
            gap={6}
            smoothingTimeConstant={0.8}
            minDecibels={-100}
            maxDecibels={0}
          />
        )}
      </div>
      <Gradient />
    </main>
  );
}
