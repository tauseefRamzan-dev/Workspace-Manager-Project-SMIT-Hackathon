import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import workspaceReducer from './slices/workspaceSlice';
import projectReducer from './slices/projectSlice';
import taskReducer from './slices/taskSlice';
import uiReducer from './slices/uiSlice';
import notificationReducer from './slices/notificationSlice';
import activityReducer from './slices/activitySlice';
import { addActivity } from './slices/activitySlice';
import { createListenerMiddleware } from '@reduxjs/toolkit';

const activityMiddleware = createListenerMiddleware();

export const store = configureStore({
  reducer: {
    auth: authReducer,
    workspace: workspaceReducer,
    project: projectReducer,
    task: taskReducer,
    ui: uiReducer,
    notification: notificationReducer,
    activity: activityReducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().prepend(activityMiddleware.middleware),
});

activityMiddleware.startListening({
  predicate: action => action.type.startsWith('task/') && !action.type.endsWith('hydrateTasks'),
  effect: (action, listenerApi) => {
    const state = listenerApi.getState();
    const user = state.auth.currentUser;
    const taskId = action.payload?.id || action.payload?.taskId || action.payload;
    listenerApi.dispatch(addActivity({
      type: action.type.replace('task/', ''),
      description: `${action.type.replace('task/', '').replace(/[A-Z]/g, letter => ` ${letter.toLowerCase()}`)} task activity`,
      user,
      relatedId: taskId,
      scope: 'task',
    }));
  },
});

export default store;
