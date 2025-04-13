import "../wdyr";
import {
  FlatList,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useRef, useState } from "react";
import LottieLoading from "../components/LottieLoading";
import DiscoverComp from "../components/discover/DiscoverComp";
import useDiscoverStore, {
  ReceivedPosition,
} from "@/zustands/useDiscoverStore";
import SwipeModals from "@/components/discover/SwipeModals";
import { useSharedValue } from "react-native-reanimated";
import useCountRender from "@/hooks/useCountRender";

function Index() {
  useCountRender();
  const fetchDiscoverSoundsState = useDiscoverStore(
    (state) => state.fetchDiscoverSoundsState
  );
  const [height, setHeight] = useState<number>(0);
  const { width: _width, height: _height } = useWindowDimensions();
  const styles = getStyles(_height, _width, height);
  const setPosition = useDiscoverStore((state) => state.setPosition);
  const isMainScrollEnable = useDiscoverStore(
    (state) => state.isMainScrollEnable
  );
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
      <Text>
        Une erreur inconnue est survenue lors du chargement de la page. Merci de
        réessayer ultérieurement.
      </Text>
    );
  }

  return (
    <View
      style={styles.mainView}
      onLayout={(event) => {
        setHeight(event.nativeEvent.layout.height);
      }}
    >
      <FlatList
        data={fetchDiscoverSoundsState.data}
        scrollEnabled={isMainScrollEnable}
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
          const position = Math.round(nativeEvent.contentOffset.y / height);
          setPosition(new ReceivedPosition(position, "keepScrollingState"));
        }}
      />
    </View>
  );
}

Index.whyDidYouRender = { logOnDifferentValues: true };

const getStyles = (_height: number, _width: number, height: number) => {
  const styles = StyleSheet.create({
    mainView: {
      flex: 1,
    },
    scrollPageView: {
      height: height,
    },
    pressableContainer: {
      borderRadius: 40,
      width: _width - 80,
      marginHorizontal: 40,
      marginVertical: 0.15 * (_height - 200),
      height: 0.7 * (_height - 200),
      alignItems: "center",
    },
  });

  return styles;
};

export default Index;
