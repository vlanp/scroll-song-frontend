import { Audio, AVPlaybackStatus } from "expo-av";
import { Platform } from "react-native";
import * as FileSystem from "expo-file-system";
import useDiscoverStore from "@/zustands/useDiscoverStore";
import SoundPlayerState from "./SoundPlayerState";

class SoundPlayer {
  private uri: string;
  readonly soundId: string;
  private sound: Audio.Sound | null = null;
  private intervalId: NodeJS.Timeout | null = null;
  private numberOfRetry = 0;
  private setSoundPlayerState: (
    soundId: string,
    soundPlayerState: Partial<SoundPlayerState>
  ) => void = useDiscoverStore.getState().setSoundPlayerState;

  constructor(uri: string, soundId: string) {
    this.uri = uri;
    this.soundId = soundId;
    this.setSoundPlayerState(
      soundId,
      new SoundPlayerState(false, false, false, false, false, null, 0)
    );
  }

  private getPlayingState = () =>
    useDiscoverStore.getState().soundsPlayerState[this.soundId];

  private onPlaybackStatusUpdate = async (playbackStatus: AVPlaybackStatus) => {
    if (!playbackStatus.isLoaded) {
      this.setSoundPlayerState(this.soundId, { isLoaded: false });
      if ("error" in playbackStatus) {
        this.setSoundPlayerState(this.soundId, { error: "play" });
        console.log(
          `Encountered a fatal error during playback: ${playbackStatus.error}`
        );
      }
    } else {
      this.setSoundPlayerState(this.soundId, { isLoaded: true });

      const currentProgressSec = playbackStatus.positionMillis / 1000;
      this.setSoundPlayerState(this.soundId, {
        progressSec: currentProgressSec,
      });

      if (playbackStatus.isPlaying) {
        this.setSoundPlayerState(this.soundId, {
          isPlaying: true,
          isPlayLoading: false,
        });
      } else {
        this.setSoundPlayerState(this.soundId, {
          isPlaying: false,
          isStopLoading: false,
        });
      }

      if (playbackStatus.isBuffering) {
        this.setSoundPlayerState(this.soundId, { isBuffering: true });
      } else {
        this.setSoundPlayerState(this.soundId, { isBuffering: false });
      }

      if (playbackStatus.didJustFinish && !playbackStatus.isLooping) {
        // The player has just finished playing and will stop. Maybe you want to play something else?
      }
    }
  };

  play = async (): Promise<boolean> => {
    try {
      // console.log("try playing");
      if (
        this.getPlayingState().isPlaying ||
        this.getPlayingState().isPlayLoading
      ) {
        return false;
      }
      this.setSoundPlayerState(this.soundId, { isPlayLoading: true });
      const didFileExist = (await FileSystem.getInfoAsync(this.uri)).exists;
      if (!didFileExist) {
        this.setSoundPlayerState(this.soundId, {
          isPlayLoading: false,
          error: "fileNotReady",
        });
        return false;
      }
      if (!this.sound || !this.getPlayingState().isLoaded) {
        this.sound = (
          await Audio.Sound.createAsync(
            {
              uri: this.uri,
            },
            {
              progressUpdateIntervalMillis: 1000,
              isLooping: true,
            },
            this.onPlaybackStatusUpdate
          )
        ).sound;

        if (Platform.OS === "android") {
          this.intervalId = setInterval(() => {
            const updatePlaybackStatus = async () => {
              await this.sound?.getStatusAsync();
            };
            updatePlaybackStatus();
          }, 1000);
        }
      }
      await this.sound.playAsync();
      this.numberOfRetry = 0;
      console.log("Playing song");
      return true;
    } catch (e) {
      if (this.numberOfRetry < 3) {
        await this.retryPlay();
        return false;
      }
      this.setSoundPlayerState(this.soundId, { error: "play" });
      console.error(e);
      return false;
    }
  };

  stop = async (isPause = false) => {
    try {
      if (
        !this.getPlayingState().isPlaying ||
        this.getPlayingState().isStopLoading
      ) {
        return;
      }
      this.setSoundPlayerState(this.soundId, { isStopLoading: true });
      if (isPause) {
        await this.sound?.pauseAsync();
        this.setSoundPlayerState(this.soundId, { isPlaying: false });
      } else {
        await this.sound?.stopAsync();
        await this.sound?.unloadAsync();
        if (this.intervalId) {
          clearInterval(this.intervalId);
        }
        this.setSoundPlayerState(this.soundId, {
          isPlaying: false,
          isLoaded: false,
        });
      }
    } catch (e) {
      this.setSoundPlayerState(this.soundId, { error: "stop" });
      console.error(e);
    }
  };

  changePositionSec = async (positionSec: number) => {
    try {
      if (
        !this.getPlayingState().isPlaying &&
        !this.getPlayingState().isPlayLoading
      ) {
        await this.play();
      }
      if (this.sound) {
        this.sound.setPositionAsync(positionSec * 1000);
      }
    } catch (e) {
      // setPlayingState((ps) => ({ ...ps, error: "play" })); // Not needed ?
      console.error(e);
    }
  };

  // It seems that sometimes when loading and unloading really quickly, onPlaybackStatusUpdate has isLoaded set to true whereas the sound is not loaded and is not loading
  private retryPlay = async () => {
    try {
      await this.sound?.unloadAsync();
      if (this.intervalId) {
        clearInterval(this.intervalId);
      }
    } catch {
      /* empty */
    }

    this.setSoundPlayerState(
      this.soundId,
      new SoundPlayerState(false, false, false, false, false, null, 0)
    );
    this.numberOfRetry += 1;
    console.log("retry " + this.numberOfRetry);
  };
}

export default SoundPlayer;
