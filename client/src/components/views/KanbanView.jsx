import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Badge } from 'react-bootstrap';
import { Form, Input, Modal, Button as AntButton } from 'antd';
import { updateTask, createTask } from '../../store/slices/taskSlice';
import { updateProjectColumns } from '../../store/slices/projectSlice';
import { filterTasks, sortTasks, searchTasks } from '../../utils/taskUtils';
import TaskCard from '../TaskCard';
import './KanbanView.css';

function KanbanView({ projectId, tasks, columns }) {
  const dispatch = useDispatch();
  const { currentUser } = useSelector(state => state.auth);
  const { filters, sortBy, searchQuery } = useSelector(state => state.ui);
  const [taskModal, setTaskModal] = useState({ open: false, status: 'todo' });
  const [form] = Form.useForm();
  const [columnOpen, setColumnOpen] = useState(false);
  const [columnForm] = Form.useForm();

  let filtered = filterTasks(tasks, filters);
  filtered = sortTasks(filtered, sortBy);
  filtered = searchTasks(filtered, searchQuery);

  const handleAddTask = (status) => {
    setTaskModal({ open: true, status });
  };

  const handleCreateTask = (values) => {
      dispatch(createTask({
        projectId,
        title: values.title,
        description: values.description,
        status: taskModal.status,
        assignee: currentUser,
      }));
      form.resetFields();
      setTaskModal({ open: false, status: 'todo' });
  };

  const moveColumn = (index, offset) => {
    const next = [...columns];
    const target = index + offset;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    dispatch(updateProjectColumns({ projectId, columns: next }));
  };

  const addColumn = ({ title }) => {
    dispatch(updateProjectColumns({ projectId, columns: [...columns, { id: `custom-${Date.now()}`, title, color: '#0f766e' }] }));
    columnForm.resetFields();
    setColumnOpen(false);
  };

  const handleDragStart = (e, task) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('taskId', task.id);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, status) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      dispatch(updateTask({
        id: taskId,
        updates: { status },
      }));
    }
  };

  return (
    <div className="kanban-view">
      <Modal title="Create task" open={taskModal.open} onCancel={() => setTaskModal({ open: false, status: 'todo' })} onOk={() => form.submit()} okText="Create task">
        <Form form={form} layout="vertical" onFinish={handleCreateTask}>
          <Form.Item name="title" label="Task title" rules={[{ required: true, message: 'Enter a task title' }]}><Input autoFocus placeholder="Ship the new dashboard" /></Form.Item>
          <Form.Item name="description" label="Description"><Input.TextArea rows={3} /></Form.Item>
        </Form>
      </Modal>
      <Modal title="Add Kanban column" open={columnOpen} onCancel={() => setColumnOpen(false)} onOk={() => columnForm.submit()} okText="Add column">
        <Form form={columnForm} layout="vertical" onFinish={addColumn}><Form.Item name="title" label="Column name" rules={[{ required: true }]}><Input placeholder="Blocked" autoFocus /></Form.Item></Form>
      </Modal>
      <div className="d-flex justify-content-end mb-2"><AntButton size="small" onClick={() => setColumnOpen(true)}>+ Add column</AntButton></div>
      <div className="kanban-board">
        {columns.map((column, index) => {
          const columnTasks = filtered.filter(t => t.status === column.id);
          return (
            <div key={column.id} className="kanban-column">
              <div className="column-header" style={{ borderTopColor: column.color }}>
                <div className="d-flex align-items-center gap-2"><h6>{column.title}</h6><Badge bg="secondary">{columnTasks.length}</Badge></div>
                <div className="d-flex gap-1"><AntButton size="small" type="text" disabled={index === 0} onClick={() => moveColumn(index, -1)}>←</AntButton><AntButton size="small" type="text" disabled={index === columns.length - 1} onClick={() => moveColumn(index, 1)}>→</AntButton></div>
              </div>

              <div
                className="column-content"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, column.id)}
              >
                {columnTasks.map(task => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task)}
                  >
                    <TaskCard task={task} />
                  </div>
                ))}
              </div>

              <Button
                variant="outline-secondary"
                size="sm"
                className="w-100 mt-2"
                onClick={() => handleAddTask(column.id)}
              >
                + Add Task
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default KanbanView;
