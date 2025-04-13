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
import GradientButtons from "../gradientButtons";
import dislikesImg from "../../assets/images/discoverImages/dislikes-img.png";
import { SharedValue, withTiming } from "react-native-reanimated";
import useDiscoverStore from "@/zustands/useDiscoverStore";
import dislikeSound from "@/utils/discover/dislikeSound";
import DiscoverSound from "@/models/DiscoverSound";
import { Immutable } from "immer";

const RightDiscoveredModal = ({
  style,
  swipePosition,
  onSide,
  sound,
}: {
  style: ViewStyle;
  swipePosition: SharedValue<number>;
  onSide: SharedValue<boolean>;
  sound: Immutable<DiscoverSound>;
}) => {
  const { width } = useWindowDimensions();
  const styles = useStyle(width);
  const setIsMainScrollEnable = useDiscoverStore(
    (state) => state.setIsMainScrollEnable
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
        <Text style={styles.swipeLeft}>Swiper à gauche ?</Text>
        <View style={{ marginTop: 10 }}></View>
        <Text style={styles.text}>
          <Text style={styles.bold}>{sound.title}</Text> n&apos;apparaîtra plus
          jamais dans votre roue.
        </Text>
        <View style={{ marginTop: 20 }}></View>
        <GradientButtons
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
            setIsMainScrollEnable(true);
            dislikeSound(sound, "09454812-d5b2-4e33-896c-3b57056a4749"); // TODO: Create a unique ID for each user
          }}
        />
        <View style={{ marginTop: 10 }}></View>
        <GradientButtons
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
            setIsMainScrollEnable(true);
          }}
        />
      </ScrollView>
    </Pressable>
  );
};

export default RightDiscoveredModal;

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
    swipeLeft: {
      fontFamily: "LatoHeavy",
      fontSize: 27,
      lineHeight: 34,
      padding: 10,
      alignSelf: "center",
    },
    text: {
      fontFamily: "LatoSemibold",
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
