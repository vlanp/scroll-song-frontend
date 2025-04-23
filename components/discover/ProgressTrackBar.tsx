import DiscoverSound from "@/models/DiscoverSound";
import { IDownloadSoundState } from "@/models/IDownloadSoundState";
import SoundPlayerState from "@/models/SoundPlayerState";
import useDiscoverStore from "@/zustands/useDiscoverStore";
import useNetworkStore from "@/zustands/useNetworkStore";
import {
  GestureResponderEvent,
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
} from "react-native";
import SoundPlayer from "@/models/SoundPlayer";

const ProgressTrackBar = ({
  trackBarWidth,
  trackBarHeigth,
  trackBarBorderWidth,
  sound,
  loadingColor,
  readingColor,
}: {
  trackBarWidth: number;
  trackBarHeigth: number;
  trackBarBorderWidth: number;
  sound: DiscoverSound;
  loadingColor: string;
  readingColor: string;
}) => {
  const networkState = useNetworkStore((state) => state.networkState);
  const downloadExcerptState = useDiscoverStore<IDownloadSoundState | null>(
    (state) => state.downloadExcerptsState[sound.id]
  );
  const soundPlayerState = useDiscoverStore<SoundPlayerState | null>(
    (state) => state.soundsPlayerState[sound.id]
  );
  const soundPlayer = useDiscoverStore<SoundPlayer | null>(
    (state) => state.soundsPlayer[sound.id]
  );
  const loadingProgress =
    downloadExcerptState?.status === "downloadSoundLoading"
      ? downloadExcerptState.relativeProgress
      : downloadExcerptState?.status === "downloadSoundSuccess"
        ? 1
        : 0;

  const durationSec =
    (sound.endTimeExcerptMs - sound.startTimeExcerptMs) / 1000;

  if (!soundPlayerState?.isLoaded || !soundPlayer) {
    return <ActivityIndicator size={25} />;
  }

  const readingProgress = soundPlayerState.progressSec / durationSec;

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
    soundPlayer.stop(true);
    soundPlayer.changePositionSec(
      ((sound.endTimeExcerptMs - sound.startTimeExcerptMs) / 1000) *
        (e.nativeEvent.locationX / 200)
    );
  };

  return (
    <>
      <View style={styles.mainView}>
        <Text style={styles.progressText}>
          {(Math.round(soundPlayerState.progressSec) < 10 ? "00:0" : "00:") +
            Math.round(soundPlayerState.progressSec)}
        </Text>
        <View style={styles.backgroundBarView}>
          <View
            style={[styles.progressView, styles.loadingProgressView]}
            onTouchStart={handleTouchAndDrag}
            onTouchMove={handleTouchAndDrag}
            onTouchEnd={soundPlayer.play}
          ></View>
          <View
            style={[styles.progressView, styles.readingProgressView]}
            onTouchStart={handleTouchAndDrag}
            onTouchMove={handleTouchAndDrag}
            onTouchEnd={soundPlayer.play}
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
        soundPlayerState.error && (
          <>
            <Text>
              Une erreur est lors{" "}
              {soundPlayerState.error === "play"
                ? "du lancement"
                : "de l'arrêt"}{" "}
              de la musique. Merci de réessayer ultérieurement.
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
      fontFamily: "Lato-Bold",
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
