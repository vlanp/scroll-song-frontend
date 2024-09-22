import * as FileSystem from "expo-file-system";
import { useState } from "react";
import { Pressable, Text, StyleSheet, View, ScrollView } from "react-native";

const Storage = () => {
  const [documentStorageInfo, setDocumentStorageInfo] = useState<string[]>([]);
  const [cacheStorageInfo, setCacheStorageInfo] = useState<string[]>([]);

  const handleClick = () => {
    setDocumentStorageInfo([]);
    getDocumentStorageInfo();
  };

  const getDocumentStorageInfo = async (uri?: string) => {
    try {
      const documentDirectoryContent = await FileSystem.readDirectoryAsync(
        FileSystem.documentDirectory + (uri || "")
      );
      documentDirectoryContent.forEach(async (partialUri) => {
        setDocumentStorageInfo((storageInfo) => [
          ...storageInfo,
          (uri ? uri + "/" : "") + partialUri,
        ]);
        const isDirectory = (
          await FileSystem.getInfoAsync(
            FileSystem.documentDirectory + (uri ? uri + "/" : "") + partialUri
          )
        ).isDirectory;
        if (isDirectory) {
          getDocumentStorageInfo((uri ? uri + "/" : "") + partialUri);
        }
      });
    } catch (e) {
      console.log(e);
    }
  };

  const getCacheStorageInfo = async (uri?: string) => {
    try {
      const cacheDirectoryContent = await FileSystem.readDirectoryAsync(
        FileSystem.cacheDirectory + (uri || "")
      );
      cacheDirectoryContent.forEach(async (partialUri) => {
        setCacheStorageInfo((storageInfo) => [
          ...storageInfo,
          (uri ? uri + "/" : "") + partialUri,
        ]);
        const isDirectory = (
          await FileSystem.getInfoAsync(
            FileSystem.cacheDirectory + (uri ? uri + "/" : "") + partialUri
          )
        ).isDirectory;
        if (isDirectory) {
          getCacheStorageInfo((uri ? uri + "/" : "") + partialUri);
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
      <ScrollView>
        {documentStorageInfo.map((uri, index) => {
          return <Text key={index}>{uri}</Text>;
        })}
        <View style={styles.blackView} />
        {cacheStorageInfo.map((uri, index) => {
          return <Text key={index}>{uri}</Text>;
        })}
      </ScrollView>
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
  blackView: {
    backgroundColor: "black",
    height: 20,
  },
});

export default Storage;
