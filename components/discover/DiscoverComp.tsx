import {
  ActivityIndicator,
  GestureResponderEvent,
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
} from "react-native";
import ProgressTrackBar from "../ProgressTrackBar";
import usePlayer from "../../hooks/usePlayer";
import { documentDirectory } from "expo-file-system";
import { useContext, useEffect, useState } from "react";
import { NetworkContext } from "../../contexts/NetworkContext";
import IDiscoverSound from "../../interfaces/IDiscoverSound";
import { useDownloadStore } from "../../zustands/useDownloadStore";
import { useIsFocused } from "@react-navigation/native";
import ModalText from "./modalText";
import Modal from "../Modal";
import MarginSection from "../marginSection";
import TabTitle from "../tabTitle";
import GradientText from "../gradientText";
import musicNote from "../../assets/images/music-note.png";
import likeIcon from "../../assets/images/discoverIcons/like-icon.png";
import dislikeIcon from "../../assets/images/discoverIcons/dislike-icon.png";
import { useDiscoverStore } from "@/zustands/useDiscoverStore";

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
  const { isError, relativeProgress } = useDownloadStore(
    (state) => state.excerptsDownloadState[sound.id]
  );
  const positionState = useDiscoverStore((state) => state.positionState);
  const isFocused = useIsFocused();
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const setIsMainScrollEnable = useDiscoverStore(
    (state) => state.setIsMainScrollEnable
  );

  const handleTouchAndDrag = (e: GestureResponderEvent) => {
    stop(true);
    changePositionSec(
      ((sound.end_time_excerpt_ms - sound.start_time_excerpt_ms) / 1000) *
        (e.nativeEvent.locationX / 200)
    );
  };

  useEffect(() => {
    const handlePositionChange = async () => {
      if (
        positionState.currentPosition === selfPosition &&
        isFocused &&
        !positionState.isScrolling
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
    positionState.currentPosition,
    positionState.isScrolling,
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
                fontSize={24}
                height={36}
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
                    fontSize={30}
                    height={45}
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
                  loadingProgress={relativeProgress}
                  durationSec={
                    (sound.end_time_excerpt_ms - sound.start_time_excerpt_ms) /
                    1000
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
              // onPress={() => {
              //   swipePosition.value = withTiming(width, { duration: 100 });
              //   onSide.value = false;
              //   likeSong(
              //     sounds,
              //     setSounds,
              //     scrollIndex,
              //     setLikedTitleToDisplay,
              //     authToken,
              //     updateNumber
              //   );
              // }}
              >
                <Image source={likeIcon} style={styles.chooseIcon} />
              </Pressable>
            </View>
          </View>
          <View style={styles.gradientText}>
            <GradientText
              fontSize={24}
              height={36}
              text="Swipez pour choisir !"
              textAlign="right"
            />
          </View>
          {isNetworkError ? (
            <Text>Il semble qu'il y ait un problème réseau</Text>
          ) : isError ? (
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
    height: 101,
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
    fontSize: 30,
    fontFamily: "PoppinsBold",
    alignSelf: "center",
    textAlign: "center",
    lineHeight: 45,
  },
  botMiddleView: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  chooseIcon: {
    height: 80,
    width: 80,
  },
});

export default DiscoverComp;
