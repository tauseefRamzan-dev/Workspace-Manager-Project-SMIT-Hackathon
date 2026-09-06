import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'antd/dist/reset.css';
import './App.css';

import { hydrateAuth } from './store/slices/authSlice';
import { loadFromLocalStorage, initializeDB, loadAllFromIndexedDB, saveToLocalStorage } from './utils/persistence';
import { store } from './store/store';
import { hydrateWorkspaces } from './store/slices/workspaceSlice';
import { hydrateProjects } from './store/slices/projectSlice';
import { hydrateTasks } from './store/slices/taskSlice';
import { hydrateActivities } from './store/slices/activitySlice';
import { hydrateUI } from './store/slices/uiSlice';
import { hydrateNotifications } from './store/slices/notificationSlice';
import { addNotification } from './store/slices/notificationSlice';
import { addActivity } from './store/slices/activitySlice';

import LoginPage from './pages/LoginPage';
import DashboardLayout from './components/layouts/DashboardLayout';
import WorkspacePage from './pages/WorkspacePage';
import ProjectPage from './pages/ProjectPage';
import SettingsPage from './pages/SettingsPage';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(state => state.auth);
  const { theme } = useSelector(state => state.ui);
  const { tasks } = useSelector(state => state.task);
  const { notifications, preferences } = useSelector(state => state.notification);

  useEffect(() => {
    let unsubscribe;

    const hydrateState = async () => {
      await initializeDB();

      const savedState = loadFromLocalStorage('appState');
      if (savedState) {
        if (savedState.workspace) dispatch(hydrateWorkspaces(savedState.workspace));
        if (savedState.project) dispatch(hydrateProjects(savedState.project.projects || []));
        if (savedState.task) dispatch(hydrateTasks(savedState.task.tasks || []));
        if (savedState.activity) dispatch(hydrateActivities(savedState.activity.activities || []));
        if (savedState.ui) dispatch(hydrateUI(savedState.ui));
        if (savedState.notification) dispatch(hydrateNotifications(savedState.notification));
      } else {
        const [workspaces, projects, tasks, activities] = await Promise.all([
          loadAllFromIndexedDB('workspaces'),
          loadAllFromIndexedDB('projects'),
          loadAllFromIndexedDB('tasks'),
          loadAllFromIndexedDB('activities'),
        ]);
        if (workspaces.length) dispatch(hydrateWorkspaces({ workspaces, currentWorkspaceId: workspaces[0].id }));
        if (projects.length) dispatch(hydrateProjects(projects));
        if (tasks.length) dispatch(hydrateTasks(tasks));
        if (activities.length) dispatch(hydrateActivities(activities));
      }

      unsubscribe = store.subscribe(() => {
        saveToLocalStorage('appState', store.getState());
      });
    };

    hydrateState();

    const savedUser = loadFromLocalStorage('currentUser');
    if (savedUser) {
      dispatch(hydrateAuth(savedUser));
    }

    return () => unsubscribe?.();
  }, [dispatch]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }, [theme]);

  useEffect(() => {
    if (!isAuthenticated) return undefined;
    const checkDueDates = () => {
      if (!preferences.dueDateApproaching) return;
      const tomorrow = Date.now() + 24 * 60 * 60 * 1000;
      tasks.filter(task => task.dueDate && new Date(task.dueDate).getTime() <= tomorrow && task.status !== 'done').forEach(task => {
        if (!notifications.some(notification => notification.relatedId === task.id && notification.type === 'dueDateApproaching')) {
          dispatch(addNotification({ type: 'dueDateApproaching', message: `Task due soon: ${task.title}`, relatedId: task.id }));
        }
      });
    };
    checkDueDates();
    const interval = window.setInterval(checkDueDates, 30000);
    return () => window.clearInterval(interval);
  }, [dispatch, isAuthenticated, notifications, preferences.dueDateApproaching, tasks]);

  useEffect(() => {
    if (!isAuthenticated || tasks.length === 0) return undefined;
    const interval = window.setInterval(() => {
      const task = tasks[Math.floor(Math.random() * tasks.length)];
      dispatch(addActivity({
        type: 'live_update',
        description: `Simulated live update on ${task.title}`,
        user: task.assignee || null,
        relatedId: task.id,
        scope: 'task',
      }));
    }, 45000);
    return () => window.clearInterval(interval);
  }, [dispatch, isAuthenticated, tasks]);

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/workspace" /> : <LoginPage />}
        />
        
        <Route 
          path="/workspace" 
          element={isAuthenticated ? <DashboardLayout /> : <Navigate to="/login" />}
        />
        
        <Route 
          path="/workspace/:workspaceId" 
          element={isAuthenticated ? <WorkspacePage /> : <Navigate to="/login" />}
        />
        
        <Route 
          path="/workspace/:workspaceId/project/:projectId" 
          element={isAuthenticated ? <ProjectPage /> : <Navigate to="/login" />}
        />
        
        <Route 
          path="/settings" 
          element={isAuthenticated ? <SettingsPage /> : <Navigate to="/login" />}
        />
        
        <Route path="/" element={<Navigate to={isAuthenticated ? "/workspace" : "/login"} />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
