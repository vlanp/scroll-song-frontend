import {
  ActivityIndicator,
  GestureResponderEvent,
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  useWindowDimensions,
} from "react-native";
import ProgressTrackBar from "../ProgressTrackBar";
import usePlayer from "../../hooks/usePlayer";
import { documentDirectory } from "expo-file-system";
import { useEffect, useState } from "react";
import DiscoverSound from "../../models/DiscoverSound";
import { useIsFocused } from "@react-navigation/native";
import ModalText from "./modalText";
import Modal from "../Modal";
import MarginSection from "../marginSection";
import TabTitle from "../tabTitle";
import GradientText from "../GradientText";
import musicNote from "../../assets/images/music-note.png";
import likeIcon from "../../assets/images/discoverIcons/like-icon.png";
import dislikeIcon from "../../assets/images/discoverIcons/dislike-icon.png";
import useDiscoverStore from "@/zustands/useDiscoverStore";
import { SharedValue, withTiming } from "react-native-reanimated";
import likeSound from "@/utils/discover/likeSound";
import useNetworkStore from "@/zustands/useNetworkStore";
import Immutable from "@/models/Immutable";
import { IDownloadSoundState } from "@/models/IDownloadSoundState";

function DiscoverComp({
  sound,
  selfPosition,
  swipePosition,
  onSide,
}: {
  sound: Immutable<DiscoverSound>;
  selfPosition: number;
  swipePosition: SharedValue<number>;
  onSide: SharedValue<boolean>;
}) {
  const excerptDirectory = process.env.EXPO_PUBLIC_EXCERPT_DIRECTORY;
  const { playingState, playingProgressSec, play, stop, changePositionSec } =
    usePlayer({
      uri:
        documentDirectory +
        (excerptDirectory ? excerptDirectory + "/" : "") +
        sound.id +
        ".mp3",
    });
  const networkState = useNetworkStore((state) => state.networkState);
  const downloadExcerptState = useDiscoverStore<IDownloadSoundState | null>(
    (state) => state.downloadExcerptsState[sound.id]
  );
  const position = useDiscoverStore((state) => state.position);
  const isFocused = useIsFocused();
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const setIsMainScrollEnable = useDiscoverStore(
    (state) => state.setIsMainScrollEnable
  );
  const likedTitleToDisplay = useDiscoverStore(
    (state) => state.likedTitleToDisplay
  );
  const dislikedTitleToDisplay = useDiscoverStore(
    (state) => state.dislikedTitleToDisplay
  );
  const { width } = useWindowDimensions();

  const handleTouchAndDrag = (e: GestureResponderEvent) => {
    stop(true);
    changePositionSec(
      ((sound.endTimeExcerptMs - sound.startTimeExcerptMs) / 1000) *
        (e.nativeEvent.locationX / 200)
    );
  };

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
    play,
    playingState.isPlaying,
    selfPosition,
    stop,
    isFocused,
    position.currentPosition,
    position.isScrolling,
    likedTitleToDisplay?.id,
    sound.id,
    dislikedTitleToDisplay?.id,
  ]);

  return (
    <View style={styles.container}>
      <Modal
        modalVisible={isModalVisible}
        setModalVisible={setIsModalVisible}
        closeButton={true}
        onClose={() => setIsMainScrollEnable(true)}
        zIndex={3}
      >
        <ModalText />
      </Modal>
      <View style={styles.container}>
        <MarginSection style={styles.marginSection}>
          <View style={styles.topView}>
            <TabTitle
              title="Découverte"
              onPressIcon={() => {
                setIsModalVisible((currentState) => !currentState);
                setIsMainScrollEnable(false);
              }}
            />
            <View style={styles.gradientText}>
              <GradientText
                fontSize={20}
                height={0}
                text="Scrollez pour découvrir !"
              />
            </View>
          </View>
          <View style={styles.middleView}>
            <View style={styles.topMiddleView}>
              <Image source={musicNote} style={styles.musicNote} />
              <View style={styles.songMiddleView}>
                <View style={styles.gradientText}>
                  <GradientText
                    fontSize={24}
                    height={0}
                    text="À l’écoute :"
                    textAlign="center"
                  />
                </View>
                <Text style={styles.songTitle}>{sound.title}</Text>
              </View>
              {!playingState.isLoaded ? (
                <ActivityIndicator size={25} />
              ) : (
                <ProgressTrackBar
                  loadingProgress={
                    downloadExcerptState?.status === "downloadSoundLoading"
                      ? downloadExcerptState.relativeProgress
                      : downloadExcerptState?.status === "downloadSoundSuccess"
                        ? 1
                        : 0
                  }
                  durationSec={
                    (sound.endTimeExcerptMs - sound.startTimeExcerptMs) / 1000
                  }
                  progressSec={playingProgressSec}
                  onTouchStart={handleTouchAndDrag}
                  onTouchMove={handleTouchAndDrag}
                  onTouchEnd={play}
                  loadingColor="rgba(0, 167, 255, 1)"
                  readingColor="rgba(0, 76, 255, 1)"
                  trackBarBorderWidth={2}
                  trackBarHeigth={15}
                  trackBarWidth={0.5 * width}
                />
              )}
            </View>
            <View style={styles.botMiddleView}>
              <Pressable
              // onPress={() => {
              //   swipePosition.value = withTiming(-width, { duration: 100 });
              //   onSide.value = false;
              // }}
              >
                <Image source={dislikeIcon} style={styles.chooseIcon} />
              </Pressable>
              <Pressable
                onPress={() => {
                  swipePosition.value = withTiming(width, { duration: 100 });
                  onSide.value = false;
                  likeSound(
                    sound,
                    "09454812-d5b2-4e33-896c-3b57056a4749" // TODO: Create a unique ID for each user
                  );
                }}
              >
                <Image source={likeIcon} style={styles.chooseIcon} />
              </Pressable>
            </View>
          </View>
          <View style={styles.gradientText}>
            <GradientText
              fontSize={20}
              height={0}
              text="Swipez pour choisir !"
              textAlign="right"
            />
          </View>
          {networkState.status === "networkError" ? (
            <Text>Il semble qu&apos;il y ait un problème réseau</Text>
          ) : downloadExcerptState?.status === "downloadSoundError" ? (
            <>
              <Text>
                Une erreur est survenue lors du téléchargement de la musique.
                Merci de réessayer ultérieurement.
              </Text>
            </>
          ) : (
            playingState.error && (
              <>
                <Text>
                  Une erreur est lors{" "}
                  {playingState.error === "play"
                    ? "du lancement"
                    : "de l'arrêt"}{" "}
                  de la musique. Merci de réessayer ultérieurement.
                </Text>
              </>
            )
          )}
        </MarginSection>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  marginSection: {
    justifyContent: "space-between",
  },
  topView: {
    gap: 10,
  },
  gradientText: {
    height: 36,
  },
  middleView: {
    gap: 60,
  },
  topMiddleView: {
    gap: 40,
  },
  musicNote: {
    height: 60,
    width: 85,
    objectFit: "contain",
    alignSelf: "center",
  },
  songMiddleView: {
    justifyContent: "center",
    gap: 20,
  },
  songTitle: {
    color: "white",
    fontSize: 24,
    fontFamily: "PoppinsBold",
    alignSelf: "center",
    textAlign: "center",
  },
  botMiddleView: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  chooseIcon: {
    height: 70,
    width: 70,
  },
});

export default DiscoverComp;
