import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Row, Col, Button } from 'react-bootstrap';
import { Form as AntForm, Input, Modal } from 'antd';
import { createWorkspace } from '../store/slices/workspaceSlice';
import './WorkspaceList.css';

function WorkspaceList() {
  const dispatch = useDispatch();
  const { workspaces } = useSelector(state => state.workspace);
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
        description: values.description,
        members: [currentUser],
      }));
      form.resetFields();
      setOpen(false);
  };

  return (
    <div className="workspace-list w-100">
      <Modal title="Create workspace" open={open} onCancel={() => setOpen(false)} onOk={() => form.submit()} okText="Create workspace">
        <AntForm form={form} layout="vertical" onFinish={handleSubmit} initialValues={{ icon: '📋' }}>
          <AntForm.Item name="name" label="Workspace name" rules={[{ required: true, message: 'Enter a workspace name' }]}><Input placeholder="Design team" autoFocus /></AntForm.Item>
          <AntForm.Item name="icon" label="Icon"><Input maxLength={2} /></AntForm.Item>
          <AntForm.Item name="description" label="Description"><Input.TextArea rows={3} placeholder="What will this workspace organize?" /></AntForm.Item>
        </AntForm>
      </Modal>
      <div className="workspace-header d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <h3>Your Workspaces</h3>
        <Button variant="primary" onClick={handleCreateWorkspace}>
          + New Workspace
        </Button>
      </div>

      {workspaces.length === 0 ? (
        <Card className="empty-state">
          <Card.Body className="text-center py-5">
            <h5>📋 No Workspaces Yet</h5>
            <p className="text-muted">Create your first workspace to get started</p>
            <Button variant="primary" onClick={handleCreateWorkspace}>
              Create Workspace
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {workspaces.map(ws => (
            <Col key={ws.id}>
              <Card className="workspace-card h-100">
                <Card.Body>
                  <div className="workspace-icon">{ws.icon}</div>
                  <Card.Title>{ws.name}</Card.Title>
                  <Card.Text className="text-muted small">
                    {ws.members.length} member{ws.members.length !== 1 ? 's' : ''}
                  </Card.Text>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="w-100"
                    href={`/workspace/${ws.id}`}
                  >
                    Open
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}

export default WorkspaceList;
