import { Pressable, StyleSheet, Text, View } from "react-native";
import { Audio } from "expo-av";
import ProgressTrackBar from "../components/ProgressTrackBar";
import useDownloader from "../hooks/useDownloader";
import getExcerptUri from "../utils/getExcerptUri";
import usePlayer from "../hooks/usePlayer";
import { documentDirectory } from "expo-file-system";
import { useContext } from "react";
import { NetworkContext } from "../contexts/NetworkContext";

Audio.setAudioModeAsync({ playsInSilentModeIOS: true });

const soundDatas = {
  url: "https://res.cloudinary.com/dwrfmnllk/video/upload/v1720173161/songs/audio/6682c6e9acd6a17089ebf7f7/lrul9ehxwwvte0knr0vk.mp3",
  excerptStartTimeSec: 10,
  excerptEndTimeSec: 40,
  totalDurationSec: 185,
  totalByteSize: 7785164,
};

const fileName = "Nananana.mp3";

function Index() {
  const excerptUri = getExcerptUri(
    soundDatas.url,
    soundDatas.excerptStartTimeSec,
    soundDatas.excerptEndTimeSec
  );
  const {
    downloadingState,
    relativeProgress: downloadingRelativeProgress,
    retry: retryDownloading,
  } = useDownloader({ fileName, uri: excerptUri, directory: "excerpt" });
  const {
    playingState,
    playingProgressSec,
    play,
    stop,
    retryPlaying,
    retryStopping,
  } = usePlayer({
    uri: documentDirectory + "excerpt/" + fileName,
  });
  const isNetworkError = useContext(NetworkContext).isNetworkError;

  return (
    <View style={styles.mainView}>
      <Pressable onPress={play} style={styles.playButton}>
        <Text>Play</Text>
      </Pressable>
      <Pressable onPress={stop} style={styles.playButton}>
        <Text>Stop</Text>
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
      {isNetworkError ? (
        <Text>Il semble qu'il y ait un problème réseau</Text>
      ) : downloadingState.isError ? (
        <>
          <Text>
            Une erreur est survenue lors du téléchargement de la musique. Merci
            de réessayer ultérieurement.
          </Text>
          <Pressable onPress={retryDownloading}>
            <Text>Réessayer</Text>
          </Pressable>
        </>
      ) : (
        playingState.error && (
          <>
            <Text>
              Une erreur est lors{" "}
              {playingState.error === "play" ? "du lancement" : "de l'arrêt"} de
              la musique. Merci de réessayer ultérieurement.
            </Text>
            <Pressable
              onPress={
                playingState.error === "play" ? retryPlaying : retryStopping
              }
            >
              <Text>Réessayer</Text>
            </Pressable>
          </>
        )
      )}
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
