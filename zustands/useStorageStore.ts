import { create } from "zustand";

interface IStorageStoreStates {
  isStorageOk: boolean;
}

interface IStorageActions {
  setIsStorageOk: (isStorageOk: boolean) => void;
}

const useStorageStore = create<IStorageStoreStates & IStorageActions>(
  (set) => ({
    isStorageOk: true,
    setIsStorageOk: (isStorageOk: boolean) => set(() => ({ isStorageOk })),
  })
);

export default useStorageStore;
