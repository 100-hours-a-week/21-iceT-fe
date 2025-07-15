import { API_BASE_URL, API_SUB_URLS } from '@/constants/apiConfig';
import { useNavigate } from 'react-router-dom';

const refreshToken = async (): Promise<boolean> => {
  const navigate = useNavigate();

  try {
    const response = await fetch(`${API_BASE_URL}${API_SUB_URLS}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    });

    if (response.ok) {
      return true;
    } else {
      // 리프레시 실패 시 로그인 페이지로 리다이렉트
      navigate('/');

      return false;
    }
  } catch (error) {
    console.error('Token refresh failed:', error);
    navigate('/');

    return false;
  }
};

// 스트리밍 응답 처리를 위한 401 에러 핸들링 함수
export const fetchStreamWithAuth = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  try {
    const response = await fetch(url, options);

    if (response.status === 401) {
      // 토큰 리프레시 시도
      const refreshSuccess = await refreshToken();

      if (refreshSuccess) {
        // 리프레시 성공 시 원래 요청 재시도
        return await fetch(url, options);
      } else {
        // 리프레시 실패 시 에러 throw
        throw new Error('Authentication failed');
      }
    }

    return response;
  } catch (error) {
    console.error('Fetch with auth failed:', error);
    throw error;
  }
};
