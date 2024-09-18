import arrayShuffle from "array-shuffle";
import IDiscoverSong from "../../interfaces/IDiscoverSong";

const handleReceivedData = (songs: IDiscoverSong[]) => {
  return arrayShuffle(songs);
};

export default handleReceivedData;
