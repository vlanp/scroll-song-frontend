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
import { useDiscoverStore } from "@/zustands/useDiscoverStore";
import { useContext } from "react";
import { SoundsContext } from "@/contexts/SoundsContext";
import dislikeSound from "@/utils/discover/dislikeSound";

const RightDiscoveredModal = ({
  style,
  swipePosition,
  onSide,
}: {
  style: ViewStyle;
  swipePosition: SharedValue<number>;
  onSide: SharedValue<boolean>;
}) => {
  const { width } = useWindowDimensions();
  const styles = useStyle(width);
  const { data: sounds, setData: setSounds } = useContext(SoundsContext);
  const currentPosition = useDiscoverStore(
    (state) => state.positionState.currentPosition
  );
  const dislikedTitleToDisplay = sounds[currentPosition].title;
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
          <Text style={styles.bold}>{dislikedTitleToDisplay}</Text> n'apparaîtra
          plus jamais dans votre roue.
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
            dislikeSound(
              sounds,
              setSounds,
              currentPosition,
              "5a6251db-8f7e-4101-9577-3f5accfade3c"
            );
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
