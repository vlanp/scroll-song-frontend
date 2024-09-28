import { Dispatch, ReactNode, SetStateAction } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";

export default function Modal({
  children,
  modalVisible,
  setModalVisible,
  closeButton = false,
  image = false,
  zIndex = 1,
}: {
  children: ReactNode;
  modalVisible: boolean;
  setModalVisible?: Dispatch<SetStateAction<boolean>>;
  closeButton?: boolean;
  image?: boolean;
  zIndex?: 1 | 3;
}) {
  const styles = useStyle(zIndex);
  return (
    <View style={modalVisible ? styles.modal : [styles.modal, styles.display]}>
      <View style={!image ? styles.modalContainer : styles.modalContainerImage}>
        <>
          {closeButton && setModalVisible && (
            <Pressable
              onPress={() => {
                setModalVisible(!modalVisible);
              }}
              style={styles.closeButton}
            >
              <Image
                source={require("@/assets/images/modalIcons/close.png")}
                style={styles.image}
                resizeMode="contain"
              />
            </Pressable>
          )}
        </>
        {children}
      </View>
    </View>
  );
}
const useStyle = (zIndex: 1 | 3) => {
  const { height } = useWindowDimensions();
  const styles = StyleSheet.create({
    modal: {
      height: height * 2,
      width: "100%",
      position: "absolute",
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      paddingHorizontal: 50,
      alignItems: "center",
      zIndex: zIndex,
    },
    modalContainer: {
      backgroundColor: "#fff",
      borderRadius: 20,
      padding: 10,
      gap: 5,
      maxHeight: height * 0.6,
      marginTop: (height - height * 0.7) / 4,
    },
    modalContainerImage: {
      borderRadius: 20,
      gap: 5,
      maxHeight: height * 0.7,
      marginTop: (height - height * 0.7) / 4,
    },
    display: {
      display: "none",
    },
    closeButton: {
      alignSelf: "flex-end",
      paddingTop: 5,
      paddingRight: 5,
    },
    image: {
      width: 15,
      height: 15,
    },
  });
  return styles;
};
