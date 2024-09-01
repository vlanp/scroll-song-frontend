import { useEffect, useRef, useState } from "react";
import IPlay from "../interfaces/IPlay";
import { Audio, AVPlaybackStatus } from "expo-av";
import { Platform } from "react-native";

const usePlayer = ({ uri }: { uri: string }) => {
  const [playingProgressSec, setPlayingProgressSec] = useState<number>(0);

  const [playingState, setPlayingState] = useState<IPlay>({
    isLoaded: false,
    isBuffering: false,
    isPlayLoading: false,
    isStopLoading: false,
    isPlaying: false,
    isError: false,
  });

  const sound = useRef<Audio.Sound>();

  const _onPlaybackStatusUpdate = async (playbackStatus: AVPlaybackStatus) => {
    if (!playbackStatus.isLoaded) {
      playingState.isLoaded = false;
      if ("error" in playbackStatus) {
        playingState.isError = true;
        console.log(
          `Encountered a fatal error during playback: ${playbackStatus.error}`
        );
      }
    } else {
      playingState.isLoaded = true;

      if (playbackStatus.isPlaying) {
        playingState.isPlaying = true;

        const currentProgressSec = playbackStatus.positionMillis / 1000;
        setPlayingProgressSec(currentProgressSec);
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
    setPlayingState({ ...playingState, isPlayLoading: true });
    try {
      const { sound: _sound } = await Audio.Sound.createAsync(
        {
          uri,
        },
        {
          progressUpdateIntervalMillis: 1000,
          isLooping: true,
        }
      );
      sound.current = _sound;
      _sound.setOnPlaybackStatusUpdate(_onPlaybackStatusUpdate);
      await _sound.playAsync();
      console.log("Playing song");
    } catch (e) {
      setPlayingState({ ...playingState, isError: true });
      console.error(e);
    }
  };

  const stop = async () => {
    try {
      setPlayingState({ ...playingState, isPlayLoading: true });
      await sound.current.stopAsync();
      await sound.current.unloadAsync();
      setPlayingState({
        ...playingState,
        isPlayLoading: false,
        isPlaying: false,
        isLoaded: false,
      });
    } catch (e) {
      setPlayingState({ ...playingState, isError: true });
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
  }, [sound.current]);

  return { playingState, playingProgressSec, play, stop };
};

export default usePlayer;
