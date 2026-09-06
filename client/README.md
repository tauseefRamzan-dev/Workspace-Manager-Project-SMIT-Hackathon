# Workspace Manager - Capstone Project

A full-featured workspace management application built with Vite + React, Redux Toolkit, Bootstrap, and Ant Design. This is a frontend-only application with simulated backend using localStorage and IndexedDB.

## 📋 Features Overview (70 Features across 14 Domains)

### 1. **Auth & User** (5 features)
- Login/signup screen with mock credentials
- Persisted session via localStorage
- User profile management
- Multiple mock user profiles
- Logout functionality

### 2. **Workspaces** (4 features)
- Create, rename, delete workspaces
- Switch between workspaces
- Workspace-level settings
- Workspace member management

### 3. **Projects** (4 features)
- Create, rename, archive, delete projects
- Project color/icon tagging
- Project descriptions
- Project-level member assignment

### 4. **Tasks & Subtasks** (8 features)
- Full CRUD for tasks
- Nested subtasks (checklist-style)
- Task fields: title, description, status, priority, due date, assignee, labels
- Task completion marking
- Task detail modal/page
- File attachments (base64)
- Task duplication
- Bulk actions (multi-select)

### 5. **Views** (5 features)
- Kanban board with drag-and-drop
- Custom/reorderable kanban columns
- List/table view with sorting
- Calendar view by due date
- View persistence per project

### 6. **Filtering, Search, Sort** (4 features)
- Global search across tasks/projects
- Filter by: assignee, label, priority, status, due date range
- Multiple sort options
- Saved filter presets

### 7. **Roles & Permissions** (4 features)
- Role types: owner, admin, member, viewer
- Permission-gated UI
- Role assignment per workspace member
- Access denied states

### 8. **Activity Log** (4 features)
- Per-task activity feed
- Per-project activity feed
- Timestamped entries with user info
- Filterable activity log

### 9. **Comments & Collaboration** (4 features)
- Task comment threads
- @mention autocomplete
- Edit/delete own comments
- Simulated live updates

### 10. **Undo/Redo & Optimistic UX** (3 features)
- Undo/redo stack for task edits
- Optimistic UI updates with rollback
- Toast notifications with undo action

### 11. **Notifications** (4 features)
- Notification bell with unread count
- Triggers: assigned to task, mentioned, due date approaching
- Mark as read / mark all as read
- Notification preferences toggle

### 12. **Data Persistence & Offline** (6 features)
- Full state persistence to localStorage/IndexedDB
- State rehydration on reload
- Offline indicator
- Manual sync button
- Export workspace data as JSON
- Import/reset data options

### 13. **UI/UX Utilities** (7 features)
- Command palette (Cmd+K)
- Keyboard shortcuts
- Dark/light theme toggle
- Responsive layout
- Loading skeletons
- Empty states
- Confirmation dialogs

### 14. **Settings** (4 features)
- App-wide preferences
- Workspace settings page
- Danger zone (delete with confirmation)
- Theme and notification settings

## 🛠 Tech Stack

- **Frontend Framework**: React 19 + Vite
- **State Management**: Redux Toolkit
- **UI Components**: Bootstrap 5, Ant Design
- **Routing**: React Router v7
- **Styling**: CSS custom properties (CSS variables), custom CSS modules
- **Data Persistence**: localStorage + IndexedDB
- **HTTP Client**: Axios (configured for future backend integration)

## 📁 Project Structure

```
client/
├── src/
│   ├── store/              # Redux store & slices
│   │   ├── store.js
│   │   └── slices/
│   │       ├── authSlice.js
│   │       ├── workspaceSlice.js
│   │       ├── projectSlice.js
│   │       ├── taskSlice.js
│   │       ├── uiSlice.js
│   │       ├── notificationSlice.js
│   │       └── activitySlice.js
│   ├── components/         # Reusable components
│   │   ├── layouts/
│   │   ├── views/         # KanbanView, ListView, CalendarView
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   ├── TaskCard.jsx
│   │   ├── TaskModal.jsx
│   │   ├── TaskFilters.jsx
│   │   ├── CommandPalette.jsx
│   │   ├── NotificationBell.jsx
│   │   └── OfflineIndicator.jsx
│   ├── pages/              # Route pages
│   │   ├── LoginPage.jsx
│   │   ├── WorkspacePage.jsx
│   │   ├── ProjectPage.jsx
│   │   └── SettingsPage.jsx
│   ├── utils/              # Helper functions
│   │   ├── persistence.js  # localStorage & IndexedDB
│   │   └── taskUtils.js    # Filtering, sorting, search
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   └── index.css
├── package.json
├── vite.config.js
└── README.md
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js >= 18
- npm or yarn

### Install Dependencies

```bash
cd client
npm install
```

### Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 👥 Demo Users

All mock users have the password: `password123`

```
📧 testing@gmail.com
📧 bob@workspace.com
📧 carol@workspace.com
```

## 🔑 Key Features Implementation

### Redux State Management

The application uses Redux Toolkit with the following slices:

- **auth**: User authentication and profile
- **workspace**: Workspace CRUD and management
- **project**: Project management
- **task**: Task/subtask management with undo/redo history
- **ui**: UI state (theme, sidebar, filters, search, view mode)
- **notification**: Notification system
- **activity**: Activity log tracking

### Data Persistence

- **localStorage**: Auth state, UI preferences, notifications
- **IndexedDB**: Workspaces, projects, tasks, activities
- Export/import functionality for data backup
- Offline detection and manual sync

### View Modes

1. **Kanban View**: Drag-and-drop tasks between status columns
2. **List View**: Table format with sorting by multiple columns
3. **Calendar View**: Month view with tasks displayed on due dates

### Task Management

- Create/edit/delete tasks with rich fields
- Nested subtasks with completion tracking
- Attach files as base64 data
- Comments with user mentions
- Activity tracking for all changes
- Undo/redo with history stack

### Filtering & Search

- Global search across all tasks/projects
- Multi-filter support (status, priority, assignee, labels, date range)
- Saved filter presets
- Sort options (due date, priority, created date, alphabetical)
- Group by option (status, priority, assignee, label)

### Theme System

- Dark/light theme toggle
- CSS variables for easy customization
- Theme preference persisted to localStorage
- Smooth transitions between themes

### Responsive Design

- Mobile-friendly navigation drawer
- Collapsible sidebar
- Responsive grid layouts
- Touch-friendly button sizes
- Mobile optimized modals

## ⌨️ Keyboard Shortcuts

- `Cmd+K` (Mac) / `Ctrl+K` (Windows): Open command palette
- `Enter`: Submit forms, add comments
- `Escape`: Close modals, command palette

## 📚 Demo Workflows

### Workflow 1: Creating a Project & Tasks

1. Login with demo credentials
2. Create a new workspace
3. Create a project within the workspace
4. Add tasks to the project
5. View tasks in Kanban/List/Calendar view

### Workflow 2: Task Management

1. Open a project
2. Create a task
3. Set priority, due date, assignee
4. Add subtasks and comments
5. Move task between statuses (Kanban view)
6. Mark task as complete

### Workflow 3: Collaboration

1. Create a task and assign to someone
2. Add comments to collaborate
3. View activity log of all changes
4. Receive notifications for updates

### Workflow 4: Data Export/Import

1. Go to Settings
2. Export workspace data as JSON
3. Download the backup file
4. Import data from a backup file
5. Reset all data if needed

## 🌐 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Android)

## 🔮 Future Enhancements

- Real backend API integration
- WebSocket support for real-time collaboration
- File upload to cloud storage
- Advanced reporting & analytics
- Team permissions & roles
- Gantt chart view
- Custom workflows
- Automation & templates
- Mobile app (React Native)
- Dark mode improvements
- Accessibility enhancements (WCAG 2.1 AA)

## 💻 Development Notes

### Adding New Features

1. **Create Redux Slice** (if state management needed)
   - Add to `src/store/slices/`
   - Register in `src/store/store.js`

2. **Create Component**
   - Add to appropriate folder in `src/components/`
   - Create accompanying CSS module

3. **Create Page** (if route-based)
   - Add to `src/pages/`
   - Register route in `App.jsx`

4. **Add Utility Functions** (if needed)
   - Add to `src/utils/`

### Styling

- Use CSS custom properties defined in `App.css`
- Create component-specific CSS modules
- Use Bootstrap utilities for quick styling
- Maintain dark mode compatibility

### State Management

- Use Redux hooks (`useSelector`, `useDispatch`)
- Keep selectors simple and focused
- Use Redux Toolkit's `createSlice` for actions
- Maintain immutability

## 🐛 Troubleshooting

### App won't load
- Clear browser cache and reload
- Check browser console for errors
- Verify all dependencies are installed

### Tasks not persisting
- Check IndexedDB in DevTools
- Verify localStorage is enabled
- Check browser storage limits

### Styling issues
- Verify Bootstrap and Ant Design CSS are loaded
- Check CSS variables are defined
- Clear CSS cache

---

**Happy coding! 🚀**
