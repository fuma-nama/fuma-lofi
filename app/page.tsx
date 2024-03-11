"use client";
import dynamic from "next/dynamic";

const MusicPlayer = dynamic(() => import("@/components/player"), {
  ssr: false,
});

export default function Home() {
  return <MusicPlayer />;
}
