import { useMemo, useState } from 'react';
import { Card, Button, ListGroup } from 'react-bootstrap';
import { filterTasks, sortTasks, searchTasks, getDueToday, getDueThisWeek, getOverdueTasks } from '../../utils/taskUtils';
import { useSelector } from 'react-redux';
import TaskModal from '../TaskModal';
import './CalendarView.css';

function CalendarView({ tasks }) {
  const { filters, sortBy, searchQuery } = useSelector(state => state.ui);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const daysInMonth = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();

    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInCurrentMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  }, [currentMonth]);

  let filtered = filterTasks(tasks, filters);
  filtered = sortTasks(filtered, sortBy);
  filtered = searchTasks(filtered, searchQuery);

  const getTasksForDate = (date) => {
    return filtered.filter(task => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      return (
        taskDate.getDate() === date.getDate() &&
        taskDate.getMonth() === date.getMonth() &&
        taskDate.getFullYear() === date.getFullYear()
      );
    });
  };

  return (
    <div className="calendar-view">
      <div className="calendar-header mb-4">
        <Button
          variant="outline-secondary"
          size="sm"
          onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
        >
          ← Prev
        </Button>
        <h5 className="mx-3 mb-0">
          {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h5>
        <Button
          variant="outline-secondary"
          size="sm"
          onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
        >
          Next →
        </Button>
      </div>

      <div className="calendar-grid">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="calendar-weekday">{day}</div>
        ))}

        {daysInMonth.map((date, i) => (
          <div key={i} className={`calendar-day ${date ? '' : 'empty'}`}>
            {date && (
              <>
                <div className="day-number">{date.getDate()}</div>
                <div className="day-tasks">
                  {getTasksForDate(date).map(task => (
                    <div
                      key={task.id}
                      className="day-task-item"
                      onClick={() => {
                        setSelectedTask(task);
                        setShowModal(true);
                      }}
                    >
                      <small>{task.title}</small>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <div className="calendar-summary mt-4">
        <Card>
          <Card.Body>
            <h6>Summary</h6>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <strong>Overdue:</strong> {getOverdueTasks(filtered).length} tasks
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>Due Today:</strong> {getDueToday(filtered).length} tasks
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>Due This Week:</strong> {getDueThisWeek(filtered).length} tasks
              </ListGroup.Item>
            </ListGroup>
          </Card.Body>
        </Card>
      </div>

      {selectedTask && (
        <TaskModal
          task={selectedTask}
          show={showModal}
          onHide={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

export default CalendarView;
