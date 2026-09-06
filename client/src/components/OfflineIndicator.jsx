import { useEffect, useState } from 'react';
import { Alert, Button } from 'react-bootstrap';

function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <Alert variant="warning" className="mt-3 rounded-3 border d-flex flex-column align-items-start">
      <div className="fw-medium">
        <span>📡 You are offline</span>
        <small className="d-block mt-2">
          Changes will sync when you're back online
        </small>
      </div>
      <Button
        variant="outline-warning"
        size="sm"
        onClick={() => window.location.reload()}
        className="mt-2"
      >
        Retry
      </Button>
    </Alert>
  );
}

export default OfflineIndicator;
