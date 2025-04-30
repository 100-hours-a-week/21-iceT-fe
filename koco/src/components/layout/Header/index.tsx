import Logo from '@/assets/Logo.svg';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <header className="text-center h-16 flex items-center justify-center">
      <img src={Logo} width={30} height={40} onClick={handleBack} />
      <h1 className="text-2xl">KOCO</h1>
    </header>
  );
};

export default Header;
