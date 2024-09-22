import { FlatList, StyleSheet, Text, View } from "react-native";
import { Audio } from "expo-av";
import { useContext, useState } from "react";
import { SoundsContext } from "../contexts/SoundsContext";
import LottieLoading from "../components/LottieLoading";
import DiscoverComp from "../components/DiscoverComp";
import { useIsFocused } from "@react-navigation/native";
import { useDownloadStore } from "../zustands/useDownloadStore";

Audio.setAudioModeAsync({ playsInSilentModeIOS: true });

function Index() {
  const { data, error, isLoading } = useContext(SoundsContext);
  const [height, setHeight] = useState<number>(0);
  const styles = getStyles(height);
  const isFocused = useIsFocused();
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
        renderItem={({ item }) => (
          <View style={styles.scrollPageView}>
            <DiscoverComp sound={item} />
          </View>
        )}
        keyExtractor={(item) => item.id}
        pagingEnabled={true}
        onMomentumScrollEnd={({ nativeEvent }) => {
          // Needed because onMomentumScrollEnd is fired everytime the discover page is left
          if (isFocused) {
            const position = Math.round(nativeEvent.contentOffset.y / height);
            setCurrentPosition(position);
          }
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
