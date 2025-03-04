import { useContext } from "react";
import { useDispatch, useSelector, useStore } from "react-redux";

import type { AppDispatch, AppStore, RootState } from "../store";
import { CxModal } from "../components";

export * from "./battery-manager";
export * from "./battery-monitor-daemon";
export * from "./notifications";
export * from "./useField";
export * from "./files";
export * from "./spinner";

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<AppStore>();

export const useModal = () => useContext(CxModal)!;
