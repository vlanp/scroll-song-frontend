import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View } from "react-native";

export default function GradientText({
  text,
  fontSize,
  height,
  underline = false,
  textAlign = "auto",
}: {
  text: string;
  fontSize: number;
  height: number;
  underline?: boolean;
  textAlign?: "auto" | "left" | "right" | "center" | "justify";
}) {
  return (
    <MaskedView
      style={{
        flex: 1,
        flexDirection: "row",
        height: height,
      }}
      maskElement={
        <View
          style={{
            // Transparent background because mask is based off alpha channel.
            backgroundColor: "transparent",
            flex: 1,
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontSize: fontSize,
              color: "black",
              fontFamily: "PoppinsBold",
              textDecorationLine: underline ? "underline" : "none",
              textAlign: textAlign,
            }}
          >
            {text}
          </Text>
        </View>
      }
    >
      <LinearGradient
        colors={["#4FACFE", "#00F2FE"]}
        start={{ x: 0.1, y: 0.2 }}
        end={{ x: 0.9, y: 0.8 }}
        style={styles.gradient}
      ></LinearGradient>
    </MaskedView>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    height: "100%",
  },
});
