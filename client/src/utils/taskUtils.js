
export const filterTasks = (tasks, filters) => {
  return tasks.filter(task => {
    if (filters.status.length > 0 && !filters.status.includes(task.status)) {
      return false;
    }
    if (filters.priority.length > 0 && !filters.priority.includes(task.priority)) {
      return false;
    }
    if (filters.assignee.length > 0 && (!task.assignee || !filters.assignee.includes(task.assignee.id))) {
      return false;
    }
    if (filters.labels.length > 0) {
      const hasLabel = filters.labels.some(label => task.labels.includes(label));
      if (!hasLabel) return false;
    }
    if (filters.dateRange && task.dueDate) {
      const dueDate = new Date(task.dueDate);
      if (dueDate < filters.dateRange.start || dueDate > filters.dateRange.end) {
        return false;
      }
    }
    return true;
  });
};

export const sortTasks = (tasks, sortBy) => {
  const sorted = [...tasks];
  
  switch (sortBy) {
    case 'dueDate':
      sorted.sort((a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      });
      break;
    case 'priority': {
      const priorityOrder = { high: 1, medium: 2, low: 3 };
      sorted.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
      break;
    }
    case 'created':
      sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      break;
    case 'alphabetical':
      sorted.sort((a, b) => a.title.localeCompare(b.title));
      break;
    default:
      break;
  }
  
  return sorted;
};

export const searchTasks = (tasks, query) => {
  if (!query.trim()) return tasks;
  
  const searchLower = query.toLowerCase();
  return tasks.filter(task =>
    task.title.toLowerCase().includes(searchLower) ||
    task.description.toLowerCase().includes(searchLower) ||
    task.labels.some(label => label.toLowerCase().includes(searchLower))
  );
};

export const groupTasks = (tasks, groupBy) => {
  if (!groupBy) return { all: tasks };
  
  const grouped = {};
  
  tasks.forEach(task => {
    let groupKey = 'Ungrouped';
    
    switch (groupBy) {
      case 'status':
        groupKey = task.status || 'Ungrouped';
        break;
      case 'priority':
        groupKey = task.priority || 'Ungrouped';
        break;
      case 'assignee':
        groupKey = task.assignee?.name || 'Unassigned';
        break;
      case 'label':
        if (task.labels.length === 0) {
          groupKey = 'No Labels';
        } else {
          task.labels.forEach(label => {
            if (!grouped[label]) grouped[label] = [];
            grouped[label].push(task);
          });
          return;
        }
        break;
      default:
        break;
    }
    
    if (!grouped[groupKey]) {
      grouped[groupKey] = [];
    }
    grouped[groupKey].push(task);
  });
  
  return grouped;
};

export const kanbanColumns = [
  { id: 'todo', title: 'To Do', color: '#95a5a6' },
  { id: 'in-progress', title: 'In Progress', color: '#3498db' },
  { id: 'in-review', title: 'In Review', color: '#f39c12' },
  { id: 'done', title: 'Done', color: '#27ae60' },
];

export const getTasksByStatus = (tasks, status) => {
  return tasks.filter(task => task.status === status);
};

export const getOverdueTasks = (tasks) => {
  const now = new Date();
  return tasks.filter(task =>
    task.dueDate && new Date(task.dueDate) < now && task.status !== 'done'
  );
};

export const getDueToday = (tasks) => {
  const today = new Date().toDateString();
  return tasks.filter(task =>
    task.dueDate && new Date(task.dueDate).toDateString() === today
  );
};

export const getDueThisWeek = (tasks) => {
  const now = new Date();
  const weekEnd = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  
  return tasks.filter(task =>
    task.dueDate &&
    new Date(task.dueDate) >= now &&
    new Date(task.dueDate) <= weekEnd
  );
};

export const formatDate = (dateString) => {
  if (!dateString) return 'No date';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export const formatTime = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};

export const getRelativeTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  
  return formatDate(dateString);
};
