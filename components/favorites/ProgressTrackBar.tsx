import {
  DownloadSoundLoading,
  IDownloadSoundState,
} from "@/models/IDownloadSoundState";
import useNetworkStore from "@/zustands/useNetworkStore";
import {
  GestureResponderEvent,
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
} from "react-native";
import { LikedSound } from "@/models/LikedSound";
import { useEffect, useState } from "react";
import downloadSound from "@/utils/download";
import useStorageStore from "@/zustands/useStorageStore";
import { useCheckedEnvContext } from "@/contexts/envContext";
import { documentDirectory } from "expo-file-system";
import { useFavoritesStore } from "@/zustands/useFavoritesStore";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";

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
  sound: LikedSound;
  loadingColor: string;
  readingColor: string;
}) => {
  const env = useCheckedEnvContext();
  const setIsStorageOk = useStorageStore((state) => state.setIsStorageOk);
  const networkState = useNetworkStore((state) => state.networkState);
  const [downloadSoundState, setDownloadSoundState] =
    useState<IDownloadSoundState>(new DownloadSoundLoading(0));
  const soundPlayer = useFavoritesStore(
    (state) => state.soundsPlayer[sound.id]
  );
  const setSoundPlayer = useFavoritesStore((state) => state.setSoundPlayer);
  const soundPlayerState = useFavoritesStore(
    (state) => state.soundsPlayerState[sound.id]
  );

  useEffect(() => {
    downloadSound(
      sound.id,
      sound.audioUrl,
      (_, downloadSoundState) => setDownloadSoundState(downloadSoundState),
      setIsStorageOk,
      env.favoritesDirectory
    );
  }, [env.favoritesDirectory, setIsStorageOk, sound.audioUrl, sound.id]);

  useEffect(() => {
    if (downloadSoundState.status !== "downloadSoundSuccess") {
      return;
    }
    const uri =
      documentDirectory + env.favoritesDirectory + "/" + sound.id + ".mp3";
    setSoundPlayer(sound.id, uri);
  }, [
    downloadSoundState.status,
    env.favoritesDirectory,
    setSoundPlayer,
    sound.id,
  ]);

  if (!soundPlayerState) {
    return <ActivityIndicator size={25} />;
  }

  const durationSec = sound.durationMs / 1000;
  const durationMin = Math.floor(durationSec / 60);
  const remeaningsSec = Math.floor(durationSec % 60);

  const progressSec = soundPlayerState.progressSec;
  const progressMin = Math.floor(progressSec / 60);
  const progressRemeaningsSec = Math.floor(progressSec % 60);

  const loadingProgress =
    downloadSoundState?.status === "downloadSoundLoading"
      ? downloadSoundState.relativeProgress
      : downloadSoundState?.status === "downloadSoundSuccess"
        ? 1
        : 0;

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
    soundPlayer?.stop(true);
    soundPlayer?.changePositionSec(
      durationSec * (e.nativeEvent.locationX / 200)
    );
  };

  return (
    <>
      <View style={styles.buttonsView}>
        {!soundPlayerState.isPlayLoading &&
          !soundPlayerState.isPlaying &&
          !soundPlayerState.isStopLoading &&
          !soundPlayerState.error && (
            <Entypo
              name="triangle-right"
              size={70}
              color="white"
              onPress={() => soundPlayer?.play()}
            />
          )}
        {!soundPlayerState.isStopLoading &&
          !soundPlayerState.isPlayLoading &&
          !soundPlayerState.error &&
          soundPlayerState.isPlaying && (
            <FontAwesome
              name="pause"
              size={40}
              color="white"
              onPress={() => soundPlayer?.stop(true)}
            />
          )}
        {!soundPlayerState.isStopLoading &&
          !soundPlayerState.isPlayLoading &&
          !soundPlayerState.error && (
            <MaterialCommunityIcons
              name="restart"
              size={50}
              color="white"
              onPress={() => soundPlayer?.changePositionSec(0)}
            />
          )}
      </View>
      <View style={styles.mainView}>
        <Text style={styles.progressText}>
          {(progressMin < 10 ? "0" + progressMin + ":" : progressMin + ":") +
            (progressRemeaningsSec < 10
              ? "0" + progressRemeaningsSec
              : progressRemeaningsSec)}
        </Text>
        <View style={styles.backgroundBarView}>
          <View
            style={[styles.progressView, styles.loadingProgressView]}
            onTouchStart={handleTouchAndDrag}
            onTouchMove={handleTouchAndDrag}
            onTouchEnd={soundPlayer?.play}
          ></View>
          <View
            style={[styles.progressView, styles.readingProgressView]}
            onTouchStart={handleTouchAndDrag}
            onTouchMove={handleTouchAndDrag}
            onTouchEnd={soundPlayer?.play}
          ></View>
        </View>
        <Text style={styles.progressText}>
          {(durationMin < 10 ? "0" + durationMin + ":" : durationMin + ":") +
            (remeaningsSec < 10 ? "0" + remeaningsSec : remeaningsSec)}
        </Text>
      </View>
      {networkState.status === "networkError" ? (
        <Text>Il semble qu&apos;il y ait un problème réseau</Text>
      ) : downloadSoundState?.status === "downloadSoundError" ? (
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
      // height: heigth - 2 * borderWidth,
      height: Math.round((heigth - 2 * borderWidth) / 2) * 2, // This version is used because their is a weird bug adding a fadded zone when the height is odd
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
    buttonsView: {
      flexDirection: "row",
      justifyContent: "space-evenly",
      alignItems: "center",
      height: 60,
    },
  });
  return styles;
};
