import { View, Text, StyleSheet, Image } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const SingleCover = ({
  singleCoverUrl,
  title,
  artist,
}: {
  singleCoverUrl: string;
  title: string;
  artist: string;
}) => {
  const styles = getStyles();
  return (
    <View style={styles.mainView}>
      <Image source={{ uri: singleCoverUrl }} style={styles.cover} />
      <View>
        <Text style={styles.coverTitle}>{"Titre :"}</Text>
        <Text numberOfLines={2} ellipsizeMode={"tail"} style={styles.coverText}>
          {title}
        </Text>
        <Text style={styles.coverTitle}>{"Artiste :"}</Text>
        <Text numberOfLines={1} style={styles.coverText}>
          {artist}
        </Text>
      </View>
    </View>
  );
};

const getStyles = () => {
  const styles = StyleSheet.create({
    mainView: {
      width: 140,
      gap: 5,
    },
    cover: {
      height: 120,
      width: 120,
      borderRadius: 10,
      elevation: 10,
    },
    coverTitle: {
      fontSize: 15,
      fontFamily: "Poppins-SemiBold",
      textDecorationLine: "underline",
      color: "white",
    },
    coverText: {
      fontSize: 13,
      width: 120,
      fontFamily: "Poppins-Medium",
      color: "white",
    },
  });
  return styles;
};

export default SingleCover;
