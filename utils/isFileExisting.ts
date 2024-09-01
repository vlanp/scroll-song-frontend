import * as FileSystem from "expo-file-system";

const isFileExisting = async (fileName: string) => {
  const fileInfo = await FileSystem.getInfoAsync(
    FileSystem.documentDirectory + fileName
  );

  if (fileInfo.exists) {
    return true;
  }

  return false;
};

export default isFileExisting;
