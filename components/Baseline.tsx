import { StyleSheet, Text } from "react-native";

export default function Baseline({ children }: { children: string }) {
  return <Text style={styles.text}>{children}</Text>;
}

const styles = StyleSheet.create({
  text: {
    color: "white",
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
  },
});
