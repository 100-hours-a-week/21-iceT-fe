import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import LoginPage from '@/pages/Login';
import FirstLoginPage from '@/pages/FirstLoginPage';
import MainPage from '@/pages/MainPage';
import SurveyPage from '@/pages/SurveyPage';

const RootRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<LoginPage />} />
          <Route path="/complete-profile" element={<FirstLoginPage />} />
          <Route path="/home" element={<MainPage />} />
          <Route path="/survey" element={<SurveyPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default RootRoutes;
