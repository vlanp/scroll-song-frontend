import * as FileSystem from "expo-file-system";
import { useState } from "react";
import { Pressable, Text, StyleSheet } from "react-native";

const Storage = () => {
  const [storageInfo, setStorageInfo] = useState<string[]>([]);

  const handleClick = () => {
    setStorageInfo([]);
    getStorageInfo();
  };

  const getStorageInfo = async (uri?: string) => {
    try {
      const documentDirectoryContent = await FileSystem.readDirectoryAsync(
        FileSystem.documentDirectory + (uri || "")
      );
      documentDirectoryContent.forEach(async (partialUri) => {
        setStorageInfo((storageInfo) => [
          ...storageInfo,
          (uri ? uri + "/" : "") + partialUri,
        ]);
        const isDirectory = (
          await FileSystem.getInfoAsync(
            FileSystem.documentDirectory + (uri ? uri + "/" : "") + partialUri
          )
        ).isDirectory;
        if (isDirectory) {
          getStorageInfo((uri ? uri + "/" : "") + partialUri);
        }
      });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <Pressable style={styles.storageButton} onPress={handleClick}>
        <Text>Récupérer les informations de stockage</Text>
      </Pressable>
      {storageInfo.map((uri, index) => {
        return <Text key={index}>{uri}</Text>;
      })}
    </>
  );
};

const styles = StyleSheet.create({
  storageButton: {
    borderWidth: 2,
    borderRadius: 50,
    width: 200,
    height: 60,
    paddingHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
});

export default Storage;
