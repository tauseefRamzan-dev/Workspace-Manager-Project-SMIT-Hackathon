import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Dropdown, Badge } from 'react-bootstrap';
import { markAsRead, markAllAsRead, deleteNotification } from '../store/slices/notificationSlice';
import { getRelativeTime } from '../utils/taskUtils';

function NotificationBell() {
  const dispatch = useDispatch();
  const { notifications, unreadCount } = useSelector(state => state.notification);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleMarkAsRead = (id) => {
    dispatch(markAsRead(id));
  };

  const handleMarkAllAsRead = () => {
    dispatch(markAllAsRead());
  };

  const handleDeleteNotification = (id) => {
    dispatch(deleteNotification(id));
  };

  return (
    <div className="position-relative">
      <Dropdown
        show={showNotifications}
        onToggle={setShowNotifications}
        align="end"
      >
        <Dropdown.Toggle variant="ghost" className="position-relative p-0">
          <span className="fs-5">🔔</span>
          {unreadCount > 0 && (
            <Badge bg="danger" className="position-absolute top-0 start-100 translate-middle rounded-pill">
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Dropdown.Toggle>

        <Dropdown.Menu className="p-0 overflow-hidden" style={{ minWidth: 350, maxWidth: 'calc(100vw - 24px)' }}>
          <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
            <h6 className="mb-0">Notifications</h6>
            {unreadCount > 0 && (
              <button
                className="btn btn-link btn-sm p-0"
                onClick={handleMarkAllAsRead}
              >
                Mark all as read
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <div className="p-4 text-center text-muted">
              <p className="mb-0">No notifications</p>
            </div>
          ) : (
            <div className="overflow-auto" style={{ maxHeight: 420 }}>
              {notifications.slice(0, 10).map(notif => (
                <div
                  key={notif.id}
                  className={`d-flex align-items-start justify-content-between gap-3 p-3 border-bottom ${notif.read ? '' : 'bg-light'}`}
                  onClick={() => !notif.read && handleMarkAsRead(notif.id)}
                >
                  <div className="flex-grow-1">
                    <p className="mb-1">{notif.message}</p>
                    <small className="text-muted">
                      {getRelativeTime(notif.createdAt)}
                    </small>
                  </div>
                  <button
                    className="btn btn-link btn-sm p-0 text-muted"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteNotification(notif.id);
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}

export default NotificationBell;
