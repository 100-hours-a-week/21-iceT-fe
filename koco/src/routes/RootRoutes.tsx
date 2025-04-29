import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import LoginPage from '@/pages/Login';
import FirstLoginPage from '@/pages/FirstLoginPage';

const RootRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<LoginPage />} />
          <Route path="/complete-profile" element={<FirstLoginPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default RootRoutes;
