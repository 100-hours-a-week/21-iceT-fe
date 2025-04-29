import Logo from '@/assets/Logo.png';
import { useNavigate } from 'react-router-dom';

const LoginCard = () => {
  return (
    <div className="flex flex-col justify-center gap-4 text-center">
      <img src={Logo} alt="Logo" />
      <title>Koco</title>
      <p className="text-m font-semibold">당신을 위한 코딩 교육 플랫폼</p>
      <KakaoButton />
    </div>
  );
};
export default LoginCard;

const KakaoButton = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/complete-profile');
    // const link = `https://kauth.kakao.com/oauth/authorize?redirect_uri=${import.meta.env.VITE_REDIRECT_URL}&client_id=${import.meta.env.VITE_KAKAO_CLIENT_ID}&response_type=code`;
    // window.location.href = link;
  };

  return (
    <button
      className="flex items-center justify-center min-w-[240px] bg-[#FEE500] text-black font-semibold py-3 px-4 rounded-md hover:brightness-90"
      onClick={handleLogin}
    >
      카카오 로그인하기
    </button>
  );
};
