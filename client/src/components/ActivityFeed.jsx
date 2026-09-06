import { useSelector } from 'react-redux';
import { Card, ListGroup, Badge } from 'react-bootstrap';
import { getRelativeTime } from '../utils/taskUtils';

function ActivityFeed({ projectId, taskId }) {
  const activities = useSelector(state => state.activity.activities);
  const tasks = useSelector(state => state.task.tasks);
  const projectTaskIds = new Set(tasks.filter(task => task.projectId === projectId).map(task => task.id));
  const visible = activities.filter(activity => taskId ? activity.relatedId === taskId : projectTaskIds.has(activity.relatedId)).slice(0, 12);

  return (
    <Card className="mt-4">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <strong>Activity</strong>
        <Badge bg="light" text="dark">{visible.length} recent</Badge>
      </Card.Header>
      <ListGroup variant="flush">
        {visible.length === 0 && <ListGroup.Item className="text-muted small">No activity yet.</ListGroup.Item>}
        {visible.map(activity => (
          <ListGroup.Item key={activity.id} className="d-flex gap-2 align-items-start">
            <img src={activity.user?.avatar} alt="" className="avatar-xs rounded-circle" />
            <div className="flex-grow-1 small">
              <strong>{activity.user?.name || 'System'}</strong> {activity.description}
              <div className="text-muted">{getRelativeTime(activity.timestamp)}</div>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Card>
  );
}

export default ActivityFeed;