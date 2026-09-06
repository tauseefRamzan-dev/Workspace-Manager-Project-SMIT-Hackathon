import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Card, Row, Col, Button, Dropdown } from 'react-bootstrap';
import { Form as AntForm, Input, Modal, Popconfirm, Select } from 'antd';
import { createProject, deleteProject, updateProject } from '../store/slices/projectSlice';
import { createTask } from '../store/slices/taskSlice';
import { message } from 'antd';
import './ProjectList.css';

function ProjectList({ workspaceId }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { projects } = useSelector(state => state.project);
  const { currentUser } = useSelector(state => state.auth);
  const workspace = useSelector(state => state.workspace.workspaces.find(item => item.id === workspaceId));
  const currentMember = workspace?.members.find(member => member.id === currentUser?.id);
  const canManage = currentMember?.role !== 'viewer';
  const [open, setOpen] = useState(false);
  const [form] = AntForm.useForm();

  const workspaceProjects = projects.filter(p => p.workspaceId === workspaceId && p.status === 'active');

  const handleCreateProject = () => {
    setOpen(true);
  };

  const handleCreate = (values) => {
      const projectId = `project-${Date.now()}`;
      dispatch(createProject({
        id: projectId,
        workspaceId,
        name: values.name,
        description: values.description,
        icon: values.icon,
        color: values.color,
        template: values.template,
        members: [currentUser],
      }));
      const starterTasks = values.template === 'launch' ? ['Define launch goals', 'Prepare release checklist', 'Review launch metrics'] : values.template === 'marketing' ? ['Define audience', 'Draft campaign brief', 'Schedule campaign review'] : [];
      starterTasks.forEach(title => dispatch(createTask({ projectId, title, status: 'todo', assignee: currentUser })));
      form.resetFields();
      setOpen(false);
  };

  const handleDeleteProject = (projectId) => {
    dispatch(deleteProject(projectId));
  };

  const handleArchiveProject = (projectId) => {
    dispatch(updateProject({
      id: projectId,
      updates: { status: 'archived' }
    }));
  };

  return (
    <div className="project-list w-100">
      <Modal title="Create project" open={open} onCancel={() => setOpen(false)} onOk={() => form.submit()} okText="Create project">
        <AntForm form={form} layout="vertical" onFinish={handleCreate} initialValues={{ icon: '📦', color: '#9b59b6', template: 'blank' }}>
          <AntForm.Item name="name" label="Project name" rules={[{ required: true, message: 'Enter a project name' }]}><Input placeholder="Website redesign" autoFocus /></AntForm.Item>
          <AntForm.Item name="description" label="Description"><Input.TextArea rows={3} /></AntForm.Item>
          <AntForm.Item name="icon" label="Icon"><Input maxLength={2} /></AntForm.Item>
          <AntForm.Item name="color" label="Color"><Input type="color" /></AntForm.Item>
          <AntForm.Item name="template" label="Template"><Select options={[{ value: 'blank', label: 'Blank project' }, { value: 'launch', label: 'Product launch' }, { value: 'marketing', label: 'Marketing sprint' }]} /></AntForm.Item>
        </AntForm>
      </Modal>
      <div className="project-header d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <h4>Projects</h4>
        <Button variant="primary" onClick={() => canManage ? handleCreateProject() : message.warning('Viewer access cannot create projects')}>
          + New Project
        </Button>
      </div>

      {workspaceProjects.length === 0 ? (
        <Card className="empty-state">
          <Card.Body className="text-center py-4">
            <h6>📦 No Projects</h6>
            <small className="text-muted">Create a project to organize your tasks</small>
          </Card.Body>
        </Card>
      ) : (
        <Row xs={1} md={2} className="g-3">
          {workspaceProjects.map(project => (
            <Col key={project.id}>
              <Card className="project-card h-100">
                <Card.Body>
                  <div className="project-header-card">
                    <div className="project-icon">{project.icon}</div>
                    <Dropdown align="end" className="ms-auto">
                      <Dropdown.Toggle variant="link" className="p-0 text-dark">
                        ⋯
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item disabled={!canManage} onClick={() => handleArchiveProject(project.id)}>
                          Archive
                        </Dropdown.Item>
                        <Popconfirm title="Delete this project?" description="This action cannot be undone." onConfirm={() => handleDeleteProject(project.id)} okText="Delete" cancelText="Keep it">
                          <Dropdown.Item disabled={!canManage} onClick={(event) => event.stopPropagation()} className="text-danger">Delete</Dropdown.Item>
                        </Popconfirm>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                  <Card.Title className="project-title">{project.name}</Card.Title>
                  {project.description && (
                    <Card.Text className="text-muted small">{project.description}</Card.Text>
                  )}
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="w-100"
                    onClick={() => navigate(`/workspace/${workspaceId}/project/${project.id}`)}
                  >
                    Open Project
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

export default ProjectList;
