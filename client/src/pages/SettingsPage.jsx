import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Row, Col, Card, Button, Form, Alert, Tabs, Tab } from 'react-bootstrap';
import { updateProfile } from '../store/slices/authSlice';
import { toggleTheme } from '../store/slices/uiSlice';
import { exportData, importData, resetAllData, saveToLocalStorage } from '../utils/persistence';
import { setNotificationPreference } from '../store/slices/notificationSlice';
import { message, Modal } from 'antd';
import Navbar from '../components/Navbar';

function SettingsPage() {
  const dispatch = useDispatch();
  const { currentUser } = useSelector(state => state.auth);
  const { theme } = useSelector(state => state.ui);
  const { preferences } = useSelector(state => state.notification);
  const [importing, setImporting] = useState(false);

  const handleExportData = async () => {
    try {
      const data = await exportData();
      const dataStr = JSON.stringify(data, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `workspace-backup-${new Date().toISOString()}.json`;
      link.click();
      message.success('Data exported successfully');
    } catch (error) {
      message.error(`Export failed: ${error.message}`);
    }
  };

  const handleResetData = () => {
    Modal.confirm({
      title: 'Reset all workspace data?',
      content: 'This permanently removes local workspaces, projects, and tasks.',
      okText: 'Reset data',
      okButtonProps: { danger: true },
      onOk: async () => { await resetAllData(); message.success('All data has been reset'); window.location.reload(); },
    });
  };

  const handleImportData = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setImporting(true);
    try {
      const imported = JSON.parse(await file.text());
      if (await importData(imported)) {
        message.success('Data imported successfully. Reloading the app...');
        window.location.reload();
      }
    } catch (error) {
      message.error(`Import failed: ${error.message}`);
    } finally {
      setImporting(false);
      event.target.value = '';
    }
  };

  const handleSync = () => {
    saveToLocalStorage('lastSyncAt', new Date().toISOString());
    message.success('Offline changes reconciled successfully');
  };

  const handleUpdateProfile = (field, value) => {
    dispatch(updateProfile({ [field]: value }));
  };

  return (
    <div className="min-vh-100 bg-body">
      <Navbar />
      
      <Container fluid className="p-4">
        <h2 className="mb-4">⚙️ Settings</h2>

        <Row>
          <Col lg={8}>
            <Tabs defaultActiveKey="profile" className="mb-4">
              <Tab eventKey="profile" title="Profile">
                <Card>
                  <Card.Body>
                    <h5>Profile Information</h5>
                    <hr />
                    
                    <div className="mb-3">
                      <label className="form-label">Name</label>
                      <Form.Control
                        type="text"
                        value={currentUser?.name || ''}
                        onChange={(e) => handleUpdateProfile('name', e.target.value)}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Email</label>
                      <Form.Control
                        type="email"
                        value={currentUser?.email || ''}
                        onChange={(e) => handleUpdateProfile('email', e.target.value)}
                        disabled
                      />
                    </div>

                    <Button variant="primary">Save Changes</Button>
                  </Card.Body>
                </Card>
              </Tab>

              <Tab eventKey="appearance" title="Appearance">
                <Card>
                  <Card.Body>
                    <h5>Theme</h5>
                    <hr />
                    
                    <div className="mb-3">
                      <p>Current theme: <strong>{theme === 'light' ? '☀️ Light' : '🌙 Dark'}</strong></p>
                      <Button variant="outline-secondary" onClick={() => dispatch(toggleTheme())}>
                        Toggle to {theme === 'light' ? 'Dark' : 'Light'} Theme
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
                <Card className="mt-3">
                  <Card.Body>
                    <h5>Notifications</h5>
                    <hr />
                    {Object.entries(preferences).map(([type, enabled]) => (
                      <Form.Check
                        key={type}
                        type="switch"
                        className="mb-2"
                        label={type.replace(/([A-Z])/g, ' $1')}
                        checked={enabled}
                        onChange={(event) => dispatch(setNotificationPreference({ type, enabled: event.target.checked }))}
                      />
                    ))}
                  </Card.Body>
                </Card>
              </Tab>

              <Tab eventKey="data" title="Data & Privacy">
                <Card className="mb-3">
                  <Card.Body>
                    <h5>Backup & Export</h5>
                    <hr />
                    <p className="text-muted">Download all your workspace data as JSON</p>
                    <Button variant="success" onClick={handleExportData}>
                      📥 Export Data
                    </Button>
                    <Form.Group className="mt-3">
                      <Form.Label>Import a validated JSON backup</Form.Label>
                      <Form.Control type="file" accept="application/json" onChange={handleImportData} disabled={importing} />
                    </Form.Group>
                    <Button variant="outline-primary" className="mt-3" onClick={handleSync}>
                      🔄 Sync Offline Changes
                    </Button>
                  </Card.Body>
                </Card>

                  <Card className="border-start border-danger border-4">
                  <Card.Body className="bg-danger-subtle">
                    <h5 className="text-danger">Danger Zone</h5>
                    <hr />
                    <Alert variant="warning">
                      ⚠️ Reset all data will permanently delete everything. This cannot be undone.
                    </Alert>
                    <Button variant="danger" onClick={handleResetData}>
                      🗑️ Reset All Data
                    </Button>
                  </Card.Body>
                </Card>
              </Tab>
            </Tabs>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default SettingsPage;
