class DiscoverSound {
  id: string;
  title: string;
  url: string;
  start_time_excerpt_ms: number;
  end_time_excerpt_ms: number;
  constructor(
    id: string,
    title: string,
    url: string,
    start_time_excerpt_ms: number,
    end_time_excerpt_ms: number
  ) {
    this.id = id;
    this.title = title;
    this.url = url;
    this.start_time_excerpt_ms = start_time_excerpt_ms;
    this.end_time_excerpt_ms = end_time_excerpt_ms;
  }
}

export default DiscoverSound;
