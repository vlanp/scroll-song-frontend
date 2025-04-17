import { StyleSheet, Text, View } from "react-native";

export default function TabTitle({
  title,
  justifyContent = "flex-start",
}: {
  title: string;
  onPressIcon?: () => void;
  hasIIcon?: boolean;
  justifyContent?:
    | "flex-start"
    | "flex-end"
    | "center"
    | "space-between"
    | "space-around"
    | "space-evenly";
}) {
  const styles = useStyle(justifyContent);
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{title}</Text>
    </View>
  );
}

const useStyle = (
  justifyContent:
    | "flex-start"
    | "flex-end"
    | "center"
    | "space-between"
    | "space-around"
    | "space-evenly"
) => {
  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      justifyContent: justifyContent,
    },
    text: {
      color: "white",
      fontSize: 24,
      fontFamily: "PoppinsBold",
    },
    icon: {
      width: 24,
      height: 24,
    },
  });

  return styles;
};
