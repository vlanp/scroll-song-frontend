import ISound from "./ISound";

class DiscoverSound implements ISound {
  id: string;
  artist: string;
  sourceUrl: string;
  title: string;
  pictureUrl: string;
  genres: string[];
  audioUrl: string;
  startTimeExcerptMs: number;
  endTimeExcerptMs: number;
  constructor(
    id: string,
    artist: string,
    sourceUrl: string,
    title: string,
    pictureUrl: string,
    genres: string[],
    audioUrl: string,
    startTimeExcerptMs: number,
    endTimeExcerptMs: number
  ) {
    this.id = id;
    this.artist = artist;
    this.sourceUrl = sourceUrl;
    this.title = title;
    this.pictureUrl = pictureUrl;
    this.genres = genres;
    this.audioUrl = audioUrl;
    this.startTimeExcerptMs = startTimeExcerptMs;
    this.endTimeExcerptMs = endTimeExcerptMs;
  }
}

export default DiscoverSound;
