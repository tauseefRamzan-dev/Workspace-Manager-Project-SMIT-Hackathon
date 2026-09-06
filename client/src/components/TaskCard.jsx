import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Card, Badge, Button } from 'react-bootstrap';
import { Popconfirm, message } from 'antd';
import { deleteTask, restoreTask } from '../store/slices/taskSlice';
import { formatDate } from '../utils/taskUtils';
import TaskModal from './TaskModal';
import './TaskCard.css';

function TaskCard({ task }) {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'danger';
      case 'medium':
        return 'warning';
      case 'low':
        return 'info';
      default:
        return 'secondary';
    }
  };

  const handleDelete = (e) => {
    e?.stopPropagation();
    dispatch(deleteTask(task.id));
    message.success({
      content: <span>Task deleted <Button variant="link" size="sm" className="p-0 ms-2" onClick={() => dispatch(restoreTask(task))}>Undo</Button></span>,
      duration: 5,
    });
  };

  return (
    <>
      <Card className="task-card" onClick={() => setShowModal(true)}>
        <Card.Body>
          <div className="task-header">
            <h6 className="task-title">{task.title}</h6>
            <Popconfirm title="Delete task?" description="This action cannot be undone." onConfirm={handleDelete} okText="Delete" cancelText="Keep it">
              <Button variant="link" size="sm" className="p-0 text-danger" onClick={(event) => event.stopPropagation()}>✕</Button>
            </Popconfirm>
          </div>

          {task.description && (
            <p className="task-description">{task.description}</p>
          )}

          <div className="task-meta">
            <div className="meta-item">
              <Badge bg={getPriorityColor(task.priority)}>
                {task.priority}
              </Badge>
            </div>

            {task.dueDate && (
              <div className="meta-item">
                <small>📅 {formatDate(task.dueDate)}</small>
              </div>
            )}

            {task.assignee && (
              <div className="meta-item">
                <img
                  src={task.assignee.avatar}
                  alt={task.assignee.name}
                  className="avatar-xs rounded-circle"
                  title={task.assignee.name}
                />
              </div>
            )}
          </div>

          {task.labels.length > 0 && (
            <div className="task-labels mt-2">
              {task.labels.map(label => (
                <Badge key={label} bg="light" text="dark" className="me-1">
                  {label}
                </Badge>
              ))}
            </div>
          )}

          {task.subtasks.length > 0 && (
            <div className="task-progress mt-2">
              <small>
                Subtasks: {task.subtasks.filter(s => s.completed).length}/{task.subtasks.length}
              </small>
            </div>
          )}
        </Card.Body>
      </Card>

      <TaskModal
        task={task}
        show={showModal}
        onHide={() => setShowModal(false)}
      />
    </>
  );
}

export default TaskCard;
