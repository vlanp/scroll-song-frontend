import { FlatList, StyleSheet, Text, View } from "react-native";
import { useContext, useState } from "react";
import { SoundsContext } from "../contexts/SoundsContext";
import LottieLoading from "../components/LottieLoading";
import DiscoverComp from "../components/DiscoverComp";
import { useDownloadStore } from "../zustands/useDownloadStore";

function Index() {
  const { data, error, isLoading } = useContext(SoundsContext);
  const [height, setHeight] = useState<number>(0);
  const styles = getStyles(height);
  const setCurrentPosition = useDownloadStore(
    (state) => state.setCurrentPosition
  );

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
        renderItem={({ item, index }) => (
          <View style={styles.scrollPageView}>
            <DiscoverComp sound={item} selfPosition={index} />
          </View>
        )}
        keyExtractor={(item) => item.id}
        pagingEnabled={true}
        // initialNumToRender={10}
        // onMomentumScrollEnd={({ nativeEvent }) => {
        //   if (isFocused) {
        //     const position = Math.round(nativeEvent.contentOffset.y / height);
        //     setCurrentPosition(position);
        //   }
        // }}
        // onMomentumScrollBegin={(responderEvent) => {
        //   console.log(responderEvent.nativeEvent.layoutMeasurement);
        //   responderEvent.currentTarget.measure((number) => console.log(number));
        //   console.log(responderEvent.nativeEvent.contentOffset.y);
        //   const position = Math.round(
        //     responderEvent.nativeEvent.contentOffset.y / height
        //   );
        //   console.log(position);
        // }}
        onScroll={({ nativeEvent }) => {
          const position = Math.round(nativeEvent.contentOffset.y / height);
          setCurrentPosition(position);
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
