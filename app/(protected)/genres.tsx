import ErrorScreen from "@/components/ErrorScreen";
import GradientText from "@/components/GradientText";
import LottieLoading from "@/components/LottieLoading";
import ScreenContainer from "@/components/ScreenContainer";
import { useSuccessfulAuthContext } from "@/contexts/authContext";
import useFetchDataState from "@/hooks/useFetchDataState";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

const Genres = () => {
  const authState = useSuccessfulAuthContext();
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
    authState.authToken
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
    <ScreenContainer>
      {genresFetchState.data.map((genre) => {
        return (
          <GradientText height={0} fontSize={20} text={genre} key={genre} />
        );
      })}
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({});

export default Genres;
