import { IFavoritesCategory } from "@/models/IFavoritesCategory";
import { StyleSheet } from "react-native";
import CoversCarousel from "./CoversCarousel";
import { ScrollView } from "react-native-gesture-handler";

const MultiCarousel = ({
  favoritesCategories,
}: {
  favoritesCategories: IFavoritesCategory[];
}) => {
  const styles = getStyles();
  return (
    <ScrollView style={styles.mainView}>
      {favoritesCategories.map((favoritesCategory) => (
        <CoversCarousel
          key={favoritesCategory.category}
          categoryTitle={favoritesCategory.category}
          sounds={favoritesCategory.sounds}
        />
      ))}
    </ScrollView>
  );
};

const getStyles = () => {
  const styles = StyleSheet.create({
    mainView: {
      flex: 1,
    },
  });
  return styles;
};

export default MultiCarousel;
