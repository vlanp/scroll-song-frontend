import { Pressable, StyleSheet, Text, View } from "react-native";
import Baseline from "./Baseline";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";

export default function ScreenTitle({
  title,
  baseline,
}: {
  title: string;
  baseline?: string | undefined;
}) {
  const router = useRouter();
  const canGoBack = router.canGoBack();

  return (
    <View style={styles.container}>
      <View style={styles.titleView}>
        <Text style={styles.text}>{title}</Text>
        {canGoBack && (
          <Pressable style={styles.iconView} onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={24} color="white" />
            <Text style={styles.iconText}>Retour</Text>
          </Pressable>
        )}
      </View>
      {baseline && <Baseline>{baseline}</Baseline>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  titleView: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  text: {
    color: "white",
    fontSize: 24,
    fontFamily: "Poppins-Bold",
  },
  iconText: {
    fontFamily: "Poppins-SemiBold",
    color: "white",
    fontSize: 16,
  },
  iconView: {
    borderWidth: 2,
    borderRadius: 10,
    borderColor: "white",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
});
