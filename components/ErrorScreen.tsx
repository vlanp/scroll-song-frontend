import { StyleSheet, View } from "react-native";
import GradientText from "./GradientText";
import GradientButton from "./GradientButton";

const ErrorScreen = ({
  errorText,
  onRetry,
}: {
  errorText: string;
  onRetry: () => void;
}) => {
  return (
    <View style={styles.container}>
      <GradientText
        text={errorText}
        fontSize={20}
        height={36}
        textAlign="center"
      />
      <GradientButton
        text="Réessayer"
        onPress={() => onRetry()}
        textColor="white"
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
  errorText: {
    fontSize: 20,
    color: "red",
  },
});

export default ErrorScreen;
