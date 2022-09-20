import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import storage from "redux-persist/lib/storage";
import loadIFCReducer from "./loadSlice";
import jobReducer from "./jobSlice";
import extensionReducer from "./extensionSlice";
import storageReducer from "./storageSlice";
const reducer = {
	loadIFC: loadIFCReducer,
	job: jobReducer,
	extension: extensionReducer,
	storageIfcModelData: storageReducer,
};
const appReducer = combineReducers(reducer);
const persistConfig = {
	key: "root",
	version: 1,
	storage,
	whitelist: ["storageIfcModelData"],
};
const rootReducer = (state, action) => {
	return appReducer(state, action);
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
			},
		}),
});
export const persistor = persistStore(store);
