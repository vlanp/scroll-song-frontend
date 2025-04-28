import ProgressTrackBar from "@/components/favorites/ProgressTrackBar";
import OpenURLButton from "@/components/OpenUrl";
import ScreenContainer from "@/components/ScreenContainer";
import ScreenTitle from "@/components/ScreenTitle";
import { LikedSound } from "@/models/LikedSound";
import { parseObject, Stringify } from "@/models/Stringify";
import { useLocalSearchParams } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  Image,
  useWindowDimensions,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const SinglePlayerScreen = () => {
  const { width } = useWindowDimensions();
  const stringifiedSound = useLocalSearchParams<Stringify<LikedSound>>();
  const sound = parseObject(stringifiedSound);
  const genres = (JSON.parse(stringifiedSound.genres) as string[]).join(", ");
  const styles = getStyles();
  return (
    <ScreenContainer style={styles.mainView}>
      <ScreenTitle title={"Favoris"} />
      <Image
        source={{ uri: stringifiedSound.pictureUrl }}
        style={styles.cover}
      />
      <ProgressTrackBar
        sound={sound}
        loadingColor="rgba(0, 167, 255, 1)"
        readingColor="rgba(0, 76, 255, 1)"
        trackBarBorderWidth={2}
        trackBarHeigth={15}
        trackBarWidth={0.5 * width}
      />
      <ScrollView contentContainerStyle={styles.contentContainerStyle}>
        <View style={styles.metadata}>
          <Text style={styles.coverTitle}>{"Titre :"}</Text>
          <Text style={styles.coverText}>{stringifiedSound.title}</Text>
        </View>
        <View style={styles.metadata}>
          <Text style={styles.coverTitle}>{"Artiste :"}</Text>
          <Text style={styles.coverText}>{stringifiedSound.artist}</Text>
        </View>
        <View style={styles.metadata}>
          <Text style={styles.coverTitle}>{"Genres :"}</Text>
          <Text style={styles.coverText}>{genres}</Text>
        </View>
        <View style={styles.metadata}>
          <Text style={styles.coverTitle}>{"Source :"}</Text>
          <OpenURLButton
            url={"https://" + stringifiedSound.sourceUrl}
            style={styles.coverText}
          >
            {stringifiedSound.sourceUrl}
          </OpenURLButton>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
};

const getStyles = () => {
  const styles = StyleSheet.create({
    mainView: {
      gap: 20,
    },
    cover: {
      alignSelf: "center",
      aspectRatio: 1,
      width: "80%",
      borderRadius: 10,
      elevation: 10,
    },
    coverTitle: {
      alignSelf: "center",
      fontSize: 16,
      fontFamily: "Poppins-SemiBold",
      textDecorationLine: "underline",
      color: "white",
    },
    coverText: {
      alignSelf: "center",
      fontSize: 14,
      fontFamily: "Poppins-Medium",
      color: "white",
    },
    metadata: {
      gap: 5,
    },
    contentContainerStyle: {
      gap: 10,
    },
  });
  return styles;
};

export default SinglePlayerScreen;
