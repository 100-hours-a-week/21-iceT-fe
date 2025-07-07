import useInput from '@/shared/hooks/useInput';
import useRegisterComment from '../hooks/useRegisterComment';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

interface ICommentInputBoxProps {
  postId: number;
}

const CommentInputBox = ({ postId }: ICommentInputBoxProps) => {
  const { value, onChange, reset } = useInput();
  const [isLoading, setIsLoading] = useState(false);
  const canSubmit = value.length > 0;

  const queryClient = useQueryClient();

  const CommentMutation = useRegisterComment();

  const handleRegisterComment = async () => {
    setIsLoading(true);
    try {
      await CommentMutation.mutateAsync(
        { content: value, postId: postId },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['post', postId, 'comment'] });
          },
        }
      );
      reset();
    } catch {
      alert('댓글 등록에 실패했습니다');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && canSubmit && !isLoading) {
      e.preventDefault(); // 기본 엔터키 동작 방지
      handleRegisterComment();
    }
  };

  return (
    <div className="flex-1 relative mt-6">
      <input
        type="text"
        value={value}
        onChange={onChange}
        disabled={isLoading}
        onKeyDown={handleKeyDown}
        className={`
              w-full pl-4 pr-12 py-2.5 
              bg-input border border-border rounded-full
              focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-200
              placeholder-text-disabled
            `}
      />

      {/* 전송 버튼 */}
      <button
        onClick={handleRegisterComment}
        disabled={!canSubmit}
        className={`
              absolute right-1.5 top-1/2 transform -translate-y-1/2
              p-2 rounded-full transition-all duration-200 ease-out
              flex items-center justify-center
              ${
                canSubmit
                  ? 'bg-secondary text-white hover:bg-secondary-hover hover:scale-110 active:scale-95'
                  : 'bg-gray-200 text-text-disabled cursor-not-allowed'
              }
            `}
      >
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transform rotate-45"
          >
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22,2 15,22 11,13 2,9" />
          </svg>
        )}
      </button>
    </div>
  );
};

export default CommentInputBox;
