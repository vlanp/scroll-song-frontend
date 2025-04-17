import "../wdyr";
import { FlatList, StyleSheet, useWindowDimensions, View } from "react-native";
import { useEffect, useRef, useState } from "react";
import LottieLoading from "../components/LottieLoading";
import DiscoverComp from "../components/discover/DiscoverComp";
import useDiscoverStore, {
  ReceivedPosition,
} from "@/zustands/useDiscoverStore";
import SwipeModals from "@/components/discover/SwipeModals";
import { useSharedValue } from "react-native-reanimated";
import ErrorScreen from "@/components/ErrorScreen";
import { useIsFocused } from "@react-navigation/native";
import { documentDirectory } from "expo-file-system";
import { Mutex } from "async-mutex";

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
  const isFocused = useIsFocused();
  const stopSoundPlayer = useRef<((isPause?: boolean) => Promise<void>) | null>(
    null
  );
  const stopSoundPlayerMutex = useRef<Mutex>(new Mutex());

  useEffect(() => {
    if (fetchDiscoverSoundsState.status !== "fetchDataSuccess") {
      return;
    }
    const position = useDiscoverStore.getState().position;
    setPosition(
      new ReceivedPosition(
        "keepPosition",
        "keepScrollingState",
        fetchDiscoverSoundsState.data[position.currentPosition]?.id ||
          fetchDiscoverSoundsState.data[position.currentPosition - 1]?.id
      )
    );
    const setSoundPlayer = useDiscoverStore.getState().setSoundPlayer;
    const excerptDirectory = process.env.EXPO_PUBLIC_EXCERPT_DIRECTORY;
    fetchDiscoverSoundsState.data.forEach((discoverSound) => {
      const uri =
        documentDirectory +
        (excerptDirectory ? excerptDirectory + "/" : "") +
        discoverSound.id +
        ".mp3";
      setSoundPlayer(discoverSound.id, uri);
    });
  }, [fetchDiscoverSoundsState, setPosition]);

  useEffect(() => {
    const unsubscribe = useDiscoverStore.subscribe(
      (state) => {
        const position = state.position;
        const play =
          position.soundId && state.soundsPlayer[position.soundId]?.play;
        const stop =
          position.soundId && state.soundsPlayer[position.soundId]?.stop;
        return {
          position,
          play,
          stop,
        };
      },
      async (selectedState) => {
        await stopSoundPlayerMutex.current.runExclusive(async () => {
          console.log("START : ", selectedState.position);
          const { position, play, stop } = selectedState;
          if (isFocused && !position.isScrolling && play) {
            if (stopSoundPlayer.current) {
              await stopSoundPlayer.current();
            }
            await play();
            stopSoundPlayer.current = stop || null;
          } else if (stop) {
            await stop();
            // stopSoundPlayer.current = null;
          } else if (stopSoundPlayer.current) {
            await stopSoundPlayer.current();
          }
          console.log("END : ", selectedState.position);
        });
      },
      {
        fireImmediately: true,
        equalityFn: (c, p) => {
          const { position: cPosition, play: cPlay, stop: cStop } = c;
          const { position: pPosition, play: pPlay, stop: pStop } = p;
          return (
            cPosition.currentPosition === pPosition.currentPosition &&
            cPosition.isScrolling === pPosition.isScrolling &&
            cPosition.soundId === pPosition.soundId &&
            cPlay === pPlay &&
            cStop === pStop
          );
        },
      }
    );
    return unsubscribe;
  }, [isFocused]);

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

  if (fetchDiscoverSoundsState.data.length === 0) {
    return (
      <ErrorScreen
        errorText="Vous avez écoutez toutes les musiques disponibles. Veuillez attendre la publication de nouveaux extraits."
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
        renderItem={({ item }) => (
          <View style={styles.scrollPageView}>
            <SwipeModals
              style={styles.pressableContainer}
              swipePosition={swipePosition}
              onSide={onSide}
              sound={item}
            >
              <DiscoverComp
                sound={item}
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
          setPosition(
            new ReceivedPosition("keepPosition", true, "keepSoundId")
          );
        }}
        onMomentumScrollEnd={() => {
          endScrollingTimeout.current = setTimeout(
            () =>
              setPosition(
                new ReceivedPosition("keepPosition", false, "keepSoundId")
              ),
            100
          );
        }}
        onScroll={({ nativeEvent }) => {
          const position = Math.round(
            nativeEvent.contentOffset.y / mainViewHeight
          );
          setPosition(
            new ReceivedPosition(
              position,
              "keepScrollingState",
              fetchDiscoverSoundsState.data[position]?.id || "keepSoundId"
            )
          );
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
