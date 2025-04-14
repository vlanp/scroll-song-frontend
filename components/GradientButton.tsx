import { LinearGradient } from "expo-linear-gradient";
import {
  ActivityIndicator,
  Dimensions,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

const screenWidth = Dimensions.get("window").width;

export default function GradientButton({
  text,
  borderOnly = false,
  loading,
  style,
  onPress,
  textColor = "black",
  backgroundColor = "black",
  radius = 15,
  paddingHorizontal = 20,
  paddingVertical = 14,
  fontWeight = "bold",
  fontSize = 17,
  row = false,
}: {
  text: string;
  borderOnly?: boolean;
  loading?: boolean;
  textColor?: "white" | "black";
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  backgroundColor?: "white" | "black";
  radius?: number;
  paddingHorizontal?: number;
  paddingVertical?: number;
  fontWeight?: "bold" | "normal";
  fontSize?: number;
  row?: boolean;
}) {
  return (
    <TouchableOpacity style={[style]} onPress={onPress} disabled={loading}>
      <LinearGradient
        colors={["#FCA445", "#FED03A"]}
        style={[
          styles.buttonGradient,
          { borderRadius: radius },
          row && { width: (screenWidth - 30) / 4 },
        ]}
      >
        <View
          style={
            borderOnly
              ? [
                  styles.button,
                  { backgroundColor: backgroundColor },
                  { borderRadius: radius },
                  { paddingHorizontal: paddingHorizontal },
                  { paddingVertical: paddingVertical },
                ]
              : [
                  styles.button,
                  { borderRadius: radius },
                  { paddingHorizontal: paddingHorizontal },
                  { paddingVertical: paddingVertical },
                ]
          }
        >
          {loading ? (
            <ActivityIndicator size="small" color="black" />
          ) : (
            <Text
              style={
                textColor === "white"
                  ? [
                      styles.textWhite,
                      {
                        fontFamily:
                          fontWeight === "bold"
                            ? "PoppinsSemiBold"
                            : "PoppinsRegular",
                      },
                      { fontSize: fontSize },
                    ]
                  : [
                      styles.textBlack,
                      {
                        fontFamily:
                          fontWeight === "bold"
                            ? "PoppinsSemiBold"
                            : "PoppinsRegular",
                      },
                      { fontSize: fontSize },
                    ]
              }
            >
              {text}
            </Text>
          )}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  buttonGradient: {
    padding: 1,
  },
  textWhite: {
    color: "white",
    textAlign: "center",
  },
  textBlack: {
    color: "black",
    textAlign: "center",
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
});
