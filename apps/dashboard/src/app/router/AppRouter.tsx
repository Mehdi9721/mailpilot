import {
  BrowserRouter,
  Route,
  Routes
} from 'react-router-dom';

import MainLayout from '../layouts/MainLayout';

import DashboardPage from '../../pages/DashboardPage';
import InboxPage from '../../pages/InboxPage';
import EmailDetailsPage from '../../pages/EmailDetailsPage';
import LogsPage from '../../pages/LogsPage';
import CategoryRulesPage from '../../pages/CategoryRulesPage';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route
            path="/"
            element={<DashboardPage />}
          />

          <Route
            path="/emails"
            element={<InboxPage />}
          />

          <Route
            path="/emails/:id"
            element={<EmailDetailsPage />}
          />
         <Route
            path="/categories"
            element={<CategoryRulesPage />}
          />
          <Route
            path="/logs"
            element={<LogsPage />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}