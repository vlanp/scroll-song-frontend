import {
  ActivityIndicator,
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Audio } from "expo-av";
import ProgressTrackBar from "./ProgressTrackBar";
import useDownloader from "../hooks/useDownloader (old)";
import getExcerptUri from "../utils/getExcerptUri";
import usePlayer from "../hooks/usePlayer";
import { documentDirectory } from "expo-file-system";
import { useContext, useEffect } from "react";
import { NetworkContext } from "../contexts/NetworkContext";
import { SoundsContext } from "../contexts/SoundsContext";
import IDiscoverSound from "../interfaces/IDiscoverSound";
import { useDownloadStore } from "../zustands/useDownloadStore";
import { useIsFocused } from "@react-navigation/native";

function DiscoverComp({
  sound,
  selfPosition,
}: {
  sound: IDiscoverSound;
  selfPosition: number;
}) {
  const { playingState, playingProgressSec, play, stop, changePositionSec } =
    usePlayer({
      uri: documentDirectory + "excerpt/" + sound.id + ".mp3",
    });
  const isNetworkError = useContext(NetworkContext).isNetworkError;
  const { isError, isLoaded, isLoading, relativeProgress } = useDownloadStore(
    (state) => state.excerptsDownloadState[sound.id]
  );
  const currentPosition = useDownloadStore((state) => state.currentPosition);
  const isFocused = useIsFocused();

  const handleTouchAndDrag = (e: GestureResponderEvent) => {
    stop(true);
    changePositionSec(
      ((sound.end_time_excerpt_ms - sound.start_time_excerpt_ms) / 1000) *
        (e.nativeEvent.locationX / 200)
    );
  };

  useEffect(() => {
    const handlePositionChange = async () => {
      if (currentPosition === selfPosition && isFocused) {
        // console.log(selfPosition);
        await play();
      } else {
        await stop();
      }
    };
    handlePositionChange();
  }, [
    currentPosition,
    play,
    playingState.isPlaying,
    selfPosition,
    stop,
    isFocused,
  ]);

  return (
    <View style={styles.mainView}>
      {/* <Pressable onPress={play} style={styles.playButton}>
        <Text>Play</Text>
      </Pressable>
      <Pressable onPress={(e) => stop(true)} style={styles.playButton}>
        <Text>Stop</Text>
      </Pressable> */}
      <Text>{sound.title}</Text>
      {/* <Pressable onPress={deleteFile} style={styles.playButton}>
        <Text>DeleteFile</Text>
      </Pressable>
      <Pressable onPress={retryDownloading} style={styles.playButton}>
        <Text>DownloadFile</Text>
      </Pressable> */}
      <ProgressTrackBar
        loadingProgress={relativeProgress}
        durationSec={
          (sound.end_time_excerpt_ms - sound.start_time_excerpt_ms) / 1000
        }
        progressSec={playingProgressSec}
        onTouchStart={handleTouchAndDrag}
        onTouchMove={handleTouchAndDrag}
        onTouchEnd={play}
        loadingColor="rgba(0, 167, 255, 1)"
        readingColor="rgba(0, 76, 255, 1)"
        trackBarBorderWidth={2}
        trackBarHeigth={15}
        trackBarWidth={200}
      />
      {isLoading && <ActivityIndicator />}
      {isNetworkError ? (
        <Text>Il semble qu'il y ait un problème réseau</Text>
      ) : isError ? (
        <>
          <Text>
            Une erreur est survenue lors du téléchargement de la musique. Merci
            de réessayer ultérieurement.
          </Text>
          {/* <Pressable onPress={retryDownloading}>
            <Text>Réessayer</Text>
          </Pressable> */}
        </>
      ) : (
        playingState.error && (
          <>
            <Text>
              Une erreur est lors{" "}
              {playingState.error === "play" ? "du lancement" : "de l'arrêt"} de
              la musique. Merci de réessayer ultérieurement.
            </Text>
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

export default DiscoverComp;
