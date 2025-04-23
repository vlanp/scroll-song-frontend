import { StyleSheet } from "react-native";
import GradientText from "./GradientText";
import GradientButton from "./GradientButton";
import ScreenContainer from "./ScreenContainer";

const ErrorScreen = ({
  errorText,
  onRetry,
}: {
  errorText: string;
  onRetry: () => void;
}) => {
  return (
    <ScreenContainer style={styles.container}>
      <GradientText
        text={errorText}
        fontSize={20}
        height={36}
        textAlign="center"
      />
      <GradientButton
        text="Réessayer"
        onPress={onRetry}
        textColor="white"
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 20,
    color: "red",
  },
});

export default ErrorScreen;
