import { FlatList, StyleSheet, Text, View } from "react-native";
import { useContext, useRef, useState } from "react";
import { SoundsContext } from "../contexts/SoundsContext";
import LottieLoading from "../components/LottieLoading";
import DiscoverComp from "../components/discover/DiscoverComp";
import { useDiscoverStore } from "@/zustands/useDiscoverStore";

function Index() {
  const { data, error, isLoading } = useContext(SoundsContext);
  const [height, setHeight] = useState<number>(0);
  const styles = getStyles(height);
  const setPositionState = useDiscoverStore((state) => state.setPositionState);
  const isMainScrollEnable = useDiscoverStore(
    (state) => state.isMainScrollEnable
  );
  const endScrollingTimeout = useRef<NodeJS.Timeout>(null);

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
        renderItem={({ item, index }) => (
          <View style={styles.scrollPageView}>
            <DiscoverComp sound={item} selfPosition={index} />
          </View>
        )}
        keyExtractor={(item) => item.id}
        pagingEnabled={true}
        onScrollBeginDrag={() => {
          console.log("begin");
          clearTimeout(endScrollingTimeout.current);
          setPositionState(undefined, true);
        }}
        onMomentumScrollEnd={() => {
          console.log("end");
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

const getStyles = (height: number) => {
  const styles = StyleSheet.create({
    mainView: {
      flex: 1,
    },
    scrollPageView: {
      height: height,
    },
  });

  return styles;
};

export default Index;
