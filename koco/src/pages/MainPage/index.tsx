import BottomNav from '@/components/layout/BottomNav';
import ContinuousDayCard from './components/ContinuousCard';
import GameBannerCard from './components/GameBannerCard';
import ProfileCard from './components/ProfileCard';
import TotalStudyCard from './components/TotalStudyCard';
import Header from '@/components/layout/Header';
import MOCK_DASHBOARD_DATA from '@/temp/mock/dashboard.json';

const MainPage = () => {
  const { studyStats, profileImgUrl, nickname, statusMessage, continuousAttendance } =
    MOCK_DASHBOARD_DATA;

  return (
    <div className="flex flex-col gap-6 p-6 pb-30">
      <Header />
      <ProfileCard
        profileImgUrl={profileImgUrl}
        nickname={nickname}
        statusMessage={statusMessage}
      />
      <ContinuousDayCard continuousAttendance={continuousAttendance} />
      <TotalStudyCard studyStats={studyStats} />
      <GameBannerCard />
      <BottomNav />
    </div>
  );
};

export default MainPage;
