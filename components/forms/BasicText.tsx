import { StyleSheet, Text } from "react-native";

const BasicText = ({
  children,
  onPress,
}: {
  children: string;
  onPress?: undefined | (() => void);
}) => {
  const styles = getStyles(onPress);
  return (
    <Text style={styles.text} onPress={onPress}>
      {children}
    </Text>
  );
};

const getStyles = (onPress?: undefined | (() => void)) => {
  const styles = StyleSheet.create({
    text: {
      alignSelf: "center",
      color: "white",
      fontFamily: onPress ? "PoppinsBold" : "PoppinsSemiBold",
      fontSize: 14,
      textDecorationLine: onPress ? "underline" : "none",
    },
  });

  return styles;
};

export { BasicText };
