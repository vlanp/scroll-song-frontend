import { Dispatch, SetStateAction } from "react";
import IDiscoverSong from "./IDiscoverSong";

interface ISoundsContext {
  isLoading: boolean;
  error: unknown;
  data: IDiscoverSong[];
  setData: Dispatch<SetStateAction<IDiscoverSong[]>>;
}

export default ISoundsContext;
