import { Pressable, StyleSheet, Text, View } from "react-native";
import * as FileSystem from "expo-file-system";
import * as Progress from "react-native-progress";
import { useEffect, useRef, useState } from "react";
import { DownloadProgressData } from "expo-file-system";
import DoubleProgressBar from "../components/DoubleProgressBar";
import { Audio, AVPlaybackStatus } from "expo-av";

interface Progress {
  totalBytesWritten: number;
  progress: number;
}

const songUrl =
  "https://res.cloudinary.com/dwrfmnllk/video/upload/v1720173161/songs/audio/6682c6e9acd6a17089ebf7f7/lrul9ehxwwvte0knr0vk.mp3";

function Index() {
  const [progress, setProgress] = useState<Progress>({
    totalBytesWritten: 0,
    progress: 0,
  });

  const callback = (downloadProgress: DownloadProgressData) => {
    const progress =
      downloadProgress.totalBytesWritten /
      downloadProgress.totalBytesExpectedToWrite;
    setProgress({
      progress: progress,
      totalBytesWritten: downloadProgress.totalBytesWritten,
    });
  };

  const downloadResumable = useRef(
    FileSystem.createDownloadResumable(
      songUrl,
      FileSystem.documentDirectory + "Nananana.mp3",
      {},
      callback
    )
  );

  const isPreloading = useRef<boolean>(false);
  const isLoading = useRef<boolean>(false);
  const isLoaded = useRef<boolean>(false);
  const isPlaying = useRef<boolean>(false);

  const preLoadSong = async () => {
    try {
      isPreloading.current = true;
      await downloadResumable.current.downloadAsync();
    } catch (e) {
      console.error(e);
    }
  };

  const endSongPreload = async () => {
    try {
      isPreloading.current = false;
      await downloadResumable.current.pauseAsync();
      console.log("Paused download operation");
    } catch (e) {
      console.error(e);
    }
  };

  const resumeSongPreload = async () => {
    try {
      if (isLoaded.current || isLoading.current || isPreloading.current) {
        return;
      }
      isLoading.current = true;
      console.log("Resumed download operation");
      const { uri } = await downloadResumable.current.resumeAsync();
      isLoading.current = false;
      isLoaded.current = true;
      console.log("Finished downloading to ", uri);
    } catch (e) {
      console.error(e);
    }
  };

  const playSong = async () => {
    if (isPlaying.current) {
      return;
    }
    isPlaying.current = true;
    try {
      const { sound } = await Audio.Sound.createAsync({
        uri: downloadResumable.current.fileUri,
      });
      await sound.playAsync();
      console.log("Playing song");
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
    preLoadSong();
  }, []);

  if (progress.totalBytesWritten > 500000 && isPreloading.current) {
    endSongPreload();
  }

  const handlePress = () => {
    resumeSongPreload();
    playSong();
  };

  return (
    <View style={styles.mainView}>
      <Pressable onPress={handlePress} style={styles.playButton}>
        <Text>Play</Text>
      </Pressable>
      <DoubleProgressBar
        loadingProgress={progress.progress}
        readingProgress={0.05}
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
