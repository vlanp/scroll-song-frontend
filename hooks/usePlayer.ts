import { useEffect, useRef, useState } from "react";
import IPlay from "../models/IPlay";
import { Audio, AVPlaybackStatus } from "expo-av";
import { Platform } from "react-native";
import * as FileSystem from "expo-file-system";

const usePlayer = ({ uri }: { uri: string }) => {
  const [playingProgressSec, setPlayingProgressSec] = useState<number>(0);

  const [playingState, setPlayingState] = useState<IPlay>({
    isLoaded: false,
    isBuffering: false,
    isPlayLoading: false,
    isStopLoading: false,
    isPlaying: false,
    error: null,
  });

  // console.log(playingState);

  const sound = useRef<Audio.Sound | null>(null);

  const intervalId = useRef<NodeJS.Timeout | null>(null);

  const numberOfRetry = useRef<number>(0);

  const _onPlaybackStatusUpdate = async (playbackStatus: AVPlaybackStatus) => {
    if (!playbackStatus.isLoaded) {
      setPlayingState((ps) => ({ ...ps, isLoaded: false }));
      if ("error" in playbackStatus) {
        setPlayingState((ps) => ({ ...ps, error: "play" }));
        console.log(
          `Encountered a fatal error during playback: ${playbackStatus.error}`
        );
      }
    } else {
      setPlayingState((ps) => ({ ...ps, isLoaded: true }));

      const currentProgressSec = playbackStatus.positionMillis / 1000;
      setPlayingProgressSec(currentProgressSec);

      if (playbackStatus.isPlaying) {
        setPlayingState((ps) => ({
          ...ps,
          isPlaying: true,
          isPlayLoading: false,
        }));
      } else {
        setPlayingState((ps) => ({
          ...ps,
          isPlaying: false,
          isStopLoading: false,
        }));
      }

      if (playbackStatus.isBuffering) {
        setPlayingState((ps) => ({ ...ps, isBuffering: true }));
      } else {
        setPlayingState((ps) => ({ ...ps, isBuffering: false }));
      }

      if (playbackStatus.didJustFinish && !playbackStatus.isLooping) {
        // The player has just finished playing and will stop. Maybe you want to play something else?
      }
    }
  };

  const play = async () => {
    // console.log("try playing");

    if (playingState.isPlaying || playingState.isPlayLoading) {
      return;
    }
    setPlayingState((ps) => ({ ...ps, isPlayLoading: true }));
    try {
      const didFileExist = (await FileSystem.getInfoAsync(uri)).exists;
      if (!didFileExist) {
        return setPlayingState((ps) => ({
          ...ps,
          isPlayLoading: false,
          error: "fileNotReady",
        }));
      }
      if (!sound.current || !playingState.isLoaded) {
        sound.current = (
          await Audio.Sound.createAsync(
            {
              uri,
            },
            {
              progressUpdateIntervalMillis: 1000,
              isLooping: true,
            },
            _onPlaybackStatusUpdate
          )
        ).sound;

        if (Platform.OS === "android") {
          intervalId.current = setInterval(() => {
            const updatePlaybackStatus = async () => {
              await sound.current?.getStatusAsync();
            };
            updatePlaybackStatus();
          }, 1000);
        }
      }
      await sound.current.playAsync();
      numberOfRetry.current = 0;
      console.log("Playing song");
    } catch (e) {
      if (numberOfRetry.current < 3) {
        return await retryPlay();
      }
      setPlayingState((ps) => ({ ...ps, error: "play" }));
      console.error(e);
    }
  };

  const stop = async (isPause: boolean = false) => {
    try {
      if (!playingState.isPlaying || playingState.isStopLoading) {
        return;
      }
      setPlayingState((ps) => ({ ...ps, isStopLoading: true }));
      if (isPause) {
        await sound.current.pauseAsync();
        setPlayingState((ps) => ({ ...ps, isPlaying: false }));
      } else {
        await sound.current.stopAsync();
        await sound.current.unloadAsync();
        clearInterval(intervalId.current);
        setPlayingState((ps) => ({ ...ps, isPlaying: false, isLoaded: false }));
      }
    } catch (e) {
      setPlayingState((ps) => ({ ...ps, error: "stop" }));
      console.error(e);
    }
  };

  const changePositionSec = async (positionSec: number) => {
    try {
      if (!playingState.isPlaying && !playingState.isPlayLoading) {
        await play();
      }
      sound.current.setPositionAsync(positionSec * 1000);
    } catch (e) {
      // setPlayingState((ps) => ({ ...ps, error: "play" })); // Not needed ?
      console.error(e);
    }
  };

  // It seems that sometimes when loading and unloading really quickly, onPlaybackStatusUpdate has isLoaded set to true whereas the sound is not loaded and is not loading
  const retryPlay = async () => {
    try {
      await sound.current.unloadAsync();
      clearInterval(intervalId.current);
    } catch {}

    setPlayingState({
      isLoaded: false,
      isBuffering: false,
      isPlayLoading: false,
      isStopLoading: false,
      isPlaying: false,
      error: null,
    });
    numberOfRetry.current = numberOfRetry.current + 1;
    console.log(playingState);
    console.log("retry " + numberOfRetry.current);
  };

  return {
    playingState,
    playingProgressSec,
    play,
    stop,
    changePositionSec,
  };
};

export default usePlayer;
