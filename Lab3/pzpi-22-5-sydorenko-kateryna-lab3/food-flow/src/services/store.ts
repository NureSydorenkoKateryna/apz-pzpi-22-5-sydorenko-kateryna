import { combineSlices, configureStore, createListenerMiddleware } from '@reduxjs/toolkit';
import productSlice from './products/slice';

const listenerMiddleware = createListenerMiddleware();

const rootReducers = combineSlices({
    [productSlice.name]: productSlice.reducer,
});

export const store = configureStore({
  reducer: rootReducers,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: getDefaultMiddleware => getDefaultMiddleware().prepend(listenerMiddleware.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
