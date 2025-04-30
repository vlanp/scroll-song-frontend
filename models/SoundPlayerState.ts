class SoundPlayerState {
  isLoaded: boolean;
  isBuffering: boolean;
  isPlayLoading: boolean;
  isStopLoading: boolean;
  isPlaying: boolean;
  error: "play" | "stop" | "fileNotReady" | null;
  progressSec: number;
  constructor(
    isLoaded: boolean,
    isBuffering: boolean,
    isPlayLoading: boolean,
    isStopLoading: boolean,
    isPlaying: boolean,
    error: "play" | "stop" | "fileNotReady" | null,
    progressSec: number
  ) {
    this.isLoaded = isLoaded;
    this.isBuffering = isBuffering;
    this.isPlayLoading = isPlayLoading;
    this.isStopLoading = isStopLoading;
    this.isPlaying = isPlaying;
    this.error = error;
    this.progressSec = progressSec;
  }
}

export default SoundPlayerState;
