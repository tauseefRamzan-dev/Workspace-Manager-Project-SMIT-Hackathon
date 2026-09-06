import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Row, Col, Button, ButtonGroup, Card } from 'react-bootstrap';
import Navbar from '../components/Navbar';
import NotificationBell from '../components/NotificationBell';
import TaskFilters from '../components/TaskFilters';
import KanbanView from '../components/views/KanbanView';
import ListView from '../components/views/ListView';
import CalendarView from '../components/views/CalendarView';
import ActivityFeed from '../components/ActivityFeed';
import { kanbanColumns } from '../utils/taskUtils';

function ProjectPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { projects } = useSelector(state => state.project);
  const { currentView, projectViews } = useSelector(state => state.ui);
  const { tasks } = useSelector(state => state.task);

  const project = projects.find(p => p.id === projectId);
  const projectTasks = tasks.filter(t => t.projectId === projectId);
  const selectedView = projectViews[projectId] || currentView;

  if (!project) {
    return (
      <div className="min-vh-100 bg-body">
        <Navbar />
        <Container fluid className="p-4">
          <Card>
            <Card.Body className="text-center py-5">
              <h5>Project not found</h5>
              <Button variant="link" onClick={() => navigate(-1)}>
                Go back
              </Button>
            </Card.Body>
          </Card>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-body">
      <Navbar />
      
      <Container fluid className="p-4">
        <Row className="mb-4">
          <Col>
            <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 pb-3 border-bottom">
              <h2 className="fw-semibold">{project.icon} {project.name}</h2>
              <p className="text-muted">{projectTasks.length} tasks</p>
            </div>
          </Col>
          <Col md={3}>
            <NotificationBell />
          </Col>
        </Row>

        <Row className="mb-4">
          <Col md={8}>
            <div className="view-toggle">
              <ButtonGroup>
                <Button
                  variant={selectedView === 'kanban' ? 'primary' : 'outline-secondary'}
                  onClick={() => dispatch({ type: 'ui/setProjectView', payload: { projectId, view: 'kanban' } })}
                >
                  📊 Kanban
                </Button>
                <Button
                  variant={selectedView === 'list' ? 'primary' : 'outline-secondary'}
                  onClick={() => dispatch({ type: 'ui/setProjectView', payload: { projectId, view: 'list' } })}
                >
                  📝 List
                </Button>
                <Button
                  variant={selectedView === 'calendar' ? 'primary' : 'outline-secondary'}
                  onClick={() => dispatch({ type: 'ui/setProjectView', payload: { projectId, view: 'calendar' } })}
                >
                  📅 Calendar
                </Button>
              </ButtonGroup>
            </div>
          </Col>
        </Row>

        <Row>
          <Col>
            <TaskFilters />
          </Col>
        </Row>

        <Row className="mt-4">
          <Col>
            {selectedView === 'kanban' && <KanbanView projectId={projectId} tasks={projectTasks} columns={project.columns || kanbanColumns} />}
            {selectedView === 'list' && <ListView projectId={projectId} tasks={projectTasks} />}
            {selectedView === 'calendar' && <CalendarView projectId={projectId} tasks={projectTasks} />}
          </Col>
        </Row>
        <ActivityFeed projectId={projectId} />
      </Container>
    </div>
  );
}

export default ProjectPage;
