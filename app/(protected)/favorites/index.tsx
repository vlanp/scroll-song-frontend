import ErrorScreen from "../../../components/ErrorScreen";
import MultiCarousel from "../../../components/favorites/MultiCarousel";
import LottieLoadingScreen from "../../../components/LottieLoading";
import ScreenContainer from "../../../components/ScreenContainer";
import ScreenTitle from "../../../components/ScreenTitle";
import { useSuccessfulAuthContext } from "../../../contexts/authContext";
import { useCheckedEnvContext } from "../../../contexts/envContext";
import useFetchDataState from "../../../hooks/useFetchDataState";
import { IFavoritesCategory } from "../../../models/IFavoritesCategory";
import { LikedSound } from "../../../models/LikedSound";
import handleReceivedData from "../../../utils/favorites/handleReceivedData";
import { useFavoritesStore } from "../../../zustands/useFavoritesStore";
import { useState } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { StyleSheet, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";

export const SortedByValues = {
  ARTISTS: "Artists",
  GENRES: "Genres",
} as const;

type ISortingBy = (typeof SortedByValues)[keyof typeof SortedByValues];

const FavoritesScreen = () => {
  const env = useCheckedEnvContext();
  const authState = useSuccessfulAuthContext();
  const updateTick = useFavoritesStore((state) => state.updateTick);
  const [sortingBy, setSortingBy] = useState<ISortingBy>("Genres");

  const [retryFavorites, setRetryFavorites] = useState<number>(0);

  const fetchFavoritesSoundsState = useFetchDataState<LikedSound[]>(
    env.apiUrl + env.favoritesEndpoint,
    retryFavorites + updateTick,
    authState.authToken,
    handleReceivedData
  );

  if (
    fetchFavoritesSoundsState.status === "fetchDataLoading" ||
    fetchFavoritesSoundsState.status === "fetchDataIdle"
  ) {
    return <LottieLoadingScreen />;
  }

  if (
    fetchFavoritesSoundsState.status === "fetchDataError" ||
    !fetchFavoritesSoundsState.data
  ) {
    return (
      <ErrorScreen
        errorText="Une erreur inconnue est survenue lors du chargement de la page. Merci de
        réessayer ultérieurement."
        onRetry={() => setRetryFavorites((p) => p++)}
      />
    );
  }

  if (fetchFavoritesSoundsState.data.length === 0) {
    return (
      <ErrorScreen
        errorText="Vous n'avez pas encore de musique en favoris. Ajoutez en depuis l'onglet découverte pour les voir apparaitre ici !"
        onRetry={() => setRetryFavorites((p) => p++)}
      />
    );
  }

  const categories = fetchFavoritesSoundsState.data
    .flatMap((likedSound) => {
      switch (sortingBy) {
        case "Genres":
          return likedSound.genres;
        case "Artists":
          return likedSound.artist;
      }
    })
    .distinct();
  const favoritesCategories: IFavoritesCategory[] = categories.map(
    (category) => {
      switch (sortingBy) {
        case "Genres":
          return {
            category,
            sounds: fetchFavoritesSoundsState.data.filter((likedSound) =>
              likedSound.genres.includes(category)
            ),
          };
        case "Artists":
          return {
            category,
            sounds: fetchFavoritesSoundsState.data.filter(
              (likedSound) => likedSound.artist === category
            ),
          };
      }
    }
  );

  return (
    <ScreenContainer>
      <ScreenTitle title="Favoris" />
      <Dropdown
        value={sortingBy}
        onChange={(item) => setSortingBy(item.value)}
        style={styles.dropdown}
        data={Object.values(SortedByValues).map((sortedByValue) => ({
          label: sortedByValue,
          value: sortedByValue,
        }))}
        labelField={"label"}
        valueField={"value"}
        selectedTextStyle={styles.selectedTextStyle}
        itemTextStyle={styles.itemTextStyle}
        containerStyle={styles.containerStyle}
        itemContainerStyle={styles.itemContainerStyle}
        activeColor={"gray"}
        renderLeftIcon={() => (
          <View style={styles.iconView}>
            <MaterialIcons name="category" size={30} color="white" />
          </View>
        )}
      />
      <MultiCarousel favoritesCategories={favoritesCategories} />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  dropdown: {
    borderColor: "white",
    borderWidth: 2,
    borderRadius: 10,
    paddingVertical: 10,
    backgroundColor: "gray",
    fontSize: 18,
    fontFamily: "Poppins-Bold",
    display: "flex",
    justifyContent: "center",
    margin: 20,
  },
  selectedTextStyle: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
    color: "white",
    alignItems: "flex-start",
    flex: 1.2,
    paddingHorizontal: 5,
  },
  containerStyle: {
    borderRadius: 10,
    backgroundColor: "gray",
    borderColor: "white",
    borderWidth: 2,
  },
  itemContainerStyle: {
    borderRadius: 10,
  },
  itemTextStyle: {
    textAlign: "center",
    color: "white",
    fontFamily: "Poppins-SemiBold",
  },
  iconView: {
    flex: 1,
    alignItems: "flex-end",
    paddingHorizontal: 5,
  },
});

export default FavoritesScreen;
