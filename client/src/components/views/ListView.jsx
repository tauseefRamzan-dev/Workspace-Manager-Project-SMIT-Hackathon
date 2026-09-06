import { useDispatch, useSelector } from 'react-redux';
import { Table, Button, Badge, Form } from 'react-bootstrap';
import { deleteTask, createTask, bulkUpdateTasks, bulkDeleteTasks } from '../../store/slices/taskSlice';
import { clearTaskSelection, toggleTaskSelection } from '../../store/slices/uiSlice';
import { filterTasks, sortTasks, searchTasks, formatDate } from '../../utils/taskUtils';
import TaskModal from '../TaskModal';
import { useState } from 'react';
import { Form as AntForm, Input, Modal, Popconfirm } from 'antd';
import './ListView.css';

function ListView({ projectId, tasks }) {
  const dispatch = useDispatch();
  const { currentUser } = useSelector(state => state.auth);
  const { filters, sortBy, searchQuery, selectedTasks } = useSelector(state => state.ui);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [createForm] = AntForm.useForm();

  let filtered = filterTasks(tasks, filters);
  filtered = sortTasks(filtered, sortBy);
  filtered = searchTasks(filtered, searchQuery);

  const handleAddTask = () => {
    setCreateOpen(true);
  };

  const handleCreateTask = (values) => {
      dispatch(createTask({
        projectId,
        title: values.title,
        description: values.description,
        status: 'todo',
        assignee: currentUser,
      }));
      createForm.resetFields();
      setCreateOpen(false);
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
    <div className="list-view">
      <Modal title="Create task" open={createOpen} onCancel={() => setCreateOpen(false)} onOk={() => createForm.submit()} okText="Create task">
        <AntForm form={createForm} layout="vertical" onFinish={handleCreateTask}>
          <AntForm.Item name="title" label="Task title" rules={[{ required: true, message: 'Enter a task title' }]}><Input autoFocus /></AntForm.Item>
          <AntForm.Item name="description" label="Description"><Input.TextArea rows={3} /></AntForm.Item>
        </AntForm>
      </Modal>
      <div className="list-header mb-3">
        <Button variant="primary" onClick={handleAddTask}>
          + New Task
        </Button>
      </div>

      {selectedTasks.length > 0 && <div className="alert alert-info d-flex flex-wrap align-items-center gap-2 py-2">
        <strong>{selectedTasks.length} selected</strong>
        <Form.Select size="sm" className="w-auto" defaultValue="" onChange={(event) => event.target.value && dispatch(bulkUpdateTasks({ taskIds: selectedTasks, updates: { status: event.target.value } }))}>
          <option value="">Change status</option><option value="todo">To Do</option><option value="in-progress">In Progress</option><option value="in-review">In Review</option><option value="done">Done</option>
        </Form.Select>
        <Popconfirm title="Delete selected tasks?" onConfirm={() => { dispatch(bulkDeleteTasks(selectedTasks)); dispatch(clearTaskSelection()); }}><Button size="sm" variant="danger">Delete selected</Button></Popconfirm>
        <Button size="sm" variant="link" onClick={() => dispatch(clearTaskSelection())}>Clear</Button>
      </div>}

      {filtered.length === 0 ? (
        <div className="empty-state">
          <p>No tasks found</p>
        </div>
      ) : (
        <div className="table-responsive rounded border">
        <Table hover className="task-table mb-0">
          <thead>
            <tr>
              <th><input type="checkbox" checked={filtered.length > 0 && filtered.every(task => selectedTasks.includes(task.id))} onChange={() => { const allSelected = filtered.every(task => selectedTasks.includes(task.id)); filtered.forEach(task => { if (allSelected) { if (selectedTasks.includes(task.id)) dispatch(toggleTaskSelection(task.id)); } else if (!selectedTasks.includes(task.id)) { dispatch(toggleTaskSelection(task.id)); } }); }} aria-label="Select visible tasks" /></th>
              <th>Title</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Assignee</th>
              <th>Due Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(task => (
              <tr key={task.id} onClick={() => {
                setSelectedTask(task);
                setShowModal(true);
              }} style={{ cursor: 'pointer' }}>
                <td onClick={(event) => event.stopPropagation()}><input type="checkbox" checked={selectedTasks.includes(task.id)} onChange={() => dispatch(toggleTaskSelection(task.id))} aria-label={`Select ${task.title}`} /></td>
                <td className="task-title-cell">{task.title}</td>
                <td>
                  <Badge bg={getStatusColor(task.status)}>
                    {task.status}
                  </Badge>
                </td>
                <td>
                  <Badge bg={getPriorityColor(task.priority)}>
                    {task.priority}
                  </Badge>
                </td>
                <td>
                  {task.assignee ? (
                    <div className="assignee-cell">
                      <img src={task.assignee.avatar} alt={task.assignee.name} className="avatar-xs rounded-circle" />
                      <small>{task.assignee.name}</small>
                    </div>
                  ) : (
                    <small className="text-muted">Unassigned</small>
                  )}
                </td>
                <td>
                  {task.dueDate ? formatDate(task.dueDate) : '-'}
                </td>
                <td>
                  <Popconfirm title="Delete task?" onConfirm={() => dispatch(deleteTask(task.id))} okText="Delete" cancelText="Keep it">
                    <Button variant="link" size="sm" className="p-0 text-danger" onClick={(e) => e.stopPropagation()}>🗑️</Button>
                  </Popconfirm>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        </div>
      )}

      {selectedTask && (
        <TaskModal
          key={selectedTask.id}
          task={selectedTask}
          show={showModal}
          onHide={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

export default ListView;
