import arrayShuffle from "array-shuffle";
import IDiscoverSound from "../../models/DiscoverSound";

const handleReceivedData = (songs: IDiscoverSound[]) => {
  return arrayShuffle(songs);
};

export default handleReceivedData;
