import * as FileSystem from "expo-file-system";

const isFileExisting = async (fileName: string, directory?: string) => {
  const fileInfo = await FileSystem.getInfoAsync(
    FileSystem.documentDirectory + (directory ? directory + "/" : "") + fileName
  );

  if (fileInfo.exists) {
    return true;
  }

  return false;
};

export default isFileExisting;
