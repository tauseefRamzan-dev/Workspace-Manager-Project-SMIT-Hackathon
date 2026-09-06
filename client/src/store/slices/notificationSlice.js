import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  notifications: [],
  unreadCount: 0,
  preferences: {
    assignedToTask: true,
    mentionedInComment: true,
    dueDateApproaching: true,
  },
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    addNotification: (state, action) => {
      const notification = {
        id: `notif-${Date.now()}`,
        type: action.payload.type,
        message: action.payload.message,
        relatedId: action.payload.relatedId,
        read: false,
        createdAt: new Date().toISOString(),
      };
      state.notifications.unshift(notification);
      state.unreadCount += 1;
    },
    markAsRead: (state, action) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification && !notification.read) {
        notification.read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    markAllAsRead: (state) => {
      state.notifications.forEach(n => {
        n.read = true;
      });
      state.unreadCount = 0;
    },
    deleteNotification: (state, action) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification && !notification.read) {
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearAllNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
    },
    setNotificationPreference: (state, action) => {
      const { type, enabled } = action.payload;
      state.preferences[type] = enabled;
      localStorage.setItem('notificationPreferences', JSON.stringify(state.preferences));
    },
    hydrateNotifications: (state, action) => {
      state.notifications = action.payload.notifications || [];
      state.preferences = action.payload.preferences || state.preferences;
      state.unreadCount = state.notifications.filter(n => !n.read).length;
    },
  },
});

export const {
  addNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
  setNotificationPreference,
  hydrateNotifications,
} = notificationSlice.actions;

export default notificationSlice.reducer;
