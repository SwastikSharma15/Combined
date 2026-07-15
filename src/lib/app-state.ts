import { create } from 'zustand'

export type AppName = 
  | "clock"
  | "settings"
  | "weather"
  | "calendar"
  | "camera"
  | "photos"
  | "notes"
  | "messages"
  | "safari"
  | "music"
  | "phone";

type AppState = {
  isLocked: boolean
  currentApp: AppName | string | null
  controlCenterOpen: boolean
  brightness: number
  openApp: (appId: AppName | string) => void
  closeApp: () => void
  lockDevice: () => void
  unlockDevice: () => void
  openControlCenter: () => void
  closeControlCenter: () => void
  setBrightness: (val: number) => void
}

export const useAppState = create<AppState>((set) => ({
  isLocked: false,
  currentApp: null,
  controlCenterOpen: false,
  brightness: 100,
  openApp: (appId) => set({ currentApp: appId }),
  closeApp: () => set({ currentApp: null }),
  lockDevice: () => set({ isLocked: true, currentApp: null }),
  unlockDevice: () => set({ isLocked: false }),
  openControlCenter: () => set({ controlCenterOpen: true }),
  closeControlCenter: () => set({ controlCenterOpen: false }),
  setBrightness: (val) => set({ brightness: val }),
}))
