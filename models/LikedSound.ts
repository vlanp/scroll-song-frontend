import ISound from "./ISound";

class LikedSound implements ISound {
  id: string;
  title: string;
  artist: string;
  sourceUrl: string;
  genres: string[];
  pictureUrl: string;
  audioUrl: string;
  durationMs: number;
  constructor(
    id: string,
    title: string,
    artist: string,
    sourceUrl: string,
    genres: string[],
    pictureUrl: string,
    audioUrl: string,
    durationMs: number
  ) {
    this.id = id;
    this.title = title;
    this.artist = artist;
    this.sourceUrl = sourceUrl;
    this.genres = genres;
    this.pictureUrl = pictureUrl;
    this.audioUrl = audioUrl;
    this.durationMs = durationMs;
  }
}

export { LikedSound };
