import { LinearGradient } from "expo-linear-gradient";
import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

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
  height,
  gradientColor,
  disabled,
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
  height?: number;
  gradientColor?: "blue" | "red" | undefined;
  disabled?: boolean | undefined;
}) {
  return (
    <TouchableOpacity
      style={[style]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      <LinearGradient
        colors={
          gradientColor === "red"
            ? ["#FF5E62", "#FF2C65"]
            : ["#4FACFE", "#00F2FE"]
        }
        style={[
          styles.buttonGradient,
          { borderRadius: radius },
          (disabled || loading) && styles.disabledInput,
        ]}
      >
        <View
          style={
            borderOnly
              ? [
                  styles.button,
                  { backgroundColor },
                  { borderRadius: radius },
                  { paddingHorizontal },
                  { paddingVertical },
                  { height },
                ]
              : [
                  styles.button,
                  { borderRadius: radius },
                  { paddingHorizontal },
                  { paddingVertical },
                  { height },
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
                            ? "Poppins-SemiBold"
                            : "Poppins-Regular",
                      },
                      { fontSize: fontSize },
                    ]
                  : [
                      styles.textBlack,
                      {
                        fontFamily:
                          fontWeight === "bold"
                            ? "Poppins-SemiBold"
                            : "Poppins-Regular",
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
    justifyContent: "center",
  },
  disabledInput: {
    backgroundColor: "#1a1a1a",
    borderColor: "#333",
    color: "#666",
    opacity: 0.7,
  },
});
