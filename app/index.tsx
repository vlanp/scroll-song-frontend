import {
  ActivityIndicator,
  FlatList,
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Audio } from "expo-av";
import ProgressTrackBar from "../components/ProgressTrackBar";
import useDownloader from "../hooks/useDownloader (old)";
import getExcerptUri from "../utils/getExcerptUri";
import usePlayer from "../hooks/usePlayer";
import { documentDirectory } from "expo-file-system";
import { useContext } from "react";
import { NetworkContext } from "../contexts/NetworkContext";
import { SoundsContext } from "../contexts/SoundsContext";
import LottieLoading from "../components/LottieLoading";
import DiscoverComp from "../components/DiscoverComp";

Audio.setAudioModeAsync({ playsInSilentModeIOS: true });

function Index() {
  const { data, error, isLoading } = useContext(SoundsContext);

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
    <FlatList
      data={data}
      renderItem={({ item }) => <DiscoverComp sound={item} />}
      keyExtractor={(item) => item.id}
    />
  );
}

const styles = StyleSheet.create({
  mainView: {
    height: "100%",
    justifyContent: "center",
    gap: 20,
  },
  playButton: {
    borderWidth: 2,
    borderRadius: 50,
    width: 100,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
});

export default Index;
