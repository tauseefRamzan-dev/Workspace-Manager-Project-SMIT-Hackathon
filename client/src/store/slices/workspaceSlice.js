import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  workspaces: [],
  currentWorkspaceId: null,
  loading: false,
};

const workspaceSlice = createSlice({
  name: 'workspace',
  initialState,
  reducers: {
    createWorkspace: (state, action) => {
      const newWorkspace = {
        id: `workspace-${Date.now()}`,
        name: action.payload.name,
        icon: action.payload.icon || '📋',
        color: action.payload.color || '#3498db',
        description: action.payload.description || '',
        members: (action.payload.members || []).map(member => ({ ...member, role: member.role || 'owner' })),
        createdAt: new Date().toISOString(),
        settings: {
          defaultView: 'kanban',
          theme: 'light',
        },
      };
      state.workspaces.push(newWorkspace);
      state.currentWorkspaceId = newWorkspace.id;
    },
    updateWorkspace: (state, action) => {
      const { id, updates } = action.payload;
      const workspace = state.workspaces.find(w => w.id === id);
      if (workspace) {
        Object.assign(workspace, updates);
      }
    },
    deleteWorkspace: (state, action) => {
      state.workspaces = state.workspaces.filter(w => w.id !== action.payload);
      if (state.currentWorkspaceId === action.payload) {
        state.currentWorkspaceId = state.workspaces[0]?.id || null;
      }
    },
    setCurrentWorkspace: (state, action) => {
      state.currentWorkspaceId = action.payload;
    },
    addMemberToWorkspace: (state, action) => {
      const { workspaceId, member } = action.payload;
      const workspace = state.workspaces.find(w => w.id === workspaceId);
      if (workspace && !workspace.members.find(m => m.id === member.id)) {
        workspace.members.push(member);
      }
    },
    updateMemberRole: (state, action) => {
      const { workspaceId, memberId, role } = action.payload;
      const workspace = state.workspaces.find(w => w.id === workspaceId);
      const member = workspace?.members.find(item => item.id === memberId);
      if (member && ['owner', 'admin', 'member', 'viewer'].includes(role)) member.role = role;
    },
    removeMemberFromWorkspace: (state, action) => {
      const { workspaceId, memberId } = action.payload;
      const workspace = state.workspaces.find(w => w.id === workspaceId);
      if (workspace) {
        workspace.members = workspace.members.filter(m => m.id !== memberId);
      }
    },
    hydrateWorkspaces: (state, action) => {
      state.workspaces = action.payload.workspaces || [];
      state.currentWorkspaceId = action.payload.currentWorkspaceId || null;
    },
  },
});

export const {
  createWorkspace,
  updateWorkspace,
  deleteWorkspace,
  setCurrentWorkspace,
  addMemberToWorkspace,
  updateMemberRole,
  removeMemberFromWorkspace,
  hydrateWorkspaces,
} = workspaceSlice.actions;

export default workspaceSlice.reducer;
