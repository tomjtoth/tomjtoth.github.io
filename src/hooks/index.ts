import { useDispatch, useSelector, useStore } from "react-redux";
import type { AppDispatch, AppStore, RootState } from "../store";

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<AppStore>();

export { useBatteryManager } from "./battery-manager";
export { useBatMonDaemon } from "./battery-monitor-daemon";
export { useModal } from "./modal";
export { useNotify } from "./notifications";
export { useField } from "./useField";
