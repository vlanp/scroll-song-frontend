interface IPlay {
  isLoaded: boolean;
  isBuffering: boolean;
  isPlayLoading: boolean;
  isStopLoading: boolean;
  isPlaying: boolean;
  error: "play" | "stop" | "fileNotReady" | null;
}

export default IPlay;
