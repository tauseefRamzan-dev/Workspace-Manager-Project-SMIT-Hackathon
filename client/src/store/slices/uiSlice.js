import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  theme: localStorage.getItem('theme') || 'light',
  sidebarOpen: true,
  currentView: 'kanban',
  searchQuery: '',
  filters: {
    status: [],
    priority: [],
    assignee: [],
    labels: [],
    dateRange: null,
  },
  sortBy: 'dueDate',
  groupBy: null,
  savedFilters: [],
  commandPaletteOpen: false,
  selectedTasks: [],
  projectViews: {},
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', state.theme);
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
      localStorage.setItem('theme', state.theme);
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    setCurrentView: (state, action) => {
      state.currentView = action.payload;
    },
    setProjectView: (state, action) => {
      const { projectId, view } = action.payload;
      state.projectViews[projectId] = view;
      state.currentView = view;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        status: [],
        priority: [],
        assignee: [],
        labels: [],
        dateRange: null,
      };
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    setGroupBy: (state, action) => {
      state.groupBy = action.payload;
    },
    saveFilter: (state, action) => {
      const { name, filter } = action.payload;
      state.savedFilters.push({ name, filter, id: `filter-${Date.now()}` });
    },
    applySavedFilter: (state, action) => {
      const saved = state.savedFilters.find(filter => filter.id === action.payload);
      if (saved) state.filters = { ...state.filters, ...saved.filter };
    },
    deleteFilter: (state, action) => {
      state.savedFilters = state.savedFilters.filter(f => f.id !== action.payload);
    },
    toggleCommandPalette: (state) => {
      state.commandPaletteOpen = !state.commandPaletteOpen;
    },
    toggleTaskSelection: (state, action) => {
      const taskId = action.payload;
      if (state.selectedTasks.includes(taskId)) {
        state.selectedTasks = state.selectedTasks.filter(id => id !== taskId);
      } else {
        state.selectedTasks.push(taskId);
      }
    },
    clearTaskSelection: (state) => {
      state.selectedTasks = [];
    },
    hydrateUI: (state, action) => {
      Object.assign(state, action.payload);
    },
  },
});

export const {
  toggleTheme,
  setTheme,
  toggleSidebar,
  setSidebarOpen,
  setCurrentView,
  setProjectView,
  setSearchQuery,
  setFilters,
  clearFilters,
  setSortBy,
  setGroupBy,
  saveFilter,
  applySavedFilter,
  deleteFilter,
  toggleCommandPalette,
  toggleTaskSelection,
  clearTaskSelection,
  hydrateUI,
} = uiSlice.actions;

export default uiSlice.reducer;
