import "../wdyr";
import {
  FlatList,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useContext, useRef, useState } from "react";
import { SoundsContext } from "../contexts/SoundsContext";
import LottieLoading from "../components/LottieLoading";
import DiscoverComp from "../components/discover/DiscoverComp";
import { useDiscoverStore } from "@/zustands/useDiscoverStore";
import SwipeModals from "@/components/discover/SwipeModals";
import { useSharedValue } from "react-native-reanimated";
import useCountRender from "@/hooks/useCountRender";

function Index() {
  useCountRender();
  const { data, error, isLoading } = useContext(SoundsContext);
  const [height, setHeight] = useState<number>(0);
  const { width: _width, height: _height } = useWindowDimensions();
  const styles = getStyles(_height, _width, height);
  const setPositionState = useDiscoverStore((state) => state.setPositionState);
  const isMainScrollEnable = useDiscoverStore(
    (state) => state.isMainScrollEnable
  );
  const endScrollingTimeout = useRef<NodeJS.Timeout>(null);
  const swipePosition = useSharedValue(0);
  const onSide = useSharedValue(true);

  if (isLoading) {
    return <LottieLoading />;
  }

  if (error || !data) {
    return (
      <Text>
        "Une erreur inconnue est survenue lors du chargement de la page. Merci
        de réessayer ultérieurement."
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
        data={data}
        scrollEnabled={isMainScrollEnable}
        initialNumToRender={3}
        renderItem={({ item, index }) => (
          <View style={styles.scrollPageView}>
            <SwipeModals
              style={styles.pressableContainer}
              swipePosition={swipePosition}
              onSide={onSide}
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
          clearTimeout(endScrollingTimeout.current);
          setPositionState(undefined, true);
        }}
        onMomentumScrollEnd={() => {
          endScrollingTimeout.current = setTimeout(
            () => setPositionState(undefined, false),
            100
          );
        }}
        onScroll={({ nativeEvent }) => {
          const position = Math.round(nativeEvent.contentOffset.y / height);
          setPositionState(position);
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
