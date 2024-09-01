import { Pressable, StyleSheet, Text, View } from "react-native";
import { Audio } from "expo-av";
import ProgressTrackBar from "../components/ProgressTrackBar";
import useDownloader from "../hooks/useDownloader";
import getExcerptUri from "../utils/getExcerptUri";
import usePlayer from "../hooks/usePlayer";
import { documentDirectory } from "expo-file-system";

Audio.setAudioModeAsync({ playsInSilentModeIOS: true });

const soundDatas = {
  url: "https://res.cloudinary.com/dwrfmnllk/video/upload/v1720173161/songs/audio/6682c6e9acd6a17089ebf7f7/lrul9ehxwwvte0knr0vk.mp3",
  excerptStartTimeSec: 10,
  excerptEndTimeSec: 40,
  totalDurationSec: 185,
  totalByteSize: 7785164,
};

const fileName = "Nananana.mp3";

// TODO Change the sound name in the storage to indicate that it is an excerpt
function Index() {
  const excerptUri = getExcerptUri(
    soundDatas.url,
    soundDatas.excerptStartTimeSec,
    soundDatas.excerptEndTimeSec
  );
  const { downloadingState, relativeProgress: downloadingRelativeProgress } =
    useDownloader({ fileName, uri: excerptUri });
  const { playingState, playingProgressSec, play, stop } = usePlayer({
    uri: documentDirectory + fileName,
  });

  const handlePress = () => {
    play();
  };

  return (
    <View style={styles.mainView}>
      <Pressable onPress={handlePress} style={styles.playButton}>
        <Text>Play</Text>
      </Pressable>
      <ProgressTrackBar
        loadingProgress={downloadingRelativeProgress}
        readingProgress={
          playingProgressSec /
          (soundDatas.excerptEndTimeSec - soundDatas.excerptStartTimeSec)
        }
        // onTouchStart={(e) => {
        //   playingProgress.progressSec =
        //     (playingProgress.endTimeSec - playingProgress.startTimeSec) *
        //       (e.nativeEvent.locationX / 200) +
        //     playingProgress.startTimeSec;
        //   console.log(playingProgress.progressSec);
        //   setPlayingProgress({
        //     ...playingProgress,
        //   });
        // }}
        loadingColor="rgba(0, 167, 255, 1)"
        readingColor="rgba(0, 76, 255, 1)"
        trackBarBorderWidth={2}
        trackBarHeigth={15}
        trackBarWidth={200}
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
});

export default Index;
