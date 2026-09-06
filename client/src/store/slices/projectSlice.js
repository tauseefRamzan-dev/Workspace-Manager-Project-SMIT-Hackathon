import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  projects: [],
  loading: false,
};

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    createProject: (state, action) => {
      const newProject = {
        id: action.payload.id || `project-${Date.now()}`,
        workspaceId: action.payload.workspaceId,
        name: action.payload.name,
        description: action.payload.description || '',
        color: action.payload.color || '#9b59b6',
        icon: action.payload.icon || '📦',
        status: 'active',
        members: action.payload.members || [],
        template: action.payload.template || 'blank',
        columns: action.payload.columns || [
          { id: 'todo', title: 'To Do', color: '#95a5a6' },
          { id: 'in-progress', title: 'In Progress', color: '#3498db' },
          { id: 'in-review', title: 'In Review', color: '#f39c12' },
          { id: 'done', title: 'Done', color: '#27ae60' },
        ],
        createdAt: new Date().toISOString(),
      };
      state.projects.push(newProject);
    },
    updateProject: (state, action) => {
      const { id, updates } = action.payload;
      const project = state.projects.find(p => p.id === id);
      if (project) {
        Object.assign(project, updates);
      }
    },
    updateProjectColumns: (state, action) => {
      const project = state.projects.find(item => item.id === action.payload.projectId);
      if (project) project.columns = action.payload.columns;
    },
    deleteProject: (state, action) => {
      state.projects = state.projects.filter(p => p.id !== action.payload);
    },
    archiveProject: (state, action) => {
      const project = state.projects.find(p => p.id === action.payload);
      if (project) {
        project.status = 'archived';
      }
    },
    addMemberToProject: (state, action) => {
      const { projectId, member } = action.payload;
      const project = state.projects.find(p => p.id === projectId);
      if (project && !project.members.find(m => m.id === member.id)) {
        project.members.push(member);
      }
    },
    removeMemberFromProject: (state, action) => {
      const { projectId, memberId } = action.payload;
      const project = state.projects.find(p => p.id === projectId);
      if (project) {
        project.members = project.members.filter(m => m.id !== memberId);
      }
    },
    hydrateProjects: (state, action) => {
      state.projects = action.payload || [];
    },
  },
});

export const {
  createProject,
  updateProject,
  updateProjectColumns,
  deleteProject,
  archiveProject,
  addMemberToProject,
  removeMemberFromProject,
  hydrateProjects,
} = projectSlice.actions;

export default projectSlice.reducer;
