import { createBrowserRouter, RouterProvider, Outlet, Navigate, useParams, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './App.css';
import { USER } from './data/constants';
import { TopBar, TopBarProvider } from '../libs/layout';
import { LoginPage } from '../libs/auth';
import { HomePage, tendersLoader } from '../libs/homepage';
import { UploadPage } from '../libs/upload-page';
import TenderPage from './TenderPage';
import { tenderLoader } from './loaders/tenderLoader';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

function TenderDefaultRedirect() {
  const { id } = useParams();
  const location = useLocation();
  return <Navigate to={`/tender/${id}/documents`} state={location.state} replace />;
}

function AppLayout() {
  return (
    <TopBarProvider>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <TopBar user={USER} />
        <Outlet />
      </div>
    </TopBarProvider>
  );
}

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: '/', element: <LoginPage /> },
      {
        path: '/homepage',
        element: <HomePage />,
        loader: tendersLoader(queryClient),
      },
      { path: '/upload', element: <UploadPage /> },
      { path: '/tender/:id', element: <TenderDefaultRedirect /> },
      {
        path: '/tender/:id/:step',
        element: <TenderPage />,
        loader: tenderLoader(queryClient),
      },
      { path: '/dashboard', element: <Navigate to="/homepage" replace /> },
      { path: '/tender/new', element: <Navigate to="/upload" replace /> },
    ],
  },
]);

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
