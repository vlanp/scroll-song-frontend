import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  useWindowDimensions,
} from "react-native";
import ProgressTrackBar from "./ProgressTrackBar";
import { memo } from "react";
import DiscoverSound from "../../models/DiscoverSound";
import ScreenTitle from "../ScreenTitle";
import GradientText from "../GradientText";
import disLikeIcon from "../../assets/images/discoverIcons/dis-like-icon.png";
import useDiscoverStore from "@/zustands/useDiscoverStore";
import { SharedValue, withTiming } from "react-native-reanimated";
import likeSound from "@/utils/discover/likeSound";
import useCountRender from "@/hooks/useCountRender";
import OpenURLButton from "../OpenUrl";
import { useSuccessfulAuthContext } from "@/contexts/authContext";

function DiscoverComp({
  sound,
  swipePosition,
  onSide,
}: {
  sound: DiscoverSound;
  swipePosition: SharedValue<number>;
  onSide: SharedValue<boolean>;
}) {
  const authState = useSuccessfulAuthContext();
  useCountRender(DiscoverComp.name + " " + sound.id);
  const setIsFlatListScrollEnable = useDiscoverStore(
    (state) => state.setIsFlatListScrollEnable
  );

  const { width } = useWindowDimensions();

  return (
    <View style={styles.mainView}>
      <View style={styles.topView}>
        <ScreenTitle title="Découverte" />
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
            <Text style={styles.songMetadata}>{"Par : " + sound.artist}</Text>
            <OpenURLButton
              url={"https://" + sound.sourceUrl}
              style={styles.songMetadata}
            >
              {"Source : " + sound.sourceUrl}
            </OpenURLButton>
          </View>
          <ProgressTrackBar
            sound={sound}
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
              setIsFlatListScrollEnable(false);
              swipePosition.value = withTiming(-width, { duration: 100 });
              onSide.value = false;
            }}
          >
            <Image source={disLikeIcon} style={styles.chooseIcon} />
          </Pressable>
          <Pressable
            onPress={() => {
              setIsFlatListScrollEnable(false);
              swipePosition.value = withTiming(width, { duration: 100 });
              onSide.value = false;
              likeSound(sound, authState.authToken);
            }}
          >
            <Image
              source={disLikeIcon}
              style={{ ...styles.chooseIcon, ...styles.likeIcon }}
            />
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
    </View>
  );
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
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
  songMiddleView: {
    justifyContent: "center",
    gap: 10,
  },
  songTitle: {
    color: "white",
    fontSize: 24,
    fontFamily: "PoppinsBold",
    alignSelf: "center",
    textAlign: "center",
  },
  songMetadata: {
    color: "white",
    fontSize: 20,
    fontFamily: "PoppinsSemiBold",
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
  likeIcon: {
    transform: "rotate(45deg)",
  },
});

// DiscoverComp.whyDidYouRender = { logOnDifferentValues: true };

export default memo(DiscoverComp);
