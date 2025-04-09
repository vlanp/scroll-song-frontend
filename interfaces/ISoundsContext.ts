import { Dispatch, SetStateAction } from "react";
import IDiscoverSound from "./IDiscoverSound";

type ISounds = ISoundsIdle | ISoundsLoading | ISoundsError | ISoundsSuccess;

interface ISoundsIdle {
  status: "soundsIdle";
}

const soundsIdle: ISoundsIdle = {
  status: "soundsIdle",
};

interface ISoundsLoading {
  status: "soundsLoading";
}

const soundsLoading: ISoundsLoading = {
  status: "soundsLoading",
};

interface ISoundsError {
  status: "soundsError";
  error: string | null;
}

const soundsError: ISoundsError = {
  status: "soundsError",
  error: null,
};

interface ISoundsSuccess {
  status: "soundsSuccess";
  sounds: IDiscoverSound[];
  setSounds: Dispatch<SetStateAction<IDiscoverSound[]>>;
}

export type {
  ISounds,
  ISoundsError,
  ISoundsLoading,
  ISoundsSuccess,
  ISoundsIdle,
};

export { soundsIdle, soundsLoading, soundsError };
