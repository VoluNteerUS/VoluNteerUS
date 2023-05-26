// Redux Store
// Description: Redux store for the application
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'reduxjs-toolkit-persist';
import storage from 'reduxjs-toolkit-persist/lib/storage';
import rootReducer from './reducers/rootReducer';
import thunk from 'redux-thunk'

const persistConfig = {
    key: 'root',
    storage,
};

const _persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: _persistedReducer,
    middleware: [thunk]
});
export const persistor = persistStore(store);