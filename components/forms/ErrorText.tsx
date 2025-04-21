import { StyleSheet, Text } from "react-native";

const ErrorText = ({ children }: { children: string }) => {
  return <Text style={styles.text}>{children}</Text>;
};

const styles = StyleSheet.create({
  text: {
    textAlign: "center",
    color: "red",
    fontFamily: "PoppinsBold",
    fontSize: 14,
  },
});

export { ErrorText };
