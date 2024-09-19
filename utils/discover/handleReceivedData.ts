import arrayShuffle from "array-shuffle";
import IDiscoverSound from "../../interfaces/IDiscoverSound";

const handleReceivedData = (songs: IDiscoverSound[]) => {
  return arrayShuffle(songs);
};

export default handleReceivedData;
