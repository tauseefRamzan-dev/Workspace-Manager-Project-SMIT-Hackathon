import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import { Form as AntForm, Input, Modal } from 'antd';
import { setFilters, clearFilters, setSearchQuery, saveFilter, applySavedFilter } from '../store/slices/uiSlice';
import './TaskFilters.css';

function TaskFilters() {
  const dispatch = useDispatch();
  const { filters, searchQuery, savedFilters } = useSelector(state => state.ui);
  const { users } = useSelector(state => state.auth);
  const [showFilters, setShowFilters] = useState(false);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [presetForm] = AntForm.useForm();

  const handleStatusChange = (status) => {
    const newStatuses = filters.status.includes(status)
      ? filters.status.filter(s => s !== status)
      : [...filters.status, status];
    dispatch(setFilters({ status: newStatuses }));
  };

  const handlePriorityChange = (priority) => {
    const newPriorities = filters.priority.includes(priority)
      ? filters.priority.filter(p => p !== priority)
      : [...filters.priority, priority];
    dispatch(setFilters({ priority: newPriorities }));
  };

  const handleSaveFilter = () => {
    setSaveModalOpen(true);
  };

  const submitPreset = ({ name }) => {
    dispatch(saveFilter({ name: name.trim(), filter: filters }));
    presetForm.resetFields();
    setSaveModalOpen(false);
  };

  return (
    <Card className="task-filters">
      <Modal title="Save filter preset" open={saveModalOpen} onCancel={() => setSaveModalOpen(false)} onOk={() => presetForm.submit()} okText="Save preset">
        <AntForm form={presetForm} layout="vertical" onFinish={submitPreset}>
          <AntForm.Item name="name" label="Preset name" rules={[{ required: true, message: 'Enter a preset name' }]}><Input placeholder="My urgent tasks" autoFocus /></AntForm.Item>
        </AntForm>
      </Modal>
      <Card.Body>
        <div className="filters-header d-flex flex-wrap align-items-center gap-2">
          <input
            type="text"
            className="form-control search-input"
            placeholder="🔍 Search tasks..."
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
          />
          <Button
            variant={showFilters ? 'primary' : 'outline-secondary'}
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            ⚙️ Filters
          </Button>
          {(filters.status.length > 0 || filters.priority.length > 0) && (
            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => dispatch(clearFilters())}
            >
              Clear
            </Button>
          )}
          <Button variant="outline-primary" size="sm" onClick={handleSaveFilter}>Save preset</Button>
          {savedFilters.length > 0 && (
            <Form.Select size="sm" className="w-auto" defaultValue="" onChange={(e) => e.target.value && dispatch(applySavedFilter(e.target.value))}>
              <option value="">Saved filters</option>
              {savedFilters.map(filter => <option key={filter.id} value={filter.id}>{filter.name}</option>)}
            </Form.Select>
          )}
        </div>

        {showFilters && (
          <div className="filters-panel mt-3">
            <Row>
              <Col md={4}>
                <h6>Status</h6>
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="status-todo"
                    checked={filters.status.includes('todo')}
                    onChange={() => handleStatusChange('todo')}
                  />
                  <label className="form-check-label" htmlFor="status-todo">
                    To Do
                  </label>
                </div>
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="status-in-progress"
                    checked={filters.status.includes('in-progress')}
                    onChange={() => handleStatusChange('in-progress')}
                  />
                  <label className="form-check-label" htmlFor="status-in-progress">
                    In Progress
                  </label>
                </div>
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="status-done"
                    checked={filters.status.includes('done')}
                    onChange={() => handleStatusChange('done')}
                  />
                  <label className="form-check-label" htmlFor="status-done">
                    Done
                  </label>
                </div>
              </Col>

              <Col md={4}>
                <h6>Assignee</h6>
                {users.map(user => (
                  <Form.Check
                    key={user.id}
                    type="checkbox"
                    label={user.name}
                    checked={filters.assignee.includes(user.id)}
                    onChange={() => dispatch(setFilters({ assignee: filters.assignee.includes(user.id) ? filters.assignee.filter(id => id !== user.id) : [...filters.assignee, user.id] }))}
                  />
                ))}
                <Form.Label className="mt-2">Due from</Form.Label>
                <Form.Control type="date" value={filters.dateRange?.start ? new Date(filters.dateRange.start).toISOString().slice(0, 10) : ''} onChange={(e) => dispatch(setFilters({ dateRange: { ...(filters.dateRange || {}), start: e.target.value ? new Date(e.target.value) : null } }))} />
                <Form.Label className="mt-2">Due until</Form.Label>
                <Form.Control type="date" value={filters.dateRange?.end ? new Date(filters.dateRange.end).toISOString().slice(0, 10) : ''} onChange={(e) => dispatch(setFilters({ dateRange: { ...(filters.dateRange || {}), end: e.target.value ? new Date(`${e.target.value}T23:59:59`) : null } }))} />
              </Col>

              <Col md={4}>
                <h6>Priority</h6>
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="priority-high"
                    checked={filters.priority.includes('high')}
                    onChange={() => handlePriorityChange('high')}
                  />
                  <label className="form-check-label" htmlFor="priority-high">
                    High
                  </label>
                </div>
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="priority-medium"
                    checked={filters.priority.includes('medium')}
                    onChange={() => handlePriorityChange('medium')}
                  />
                  <label className="form-check-label" htmlFor="priority-medium">
                    Medium
                  </label>
                </div>
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="priority-low"
                    checked={filters.priority.includes('low')}
                    onChange={() => handlePriorityChange('low')}
                  />
                  <label className="form-check-label" htmlFor="priority-low">
                    Low
                  </label>
                </div>
              </Col>
            </Row>
          </div>
        )}
      </Card.Body>
    </Card>
  );
}

export default TaskFilters;
