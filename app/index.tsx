import "../wdyr";
import { FlatList, StyleSheet, useWindowDimensions, View } from "react-native";
import { useRef, useState } from "react";
import LottieLoading from "../components/LottieLoading";
import DiscoverComp from "../components/discover/DiscoverComp";
import useDiscoverStore, {
  ReceivedPosition,
} from "@/zustands/useDiscoverStore";
import SwipeModals from "@/components/discover/SwipeModals";
import { useSharedValue } from "react-native-reanimated";
import ErrorScreen from "@/components/ErrorScreen";

function Index() {
  const fetchDiscoverSoundsState = useDiscoverStore(
    (state) => state.fetchDiscoverSoundsState
  );
  const setRetryDiscover = useDiscoverStore((state) => state.setRetryDiscover);
  const setFlatList = useDiscoverStore((state) => state.setFlatList);
  const [mainViewHeight, setMainViewHeight] = useState<number>(0);
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const styles = getStyles(screenHeight, screenWidth, mainViewHeight);
  const setPosition = useDiscoverStore((state) => state.setPosition);
  const endScrollingTimeout = useRef<NodeJS.Timeout | null>(null);
  const swipePosition = useSharedValue(0);
  const onSide = useSharedValue(true);

  if (
    fetchDiscoverSoundsState.status === "fetchDataLoading" ||
    fetchDiscoverSoundsState.status === "fetchDataIdle"
  ) {
    return <LottieLoading />;
  }

  if (
    fetchDiscoverSoundsState.status === "fetchDataError" ||
    !fetchDiscoverSoundsState.data
  ) {
    return (
      <ErrorScreen
        errorText="Une erreur inconnue est survenue lors du chargement de la page. Merci de
        réessayer ultérieurement."
        onRetry={setRetryDiscover}
      />
    );
  }

  return (
    <View
      style={styles.mainView}
      onLayout={(event) => {
        setMainViewHeight(event.nativeEvent.layout.height);
      }}
    >
      <FlatList
        ref={setFlatList}
        data={fetchDiscoverSoundsState.data}
        initialNumToRender={3}
        renderItem={({ item, index }) => (
          <View style={styles.scrollPageView}>
            <SwipeModals
              style={styles.pressableContainer}
              swipePosition={swipePosition}
              onSide={onSide}
              sound={item}
            >
              <DiscoverComp
                sound={item}
                selfPosition={index}
                onSide={onSide}
                swipePosition={swipePosition}
              />
            </SwipeModals>
          </View>
        )}
        keyExtractor={(item) => item.id}
        pagingEnabled={true}
        onScrollBeginDrag={() => {
          if (endScrollingTimeout.current) {
            clearTimeout(endScrollingTimeout.current);
          }
          setPosition(new ReceivedPosition("keepPosition", true));
        }}
        onMomentumScrollEnd={() => {
          endScrollingTimeout.current = setTimeout(
            () => setPosition(new ReceivedPosition("keepPosition", false)),
            100
          );
        }}
        onScroll={({ nativeEvent }) => {
          const position = Math.round(
            nativeEvent.contentOffset.y / mainViewHeight
          );
          setPosition(new ReceivedPosition(position, "keepScrollingState"));
        }}
      />
    </View>
  );
}

// Index.whyDidYouRender = { logOnDifferentValues: true };

const getStyles = (
  screenHeight: number,
  screenWidth: number,
  mainViewHeight: number
) => {
  const styles = StyleSheet.create({
    mainView: {
      flex: 1,
    },
    scrollPageView: {
      height: mainViewHeight,
    },
    pressableContainer: {
      borderRadius: 40,
      width: screenWidth - 80,
      marginHorizontal: 40,
      marginVertical: 0.15 * (screenHeight - 200),
      height: 0.7 * (screenHeight - 200),
      alignItems: "center",
    },
  });

  return styles;
};

export default Index;
