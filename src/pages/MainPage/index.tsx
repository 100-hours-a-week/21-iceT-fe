import Header from '@/shared/layout/Header';
import BottomNav from '@/shared/layout/BottomNav';
import ProfileCard from '../../features/user/components/ProfileCard';
import TotalStudyCard from './components/TotalStudyCard';
import { useUserProfile } from '@/features/user/hooks/useUserProfile';
import ProblemItem from '@/features/problemSet/components/ProblemItem';
import Spinner from '@/shared/ui/Spinner';
import { useAuth } from '@/app/providers/AuthContext';
import { useUserStats } from '@/features/user/hooks/useUserStats';
import { useProblemSet } from '@/features/problemSet/hooks/useProblemSet';
import ChunsikCard from './components/ChunsikCard';

const MainPage = () => {
  const { logoutUserContext } = useAuth();
  const { data: userProfileData, isLoading: isUserProfileLoading } = useUserProfile();
  const { data: userStudyStatData, isLoading: isUserStudyStatLoading } = useUserStats();
  const today = new Date().toISOString().split('T')[0];
  const { data: todayProblemData, isLoading: isTodayProblemLoading } = useProblemSet(today);

  const handleOpenGame = () => {
    window.open('/game/index.html', '_blank');
  };

  // ⏳ 로딩 중
  if (isUserProfileLoading || isUserStudyStatLoading || isTodayProblemLoading) {
    return (
      <div className="flex flex-col gap-6 p-6 pb-30">
        <Spinner text="로딩중..." />
      </div>
    );
  }

  if (!userProfileData) {
    logoutUserContext();

    return (
      <div className="flex flex-col gap-6 p-6 pb-30">
        <Header />
        <p className="text-center">프로필 데이터를 불러올 수 없습니다.</p>
      </div>
    );
  }

  if (!userStudyStatData) {
    logoutUserContext();

    return (
      <div className="flex flex-col gap-6 p-6 pb-30">
        <Header />
        <p className="text-center">알고리즘 데이터를 불러올 수 없습니다.</p>
      </div>
    );
  }

  return (
    <>
      <Header hasNotification={false} receiverId={userProfileData.userId} />
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 flex flex-col gap-6 p-6 pb-30">
        <ProfileCard
          profileImgUrl={userProfileData.profileImgUrl}
          nickname={userProfileData.nickname}
          statusMessage={userProfileData.statusMsg}
        />

        {/* ✅ 오늘의 문제 */}
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold">오늘의 문제</h2>
          {Array.isArray(todayProblemData?.problems) && todayProblemData.problems.length > 0 ? (
            todayProblemData.problems.map(problem => (
              <ProblemItem
                key={problem.problemNumber}
                onClick={() => {
                  const url = `https://www.acmicpc.net/problem/${problem.problemNumber}`;
                  window.open(url, '_blank');
                }}
                problemNumber={problem.problemNumber}
                title={problem.title}
                tier={problem.tier}
              />
            ))
          ) : (
            <p className="text-sm text-gray-500">오늘 출제된 문제가 없습니다.</p>
          )}
        </div>

        <TotalStudyCard studyStats={userStudyStatData.studyStats} />
        <ChunsikCard onClick={handleOpenGame} />
        <BottomNav />
      </div>
    </>
  );
};

export default MainPage;
