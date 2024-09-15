interface IPlay {
  isLoaded: boolean;
  isBuffering: boolean;
  isPlayLoading: boolean;
  isStopLoading: boolean;
  isPlaying: boolean;
  error: "play" | "stop" | null;
}

export default IPlay;
