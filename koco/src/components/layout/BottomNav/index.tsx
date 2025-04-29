const BottomNav = () => {
  return (
    <div className="fixed bottom-0 left-0 w-full flex justify-center z-50 h-20">
      <nav
        className="w-full max-w-xl bg-white  shadow-[0_-2px_4px_rgba(0,0,0,0.06)]
                     flex justify-around items-center py-2 px-6 rounded-t-xl"
      >
        <div className="flex flex-col items-center text-xs text-text-primary">코드 해설집</div>
        <div className="flex flex-col items-center text-xs text-text-primary">홈</div>
      </nav>
    </div>
  );
};

export default BottomNav;
