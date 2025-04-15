import { ReactNode } from "react";
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
import likeSound from "@/utils/discover/likeSound";
import useDiscoverStore from "@/zustands/useDiscoverStore";
import DiscoverSound from "@/models/DiscoverSound";
import Immutable from "@/models/Immutable";

export default function SwipeModals({
  children,
  style,
  swipePosition,
  onSide,
  sound,
}: {
  children: ReactNode;
  style: ViewStyle;
  swipePosition: SharedValue<number>;
  onSide: SharedValue<boolean>;
  readonly sound: Immutable<DiscoverSound>;
}) {
  const { width } = useWindowDimensions();
  const initialTouchLocation = useSharedValue<{ x: number; y: number } | null>(
    null
  );
  const setIsMainScrollEnable = useDiscoverStore(
    (state) => state.setIsMainScrollEnable
  );
  const styles = getStyle(width);
  // For weird reason when trying to access sound from panGesture, it retrieve an empty object
  // However sound doesn't seems to be modified directly anywere
  const panGestureSound = { ...sound };

  const panGesture = Gesture.Pan()
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
        swipePosition.value = withTiming(width, { duration: 100 });
        onSide.value = false;
        runOnJS(likeSound)(
          panGestureSound,
          "09454812-d5b2-4e33-896c-3b57056a4749"
        ); // TODO: Create a unique ID for each user
        runOnJS(setIsMainScrollEnable)(false);
      } else if (Math.abs(swipePosition.value) > width / 3) {
        swipePosition.value = withTiming(-width, { duration: 100 });
        onSide.value = false;
        runOnJS(setIsMainScrollEnable)(false);
      } else {
        swipePosition.value = withTiming(0, { duration: 100 });
        onSide.value = true;
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    console.log("Position actuelle:", swipePosition.value);
    return {
      transform: [{ translateX: swipePosition.value }],
    };
  });

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
      width: 3 * width,
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
      width: width,
      height: "100%",
    },
  });

  return styles;
};
