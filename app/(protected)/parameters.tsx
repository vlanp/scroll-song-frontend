import ErrorScreen from "@/components/ErrorScreen";
import GradientButton from "@/components/GradientButton";
import LottieLoadingScreen from "@/components/LottieLoading";
import ScreenContainer from "@/components/ScreenContainer";
import ScreenTitle from "@/components/ScreenTitle";
import SelectableText from "@/components/genres/SelectableText";
import { useSuccessfulAuthContext } from "@/contexts/authContext";
import { useCheckedEnvContext } from "@/contexts/envContext";
import useFetchDataState from "@/hooks/useFetchDataState";
import IGenreState from "@/models/IGenreState";
import axios from "axios";
import { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { Snackbar, Button } from "@react-native-material/core";
import useDiscoverStore from "@/zustands/useDiscoverStore";
import { useGenresStore } from "@/zustands/useGenresStore";

const Parameters = () => {
  const authState = useSuccessfulAuthContext();
  const env = useCheckedEnvContext();
  const [retryGenres, setRetryGenres] = useState<number>(0);
  const [updatingGenres, setUpdatingGenres] = useState<boolean>(false);
  const [showSnackbar, setShowSnackbar] = useState<boolean>(false);

  const styles = getStyles(showSnackbar);

  const genresStatesFetchState = useFetchDataState<IGenreState[]>(
    env.apiUrl + env.genresEndpoint,
    retryGenres,
    authState.authToken
  );

  const saveUnselectedGenres = () => {
    setUpdatingGenres(true);
    const genresStates = useGenresStore.getState().genresStates;
    const unselectedGenres: string[] = [];
    for (const genre in genresStates) {
      const isSelected = genresStates[genre];
      if (!isSelected) {
        unselectedGenres.push(genre);
      }
    }
    console.log(unselectedGenres);

    axios
      .put(
        env.apiUrl + env.updatedGenresEndpoint,
        { unselectedGenres },
        {
          headers: { Authorization: "Bearer " + authState.authToken },
        }
      )
      .then(() => {
        setUpdatingGenres(false);
      })
      .catch((error) => {
        console.log("Error when updating genres", error);
        setUpdatingGenres(false);
        setShowSnackbar(true);
      });
  };

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
      <GradientButton
        text="Se déconnecter"
        onPress={authState.logOut}
        gradientColor="red"
      />
      <ScrollView
        style={styles.genresScrollView}
        contentContainerStyle={styles.genresContentContainer}
      >
        {genresStatesFetchState.data.map((genreState) => {
          return (
            <SelectableText
              text={genreState.genre}
              key={genreState.genre}
              initialState={genreState.isSelected}
            />
          );
        })}
      </ScrollView>
      <GradientButton text="Sauvegarder" onPress={saveUnselectedGenres} />
      <Snackbar
        message="La sauvegarde a échoué."
        action={
          <Button
            variant="text"
            title="Dismiss"
            color="#BB86FC"
            compact
            onPress={() => {
              setShowSnackbar(false);
            }}
          />
        }
        style={styles.snackbar}
      />
    </ScreenContainer>
  );
};

const getStyles = (showSnackbar: boolean) => {
  const styles = StyleSheet.create({
    genresScrollView: {},
    genresContentContainer: {
      paddingVertical: 10,
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-evenly",
      flexWrap: "wrap",
      rowGap: 10,
      gap: 0,
    },
    snackbar: {
      position: "absolute",
      start: 16,
      end: 16,
      bottom: 16,
      display: showSnackbar ? "flex" : "none",
    },
  });
  return styles;
};

export default Parameters;
