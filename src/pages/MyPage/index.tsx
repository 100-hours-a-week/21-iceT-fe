import { useNavigate } from 'react-router-dom';
import { useUserProfile } from '@/features/user/hooks/useUserProfile';
import { useLogout } from '@/features/auth/hooks/useLogout';
import { useDeleteUser } from '@/features/user/hooks/useDeleteUser';
import { useAuth } from '@/app/providers/AuthContext';
import PageHeader from '@/shared/layout/PageHeader';
import BottomNav from '@/shared/layout/BottomNav';
import Spinner from '@/shared/ui/Spinner';
import { useState } from 'react';
import DeleteConfirmModal from '@/shared/ui/DeleteComfirmModal';
import useModal from '@/shared/hooks/useModal';
import defaultProfileImage from '@/assets/defaultProfileImage.png';

const MorePage = () => {
  const navigate = useNavigate();
  const { logoutUserContext } = useAuth();
  const { mutate: logoutMutation } = useLogout();
  const { mutate: deleteUserMutation } = useDeleteUser();
  const { data: userProfileData, isLoading: isUserProfileLoading } = useUserProfile();
  const { isModalOpen, handleModalOpen } = useModal();
  const [isDeleting, setIsDeleting] = useState(false);

  // 로딩 중
  if (isUserProfileLoading) {
    return (
      <div className="flex flex-col gap-6 p-6 pb-30">
        <PageHeader title="더보기" />
        <Spinner text="로딩중..." />
        <BottomNav />
      </div>
    );
  }

  if (!userProfileData) {
    logoutUserContext();

    return (
      <div className="flex flex-col gap-6 p-6 pb-30">
        <PageHeader title="더보기" />
        <p className="text-center">프로필 데이터를 불러올 수 없습니다.</p>
        <BottomNav />
      </div>
    );
  }

  // 내 정보 수정 클릭
  const handleEditProfile = () => {
    navigate('/complete-profile', { state: { isEditMode: true } });
  };

  // 로그아웃 클릭
  const handleLogout = () => {
    logoutMutation();
  };

  // 탈퇴하기 버튼 클릭
  const handleDeleteClick = () => {
    handleModalOpen(true);
  };

  // 탈퇴 확인
  const handleDeleteConfirm = () => {
    handleModalOpen(false);
    setIsDeleting(true);

    deleteUserMutation(undefined, {
      onSuccess: () => {
        alert('탈퇴가 완료되었습니다.');
        logoutUserContext();
        navigate('/');
      },
      onError: () => {
        alert('탈퇴 처리 중 오류가 발생했습니다.');
        setIsDeleting(false);
      },
    });
  };

  // 탈퇴 취소
  const handleDeleteCancel = () => {
    handleModalOpen(false);
  };

  return (
    <div className="bg-background min-h-screen">
      <PageHeader title="더보기" />

      <div className="px-6 pb-20">
        {/* 프로필 정보 */}
        <div className="bg-surface p-4 mb-4 flex items-center gap-4">
          <img
            src={
              userProfileData.profileImgUrl ? userProfileData.profileImgUrl : defaultProfileImage
            }
            alt="프로필 이미지"
            className="w-24 h-24 rounded-full object-cover bg-gray-200 mr-4"
          />
          <div className="flex-1">
            <p className="font-semibold text-base">{userProfileData.nickname}</p>
            <p className="text-text-secondary text-sm">{userProfileData.statusMsg}</p>
          </div>
        </div>
        {/* 계정 정보 섹션 */}
        <div className="mb-8 border-b border-border">
          <h2 className="text-lg font-semibold mb-4">계정 정보</h2>

          {/* 내 정보 수정 버튼 */}
          <button
            onClick={handleEditProfile}
            className="w-full bg-surface py-3 text-left px-4 hover:bg-gray-50 transition-colors"
          >
            내 정보 수정
          </button>
          {/* 로그아웃 버튼 */}
          <button
            onClick={handleLogout}
            className="w-full bg-surface py-3 text-left px-4 hover:bg-gray-50 transition-colors"
          >
            로그아웃
          </button>
          {/* 탈퇴하기 버튼 */}
          <button
            onClick={handleDeleteClick}
            disabled={isDeleting}
            className={`w-full py-3 text-left px-4 transition-colors text-red-600 ${
              isDeleting
                ? 'bg-gray-100 cursor-not-allowed opacity-50'
                : 'bg-surface hover:bg-gray-50'
            }`}
          >
            {isDeleting ? '탈퇴 처리 중...' : '탈퇴하기'}
          </button>
        </div>

        {/* 서비스 섹션 */}
        <div className="mb-8 border-b border-border">
          <h2 className="text-lg font-semibold mb-4">서비스</h2>

          <div className="space-y-2">
            {/* 문제 리스트 */}
            <button
              onClick={() => navigate('/problems')}
              className="w-full bg-surface py-3 text-left px-4 hover:bg-gray-50 transition-colors"
            >
              문제 리스트
            </button>
          </div>
          <div className="space-y-2">
            {/* 문제 리스트 */}
            <button
              onClick={() => navigate('/my-posts')}
              className="w-full bg-surface py-3 text-left px-4 hover:bg-gray-50 transition-colors"
            >
              내 게시글
            </button>
          </div>
          <div className="space-y-2">
            {/* 문제 리스트 */}
            <button
              onClick={() => navigate('/chat-sessions')}
              className="w-full bg-surface py-3 text-left px-4 hover:bg-gray-50 transition-colors"
            >
              챗봇 대화 내역 조회
            </button>
          </div>
        </div>
      </div>
      <DeleteConfirmModal
        isOpen={isModalOpen}
        title="정말 탈퇴하시겠습니까?"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        isLoading={isDeleting}
      />

      <BottomNav />
    </div>
  );
};

export default MorePage;
