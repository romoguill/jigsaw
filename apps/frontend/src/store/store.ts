import { FullScreenHandle } from "react-full-screen";
import { create } from "zustand";

interface GameStore {
  isFullScreen: boolean;
  toggleFullScreen: (handle: FullScreenHandle) => void;
  timer: number;
  isTimerRunning: boolean;
  setTimer: (timer: number) => void;
  resumeTimer: () => void;
  pauseTimer: () => void;
}

const useGameStore = create<GameStore>((set) => ({
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
  timer: 0,
  isTimerRunning: true,
  setTimer: (timer: number) => {
    set({ timer });
  },
  resumeTimer: () => {
    set(() => ({
      isTimerRunning: true,
    }));
  },
  pauseTimer: () => {
    set(() => ({
      isTimerRunning: false,
    }));
  },
}));

export default useGameStore;
