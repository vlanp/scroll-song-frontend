import { memo, ReactNode, useMemo } from "react";
import { StyleSheet, useWindowDimensions, View, ViewStyle } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  SharedValue,
  runOnJS,
} from "react-native-reanimated";
import LeftDiscoveredModal from "./LeftDiscoveredModal";
import RightDiscoveredModal from "./RightDiscoveredModal";
import likeSound from "../../utils/discover/likeSound";
import useDiscoverStore from "../../zustands/useDiscoverStore";
import DiscoverSound from "../../models/DiscoverSound";
import useCountRender from "../../hooks/useCountRender";
import { useSuccessfulAuthContext } from "../../contexts/authContext";

function SwipeModals({
  children,
  style,
  swipePosition,
  onSide,
  sound,
  remainingSounds,
}: {
  children: ReactNode;
  style: ViewStyle;
  swipePosition: SharedValue<number>;
  onSide: SharedValue<boolean>;
  sound: DiscoverSound;
  remainingSounds: number;
}) {
  useCountRender(SwipeModals.name + " " + sound.id);
  const authState = useSuccessfulAuthContext();
  const { width } = useWindowDimensions();
  const initialTouchLocation = useSharedValue<{ x: number; y: number } | null>(
    null
  );
  const setIsFlatListScrollEnable = useDiscoverStore(
    (state) => state.setIsFlatListScrollEnable
  );
  const styles = getStyle(width);

  // There is a weird behavior making sound undefined in panGesture while it not seems to be modified elsewhere
  const panGestureSound = useMemo(() => ({ ...sound }), [sound]);

  const panGesture = useMemo(
    () =>
      Gesture.Pan()
        .manualActivation(true)
        .onBegin((e) => {
          initialTouchLocation.value = { x: e.x, y: e.y };
        })
        .onTouchesMove((e, state) => {
          // Sanity checks
          if (!initialTouchLocation.value || !e.changedTouches.length) {
            state.fail();
            return;
          }

          const xDiff = Math.abs(
            e.changedTouches[0].x - initialTouchLocation.value.x
          );
          const yDiff = Math.abs(
            e.changedTouches[0].y - initialTouchLocation.value.y
          );
          const isHorizontalPanning = xDiff > yDiff;

          if (isHorizontalPanning) {
            state.activate();
          } else {
            state.fail();
          }
        })
        .onUpdate((e) => {
          if (onSide.value) {
            swipePosition.value = e.translationX;
          } else {
            swipePosition.value = width + e.translationX;
          }
        })
        .onEnd(() => {
          if (swipePosition.value > width / 3) {
            if (remainingSounds === 1) {
              swipePosition.value = withTiming(
                width - 20,
                { duration: 100 },
                () => {
                  swipePosition.value = withTiming(0, { duration: 100 });
                }
              );
              onSide.value = true;
            } else {
              swipePosition.value = withTiming(width - 20, { duration: 100 });
              onSide.value = false;
            }
            runOnJS(likeSound)(panGestureSound, authState.authToken);
            runOnJS(setIsFlatListScrollEnable)(false);
          } else if (Math.abs(swipePosition.value) > width / 3) {
            swipePosition.value = withTiming(-width - 20, { duration: 100 });
            onSide.value = false;
            runOnJS(setIsFlatListScrollEnable)(false);
          } else {
            swipePosition.value = withTiming(0, { duration: 100 });
            onSide.value = true;
          }
        }),
    [
      initialTouchLocation,
      onSide,
      swipePosition,
      width,
      panGestureSound,
      authState.authToken,
      setIsFlatListScrollEnable,
      remainingSounds,
    ]
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: swipePosition.value }],
  }));

  return (
    <View style={styles.globalContainer}>
      <GestureDetector gesture={panGesture}>
        <View style={styles.middleView}>{children}</View>
      </GestureDetector>
      <Animated.View style={[styles.leftModalView, animatedStyle]}>
        <LeftDiscoveredModal
          swipePosition={swipePosition}
          style={style}
          onSide={onSide}
        />
      </Animated.View>
      <Animated.View style={[styles.rightModalView, animatedStyle]}>
        <RightDiscoveredModal
          swipePosition={swipePosition}
          style={style}
          onSide={onSide}
          sound={sound}
        />
      </Animated.View>
    </View>
  );
}

const getStyle = (width: number) => {
  const styles = StyleSheet.create({
    globalContainer: {
      position: "relative",
      flex: 1,
      width: "100%",
      transform: [{ translateX: -width }],
    },
    container: {
      flex: 1,
    },
    leftModalView: {
      position: "absolute",
      top: 0,
      left: 0,
      width: width,
      height: "100%",
      justifyContent: "center",
      alignItems: "center",
    },
    rightModalView: {
      position: "absolute",
      top: 0,
      left: 2 * width,
      width: width,
      height: "100%",
      justifyContent: "center",
      alignItems: "center",
    },
    middleView: {
      position: "absolute",
      top: 0,
      left: width,
      width: "100%",
      height: "100%",
    },
  });

  return styles;
};

SwipeModals.whyDidYouRender = {
  logOnDifferentValues: true,
};

export default memo(SwipeModals);
