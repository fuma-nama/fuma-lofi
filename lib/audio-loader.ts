interface AudioLoader {
  load(url: string): Promise<ArrayBuffer>;
}
export function createAudioLoader(): AudioLoader {
  const cache = new Map<string, ArrayBuffer>();

  return {
    async load(url) {
      const cached = cache.get(url);
      if (cached) return Promise.resolve(cached);

      const res = await fetch(url);
      const buffer = await res.arrayBuffer();
      cache.set(url, buffer);
      return buffer;
    },
  };
}
