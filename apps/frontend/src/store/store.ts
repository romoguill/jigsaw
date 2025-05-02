import { FullScreenHandle } from "react-full-screen";
import { create } from "zustand";

interface GameStore {
  isFullScreen: boolean;
  toggleFullScreen: (handle: FullScreenHandle) => void;
}

const useStore = create<GameStore>((set) => ({
  isFullScreen: false,
  toggleFullScreen: (handle: FullScreenHandle) => {
    if (handle.active) {
      handle.exit();
    } else {
      handle.enter();
    }

    set((state) => ({
      isFullScreen: !state.isFullScreen,
    }));
  },
}));

export default useStore;
