"use client";
import { useEffect, useRef, useState, MouseEvent, useMemo } from "react";
import { Gradient } from "@/components/gradient";
import { createMusicManager, MusicManager } from "@/lib/music-manager";
import { createShortcutManager } from "@/lib/shortcut-manager";
import { MusicVisualizer } from "@/components/music-visualizer";
import { formatSeconds } from "@/lib/format";
import { AnimatePresence, motion } from "framer-motion";
import { Menu } from "@/components/menu";
import { QueueItem } from "@/lib/queue-manager";

export default function MusicPlayer() {
  const durationRef = useRef<HTMLDivElement>(null);
  const timeLabelRef = useRef<HTMLParagraphElement>(null);

  const [currentIndex, setCurrentIndex] = useState(-1);
  const [paused, setPaused] = useState(true);
  const [musicManager, setMusicManager] = useState<MusicManager>();

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
        setCurrentIndex(song?.id ?? -1);
      },
    });

    const shortcut = createShortcutManager({ musicManager: manager });

    shortcut.bind();
    setMusicManager(manager);

    return () => {
      shortcut.destroy();
      manager.destroy();
    };
  }, []);

  const onClick = (e: MouseEvent) => {
    if (!musicManager || e.button !== 0) return;

    const target = e.target as Element;
    const isTrigger = target.matches(
      "[data-trigger-container] *, [data-trigger-container], [data-trigger]",
    );

    if (!isTrigger) return;

    if (musicManager.isPaused()) musicManager.play();
    else musicManager.pause();
    e.preventDefault();
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
      onMouseDown={onClick}
    >
      <AnimatedTitle text={paused ? "Click to Play" : "Lofi Fuma"} />
      <div className="w-full max-w-[480px] mt-6">
        <div className="h-1 border border-purple-100/30">
          <div ref={durationRef} className="w-0 h-full bg-purple-100" />
        </div>
        <AnimatePresence mode="wait" initial={false}>
          {musicManager && currentIndex !== -1 ? (
            <SongDisplay song={musicManager.queueManager.songs[currentIndex]} />
          ) : null}
        </AnimatePresence>
      </div>
      <div
        data-trigger={true}
        className="flex flex-col-reverse gap-4 justify-between mt-auto items-end sm:flex-row"
      >
        {musicManager && <Menu musicManager={musicManager} />}
        <div className="w-full max-w-[250px]" data-trigger-container={true}>
          {musicManager && (
            <MusicVisualizer
              className="w-full h-[150px]"
              analyser={musicManager.analyser}
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
        data-trigger-container={true}
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
        <Gradient currentId={currentIndex} />
      </motion.div>
    </motion.main>
  );
}

function SongDisplay({ song }: { song: QueueItem }) {
  return (
    <motion.div
      key={song.id}
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -10, opacity: 0 }}
      transition={{ ease: "easeInOut", duration: 0.3 }}
      className="flex flex-row items-center gap-4 mt-4 rounded-xl p-3"
    >
      {song.picture && (
        <img alt="picture" src={song.picture} className="size-14 rounded-md" />
      )}
      <div>
        <p className="font-medium">{song.name}</p>
        <p className="text-xs text-purple-200">{song.author}</p>
      </div>
    </motion.div>
  );
}

function AnimatedTitle({ text }: { text: string }) {
  const words = useMemo(() => text.split(" "), [text]);
  let index = 0;

  return (
    <h1 className="text-8xl font-light leading-[0.9] tracking-[-0.1em] sm:text-9xl sm:leading-[0.9] sm:tracking-[-0.1em]">
      {words.map((word, i) => (
        <motion.span key={i} className="inline-block mr-8 break-keep">
          {word.split("").map((c, j) => (
            <motion.span
              key={`${c}-${j}`}
              className="inline-block"
              initial={{ y: 20, opacity: 0 }}
              animate={{
                y: 0,
                opacity: 1,
                transition: {
                  ease: "easeInOut",
                  delay: index++ * 0.05,
                  duration: 0.2,
                },
              }}
            >
              {c}
            </motion.span>
          ))}
        </motion.span>
      ))}
    </h1>
  );
}
