import solutionIc from '@/assets/solutionIc.svg';
import homeIc from '@/assets/homeIc.svg';
import settingIc from '@/assets/settingIc.svg';
import boardsIc from '@/assets/boardsIc.svg';
import chatIc from '@/assets/chatIc.svg';
import { useNavigate } from 'react-router-dom';

const BottomNav = () => {
  const navigate = useNavigate();

  const menuItem = [
    {
      title: '코드 해설집',
      width: 18,
      height: 18,
      icon: solutionIc,
      alt: 'solution',
      onClick: () => {
        navigate('/problems');
      },
    },
    {
      title: '챗봇',
      width: 18,
      height: 18,
      icon: chatIc,
      alt: 'chat',
      onClick: () => {
        navigate('/new-chat');
      },
    },

    {
      title: '홈',
      width: 16,
      height: 16,
      icon: homeIc,
      alt: 'home',
      onClick: () => {
        navigate('/home');
      },
    },
    {
      title: '커뮤니티',
      width: 18,
      height: 18,
      icon: boardsIc,
      alt: 'posts',
      onClick: () => {
        navigate('/posts');
      },
    },
    {
      title: '더보기',
      width: 16,
      height: 16,
      icon: settingIc,
      alt: 'setting',
      onClick: () => {
        navigate('/more');
      },
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full flex justify-center z-50 h-20">
      <nav className="w-full max-w-xl bg-white shadow-[0_-2px_4px_rgba(0,0,0,0.06)] flex justify-around items-center py-2 px-6 rounded-t-xl">
        {menuItem.map(menu => {
          return (
            <div
              key={menu.alt}
              className="group flex flex-col items-center text-xs text-text- gap-1 hover:text-primary-hover transition-colors duration-200"
            >
              <img
                onClick={menu.onClick}
                src={menu.icon}
                width={menu.width}
                height={menu.height}
                className="group-hover:scale-150 transition-transform duration-200 cursor-pointer"
                alt={menu.alt}
              />
              <p>{menu.title}</p>
            </div>
          );
        })}
      </nav>
    </div>
  );
};

export default BottomNav;
