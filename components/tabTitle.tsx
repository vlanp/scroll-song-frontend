import { StyleSheet, Text, View } from "react-native";
import Baseline from "./Baseline";

export default function TabTitle({
  title,
  baseline,
}: {
  title: string;
  baseline?: string | undefined;
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{title}</Text>
      {baseline && <Baseline>{baseline}</Baseline>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  text: {
    color: "white",
    fontSize: 24,
    fontFamily: "PoppinsBold",
  },
});
