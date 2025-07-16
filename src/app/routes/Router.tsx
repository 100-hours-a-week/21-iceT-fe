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
import CreateChatbotPage from '@/pages/CreateChatbotPage';

const SurveyPage = React.lazy(() => import('@/pages/SurveyPage'));
const ProblemListPage = React.lazy(() => import('@/pages/ProblemListPage'));
const ProblemSolutionPage = React.lazy(() => import('@/pages/ProblemSolutionPage'));
const CreatePostPage = React.lazy(() => import('@/pages/CreatePostPage'));
const PostDetailPage = React.lazy(() => import('@/pages/PostDetailPage'));
const AlarmListPage = React.lazy(() => import('@/pages/AlarmListPage'));
const EditPostPage = React.lazy(() => import('@/pages/EditPostPage'));
const MyPostPage = React.lazy(() => import('@/pages/MyPostsPage'));
const ChattingPage = React.lazy(() => import('@/pages/ChattingPage'));
const SessionPage = React.lazy(() => import('@/pages/SessionPage'));

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
