import ErrorScreen from "@/components/ErrorScreen";
import GradientText from "@/components/GradientText";
import LottieLoading from "@/components/LottieLoading";
import useFetchDataState from "@/hooks/useFetchDataState";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

const Genres = () => {
  const [retryGenres, setRetryGenres] = useState<number>(0);

  const expoPublicApiUrl = process.env.EXPO_PUBLIC_API_URL;
  const genresEndpoint = process.env.EXPO_PUBLIC_GENRES_ENDPOINT;

  if (!expoPublicApiUrl || !genresEndpoint) {
    console.error(
      "EXPO_PUBLIC_API_URL or EXPO_PUBLIC_GENRES_ENDPOINT is not defined"
    );
  }

  const genresFetchState = useFetchDataState<string[], string[]>(
    (expoPublicApiUrl || "") + (genresEndpoint || ""),
    retryGenres,
    "09454812-d5b2-4e33-896c-3b57056a4749" // TODO: Create a unique ID for each user
  );

  if (
    genresFetchState.status === "fetchDataLoading" ||
    genresFetchState.status === "fetchDataIdle"
  ) {
    return <LottieLoading />;
  }

  if (
    genresFetchState.status === "fetchDataError" ||
    !genresFetchState.data ||
    genresFetchState.data.length === 0
  ) {
    return (
      <ErrorScreen
        errorText="Une erreur inconnue est survenue lors du chargement de la page. Merci de
        réessayer ultérieurement."
        onRetry={() => setRetryGenres((p) => p++)}
      />
    );
  }

  return (
    <View style={styles.mainView}>
      {genresFetchState.data.map((genre) => {
        return (
          <GradientText height={0} fontSize={20} text={genre} key={genre} />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  mainView: {
    backgroundColor: "black",
    flex: 1,
  },
});

export default Genres;
