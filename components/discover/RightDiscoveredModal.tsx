import {
  Pressable,
  ScrollView,
  Image,
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  ViewStyle,
} from "react-native";
import GradientButton from "../GradientButton";
import dislikesImg from "../../assets/images/discoverImages/dislikes-img.png";
import { SharedValue, withTiming } from "react-native-reanimated";
import useDiscoverStore from "@/zustands/useDiscoverStore";
import dislikeSound from "@/utils/discover/dislikeSound";
import DiscoverSound from "@/models/DiscoverSound";
import { memo } from "react";
import { useSuccessfulAuthContext } from "@/contexts/authContext";

const RightDiscoveredModal = ({
  style,
  swipePosition,
  onSide,
  sound,
}: {
  style: ViewStyle;
  swipePosition: SharedValue<number>;
  onSide: SharedValue<boolean>;
  sound: DiscoverSound;
}) => {
  const authState = useSuccessfulAuthContext();
  const { width } = useWindowDimensions();
  const styles = useStyle(width);
  const setIsFlatListScrollEnable = useDiscoverStore(
    (state) => state.setIsFlatListScrollEnable
  );

  return (
    <Pressable style={[style, styles.leftContainer]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContainer}
      >
        <Image
          source={dislikesImg}
          resizeMode="contain"
          style={styles.dislikesImg}
        />
        <View style={{ marginTop: 20 }}></View>
        <Text style={styles.swipeRight}>Retirer cet extrait ?</Text>
        <View style={{ marginTop: 10 }}></View>
        <Text style={styles.text}>
          <Text style={styles.bold}>{sound.title}</Text> n&apos;apparaîtra plus
          jamais dans votre roue.
        </Text>
        <View style={{ marginTop: 20 }}></View>
        <GradientButton
          style={{
            width: "90%",
            alignSelf: "center",
          }}
          paddingVertical={10}
          radius={50}
          fontSize={16}
          text="Je l'enlève de ma roue"
          onPress={() => {
            swipePosition.value = withTiming(0, { duration: 100 });
            onSide.value = true;
            setIsFlatListScrollEnable(true);
            dislikeSound(sound, authState.authToken);
          }}
        />
        <View style={{ marginTop: 10 }}></View>
        <GradientButton
          style={{
            width: "90%",
            alignSelf: "center",
          }}
          backgroundColor="white"
          borderOnly
          paddingVertical={10}
          radius={50}
          fontSize={16}
          text="Je réfléchis encore"
          onPress={() => {
            swipePosition.value = withTiming(0, { duration: 100 });
            onSide.value = true;
            setIsFlatListScrollEnable(true);
          }}
        />
      </ScrollView>
    </Pressable>
  );
};

export default memo(RightDiscoveredModal);

const useStyle = (width: number) => {
  const styles = StyleSheet.create({
    leftContainer: {
      backgroundColor: "white",
    },
    scrollViewContainer: {
      height: "100%",
      justifyContent: "center",
    },
    dislikesImg: {
      width: "100%",
      height: 125,
    },
    scrollView: {
      width: 0.7 * width,
    },
    swipeRight: {
      fontFamily: "Lato-Heavy",
      fontSize: 27,
      lineHeight: 34,
      padding: 10,
      alignSelf: "center",
    },
    text: {
      fontFamily: "Lato-Semibold",
      paddingHorizontal: 20,
      textAlign: "center",
      fontSize: 17,
      lineHeight: 22,
      color: "#606268",
    },
    bold: {
      fontFamily: "LatoBold",
    },
  });
  return styles;
};
