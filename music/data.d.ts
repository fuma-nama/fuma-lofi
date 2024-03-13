export interface Song {
  name: string;
  author: string;
  url: string;
  picture?: string;

  /**
   * Whether the song is customised
   */
  isCustom?: boolean;
}
