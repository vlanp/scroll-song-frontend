import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import * as Progress from "react-native-progress";

const DoubleProgressBar = ({
  loadingProgress,
  readingProgress,
  width,
  style,
}: {
  loadingProgress: number;
  readingProgress: number;
  width: number;
  style?: StyleProp<ViewStyle>;
}) => {
  const styles = getStyles(width);

  return (
    <View style={[styles.progressView, style]}>
      <Progress.Bar
        progress={loadingProgress}
        style={styles.loadingBar}
        width={width}
        color="rgba(0, 167, 255, 1)"
      />
      <Progress.Bar
        progress={readingProgress}
        style={styles.progressBar}
        width={width}
        color="rgba(0, 76, 255, 1)"
      />
    </View>
  );
};

const getStyles = (width: number) => {
  const styles = StyleSheet.create({
    progressView: {
      position: "relative",
      width: width,
    },
    loadingBar: {
      position: "absolute",
      top: 0,
    },
    progressBar: {
      position: "absolute",
      top: 0,
    },
  });

  return styles;
};

export default DoubleProgressBar;
