import { useEffect, useRef, useState } from "react";
import IPlay from "../interfaces/IPlay";
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

  const sound = useRef<Audio.Sound | null>(null);

  const _onPlaybackStatusUpdate = async (playbackStatus: AVPlaybackStatus) => {
    if (!playbackStatus.isLoaded) {
      playingState.isLoaded = false;
      if ("error" in playbackStatus) {
        playingState.error = "play";
        console.log(
          `Encountered a fatal error during playback: ${playbackStatus.error}`
        );
      }
    } else {
      playingState.isLoaded = true;

      const currentProgressSec = playbackStatus.positionMillis / 1000;
      setPlayingProgressSec(currentProgressSec);

      if (playbackStatus.isPlaying) {
        playingState.isPlaying = true;
      } else {
        playingState.isPlaying = false;
      }

      if (playbackStatus.isBuffering) {
        playingState.isBuffering = true;
      } else {
        playingState.isBuffering = false;
      }

      if (playbackStatus.didJustFinish && !playbackStatus.isLooping) {
        // The player has just finished playing and will stop. Maybe you want to play something else?
      }
    }
    setPlayingState({ ...playingState });
  };

  const play = async () => {
    console.log("try playing");

    if (playingState.isPlaying || playingState.isPlayLoading) {
      return;
    }
    setPlayingState({ ...playingState, isPlayLoading: true });
    try {
      const didFileExist = (await FileSystem.getInfoAsync(uri)).exists;
      if (!didFileExist) {
        return setPlayingState({
          ...playingState,
          isPlayLoading: false,
          error: "fileNotReady",
        });
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
            }
          )
        ).sound;
        sound.current.setOnPlaybackStatusUpdate(_onPlaybackStatusUpdate);
      }
      await sound.current.playAsync();
      console.log("Playing song");
    } catch (e) {
      setPlayingState({ ...playingState, error: "play" });
      console.error(e);
    }
  };

  const stop = async (isPause: boolean = false) => {
    try {
      if (!playingState.isPlaying || playingState.isStopLoading) {
        return;
      }
      setPlayingState({ ...playingState, isStopLoading: true });
      if (isPause) {
        await sound.current.pauseAsync();
        setPlayingState({
          ...playingState,
          isPlayLoading: false,
          isPlaying: false,
        });
      } else {
        await sound.current.stopAsync();
        await sound.current.unloadAsync();
        setPlayingState({
          ...playingState,
          isPlayLoading: false,
          isPlaying: false,
          isLoaded: false,
        });
      }
    } catch (e) {
      setPlayingState({ ...playingState, error: "stop" });
      console.error(e);
    }
  };

  useEffect(() => {
    if (Platform.OS === "android" && sound.current) {
      const intervalId = setInterval(() => {
        const updatePlaybackStatus = async () => {
          await sound.current?.getStatusAsync();
        };
        updatePlaybackStatus();
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, []);

  const retryPlaying = () => {
    setPlayingState({
      isLoaded: false,
      isBuffering: false,
      isPlayLoading: false,
      isStopLoading: false,
      isPlaying: false,
      error: null,
    });
    play();
  };

  const retryStopping = () => {
    setPlayingState({
      isLoaded: false,
      isBuffering: false,
      isPlayLoading: false,
      isStopLoading: false,
      isPlaying: false,
      error: null,
    });
    stop();
  };

  const changePositionSec = async (positionSec: number) => {
    try {
      if (!sound.current || !playingState.isLoaded) {
        sound.current = (
          await Audio.Sound.createAsync(
            {
              uri,
            },
            {
              progressUpdateIntervalMillis: 1000,
              isLooping: true,
            }
          )
        ).sound;
        sound.current.setOnPlaybackStatusUpdate(_onPlaybackStatusUpdate);
      }
      sound.current.setPositionAsync(positionSec * 1000);
    } catch (e) {
      setPlayingState({ ...playingState, error: "play" });
      console.error(e);
    }
  };

  return {
    playingState,
    playingProgressSec,
    play,
    stop,
    retryPlaying,
    retryStopping,
    changePositionSec,
  };
};

export default usePlayer;
