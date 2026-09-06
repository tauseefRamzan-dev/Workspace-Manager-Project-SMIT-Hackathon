import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toggleSidebar } from '../../store/slices/uiSlice';
import { Container, Row, Col } from 'react-bootstrap';
import Sidebar from '../Sidebar';
import CommandPalette from '../CommandPalette';
import Navbar from '../Navbar';
import NotificationBell from '../NotificationBell';
import OfflineIndicator from '../OfflineIndicator';
import WorkspaceList from '../WorkspaceList';
import ProjectList from '../ProjectList';
import './DashboardLayout.css';

function DashboardLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector(state => state.auth);
  const { sidebarOpen } = useSelector(state => state.ui);
  const { workspaces, currentWorkspaceId } = useSelector(state => state.workspace);

  useEffect(() => {
    if (workspaces.length === 0) {
      navigate('/workspace');
    }
  }, [workspaces, navigate]);

  return (
    <div className="dashboard-layout d-flex flex-column min-vh-100">
      <Navbar />
      
      <div className="dashboard-container d-flex flex-grow-1 overflow-hidden">
        <div className={`sidebar-wrapper ${sidebarOpen ? 'open' : 'closed'}`}>
          <Sidebar />
        </div>
        {sidebarOpen && <button type="button" className="sidebar-backdrop" aria-label="Close navigation" onClick={() => dispatch(toggleSidebar())} />}

        <main className="main-content flex-grow-1 overflow-auto">
          <Container fluid className="px-3 px-md-4 py-3 py-md-4">
            <Row className="g-4">
              <Col lg={8} xl={9}>
                {currentWorkspaceId ? (
                  <>
                    <h3 className="mb-4">Welcome, {currentUser?.name}! 👋</h3>
                    <ProjectList workspaceId={currentWorkspaceId} />
                  </>
                ) : (
                  <WorkspaceList />
                )}
              </Col>
              <Col lg={4} xl={3}>
                <NotificationBell />
                <OfflineIndicator />
              </Col>
            </Row>
          </Container>
        </main>
      </div>

      <CommandPalette />
    </div>
  );
}

export default DashboardLayout;
