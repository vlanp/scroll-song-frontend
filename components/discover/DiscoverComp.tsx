import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  useWindowDimensions,
} from "react-native";
import ProgressTrackBar from "../ProgressTrackBar";
import { documentDirectory } from "expo-file-system";
import { useState } from "react";
import DiscoverSound from "../../models/DiscoverSound";
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
import useCountRender from "@/hooks/useCountRender";

const DiscoverComp = function DiscoverComp({
  sound,
  selfPosition,
  swipePosition,
  onSide,
}: {
  readonly sound: DiscoverSound;
  selfPosition: number;
  swipePosition: SharedValue<number>;
  onSide: SharedValue<boolean>;
}) {
  useCountRender(sound.id);
  const excerptDirectory = process.env.EXPO_PUBLIC_EXCERPT_DIRECTORY;
  const uri =
    documentDirectory +
    (excerptDirectory ? excerptDirectory + "/" : "") +
    sound.id +
    ".mp3";

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const setIsFlatListScrollEnable = useDiscoverStore(
    (state) => state.setIsFlatListScrollEnable
  );

  const { width } = useWindowDimensions();

  return (
    <View style={styles.container}>
      <Modal
        modalVisible={isModalVisible}
        setModalVisible={setIsModalVisible}
        closeButton={true}
        onClose={() => setIsFlatListScrollEnable(true)}
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
                setIsFlatListScrollEnable(false);
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
              <ProgressTrackBar
                sound={sound}
                uri={uri}
                selfPosition={selfPosition}
                loadingColor="rgba(0, 167, 255, 1)"
                readingColor="rgba(0, 76, 255, 1)"
                trackBarBorderWidth={2}
                trackBarHeigth={15}
                trackBarWidth={0.5 * width}
              />
            </View>
            <View style={styles.botMiddleView}>
              <Pressable
                onPress={() => {
                  swipePosition.value = withTiming(-width, { duration: 100 });
                  onSide.value = false;
                }}
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
        </MarginSection>
      </View>
    </View>
  );
};

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

// DiscoverComp.whyDidYouRender = { logOnDifferentValues: true };

export default DiscoverComp;
