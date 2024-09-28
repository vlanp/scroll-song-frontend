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
import favoritesImg from "../../assets/images/discoverImages/favorites-img.png";
import { router } from "expo-router";
import { SharedValue, withTiming } from "react-native-reanimated";
import { useDiscoverStore } from "@/zustands/useDiscoverStore";

const LeftDiscoveredModal = ({
  style,
  swipePosition,
  onSide,
}: {
  style: ViewStyle;
  swipePosition: SharedValue<number>;
  onSide: SharedValue<boolean>;
}) => {
  const { width } = useWindowDimensions();
  const likedTitleToDisplay = useDiscoverStore(
    (state) => state.likedTitleToDisplay?.title
  );
  const setIsMainScrollEnable = useDiscoverStore(
    (state) => state.setIsMainScrollEnable
  );

  const styles = useStyle(width);

  return (
    <Pressable style={[style, styles.leftContainer]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContainer}
      >
        <Image
          source={favoritesImg}
          resizeMode="contain"
          style={styles.favoritesImg}
        />
        <View style={{ marginTop: 20 }}></View>
        <Text style={styles.swipeRight}>Bravo !</Text>
        <View style={{ marginTop: 10 }}></View>
        <Text style={styles.text}>
          {" "}
          Vous avez ajouté{" "}
          <Text style={styles.bold}>{likedTitleToDisplay}</Text> à vos favoris,
          vous pouvez maintenant voter pour découvrir l'artiste !
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
          text="Aller voter"
          onPress={() => {
            router.navigate("/vote");
            swipePosition.value = withTiming(0, { duration: 100 });
            onSide.value = true;
            setIsMainScrollEnable(true);
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
          text="Tourner encore la roue"
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

export default LeftDiscoveredModal;

const useStyle = (width: number) => {
  const styles = StyleSheet.create({
    leftContainer: {
      backgroundColor: "white",
    },
    scrollViewContainer: {
      height: "100%",
      justifyContent: "center",
    },
    favoritesImg: {
      width: "100%",
      height: 125,
    },
    scrollView: {
      width: 0.7 * width,
    },
    swipeRight: {
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
