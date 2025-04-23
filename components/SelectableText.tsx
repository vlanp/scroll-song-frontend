import { Image, Pressable, StyleSheet, View } from "react-native";
import GradientText from "./GradientText";
import checked from "../assets/images/icons/checked.png";
import unchecked from "../assets/images/icons/unchecked.png";
import GradientButton from "./GradientButton";
import { useState } from "react";

const SelectableText = ({
  text,
  initialState,
  key,
}: {
  text: string;
  initialState: boolean;
  key?: string | undefined;
}) => {
  const [isSelected, setIsSelected] = useState<boolean>(initialState);
  const [height, setHeight] = useState<number>(0);

  const styles = getStyles(height, isSelected);
  return (
    <View
      style={styles.mainView}
      key={key}
      onLayout={(event) => {
        setHeight(event.nativeEvent.layout.height);
      }}
    >
      <GradientButton
        text={text}
        fontSize={16}
        style={styles.gradientButtonStyle}
        radius={10}
        paddingVertical={0}
        paddingHorizontal={10}
        height={50}
        onPress={() => setIsSelected((prev) => !prev)}
      />
      <Pressable
        style={styles.selectedPressable}
        onPress={() => setIsSelected((prev) => !prev)}
      >
        <Image
          source={isSelected ? checked : unchecked}
          style={styles.selectedImage}
        />
      </Pressable>
    </View>
  );
};

const getStyles = (height: number, isSelected: boolean) => {
  const styles = StyleSheet.create({
    mainView: {
      width: 140 + height,
    },
    gradientButtonStyle: {
      justifyContent: "center",
      width: 140,
    },
    selectedPressable: {
      position: "absolute",
      right: 0,
      zIndex: 1,
      width: height,
      height: "100%",
      backgroundColor: isSelected ? "#17ca40" : "#ca1e17",
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
