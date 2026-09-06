import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Row, Col, Card, Button, Form, ListGroup } from 'react-bootstrap';
import { addMemberToWorkspace, deleteWorkspace, updateMemberRole, updateWorkspace } from '../store/slices/workspaceSlice';
import { Form as AntForm, Input, Modal, Popconfirm, Select, message } from 'antd';
import Navbar from '../components/Navbar';
import ProjectList from '../components/ProjectList';
import NotificationBell from '../components/NotificationBell';

function WorkspacePage() {
  const { workspaceId } = useParams();
  const { workspaces } = useSelector(state => state.workspace);
  const { users, currentUser } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [renameOpen, setRenameOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [renameForm] = AntForm.useForm();
  const [settingsForm] = AntForm.useForm();
  
  const workspace = workspaces.find(w => w.id === workspaceId);

  if (!workspace) {
    return (
      <div className="min-vh-100 bg-body">
        <Navbar />
        <Container fluid className="p-4">
          <Card>
            <Card.Body className="text-center py-5">
              <h5>Workspace not found</h5>
            </Card.Body>
          </Card>
        </Container>
      </div>
    );
  }

  const renameWorkspace = ({ name }) => {
    dispatch(updateWorkspace({ id: workspaceId, updates: { name } }));
    setRenameOpen(false);
  };

  const updateSettings = ({ defaultView }) => {
    dispatch(updateWorkspace({ id: workspaceId, updates: { settings: { ...workspace.settings, defaultView } } }));
    setSettingsOpen(false);
  };

  return (
    <div className="min-vh-100 bg-body">
      <Navbar />
      <Modal title="Rename workspace" open={renameOpen} onCancel={() => setRenameOpen(false)} onOk={() => renameForm.submit()}>
        <AntForm form={renameForm} layout="vertical" initialValues={{ name: workspace.name }} onFinish={renameWorkspace}><AntForm.Item name="name" label="Workspace name" rules={[{ required: true }]}><Input autoFocus /></AntForm.Item></AntForm>
      </Modal>
      <Modal title="Workspace settings" open={settingsOpen} onCancel={() => setSettingsOpen(false)} onOk={() => settingsForm.submit()}>
        <AntForm form={settingsForm} layout="vertical" initialValues={{ defaultView: workspace.settings.defaultView }} onFinish={updateSettings}><AntForm.Item name="defaultView" label="Default view"><Select options={[{ value: 'kanban', label: 'Kanban' }, { value: 'list', label: 'List' }, { value: 'calendar', label: 'Calendar' }]} /></AntForm.Item></AntForm>
      </Modal>
      
      <Container fluid className="p-4">
        <Row className="mb-4">
          <Col>
            <div className="d-flex flex-wrap align-items-start gap-2 pb-3 border-bottom">
              <h2 className="fw-semibold">{workspace.icon} {workspace.name}</h2>
              <p className="text-muted">{workspace.members.length} members</p>
              <Button size="sm" variant="outline-secondary" onClick={() => setRenameOpen(true)}>Rename</Button>{' '}
              <Button size="sm" variant="outline-primary" onClick={() => setSettingsOpen(true)}>Workspace settings</Button>
              <Popconfirm title="Delete this workspace?" description="All projects and tasks in it will become inaccessible." okText="Delete" cancelText="Keep it" onConfirm={() => { dispatch(deleteWorkspace(workspaceId)); navigate('/workspace'); }}><Button size="sm" variant="outline-danger">Delete</Button></Popconfirm>
            </div>
          </Col>
          <Col md={3}>
            <NotificationBell />
          </Col>
        </Row>

        <Row>
          <Col>
            <ProjectList workspaceId={workspaceId} />
          </Col>
        </Row>
        <Row className="mt-4">
          <Col md={6}>
            <Card><Card.Body><Card.Title>Members and roles</Card.Title>
              <ListGroup variant="flush">
                {workspace.members.map(member => <ListGroup.Item key={member.id} className="d-flex align-items-center gap-2">
                  <span className="flex-grow-1">{member.name}</span>
                  <Form.Select size="sm" value={member.role || 'member'} onChange={(event) => dispatch(updateMemberRole({ workspaceId, memberId: member.id, role: event.target.value }))} style={{ maxWidth: 130 }}>
                    <option value="owner">Owner</option><option value="admin">Admin</option><option value="member">Member</option><option value="viewer">Viewer</option>
                  </Form.Select>
                </ListGroup.Item>)}
              </ListGroup>
              <Button className="mt-3" size="sm" onClick={() => { const member = users.find(user => user.id !== currentUser?.id && !workspace.members.some(item => item.id === user.id)); if (member) dispatch(addMemberToWorkspace({ workspaceId, member: { ...member, role: 'member' } })); else message.info('All mock users are already members'); }}>Invite mock member</Button>
            </Card.Body></Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default WorkspacePage;
