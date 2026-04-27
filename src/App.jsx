import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { USER, INITIAL_TENDERS } from './data/constants';
import TopBar from './components/TopBar';
import DashboardView from './components/DashboardView';
import NewProjectView from './components/NewProjectView';
import TenderView from './components/ProposalView';

export default function App() {
  // TODO: remplacer par un fetch API GET /tenders au montage
  const [tenders, setTenders] = useState(INITIAL_TENDERS);

  const addTender = (tender) => {
    setTenders(prev => [tender, ...prev]);
  };

  const updateTender = (id, patch) => {
    // TODO: remplacer par appel API PATCH /tenders/:id
    setTenders(prev => prev.map(t => t.id === id ? { ...t, ...patch } : t));
  };

  const deleteTender = (id) => {
    // TODO: remplacer par appel API DELETE /tenders/:id
    setTenders(prev => prev.filter(t => t.id !== id));
  };

  return (
    <BrowserRouter>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <TopBar user={USER} />
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route
            path="/dashboard"
            element={
              <DashboardView
                tenders={tenders}
                onDeleteTender={deleteTender}
              />
            }
          />
          <Route
            path="/tender/new"
            element={
              <NewProjectView
                tenders={tenders}
                onCreateTender={addTender}
                onUpdateTender={updateTender}
              />
            }
          />
          <Route
            path="/tender/:id"
            element={
              <TenderView
                tenders={tenders}
                onUpdateTender={updateTender}
              />
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
