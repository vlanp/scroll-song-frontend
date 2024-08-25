import { GestureResponderEvent, StyleSheet, View } from "react-native";

const ProgressTrackBar = ({
  trackBarWidth,
  trackBarHeigth,
  trackBarBorderWidth,
  loadingProgress,
  readingProgress,
  loadingColor,
  readingColor,
  onTouchStart,
}: {
  trackBarWidth: number;
  trackBarHeigth: number;
  trackBarBorderWidth: number;
  loadingProgress: number;
  readingProgress: number;
  loadingColor: string;
  readingColor: string;
  onTouchStart?: (event: GestureResponderEvent) => void;
}) => {
  const styles = getStyles(
    trackBarWidth,
    trackBarHeigth,
    trackBarBorderWidth,
    loadingProgress,
    readingProgress,
    loadingColor,
    readingColor
  );

  return (
    <View style={styles.mainView}>
      <View style={styles.backgroundBarView}>
        <View
          style={[styles.progressView, styles.loadingProgressView]}
          onTouchStart={onTouchStart}
        ></View>
        <View
          style={[styles.progressView, styles.readingProgressView]}
          onTouchStart={onTouchStart}
        ></View>
      </View>
    </View>
  );
};

export default ProgressTrackBar;

const getStyles = (
  width: number,
  heigth: number,
  borderWidth: number,
  loadingProgress: number,
  readingProgress: number,
  loadingColor: string,
  readingColor: string
) => {
  const loadingWidth = loadingProgress * (width - 2 * borderWidth);
  const readingWidth = readingProgress * (width - 2 * borderWidth);

  const styles = StyleSheet.create({
    mainView: {
      alignItems: "center",
    },
    backgroundBarView: {
      position: "relative",
      width: width,
      height: heigth,
      borderColor: "black",
      borderWidth: borderWidth,
      borderRadius: 50,
    },
    progressView: {
      position: "absolute",
      borderTopLeftRadius: 50,
      borderBottomLeftRadius: 50,
      left: 0,
      top: 0,
      height: heigth - 2 * borderWidth,
    },
    loadingProgressView: {
      width: loadingWidth,
      backgroundColor: loadingColor,
      borderTopRightRadius: loadingProgress > 0.99 ? 50 : 0,
      borderBottomRightRadius: loadingProgress > 0.99 ? 50 : 0,
    },
    readingProgressView: {
      width: readingWidth,
      backgroundColor: readingColor,
      borderTopRightRadius: readingProgress > 0.99 ? 50 : 0,
      borderBottomRightRadius: readingProgress > 0.99 ? 50 : 0,
    },
  });
  return styles;
};
