import arrayShuffle from "array-shuffle";
import DiscoverSound from "../../models/DiscoverSound";

const handleReceivedData = (songs: DiscoverSound[]) => {
  return arrayShuffle(songs);
};

export default handleReceivedData;
