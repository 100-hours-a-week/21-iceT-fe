import BottomNav from '@/components/layout/BottomNav';
import ContinuousDayCard from './components/ContinuousCard';
import GameBannerCard from './components/GameBannerCard';
import ProfileCard from './components/ProfileCard';
import TotalStudyCard from './components/TotalStudyCard';
import Header from '@/components/layout/Header';

const MainPage = () => {
  return (
    <div>
      <div className="flex flex-col gap-6 p-6">
        <Header />
        <ProfileCard />
        <ContinuousDayCard />
        <TotalStudyCard />
        <GameBannerCard />
      </div>
      <BottomNav />
    </div>
  );
};

export default MainPage;
