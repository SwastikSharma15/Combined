import { immer } from "zustand/middleware/immer";
import { create } from "zustand";
import { INITIAL_Z_INDEX, WINDOW_CONFIG } from "#constants";

export type WindowKey = keyof typeof WINDOW_CONFIG;

export interface WindowState {
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  data: any;
}

interface WindowStoreState {
  windows: Record<WindowKey, WindowState>;
  nextZIndex: number;
  openWindow: (windowKey: WindowKey, data?: any) => void;
  closeWindow: (windowKey: WindowKey) => void;
  focusWindow: (windowKey: WindowKey) => void;
  toggleMaximizeWindow: (windowKey: WindowKey) => void;
}

const useWindowStore = create<WindowStoreState>()(
  immer((set) => ({
    windows: WINDOW_CONFIG as Record<WindowKey, WindowState>,
    nextZIndex: INITIAL_Z_INDEX + 1,
    openWindow: (windowKey, data = null) => set((state) => {
      const win = state.windows[windowKey];
      if (!win) return;
      win.isOpen = true;
      win.zIndex = state.nextZIndex++;
      win.data = data ?? win.data;
    }),
    closeWindow: (windowKey) => set((state) => {
      const win = state.windows[windowKey];
      if (!win) return;
      win.isOpen = false;
      win.isMaximized = false;
      win.zIndex = INITIAL_Z_INDEX;
      win.data = null;
    }),
    focusWindow: (windowKey) => set((state) => {
      const win = state.windows[windowKey];
      if (!win) return;
      win.zIndex = state.nextZIndex++;
    }),
    toggleMaximizeWindow: (windowKey) => set((state) => {
      const win = state.windows[windowKey];
      if (!win) return;
      win.isMaximized = !win.isMaximized;
      // bring to front when maximizing
      if (win.isMaximized) {
        win.zIndex = state.nextZIndex++;
      }
    }),
  }))
);

export default useWindowStore;