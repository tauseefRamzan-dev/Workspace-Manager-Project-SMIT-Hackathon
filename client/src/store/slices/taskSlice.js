import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tasks: [],
  history: [],
  historyIndex: -1,
};

const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    createTask: (state, action) => {
      const newTask = {
        id: `task-${Date.now()}`,
        projectId: action.payload.projectId,
        title: action.payload.title,
        description: action.payload.description || '',
        status: action.payload.status || 'todo',
        priority: action.payload.priority || 'medium',
        dueDate: action.payload.dueDate || null,
        assignee: action.payload.assignee || null,
        labels: action.payload.labels || [],
        subtasks: [],
        attachments: [],
        comments: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      state.tasks.push(newTask);
      addToHistory(state, action.type);
    },
    updateTask: (state, action) => {
      const { id, updates } = action.payload;
      const task = state.tasks.find(t => t.id === id);
      if (task) {
        Object.assign(task, updates, { updatedAt: new Date().toISOString() });
        addToHistory(state, action.type);
      }
    },
    deleteTask: (state, action) => {
      state.tasks = state.tasks.filter(t => t.id !== action.payload);
      addToHistory(state, action.type);
    },
    restoreTask: (state, action) => {
      if (action.payload && !state.tasks.some(task => task.id === action.payload.id)) {
        state.tasks.push(action.payload);
        addToHistory(state, action.type);
      }
    },
    duplicateTask: (state, action) => {
      const originalTask = state.tasks.find(t => t.id === action.payload);
      if (originalTask) {
        const newTask = {
          ...originalTask,
          id: `task-${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        state.tasks.push(newTask);
        addToHistory(state, action.type);
      }
    },
    addSubtask: (state, action) => {
      const { taskId, subtask } = action.payload;
      const task = state.tasks.find(t => t.id === taskId);
      if (task) {
        task.subtasks.push({
          id: `subtask-${Date.now()}`,
          title: subtask.title,
          completed: false,
          parentId: subtask.parentId || null,
          createdAt: new Date().toISOString(),
        });
        addToHistory(state, action.type);
      }
    },
    updateSubtask: (state, action) => {
      const { taskId, subtaskId, updates } = action.payload;
      const task = state.tasks.find(t => t.id === taskId);
      if (task) {
        const subtask = task.subtasks.find(s => s.id === subtaskId);
        if (subtask) {
          Object.assign(subtask, updates);
          addToHistory(state, action.type);
        }
      }
    },
    deleteSubtask: (state, action) => {
      const { taskId, subtaskId } = action.payload;
      const task = state.tasks.find(t => t.id === taskId);
      if (task) {
        task.subtasks = task.subtasks.filter(s => s.id !== subtaskId);
        addToHistory(state, action.type);
      }
    },
    convertSubtaskToTask: (state, action) => {
      const { taskId, subtaskId } = action.payload;
      const parentTask = state.tasks.find(task => task.id === taskId);
      const subtask = parentTask?.subtasks.find(item => item.id === subtaskId);
      if (parentTask && subtask) {
        parentTask.subtasks = parentTask.subtasks.filter(item => item.id !== subtaskId);
        state.tasks.push({
          id: `task-${Date.now()}`,
          projectId: parentTask.projectId,
          title: subtask.title,
          description: `Converted from ${parentTask.title}`,
          status: subtask.completed ? 'done' : 'todo',
          priority: parentTask.priority,
          dueDate: null,
          assignee: parentTask.assignee,
          labels: [...parentTask.labels],
          subtasks: [],
          attachments: [],
          comments: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        addToHistory(state, action.type);
      }
    },
    attachFile: (state, action) => {
      const { taskId, file } = action.payload;
      const task = state.tasks.find(t => t.id === taskId);
      if (task) {
        task.attachments.push({
          id: `file-${Date.now()}`,
          name: file.name,
          size: file.size,
          data: file.data,
          uploadedAt: new Date().toISOString(),
        });
      }
    },
    addComment: (state, action) => {
      const { taskId, comment } = action.payload;
      const task = state.tasks.find(t => t.id === taskId);
      if (task) {
        task.comments.push({
          id: `comment-${Date.now()}`,
          author: comment.author,
          text: comment.text,
          mentions: comment.mentions || [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        addToHistory(state, action.type);
      }
    },
    updateComment: (state, action) => {
      const { taskId, commentId, text } = action.payload;
      const task = state.tasks.find(t => t.id === taskId);
      if (task) {
        const comment = task.comments.find(c => c.id === commentId);
        if (comment) {
          comment.text = text;
          comment.updatedAt = new Date().toISOString();
        }
      }
    },
    deleteComment: (state, action) => {
      const { taskId, commentId } = action.payload;
      const task = state.tasks.find(t => t.id === taskId);
      if (task) {
        task.comments = task.comments.filter(c => c.id !== commentId);
      }
    },
    bulkUpdateTasks: (state, action) => {
      const { taskIds, updates } = action.payload;
      taskIds.forEach(id => {
        const task = state.tasks.find(t => t.id === id);
        if (task) {
          Object.assign(task, updates, { updatedAt: new Date().toISOString() });
        }
      });
      addToHistory(state, action.type);
    },
    bulkDeleteTasks: (state, action) => {
      const taskIds = action.payload;
      state.tasks = state.tasks.filter(t => !taskIds.includes(t.id));
      addToHistory(state, action.type);
    },
    undo: (state) => {
      if (state.historyIndex > 0) {
        state.historyIndex--;
        const historyState = state.history[state.historyIndex];
        if (historyState) {
          state.tasks = historyState;
        }
      }
    },
    redo: (state) => {
      if (state.historyIndex < state.history.length - 1) {
        state.historyIndex++;
        const historyState = state.history[state.historyIndex];
        if (historyState) {
          state.tasks = historyState;
        }
      }
    },
    hydrateTasks: (state, action) => {
      state.tasks = action.payload || [];
    },
  },
});

const addToHistory = (state) => {
  state.history = state.history.slice(0, state.historyIndex + 1);
  if (state.history.length > 50) {
    state.history.shift();
  }
  state.history.push(JSON.parse(JSON.stringify(state.tasks)));
  state.historyIndex = state.history.length - 1;
};

export const {
  createTask,
  updateTask,
  deleteTask,
  restoreTask,
  duplicateTask,
  addSubtask,
  updateSubtask,
  deleteSubtask,
  convertSubtaskToTask,
  attachFile,
  addComment,
  updateComment,
  deleteComment,
  bulkUpdateTasks,
  bulkDeleteTasks,
  undo,
  redo,
  hydrateTasks,
} = taskSlice.actions;

export default taskSlice.reducer;
