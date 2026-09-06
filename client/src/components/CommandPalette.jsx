import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../store/slices/authSlice';
import { toggleCommandPalette, toggleTheme } from '../store/slices/uiSlice';
import { Input, List, Modal } from 'antd';

function CommandPalette() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { commandPaletteOpen } = useSelector(state => state.ui);
  const [search, setSearch] = useState('');

  const allCommands = [
    { id: 1, label: 'Go to Settings', icon: '⚙️', action: 'go-settings' },
    { id: 2, label: 'Toggle Theme', icon: '🌙', action: 'toggle-theme' },
    { id: 3, label: 'Logout', icon: '🚪', action: 'logout' },
  ];

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        dispatch(toggleCommandPalette());
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dispatch]);

  const commands = allCommands.filter(cmd =>
      cmd.label.toLowerCase().includes(search.toLowerCase())
  );

  const handleClose = () => {
    dispatch(toggleCommandPalette());
    setSearch('');
  };

  const handleCommand = (action) => {
    if (action === 'go-settings') navigate('/settings');
    if (action === 'toggle-theme') dispatch(toggleTheme());
    if (action === 'logout') {
      dispatch(logout());
      navigate('/login');
    }
    handleClose();
  };

  if (!commandPaletteOpen) return null;

  return (
    <Modal open={commandPaletteOpen} onCancel={handleClose} footer={null} title="Quick actions" width={520} centered>
      <Input autoFocus allowClear prefix="🔍" placeholder="Search commands..." value={search} onChange={(event) => setSearch(event.target.value)} />
      <List className="mt-3" dataSource={commands} renderItem={cmd => <List.Item className="px-2" onClick={() => handleCommand(cmd.action)} style={{ cursor: 'pointer' }}><span className="fs-5 me-3">{cmd.icon}</span><span>{cmd.label}</span></List.Item>} />
      <div className="text-center text-muted small pt-2">Press Escape to close</div>
    </Modal>
  );
}

export default CommandPalette;
