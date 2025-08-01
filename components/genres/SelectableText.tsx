import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import checked from "../../assets/images/icons/checked.png";
import unchecked from "../../assets/images/icons/unchecked.png";
import GradientButton from "../GradientButton";
import { useEffect, useState } from "react";
import { useGenresStore } from "../../zustands/useGenresStore";

const SelectableText = ({
  text,
  initialState,
  disabled = false,
}: {
  text: string;
  initialState: boolean;
  disabled?: boolean;
}) => {
  const isSelected = useGenresStore((state) => state.genresStates[text]);
  const setIsSelected = useGenresStore((state) => state.setGenreState);
  const [height, setHeight] = useState<number>(0);

  useEffect(() => {
    setIsSelected(text, initialState);
  }, [initialState, setIsSelected, text]);

  if (isSelected === undefined) {
    <ActivityIndicator />;
  }

  const styles = getStyles(height, isSelected, disabled);
  return (
    <View
      style={styles.mainView}
      onLayout={(event) => {
        setHeight(event.nativeEvent.layout.height);
      }}
    >
      <GradientButton
        text={text}
        fontSize={14}
        style={styles.gradientButtonStyle}
        radius={10}
        paddingVertical={0}
        paddingHorizontal={10}
        height={50}
        onPress={() => setIsSelected(text)}
        disabled={disabled}
      />
      <Pressable
        style={styles.selectedPressable}
        onPress={() => setIsSelected(text)}
        disabled={disabled}
      >
        {!disabled && (
          <Image
            source={isSelected ? checked : unchecked}
            style={styles.selectedImage}
          />
        )}
      </Pressable>
    </View>
  );
};

const getStyles = (height: number, isSelected: boolean, disabled: boolean) => {
  const width = 120;
  const styles = StyleSheet.create({
    mainView: {
      width: width + height,
    },
    gradientButtonStyle: {
      justifyContent: "center",
      width: width,
    },
    selectedPressable: {
      position: "absolute",
      right: 0,
      zIndex: 1,
      width: height,
      height: "100%",
      backgroundColor: isSelected ? "#17ca40" : "#ca1e17",
      opacity: disabled ? 0.7 : 1,
      borderRadius: 10,
    },
    selectedImage: {
      width: "100%",
      height: "100%",
    },
  });
  return styles;
};

export default SelectableText;
