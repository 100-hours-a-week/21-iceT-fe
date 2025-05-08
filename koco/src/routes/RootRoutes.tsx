import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import LoginPage from '@/pages/Login';
import FirstLoginPage from '@/pages/FirstLoginPage';
import MainPage from '@/pages/MainPage';
import SurveyPage from '@/pages/SurveyPage';
import ProblemListPage from '@/pages/ProblemListPage';
import ProblemSolutionPage from '@/pages/ProblemSolutionPage';
import KakaoCallback from '@/pages/KakaoCallbackPage';
import { ProtectedRoute } from './ProtectedRoute';
import { AuthProvider } from '@/context/AuthContext';

const RootRoutes = () => {
  return (
    <BrowserRouter basename={import.meta.env.NODE_ENV === 'qa' ? '/admin-preview' : '/'}>
      <AuthProvider>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<LoginPage />} />
            <Route path="/oauth/kakao/callback" element={<KakaoCallback />} />

            {/* 로그인 시 접근 가능한 페이지들 */}
            <Route element={<ProtectedRoute />}>
              <Route path="/complete-profile" element={<FirstLoginPage />} />
              <Route path="/home" element={<MainPage />} />
              <Route path="/survey" element={<SurveyPage />} />
              <Route path="/problems" element={<ProblemListPage />} />
              <Route path="/problems/:id" element={<ProblemSolutionPage />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default RootRoutes;
