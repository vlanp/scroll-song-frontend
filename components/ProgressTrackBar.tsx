import { GestureResponderEvent, StyleSheet, View, Text } from "react-native";

const ProgressTrackBar = ({
  trackBarWidth,
  trackBarHeigth,
  trackBarBorderWidth,
  loadingProgress,
  progressSec,
  durationSec,
  loadingColor,
  readingColor,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
}: {
  trackBarWidth: number;
  trackBarHeigth: number;
  trackBarBorderWidth: number;
  loadingProgress: number;
  progressSec: number;
  durationSec: number;
  loadingColor: string;
  readingColor: string;
  onTouchStart?: (event: GestureResponderEvent) => void;
  onTouchMove?: (event: GestureResponderEvent) => void;
  onTouchEnd?: (event: GestureResponderEvent) => void;
}) => {
  const readingProgress = progressSec / durationSec;

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
      <Text style={styles.progressText}>
        {(Math.round(progressSec) < 10 ? "00:0" : "00:") +
          Math.round(progressSec)}
      </Text>
      <View style={styles.backgroundBarView}>
        <View
          style={[styles.progressView, styles.loadingProgressView]}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        ></View>
        <View
          style={[styles.progressView, styles.readingProgressView]}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        ></View>
      </View>
      <Text style={styles.progressText}>
        {(durationSec < 10 ? "00:0" : "00:") + durationSec}
      </Text>
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
      justifyContent: "space-evenly",
      alignItems: "center",
      flexDirection: "row",
    },
    progressText: {
      fontFamily: "LatoBold",
      fontSize: 21,
      color: "white",
      width: 60,
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
