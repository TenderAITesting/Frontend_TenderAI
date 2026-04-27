import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { USER } from './data/constants';
import { TopBar } from '../libs/layout';
import { LoginPage } from '../libs/auth';
import { HomePage, useTenders } from '../libs/homepage';
import { UploadPage } from '../libs/upload-page';
import { TenderPage } from '../libs/tender-page';

function AppRoutes() {
  // useTenders gère l'état des tenders et expose les mutations
  // TODO: BACKEND — remplacer par React Query + appels API réels
  const { data: tenders, addTender, updateTender, deleteTender } = useTenders();

  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route
        path="/homepage"
        element={
          <HomePage
            tenders={tenders}
            onDeleteTender={deleteTender}
          />
        }
      />
      <Route
        path="/upload"
        element={
          <UploadPage
            tenders={tenders}
            onCreateTender={addTender}
            onUpdateTender={updateTender}
          />
        }
      />
      <Route
        path="/tender/:id"
        element={
          <TenderPage
            tenders={tenders}
            onUpdateTender={updateTender}
          />
        }
      />
      {/* Redirections de compatibilité pour les anciens liens */}
      <Route path="/dashboard" element={<Navigate to="/homepage" replace />} />
      <Route path="/tender/new" element={<Navigate to="/upload" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <TopBar user={USER} />
        <AppRoutes />
      </div>
    </BrowserRouter>
  );
}
