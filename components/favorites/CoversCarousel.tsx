import { LikedSound } from "@/models/LikedSound";
import { View, StyleSheet } from "react-native";
import SingleCover from "./SingleCover";
import GradientText from "../GradientText";
import { ScrollView } from "react-native-gesture-handler";

const CoversCarousel = ({
  categoryTitle,
  sounds,
}: {
  categoryTitle: string;
  sounds: LikedSound[];
}) => {
  const styles = getStyles();
  return (
    <View style={styles.mainView}>
      <View style={styles.gradientView}>
        <GradientText text={categoryTitle} fontSize={20} height={0} />
      </View>
      <ScrollView horizontal contentContainerStyle={styles.carousel}>
        {sounds.map((sound) => (
          <SingleCover
            key={sound.id}
            singleCoverUrl={sound.pictureUrl}
            artist={sound.artist}
            title={sound.title}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const getStyles = () => {
  const styles = StyleSheet.create({
    mainView: {
      maxHeight: 300,
    },
    carousel: {
      paddingVertical: 5,
    },
    gradientView: {
      height: 40,
    },
  });
  return styles;
};

export default CoversCarousel;
