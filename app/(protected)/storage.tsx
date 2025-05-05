import ErrorScreen from "../../components/ErrorScreen";
import GradientText from "../../components/GradientText";
import LottieLoadingScreen from "../../components/LottieLoading";
import ScreenContainer from "../../components/ScreenContainer";
import ScreenTitle from "../../components/ScreenTitle";
import { useCheckedEnvContext } from "../../contexts/envContext";
import { IDocInfo } from "../../models/IDocInfo";
import {
  fetchDataError,
  fetchDataIdle,
  fetchDataLoading,
  FetchDataSuccess,
  IFetchDataState,
} from "../../models/IFetchDataState";
import { useIsFocused } from "@react-navigation/native";
import * as FileSystem from "expo-file-system";
import { useEffect, useState } from "react";
import { Text, StyleSheet, ScrollView, View } from "react-native";

const StorageScreen = () => {
  const [retryStorage, setRetryStorage] = useState<number>(0);
  const isFocused = useIsFocused();
  const [documentsInfosState, setDocumentsInfosState] =
    useState<IFetchDataState<IDocInfo[]>>(fetchDataIdle);
  const env = useCheckedEnvContext();

  useEffect(() => {
    if (!isFocused) {
      return;
    }
    const getDocumentsInfos = async () => {
      try {
        setDocumentsInfosState(fetchDataLoading);

        const foldersUris = [env.excerptDirectory, env.favoritesDirectory];
        const documentsInfos: IDocInfo[] = [];
        for (const folderUri of foldersUris) {
          let documentDirectoryContent: string[];
          try {
            documentDirectoryContent = await FileSystem.readDirectoryAsync(
              FileSystem.documentDirectory + (folderUri || "")
            );
          } catch {
            documentDirectoryContent = [];
          }
          for (const docName of documentDirectoryContent) {
            const fullUri =
              FileSystem.documentDirectory +
              (folderUri ? folderUri + "/" : "") +
              docName;
            const infos = await FileSystem.getInfoAsync(fullUri);
            if (infos.exists) {
              const size = infos.size;
              documentsInfos.push({
                folder: folderUri || "",
                docName: docName,
                sizeMo: Math.round((size / 1_000_000) * 100) / 100,
              });
            }
          }
        }
        setDocumentsInfosState(new FetchDataSuccess(documentsInfos));
      } catch (e) {
        setDocumentsInfosState(fetchDataError);
        console.log(
          "An error occured while trying to retrieve documents infos from storage.",
          e
        );
      }
    };
    getDocumentsInfos();
  }, [env.excerptDirectory, env.favoritesDirectory, retryStorage, isFocused]);

  if (
    documentsInfosState.status === "fetchDataLoading" ||
    documentsInfosState.status === "fetchDataIdle"
  ) {
    return <LottieLoadingScreen />;
  }

  if (
    documentsInfosState.status === "fetchDataError" ||
    !documentsInfosState.data
  ) {
    return (
      <ErrorScreen
        errorText="Une erreur inconnue est survenue lors du chargement de la page. Merci de
        réessayer ultérieurement."
        onRetry={() => setRetryStorage((p) => p++)}
      />
    );
  }

  return (
    <ScreenContainer>
      <ScreenTitle
        title={"Stockage"}
        baseline={
          "Taille totale : " +
          Math.round(
            documentsInfosState.data
              .map((v) => v.sizeMo)
              .reduce((acc, cv) => acc + cv, 0) * 100
          ) /
            100 +
          " Mo"
        }
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainerStyle}
      >
        <GradientText text="Extraits musicaux" fontSize={24} height={40} />
        <Text style={styles.categorySize}>
          {"Taille totale catégorie : " +
            Math.round(
              documentsInfosState.data
                .filter((docInfo) => docInfo.folder === env.excerptDirectory)
                .map((v) => v.sizeMo)
                .reduce((acc, cv) => acc + cv, 0) * 100
            ) /
              100 +
            " Mo"}
        </Text>
        <View style={styles.column}>
          <Text style={[styles.columnTitle, styles.fileNameTitle]}>
            Nom du fichier
          </Text>
          <Text style={[styles.columnTitle, styles.sizeTitle]}>Taille</Text>
        </View>
        {documentsInfosState.data
          .filter((docInfo) => docInfo.folder === env.excerptDirectory)
          .map((docInfo) => {
            return (
              <View key={docInfo.docName} style={styles.column}>
                <Text style={[styles.storageDoc, styles.fileNameTitle]}>
                  {docInfo.docName}
                </Text>
                <Text style={[styles.storageDoc, styles.sizeTitle]}>
                  {docInfo.sizeMo + " Mo"}
                </Text>
              </View>
            );
          })}
        <GradientText text="Favoris" fontSize={24} height={40} />
        <Text style={styles.categorySize}>
          {"Taille totale catégorie : " +
            Math.round(
              documentsInfosState.data
                .filter((docInfo) => docInfo.folder === env.favoritesDirectory)
                .map((v) => v.sizeMo)
                .reduce((acc, cv) => acc + cv, 0) * 100
            ) /
              100 +
            " Mo"}
        </Text>
        <View style={styles.column}>
          <Text style={[styles.columnTitle, styles.fileNameTitle]}>
            Nom du fichier
          </Text>
          <Text style={[styles.columnTitle, styles.sizeTitle]}>Taille</Text>
        </View>
        {documentsInfosState.data
          .filter((docInfo) => docInfo.folder === env.favoritesDirectory)
          .map((docInfo) => {
            return (
              <View key={docInfo.docName} style={styles.column}>
                <Text style={[styles.storageDoc, styles.fileNameTitle]}>
                  {docInfo.docName}
                </Text>
                <Text style={[styles.storageDoc, styles.sizeTitle]}>
                  {docInfo.sizeMo + " Mo"}
                </Text>
              </View>
            );
          })}
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    marginTop: 20,
  },
  contentContainerStyle: {
    gap: 10,
  },
  storageDoc: {
    color: "white",
    textAlign: "center",
  },
  categorySize: {
    fontFamily: "Poppins-SemiBold",
    color: "white",
    fontSize: 16,
  },
  columnTitle: {
    color: "white",
    fontFamily: "Poppins-Bold",
    fontSize: 18,
    textAlign: "center",
  },
  fileNameTitle: {
    flex: 2,
  },
  sizeTitle: {
    flex: 1,
  },
  column: {
    flexDirection: "row",
  },
});

export default StorageScreen;
