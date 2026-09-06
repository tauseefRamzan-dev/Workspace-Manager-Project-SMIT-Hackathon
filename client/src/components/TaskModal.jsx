import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Form, Button, ListGroup, InputGroup, Badge, Row, Col, Card } from 'react-bootstrap';
import { message } from 'antd';
import { updateTask, addSubtask, updateSubtask, deleteSubtask, convertSubtaskToTask, addComment, updateComment, deleteComment, attachFile } from '../store/slices/taskSlice';
import { formatDate, getRelativeTime } from '../utils/taskUtils';
import { addNotification } from '../store/slices/notificationSlice';
import './TaskModal.css';

function TaskModal({ task, show, onHide }) {
  const dispatch = useDispatch();
  const { currentUser } = useSelector(state => state.auth);
  const { users } = useSelector(state => state.auth);
  const [editMode, setEditMode] = useState(false);
  const [newCommentText, setNewCommentText] = useState('');
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [formData, setFormData] = useState(task);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentText, setEditingCommentText] = useState('');

  const handleFieldChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSave = () => {
    dispatch(updateTask({
      id: task.id,
      updates: formData,
    }));
    if (formData.assignee?.id && formData.assignee?.id !== task.assignee?.id) {
      dispatch(addNotification({ type: 'assignedToTask', message: `You were assigned to ${formData.title}`, relatedId: task.id }));
    }
    setEditMode(false);
  };

  const handleAddSubtask = () => {
    if (newSubtaskTitle.trim()) {
      dispatch(addSubtask({
        taskId: task.id,
        subtask: { title: newSubtaskTitle },
      }));
      setNewSubtaskTitle('');
    }
  };

  const handleToggleSubtask = (subtaskId) => {
    const subtask = task.subtasks.find(s => s.id === subtaskId);
    if (subtask) {
      dispatch(updateSubtask({
        taskId: task.id,
        subtaskId,
        updates: { completed: !subtask.completed },
      }));
    }
  };

  const handleAddComment = () => {
    if (newCommentText.trim()) {
      dispatch(addComment({
        taskId: task.id,
        comment: {
          author: currentUser,
          text: newCommentText,
          mentions: users.filter(user => newCommentText.toLowerCase().includes(`@${user.name.split(' ')[0].toLowerCase()}`)).map(user => user.id),
        },
      }));
      users.filter(user => newCommentText.toLowerCase().includes(`@${user.name.split(' ')[0].toLowerCase()}`)).forEach(user => dispatch(addNotification({ type: 'mentionedInComment', message: `${currentUser.name} mentioned ${user.name} in a task comment`, relatedId: task.id })));
      message.success('Comment added');
      setNewCommentText('');
    }
  };

  const handleAttachFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => dispatch(attachFile({ taskId: task.id, file: { name: file.name, size: file.size, data: reader.result } }));
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'secondary';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'done': return 'success';
      case 'in-progress': return 'primary';
      case 'in-review': return 'warning';
      default: return 'secondary';
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" className="task-modal">
      <Modal.Header closeButton>
        <Modal.Title className="w-100">
          {editMode ? (
            <Form.Control
              type="text"
              value={formData.title}
              onChange={(e) => handleFieldChange('title', e.target.value)}
              className="fw-bold"
            />
          ) : (
            task.title
          )}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="task-modal-body">
        <Row>
          <Col md={8}>
            <div className="section mb-4">
              <h6>Description</h6>
              {editMode ? (
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => handleFieldChange('description', e.target.value)}
                />
              ) : (
                <p className="text-muted">{task.description || 'No description'}</p>
              )}
            </div>

            <div className="section mb-4">
              <h6>Subtasks ({task.subtasks.filter(s => s.completed).length}/{task.subtasks.length})</h6>
              <ListGroup variant="flush">
                {task.subtasks.map(subtask => (
                  <ListGroup.Item key={subtask.id} className="px-0">
                    <div className="d-flex align-items-center gap-2">
                      <input
                        type="checkbox"
                        checked={subtask.completed}
                        onChange={() => handleToggleSubtask(subtask.id)}
                      />
                      <span className={subtask.completed ? 'text-muted text-decoration-line-through' : ''}>
                        {subtask.title}
                      </span>
                      {!editMode && (
                        <div className="ms-auto d-flex gap-2">
                        <Button
                          variant="link"
                          size="sm"
                          className="p-0 text-primary"
                          onClick={() => dispatch(convertSubtaskToTask({ taskId: task.id, subtaskId: subtask.id }))}
                        >
                          Convert
                        </Button>
                        <Button variant="link" size="sm" className="p-0 text-danger" onClick={() => dispatch(deleteSubtask({ taskId: task.id, subtaskId: subtask.id }))}>✕</Button>
                        </div>
                      )}
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>

              {editMode && (
                <div className="mt-2 d-flex gap-2">
                  <Form.Control
                    type="text"
                    placeholder="Add subtask..."
                    value={newSubtaskTitle}
                    onChange={(e) => setNewSubtaskTitle(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddSubtask()}
                  />
                  <Button variant="outline-primary" size="sm" onClick={handleAddSubtask}>
                    Add
                  </Button>
                </div>
              )}
            </div>

            <div className="section mb-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="mb-0">Attachments ({task.attachments.length})</h6>
                <Form.Control type="file" size="sm" className="w-auto" onChange={handleAttachFile} />
              </div>
              {task.attachments.length > 0 && <ListGroup variant="flush">{task.attachments.map(file => <ListGroup.Item key={file.id} className="px-0 small d-flex justify-content-between"><span>📎 {file.name}</span><span className="text-muted">{Math.round(file.size / 1024)} KB</span></ListGroup.Item>)}</ListGroup>}
            </div>

            <div className="section mb-4">
              <h6>Comments ({task.comments.length})</h6>
              <ListGroup variant="flush" className="mb-3">
                {task.comments.map(comment => (
                  <ListGroup.Item key={comment.id} className="px-0 border-0">
                    <div className="d-flex gap-2">
                      <img
                        src={comment.author.avatar}
                        alt={comment.author.name}
                        className="avatar-xs rounded-circle"
                      />
                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between">
                          <strong className="small">{comment.author.name}</strong>
                          <small className="text-muted">{getRelativeTime(comment.createdAt)}</small>
                        </div>
                        {editingCommentId === comment.id ? <InputGroup size="sm" className="mt-1"><Form.Control value={editingCommentText} onChange={(event) => setEditingCommentText(event.target.value)} /><Button onClick={() => { dispatch(updateComment({ taskId: task.id, commentId: comment.id, text: editingCommentText })); setEditingCommentId(null); }}>Save</Button></InputGroup> : <p className="small mb-0 mt-1">{comment.text}</p>}
                        {comment.author?.id === currentUser?.id && editingCommentId !== comment.id && <div className="mt-1"><Button variant="link" size="sm" className="p-0 me-2" onClick={() => { setEditingCommentId(comment.id); setEditingCommentText(comment.text); }}>Edit</Button><Button variant="link" size="sm" className="p-0 text-danger" onClick={() => dispatch(deleteComment({ taskId: task.id, commentId: comment.id }))}>Delete</Button></div>}
                      </div>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>

              <div className="d-flex gap-2">
                <img
                  src={currentUser?.avatar}
                  alt={currentUser?.name}
                  className="avatar-xs rounded-circle"
                />
                <InputGroup size="sm">
                  <Form.Control
                    placeholder="Add a comment or @mention..."
                    list="mention-users"
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                  />
                  <Button
                    variant="outline-primary"
                    onClick={handleAddComment}
                    disabled={!newCommentText.trim()}
                  >
                    Send
                  </Button>
                </InputGroup>
                <datalist id="mention-users">{users.map(user => <option key={user.id} value={`@${user.name.split(' ')[0]}`} />)}</datalist>
              </div>
            </div>
          </Col>

          <Col md={4}>
            <Card className="task-details-card">
              <Card.Body>
                <div className="detail-item mb-3">
                  <small className="text-muted">Status</small>
                  {editMode ? (
                    <Form.Select
                      value={formData.status}
                      onChange={(e) => handleFieldChange('status', e.target.value)}
                      size="sm"
                      className="mt-1"
                    >
                      <option value="todo">To Do</option>
                      <option value="in-progress">In Progress</option>
                      <option value="in-review">In Review</option>
                      <option value="done">Done</option>
                    </Form.Select>
                  ) : (
                    <Badge bg={getStatusColor(task.status)} className="d-block mt-1">
                      {task.status}
                    </Badge>
                  )}
                </div>

                <div className="detail-item mb-3">
                  <small className="text-muted">Priority</small>
                  {editMode ? (
                    <Form.Select
                      value={formData.priority}
                      onChange={(e) => handleFieldChange('priority', e.target.value)}
                      size="sm"
                      className="mt-1"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </Form.Select>
                  ) : (
                    <Badge bg={getPriorityColor(task.priority)} className="d-block mt-1">
                      {task.priority}
                    </Badge>
                  )}
                </div>

                <div className="detail-item mb-3">
                  <small className="text-muted">Assignee</small>
                  {editMode ? (
                    <Form.Select
                      value={formData.assignee?.id || ''}
                      onChange={(e) => {
                        const user = users.find(u => u.id === e.target.value);
                        handleFieldChange('assignee', user || null);
                      }}
                      size="sm"
                      className="mt-1"
                    >
                      <option value="">Unassigned</option>
                      {users.map(u => (
                        <option key={u.id} value={u.id}>{u.name}</option>
                      ))}
                    </Form.Select>
                  ) : (
                    <p className="small mb-0 mt-1">
                      {task.assignee ? task.assignee.name : 'Unassigned'}
                    </p>
                  )}
                </div>

                <div className="detail-item mb-3">
                  <small className="text-muted">Due Date</small>
                  {editMode ? (
                    <Form.Control
                      type="date"
                      value={formData.dueDate ? formData.dueDate.split('T')[0] : ''}
                      onChange={(e) => handleFieldChange('dueDate', e.target.value ? new Date(e.target.value).toISOString() : null)}
                      size="sm"
                      className="mt-1"
                    />
                  ) : (
                    <p className="small mb-0 mt-1">
                      {task.dueDate ? formatDate(task.dueDate) : 'No due date'}
                    </p>
                  )}
                </div>

                <div className="detail-item mb-3">
                  <small className="text-muted">Created</small>
                  <p className="small mb-0 mt-1">{formatDate(task.createdAt)}</p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Modal.Body>

      <Modal.Footer>
        {editMode ? (
          <>
            <Button variant="secondary" onClick={() => {
              setEditMode(false);
              setFormData(task);
            }}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSave}>
              Save Changes
            </Button>
          </>
        ) : (
          <>
            <Button variant="outline-secondary" onClick={() => setEditMode(true)}>
              Edit
            </Button>
            <Button variant="secondary" onClick={onHide}>
              Close
            </Button>
          </>
        )}
      </Modal.Footer>
    </Modal>
  );
}

export default TaskModal;
