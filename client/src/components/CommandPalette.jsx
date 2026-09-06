import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleCommandPalette } from '../store/slices/uiSlice';
import { Input, List, Modal } from 'antd';

function CommandPalette() {
  const dispatch = useDispatch();
  const { commandPaletteOpen } = useSelector(state => state.ui);
  const [search, setSearch] = useState('');

  const allCommands = [
    { id: 1, label: 'Create New Workspace', icon: '📋', action: 'create-workspace' },
    { id: 2, label: 'Create New Project', icon: '📦', action: 'create-project' },
    { id: 3, label: 'Create New Task', icon: '✅', action: 'create-task' },
    { id: 4, label: 'Go to Settings', icon: '⚙️', action: 'go-settings' },
    { id: 5, label: 'Toggle Theme', icon: '🌙', action: 'toggle-theme' },
    { id: 6, label: 'Logout', icon: '🚪', action: 'logout' },
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

  if (!commandPaletteOpen) return null;

  return (
    <Modal open={commandPaletteOpen} onCancel={handleClose} footer={null} title="Quick actions" width={520} centered>
      <Input autoFocus allowClear prefix="🔍" placeholder="Search commands..." value={search} onChange={(event) => setSearch(event.target.value)} />
      <List className="mt-3" dataSource={commands} renderItem={cmd => <List.Item className="px-2"><span className="fs-5 me-3">{cmd.icon}</span><span>{cmd.label}</span></List.Item>} />
      <div className="text-center text-muted small pt-2">Press Escape to close</div>
    </Modal>
  );
}

export default CommandPalette;
