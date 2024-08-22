import { Pressable, StyleSheet, Text, View } from "react-native";
import * as FileSystem from "expo-file-system";
import * as Progress from "react-native-progress";
import { useEffect, useRef, useState } from "react";
import { DownloadProgressData } from "expo-file-system";
import DoubleProgressBar from "../components/DoubleProgressBar";
import { Audio, AVPlaybackStatus } from "expo-av";
import IDownloadProgress from "../interfaces/IDownloadProgress";
import IDownload from "../interfaces/IDownload";
import IPlay from "../interfaces/IPlay";
import IPlayProgress from "../interfaces/IPlayProgress";

const soundDatas = {
  url: "https://res.cloudinary.com/dwrfmnllk/video/upload/v1720173161/songs/audio/6682c6e9acd6a17089ebf7f7/lrul9ehxwwvte0knr0vk.mp3",
  startTimeSec: 10,
  endTimeSec: 40,
  duration: 211,
};

// NE PAS OUBLIER DE UNLOAD
function Index() {
  const [downloadingProgress, setDownloadingProgress] =
    useState<IDownloadProgress>({
      totalBytesWritten: 0,
      relativeProgress: 0,
    });

  const [playingProgress, setPlayingProgress] = useState<IPlayProgress>({
    endTimeSec: soundDatas.endTimeSec,
    progressSec: 0,
    soundDuration: soundDatas.duration,
    startTimeSec: soundDatas.startTimeSec,
  });

  const [downloadingState, setDownloadingState] = useState<IDownload>({
    isLoaded: false,
    isLoading: false,
    isPreloaded: false,
    isPreloading: false,
    isError: false,
  });

  const [playingState, setPlayingState] = useState<IPlay>({
    isLoaded: false,
    isBuffering: false,
    isPlayLoading: false,
    isPlaying: false,
    isError: false,
  });

  const callback = (downloadProgress: DownloadProgressData) => {
    const progress =
      downloadProgress.totalBytesWritten /
      downloadProgress.totalBytesExpectedToWrite;
    setDownloadingProgress({
      relativeProgress: progress,
      totalBytesWritten: downloadProgress.totalBytesWritten,
    });
  };

  const downloadResumable = useRef(
    FileSystem.createDownloadResumable(
      soundDatas.url,
      FileSystem.documentDirectory + "Nananana.mp3",
      {},
      callback
    )
  );

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
        playingProgress.progressSec = currentProgressSec;
        if (
          currentProgressSec >=
          playingProgress.endTimeSec - playingProgress.startTimeSec
        ) {
          try {
            await sound.current.setPositionAsync(playingProgress.startTimeSec);
          } catch (e) {
            playingState.isError = true;
            console.error(e);
          }
        }
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
    setPlayingProgress({ ...playingProgress });
    setPlayingState({ ...playingState });
  };

  const preLoadSound = async () => {
    try {
      downloadingState.isPreloading = true;
      setDownloadingState({ ...downloadingState });
      await downloadResumable.current.downloadAsync();
    } catch (e) {
      downloadingState.isError = true;
      setDownloadingState({ ...downloadingState });
      console.error(e);
    }
  };

  const endSoundPreload = async () => {
    try {
      downloadingState.isPreloading = false;
      downloadingState.isPreloaded = true;
      setDownloadingState({ ...downloadingState });
      await downloadResumable.current.pauseAsync();
      console.log("Paused download operation");
    } catch (e) {
      downloadingState.isError = true;
      setDownloadingState({ ...downloadingState });
      console.error(e);
    }
  };

  const fullySoundLoad = async () => {
    try {
      if (
        downloadingState.isLoaded ||
        downloadingState.isLoading ||
        downloadingState.isPreloading
      ) {
        return;
      }
      downloadingState.isLoading = true;
      setDownloadingState({ ...downloadingState });
      console.log("Resumed download operation");
      const { uri } = await downloadResumable.current.resumeAsync();
      downloadingState.isLoading = false;
      downloadingState.isLoaded = true;
      setDownloadingState({ ...downloadingState });
      console.log("Finished downloading to ", uri);
    } catch (e) {
      downloadingState.isError = true;
      setDownloadingState({ ...downloadingState });
      console.error(e);
    }
  };

  const playSound = async () => {
    if (playingState.isPlayLoading || playingState.isPlaying) {
      return;
    }
    playingState.isPlayLoading = true;
    setPlayingState({ ...playingState });
    try {
      const { sound: _sound } = await Audio.Sound.createAsync({
        uri: downloadResumable.current.fileUri,
      });
      sound.current = _sound;
      _sound.setOnPlaybackStatusUpdate(_onPlaybackStatusUpdate);
      await _sound.setPositionAsync(playingProgress.startTimeSec);
      await _sound.playAsync();
      console.log("Playing song");
    } catch (e) {
      playingState.isError = true;
      setPlayingState({ ...playingState });
      console.error(e);
    }
  };

  useEffect(() => {
    Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
    preLoadSound();
  }, []);

  if (
    downloadingProgress.totalBytesWritten > 500000 &&
    downloadingState.isPreloading
  ) {
    endSoundPreload();
  }

  const handlePress = () => {
    fullySoundLoad();
    playSound();
  };

  return (
    <View style={styles.mainView}>
      <Pressable onPress={handlePress} style={styles.playButton}>
        <Text>Play</Text>
      </Pressable>
      <DoubleProgressBar
        loadingProgress={downloadingProgress.relativeProgress}
        readingProgress={
          playingProgress.progressSec /
          (playingProgress.endTimeSec - playingProgress.startTimeSec)
        }
        width={200}
        style={styles.doubleProgressBar}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mainView: {
    height: "100%",
    justifyContent: "center",
    gap: 20,
  },
  playButton: {
    borderWidth: 2,
    borderRadius: 50,
    width: 100,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  doubleProgressBar: {
    alignSelf: "center",
  },
});

export default Index;
