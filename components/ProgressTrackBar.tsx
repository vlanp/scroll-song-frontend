import usePlayer from "@/hooks/usePlayer";
import DiscoverSound from "@/models/DiscoverSound";
import { IDownloadSoundState } from "@/models/IDownloadSoundState";
import useDiscoverStore from "@/zustands/useDiscoverStore";
import useNetworkStore from "@/zustands/useNetworkStore";
import { useIsFocused } from "@react-navigation/native";
import { useEffect } from "react";
import {
  GestureResponderEvent,
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
} from "react-native";

const ProgressTrackBar = ({
  trackBarWidth,
  trackBarHeigth,
  trackBarBorderWidth,
  sound,
  uri,
  selfPosition,
  loadingColor,
  readingColor,
}: {
  trackBarWidth: number;
  trackBarHeigth: number;
  trackBarBorderWidth: number;
  sound: DiscoverSound;
  uri: string;
  selfPosition: number;
  loadingColor: string;
  readingColor: string;
}) => {
  const networkState = useNetworkStore((state) => state.networkState);
  const downloadExcerptState = useDiscoverStore<IDownloadSoundState | null>(
    (state) => state.downloadExcerptsState[sound.id]
  );
  const { playingState, playingProgressSec, play, stop, changePositionSec } =
    usePlayer({
      uri: uri,
    });
  const likedTitleToDisplay = useDiscoverStore(
    (state) => state.likedTitleToDisplay
  );
  const dislikedTitleToDisplay = useDiscoverStore(
    (state) => state.dislikedTitleToDisplay
  );
  const position = useDiscoverStore((state) => state.position);
  const isFocused = useIsFocused();

  useEffect(() => {
    const handlePositionChange = async () => {
      if (
        position.currentPosition === selfPosition &&
        isFocused &&
        !position.isScrolling &&
        likedTitleToDisplay?.id !== sound.id &&
        dislikedTitleToDisplay?.id !== sound.id
      ) {
        await play();
      } else {
        await stop();
      }
    };
    handlePositionChange();
  }, [
    selfPosition,
    isFocused,
    position.currentPosition,
    position.isScrolling,
    likedTitleToDisplay?.id,
    sound.id,
    dislikedTitleToDisplay?.id,
    play,
    stop,
  ]);

  const loadingProgress =
    downloadExcerptState?.status === "downloadSoundLoading"
      ? downloadExcerptState.relativeProgress
      : downloadExcerptState?.status === "downloadSoundSuccess"
        ? 1
        : 0;

  const durationSec =
    (sound.endTimeExcerptMs - sound.startTimeExcerptMs) / 1000;

  const readingProgress = playingProgressSec / durationSec;

  const styles = getStyles(
    trackBarWidth,
    trackBarHeigth,
    trackBarBorderWidth,
    loadingProgress,
    readingProgress,
    loadingColor,
    readingColor
  );

  const handleTouchAndDrag = (e: GestureResponderEvent) => {
    stop(true);
    changePositionSec(
      ((sound.endTimeExcerptMs - sound.startTimeExcerptMs) / 1000) *
        (e.nativeEvent.locationX / 200)
    );
  };

  if (!playingState.isLoaded) {
    return <ActivityIndicator size={25} />;
  }

  return (
    <>
      <View style={styles.mainView}>
        <Text style={styles.progressText}>
          {(Math.round(playingProgressSec) < 10 ? "00:0" : "00:") +
            Math.round(playingProgressSec)}
        </Text>
        <View style={styles.backgroundBarView}>
          <View
            style={[styles.progressView, styles.loadingProgressView]}
            onTouchStart={handleTouchAndDrag}
            onTouchMove={handleTouchAndDrag}
            onTouchEnd={play}
          ></View>
          <View
            style={[styles.progressView, styles.readingProgressView]}
            onTouchStart={handleTouchAndDrag}
            onTouchMove={handleTouchAndDrag}
            onTouchEnd={play}
          ></View>
        </View>
        <Text style={styles.progressText}>
          {(durationSec < 10 ? "00:0" : "00:") + durationSec}
        </Text>
      </View>
      {networkState.status === "networkError" ? (
        <Text>Il semble qu&apos;il y ait un problème réseau</Text>
      ) : downloadExcerptState?.status === "downloadSoundError" ? (
        <>
          <Text>
            Une erreur est survenue lors du téléchargement de la musique. Merci
            de réessayer ultérieurement.
          </Text>
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
    </>
  );
};

export default ProgressTrackBar;

const getStyles = (
  width: number,
  heigth: number,
  borderWidth: number,
  loadingProgress: number,
  readingProgress: number,
  loadingColor: string,
  readingColor: string
) => {
  const loadingWidth = loadingProgress * (width - 2 * borderWidth);
  const readingWidth = readingProgress * (width - 2 * borderWidth);

  const styles = StyleSheet.create({
    mainView: {
      justifyContent: "space-evenly",
      alignItems: "center",
      flexDirection: "row",
    },
    progressText: {
      fontFamily: "LatoBold",
      fontSize: 18,
      color: "white",
      width: 60,
      textAlign: "center",
    },
    backgroundBarView: {
      position: "relative",
      width: width,
      height: heigth,
      borderColor: "black",
      borderWidth: borderWidth,
      borderRadius: 50,
    },
    progressView: {
      position: "absolute",
      borderTopLeftRadius: 50,
      borderBottomLeftRadius: 50,
      left: 0,
      top: 0,
      height: heigth - 2 * borderWidth,
    },
    loadingProgressView: {
      width: loadingWidth,
      backgroundColor: loadingColor,
      borderTopRightRadius: loadingProgress > 0.99 ? 50 : 0,
      borderBottomRightRadius: loadingProgress > 0.99 ? 50 : 0,
    },
    readingProgressView: {
      width: readingWidth,
      backgroundColor: readingColor,
      borderTopRightRadius: readingProgress > 0.99 ? 50 : 0,
      borderBottomRightRadius: readingProgress > 0.99 ? 50 : 0,
    },
  });
  return styles;
};
