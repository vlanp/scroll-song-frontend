import IDiscoverSound from "./IDiscoverSound";

type ISoundsState = ISoundsIdle | ISoundsLoading | ISoundsError | SoundsSuccess;

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
}

const soundsError: ISoundsError = {
  status: "soundsError",
};

class SoundsSuccess {
  status = "soundsSuccess";
  sounds: IDiscoverSound[];

  constructor(sounds: IDiscoverSound[]) {
    this.sounds = sounds;
  }
}

export type {
  ISoundsState,
  ISoundsError,
  ISoundsLoading,
  SoundsSuccess,
  ISoundsIdle,
};

export { soundsIdle, soundsLoading, soundsError };
