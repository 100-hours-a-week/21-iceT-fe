import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AppLayout from '@/shared/layout/AppLayout';
import LoginPage from '@/pages/LoginPage';
import FirstLoginPage from '@/pages/FirstLoginPage';
import MainPage from '@/pages/MainPage';
import KakaoCallback from '@/pages/KakaoCallbackPage';
import GoogleAnalytics from '@/shared/utils/GoogleAnalytics';
import React, { Suspense } from 'react';
import Spinner from '@/shared/ui/Spinner';
import { AuthProtectedRoute } from './AuthProtectedRoute';
import { AuthProvider } from '../providers/AuthContext';
import MorePage from '@/pages/MyPage';
import PostsPage from '@/pages/PostsPage';
import CreatePostPage from '@/pages/CreatePostPage';
import PostDetailPage from '@/pages/PostDetailPage';
import AlarmListPage from '@/pages/AlarmListPage';
import EditPostPage from '@/pages/EditPostPage';
import MyPostPage from '@/pages/MyPostsPage';
import CreateChatbotPage from '@/pages/CreateChatbotPage';
import ChattingPage from '@/pages/ChattingPage';
import SessionPage from '@/pages/SessionPage';

const SurveyPage = React.lazy(() => import('@/pages/SurveyPage'));
const ProblemListPage = React.lazy(() => import('@/pages/ProblemListPage'));
const ProblemSolutionPage = React.lazy(() => import('@/pages/ProblemSolutionPage'));

const Router = () => {
  return (
    <BrowserRouter basename={'/'}>
      <AuthProvider>
        <GoogleAnalytics />
        <Suspense fallback={<Spinner text="로딩중..." />}>
          <Routes>
            <Route element={<AppLayout />}>
              <Route index element={<LoginPage />} />
              <Route path="/oauth/kakao/callback" element={<KakaoCallback />} />

              {/* 로그인 시 접근 가능한 페이지들 */}

              <Route element={<AuthProtectedRoute />}>
                <Route path="/complete-profile" element={<FirstLoginPage />} />
                <Route path="/home" element={<MainPage />} />{' '}
                <Route path="/survey" element={<SurveyPage />} />
                <Route path="/problems" element={<ProblemListPage />} />
                <Route path="/problems/:id" element={<ProblemSolutionPage />} />
                <Route path="/more" element={<MorePage />} />
                <Route path="/new-post" element={<CreatePostPage />} />
                <Route path="/posts" element={<PostsPage />} />
                <Route path="/post/:id" element={<PostDetailPage />} />
                <Route path="/alarms" element={<AlarmListPage />} />
                <Route path="/post/:id/edit" element={<EditPostPage />} />
                <Route path="/my-posts" element={<MyPostPage />} />
                <Route path="/new-chat" element={<CreateChatbotPage />} />
                <Route path="/chatbot" element={<ChattingPage />} />
                <Route path="/chat-sessions" element={<SessionPage />} />
                <Route path="/chatbot/:id" element={<ChattingPage />} />
              </Route>
            </Route>
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default Router;
