import { configureStore, combineReducers } from '@reduxjs/toolkit';
import projectReducer from './slices/projectSlice';
import targetReducer from './slices/targetSlice';
import taskReducer from './slices/taskSlice';
import noteReducer from './slices/noteSlice';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { createFilter } from 'redux-persist-transform-filter';

const projectFilter = createFilter('project', ['selectedProjectView', 'selectedProject']);

export type RootState = ReturnType<typeof rootReducer>;

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['project', 'target', 'task', 'note'],
  transforms: [projectFilter],
};

const rootReducer = combineReducers({
  project: projectReducer,
  target: targetReducer,
  task: taskReducer,
  note: noteReducer,
});

const persistedReducer = persistReducer<ReturnType<typeof rootReducer>>(persistConfig, rootReducer);


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

export type AppDispatch = typeof store.dispatch;
