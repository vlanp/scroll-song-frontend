import { create } from "zustand";

type IStorageState = IStorageOk | IStorageError;

interface IStorageOk {
  status: "storageOk";
}
const storageOk: IStorageOk = {
  status: "storageOk",
};
interface IStorageError {
  status: "storageError";
}
const storageError: IStorageError = {
  status: "storageError",
};

interface IStorageAction {
  setStorageState: (storageState: IStorageState) => void;
}

const useStorageStore = create<
  { storageState: IStorageState } & IStorageAction
>((set) => ({
  storageState: storageOk,
  setStorageState: (storageState: IStorageState) =>
    set(() => ({ storageState })),
}));

export default useStorageStore;
export type { IStorageState, IStorageOk, IStorageError };
export { storageOk, storageError };
