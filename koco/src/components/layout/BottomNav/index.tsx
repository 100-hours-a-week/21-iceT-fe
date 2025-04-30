import solutionIc from '@/assets/solutionIc.svg';
import homeIc from '@/assets/homeIc.svg';
import { useNavigate } from 'react-router-dom';

const BottomNav = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-0 left-0 w-full flex justify-center z-50 h-20">
      <nav className="w-full max-w-xl bg-white shadow-[0_-2px_4px_rgba(0,0,0,0.06)] flex justify-around items-center py-2 px-6 rounded-t-xl">
        <div className="group flex flex-col items-center text-xs text-text- gap-1 hover:text-primary-hover transition-colors duration-200">
          <img
            onClick={() => navigate('/survey')}
            src={solutionIc}
            width={18}
            height={18}
            className="group-hover:scale-150 transition-transform duration-200 cursor-pointer"
            alt="solution"
          />
          <p>코드 해설집</p>
        </div>
        <div className="group flex flex-col items-center text-xs text-text-primary gap-1 hover:text-primary-hover transition-colors duration-200">
          <img
            onClick={() => navigate('/home')}
            src={homeIc}
            width={16}
            height={16}
            className="group-hover:scale-150 transition-transform duration-200 cursor-pointer"
            alt="home"
          />
          <p>홈</p>
        </div>
      </nav>
    </div>
  );
};

export default BottomNav;
