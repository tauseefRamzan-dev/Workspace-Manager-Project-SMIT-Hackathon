import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Navbar as BsNavbar, Container, Button, Dropdown } from 'react-bootstrap';
import { AutoComplete, Input } from 'antd';
import { logout } from '../store/slices/authSlice';
import { toggleSidebar, toggleTheme } from '../store/slices/uiSlice';
import './Navbar.css';

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser, users } = useSelector(state => state.auth);
  const { theme } = useSelector(state => state.ui);
  const workspaces = useSelector(state => state.workspace.workspaces);
  const projects = useSelector(state => state.project.projects);
  const tasks = useSelector(state => state.task.tasks);
  const [globalQuery, setGlobalQuery] = useState('');

  const searchOptions = (query) => {
    const value = query.trim().toLowerCase();
    if (!value) return [];
    return [
      ...workspaces.filter(item => item.name.toLowerCase().includes(value)).slice(0, 4).map(item => ({ value: item.name, label: `Workspace · ${item.name}`, path: `/workspace/${item.id}` })),
      ...projects.filter(item => item.name.toLowerCase().includes(value)).slice(0, 4).map(item => ({ value: item.name, label: `Project · ${item.name}`, path: `/workspace/${item.workspaceId}/project/${item.id}` })),
      ...tasks.filter(item => item.title.toLowerCase().includes(value)).slice(0, 4).map(item => ({ value: item.title, label: `Task · ${item.title}`, path: `/workspace` })),
    ];
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  return (
    <BsNavbar bg="light" expand="lg" className="navbar-custom shadow-sm">
      <Container fluid>
        <BsNavbar.Brand className="d-flex align-items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => dispatch(toggleSidebar())}
            className="p-0"
          >
            ☰
          </Button>
          <span className="fw-bold">📋 Workspace Manager</span>
        </BsNavbar.Brand>

        <div className="navbar-end d-flex align-items-center gap-3">
          <AutoComplete
            className="global-search d-none d-md-block"
            value={globalQuery}
            options={searchOptions(globalQuery)}
            onChange={setGlobalQuery}
            onSelect={(_, option) => navigate(option.path)}
            filterOption={false}
          >
            <Input.Search size="middle" placeholder="Search everything" allowClear />
          </AutoComplete>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleThemeToggle}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </Button>

          <Dropdown align="end">
            <Dropdown.Toggle variant="ghost" className="d-flex align-items-center gap-2 p-0">
              <img
                src={currentUser?.avatar}
                alt={currentUser?.name}
                className="avatar-sm rounded-circle"
              />
              <span className="d-none d-md-inline small">{currentUser?.name}</span>
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Header>Switch demo user</Dropdown.Header>
              {users.map(user => (
                <Dropdown.Item key={user.id} onClick={() => dispatch({ type: 'auth/switchUser', payload: user.id })}>
                  {user.name}
                </Dropdown.Item>
              ))}
              <Dropdown.Divider />
              <Dropdown.Item onClick={() => navigate('/settings')}>
                ⚙️ Settings
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleLogout} className="text-danger">
                🚪 Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </Container>
    </BsNavbar>
  );
}

export default Navbar;
