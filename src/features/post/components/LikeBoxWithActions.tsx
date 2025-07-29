import useDeleteLike from '@/features/like/hooks/useDeleteLike';
import useRegisterLike from '@/features/like/hooks/useRegisterLike';
import { useState } from 'react';

interface ILikeWithActionsProps {
  liked: boolean;
  likeCount: number;
  postId: number;
}

const LikeWithActions = ({ liked, likeCount, postId }: ILikeWithActionsProps) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [localLike, setLocalLike] = useState(liked);
  const [localLikeCount, setLocalLikeCount] = useState(likeCount);
  const registerLikeMutation = useRegisterLike();
  const deleteLikeMutation = useDeleteLike();

  const handleLike = async () => {
    if (isAnimating) return;

    // 좋아요 취소
    if (localLike && localLikeCount > 0) {
      setLocalLike(prev => !prev);
      setLocalLikeCount(prev => prev - 1);
      try {
        await deleteLikeMutation.mutateAsync(postId);
      } catch {
        setLocalLike(prev => !prev);
        setLocalLikeCount(prev => prev + 1);
      }
    }
    // 좋아요 등록
    else if (!localLike) {
      setIsAnimating(true);
      setLocalLike(prev => !prev);
      setLocalLikeCount(prev => prev + 1);
      try {
        await registerLikeMutation.mutateAsync(postId);
      } catch {
        setLocalLike(prev => !prev);
        setLocalLikeCount(prev => prev - 1);
      } finally {
        // 애니메이션 종료
        setTimeout(() => {
          setIsAnimating(false);
        }, 300);
      }
    }
  };

  return (
    <div className="flex items-center gap-4">
      {/* 좋아요 버튼 */}
      <button
        onClick={handleLike}
        disabled={isAnimating}
        className={`
              relative flex items-center gap-2 px-3 py-2 rounded-xl font-medium text-sm
              transition-all duration-200 ease-out select-none
              ${
                localLike
                  ? 'bg-red-50 text-red-600 hover:bg-red-100'
                  : 'hover:bg-gray-100 text-text-secondary hover:text-red-600'
              }
              ${isAnimating ? 'scale-105' : 'hover:scale-[1.02]'}
            `}
      >
        {/* 하트 아이콘 */}
        <div className="relative">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            className={`
                  transition-all duration-300 ease-out
                  ${localLike ? 'fill-current scale-110' : 'fill-none'}
                  ${isAnimating ? 'animate-pulse' : ''}
                `}
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>

          {/* 좋아요 애니메이션 효과 */}
          {isAnimating && localLike && (
            <div className="absolute inset-0 -m-2">
              <div className="w-6 h-6 bg-red-500 rounded-full opacity-20 animate-ping" />
            </div>
          )}
        </div>

        {/* 좋아요 카운트 */}
        <span
          data-testid="like-count"
          className={`
              font-medium transition-all duration-300 ease-out
              ${isAnimating ? 'scale-105' : ''}
              ${localLike ? 'text-red-600' : ''}
            `}
        >
          {localLikeCount}
        </span>
      </button>
    </div>
  );
};

export default LikeWithActions;
