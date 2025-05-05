import { LikedSound } from "../../models/LikedSound";
import { stringifyObject } from "../../models/Stringify";
import { useRouter } from "expo-router";
import { View, Text, StyleSheet, Image, Pressable } from "react-native";

const SingleCover = ({ sound }: { sound: LikedSound }) => {
  const router = useRouter();
  const styles = getStyles();
  return (
    <View style={styles.mainView}>
      <Pressable
        onPress={() =>
          router.push({
            pathname: "/favorites/singlePlayer",
            params: stringifyObject(sound),
          })
        }
      >
        <Image source={{ uri: sound.pictureUrl }} style={styles.cover} />
      </Pressable>
      <View>
        <Text style={styles.coverTitle}>{"Titre :"}</Text>
        <Text numberOfLines={2} ellipsizeMode={"tail"} style={styles.coverText}>
          {sound.title}
        </Text>
        <Text style={styles.coverTitle}>{"Artiste :"}</Text>
        <Text numberOfLines={1} style={styles.coverText}>
          {sound.artist}
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
