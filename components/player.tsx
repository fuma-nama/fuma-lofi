"use client";
import { useEffect, useRef, useState } from "react";
import { Gradient } from "@/components/gradient";
import { Song } from "@/music/data";
import { createMusicManager, MusicManager } from "@/lib/music-manager";
import { createShortcutManager } from "@/lib/shortcut-manager";
import { MusicVisualizer } from "@/components/music-visualizer";
import { formatSeconds } from "@/lib/format";
import { AnimatePresence, motion } from "framer-motion";
import { Menu } from "@/components/menu";

export default function MusicPlayer() {
  const durationRef = useRef<HTMLDivElement>(null);
  const timeLabelRef = useRef<HTMLParagraphElement>(null);

  const managerRef = useRef<MusicManager>();
  const [song, setSong] = useState<Song>();
  const [paused, setPaused] = useState(true);
  const [analyser, setAnalyser] = useState<AnalyserNode>();

  useEffect(() => {
    const duration = durationRef.current;
    if (!duration) return;

    const updateDuration = (percent: number) => {
      duration.style.setProperty("width", `${percent}%`);
    };

    const manager = createMusicManager({
      onStateChange: () => {
        setPaused(manager.isPaused());
      },
      onTimeUpdate: (currentTime, duration) => {
        if (timeLabelRef.current) {
          timeLabelRef.current.innerText = formatSeconds(currentTime);
        }
        updateDuration((currentTime / duration) * 100);
      },
      onNext: (song) => {
        updateDuration(0);
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
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        ease: "easeInOut",
        duration: 0.5,
      }}
      className="relative flex flex-col h-screen p-12 z-[2] text-purple-100 sm:p-24"
      onClick={onClick}
    >
      <AnimatedTitle text={paused ? "Click to Play" : "Lofi Fuma"} />
      <div className="w-full max-w-[480px] mt-6">
        <div className="h-1 border border-purple-100/30">
          <div ref={durationRef} className="w-0 h-full bg-purple-100" />
        </div>
        <AnimatePresence mode="wait">
          {song ? (
            <motion.div
              key={song.url}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ ease: "easeInOut", duration: 0.3 }}
              className="flex flex-row items-center gap-4 mt-4 rounded-xl p-3"
            >
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
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
      <div className="flex flex-col-reverse gap-4 justify-between mt-auto items-end sm:flex-row">
        <Menu />
        <div className="w-full max-w-[250px]">
          {analyser && (
            <MusicVisualizer
              className="w-full h-[150px]"
              analyser={analyser}
              fftSize={4096}
              barWidth={2}
              gap={6}
              smoothingTimeConstant={0.8}
              minDecibels={-100}
              maxDecibels={0}
            />
          )}
          <p ref={timeLabelRef} className="text-xs text-blue-200 mt-2">
            --:--
          </p>
        </div>
      </div>
      <motion.div
        className="absolute inset-0 z-[-1]"
        animate={{
          opacity: paused ? 0.3 : 1,
        }}
        initial={{
          opacity: 0,
        }}
        transition={{
          ease: "easeInOut",
          duration: 1,
        }}
      >
        <Gradient />
      </motion.div>
    </motion.main>
  );
}

function AnimatedTitle({ text }: { text: string }) {
  let index = 0;
  return (
    <h1 className="text-8xl font-light leading-[0.9] tracking-[-0.1em] sm:text-9xl sm:leading-[0.9] sm:tracking-[-0.1em]">
      <AnimatePresence mode="wait" initial={false}>
        {text.split(" ").map((word) => (
          <span className="inline-block mr-8 break-keep">
            {word.split("").map((c) => (
              <motion.span
                key={`${c}-${index++}`}
                className="inline-block"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0, transition: { duration: 0.1 } }}
                transition={{
                  ease: "easeInOut",
                  delay: index * 0.05,
                  duration: 0.2,
                }}
              >
                {c}
              </motion.span>
            ))}
          </span>
        ))}
      </AnimatePresence>
    </h1>
  );
}
