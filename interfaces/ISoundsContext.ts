import { Dispatch, SetStateAction } from "react";
import IDiscoverSound from "./IDiscoverSound";

interface ISoundsContext {
  isLoading: boolean;
  error: unknown;
  data: IDiscoverSound[];
}

export default ISoundsContext;
