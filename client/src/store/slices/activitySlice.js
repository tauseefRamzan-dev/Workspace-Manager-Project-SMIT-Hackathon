import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activities: [],
};

const activitySlice = createSlice({
  name: 'activity',
  initialState,
  reducers: {
    addActivity: (state, action) => {
      const activity = {
        id: `activity-${Date.now()}`,
        type: action.payload.type,
        description: action.payload.description,
        user: action.payload.user,
        relatedId: action.payload.relatedId,
        scope: action.payload.scope,
        timestamp: new Date().toISOString(),
        metadata: action.payload.metadata || {},
      };
      state.activities.unshift(activity);
      if (state.activities.length > 1000) {
        state.activities = state.activities.slice(0, 1000);
      }
    },
    filterActivities: (state) => {
      return state;
    },
    clearActivities: (state) => {
      state.activities = [];
    },
    hydrateActivities: (state, action) => {
      state.activities = action.payload || [];
    },
  },
});

export const {
  addActivity,
  filterActivities,
  clearActivities,
  hydrateActivities,
} = activitySlice.actions;

export default activitySlice.reducer;
