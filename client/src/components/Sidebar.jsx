import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createWorkspace, setCurrentWorkspace } from '../store/slices/workspaceSlice';
import { toggleSidebar } from '../store/slices/uiSlice';
import { Button, ListGroup } from 'react-bootstrap';
import { Form as AntForm, Input, Modal } from 'antd';
import './Sidebar.css';

function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { workspaces, currentWorkspaceId } = useSelector(state => state.workspace);
  const { currentUser } = useSelector(state => state.auth);
  const [open, setOpen] = useState(false);
  const [form] = AntForm.useForm();

  const handleCreateWorkspace = () => {
    setOpen(true);
  };

  const handleSubmit = (values) => {
      dispatch(createWorkspace({
        name: values.name,
        icon: values.icon,
        members: [currentUser],
      }));
      form.resetFields();
      setOpen(false);
  };

  const handleSelectWorkspace = (workspaceId) => {
    dispatch(setCurrentWorkspace(workspaceId));
    if (window.innerWidth <= 768) dispatch(toggleSidebar());
    navigate(`/workspace/${workspaceId}`);
  };

  return (
    <div className="sidebar d-flex flex-column h-100 p-3">
      <Modal title="Create workspace" open={open} onCancel={() => setOpen(false)} onOk={() => form.submit()} okText="Create workspace">
        <AntForm form={form} layout="vertical" onFinish={handleSubmit} initialValues={{ icon: '📋' }}>
          <AntForm.Item name="name" label="Workspace name" rules={[{ required: true, message: 'Enter a workspace name' }]}><Input placeholder="Product HQ" autoFocus /></AntForm.Item>
          <AntForm.Item name="icon" label="Icon"><Input maxLength={2} /></AntForm.Item>
        </AntForm>
      </Modal>
      <div className="sidebar-header">
        <h5 className="mb-3">Workspaces</h5>
        <Button
          variant="primary"
          size="sm"
          className="w-100 mb-3"
          onClick={handleCreateWorkspace}
        >
          + New Workspace
        </Button>
      </div>

      <div className="sidebar-content flex-grow-1 overflow-auto">
        <ListGroup variant="flush">
          {workspaces.map(ws => (
            <ListGroup.Item
              key={ws.id}
              active={ws.id === currentWorkspaceId}
              onClick={() => handleSelectWorkspace(ws.id)}
              className="cursor-pointer"
            >
              <span className="me-2">{ws.icon}</span>
              {ws.name}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>

      <div className="sidebar-footer mt-auto pt-3 border-top">
        <Button
          variant="outline-secondary"
          size="sm"
          className="w-100"
          href="/settings"
        >
          ⚙️ Settings
        </Button>
      </div>
    </div>
  );
}

export default Sidebar;
