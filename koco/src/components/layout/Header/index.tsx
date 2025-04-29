import Logo from '@/assets/Logo.png';

const Header = () => {
  return (
    <header className="text-center h-16 flex items-center justify-center">
      <img src={Logo} width={30} height={40} />
      <h1 className="text-2xl">KOCO</h1>
    </header>
  );
};

export default Header;
