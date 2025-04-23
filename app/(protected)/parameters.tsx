import ErrorScreen from "@/components/ErrorScreen";
import GradientButton from "@/components/GradientButton";
import LottieLoadingScreen from "@/components/LottieLoading";
import ScreenContainer from "@/components/ScreenContainer";
import ScreenTitle from "@/components/ScreenTitle";
import SelectableText from "@/components/SelectableText";
import { useSuccessfulAuthContext } from "@/contexts/authContext";
import { useCheckedEnvContext } from "@/contexts/envContext";
import useFetchDataState from "@/hooks/useFetchDataState";
import IGenreState from "@/models/IGenreState";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

const Parameters = () => {
  const authState = useSuccessfulAuthContext();
  const env = useCheckedEnvContext();
  const [retryGenres, setRetryGenres] = useState<number>(0);

  const genresStatesFetchState = useFetchDataState<
    IGenreState[],
    IGenreState[]
  >(env.apiUrl + env.genresEndpoint, retryGenres, authState.authToken);

  if (
    genresStatesFetchState.status === "fetchDataLoading" ||
    genresStatesFetchState.status === "fetchDataIdle"
  ) {
    return <LottieLoadingScreen />;
  }

  if (
    genresStatesFetchState.status === "fetchDataError" ||
    !genresStatesFetchState.data ||
    genresStatesFetchState.data.length === 0
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
      <ScreenTitle title="Paramètres" />
      <GradientButton text="Se déconnecter" onPress={authState.logOut} />
      <ScrollView
        style={styles.genresScrollView}
        contentContainerStyle={styles.genresContentContainer}
      >
        {genresStatesFetchState.data.map((genreState) => {
          console.log(genreState);

          return (
            <SelectableText
              text={genreState.genre}
              key={genreState.genre}
              initialState={genreState.isSelected}
            />
          );
        })}
      </ScrollView>
      <GradientButton text="Sauvegarder" />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  genresScrollView: {},
  genresContentContainer: {
    paddingVertical: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    flexWrap: "wrap",
    rowGap: 10,
    gap: 0,
  },
});

export default Parameters;
