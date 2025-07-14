import useModal from '@/shared/hooks/useModal';
import ConfirmModal from '@/shared/ui/ConfirmModal';
import { formatDate } from '@/shared/utils/formatDate';
import { useState } from 'react';
import useDeleteComment from '../hooks/useDeleteComment';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/constants/queryKeys';
import defaultProfileImage from '@/assets/defaultProfileImage.png';
import { CommentAuthor } from '../types/comment';
import Input from '@/shared/ui/Input';
import useInput from '@/shared/hooks/useInput';
import useEditComment from '../hooks/useEditComment';

interface ICommentProps {
  postId: number;
  commentId: number;
  content: string;
  createdAt: string;
  isOwner: boolean;
  author: CommentAuthor;
}

const CommentItem = (data: ICommentProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const { isModalOpen, handleModalOpen } = useModal();
  const { value, onChange } = useInput(data?.content);
  const queryClient = useQueryClient();
  const deleteCommentMutation = useDeleteComment();
  const editCommentMutation = useEditComment();

  const handleToggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };

  const onCancel = () => {
    handleModalOpen(false);
  };

  const onDeleteConfirm = () => {
    try {
      deleteCommentMutation.mutateAsync(
        { postId: data.postId, commentId: data.commentId },
        {
          onSuccess: () => {
            onCancel();
            queryClient.invalidateQueries({ queryKey: queryKeys.post.comment(data.postId) });
          },
        }
      );
    } catch {
      alert('댓글 삭제에 실패했습니다.');
    }
  };

  const handleEditMode = () => {
    setIsEditOpen(prev => !prev);
  };

  const onEditConfirm = () => {
    try {
      editCommentMutation.mutateAsync(
        {
          postId: data.postId,
          commentId: data.commentId,
          content: value,
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.post.comment(data?.postId) });
          },
        }
      );
    } catch {
      alert('댓글 편집에 실패했습니다.');
    } finally {
      handleEditMode();
    }
  };

  return (
    <div className="py-4 border-b border-border last:border-b-0">
      <div className="flex gap-3">
        {/* 프로필 이미지 */}
        <img
          src={data.author.imgUrl ? data.author.imgUrl : defaultProfileImage}
          alt={data.author.nickname}
          className="w-8 h-8 rounded-full object-cover flex-shrink-0"
        />

        <div className="flex-1 min-w-0">
          {/* 상단: 작성자 정보 */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-text-primary text-sm">
                {data.author.nickname}
              </span>
              <span className="text-text-secondary text-xs">{formatDate(data.createdAt)}</span>
            </div>

            {/* 메뉴 버튼 */}
            {data.isOwner && (
              <div className="relative">
                <button
                  onClick={handleToggleMenu}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors text-text-secondary hover:text-text-primary"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="1" />
                    <circle cx="19" cy="12" r="1" />
                    <circle cx="5" cy="12" r="1" />
                  </svg>
                </button>

                {/* 드롭다운 메뉴 */}
                {isMenuOpen && (
                  <>
                    {/* 백드롭 */}
                    <div className="fixed inset-0 z-10" onClick={() => setIsMenuOpen(false)} />

                    {/* 메뉴 */}
                    <div className="absolute right-0 top-8 z-20 bg-white border border-border rounded-lg shadow-lg py-1 min-w-[100px]">
                      {data.isOwner && (
                        // 본인 댓글 메뉴
                        <>
                          <button
                            className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 transition-colors text-text-primary"
                            onClick={handleEditMode}
                          >
                            수정
                          </button>
                          <button
                            onClick={() => handleModalOpen(true)}
                            className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 transition-colors text-error"
                          >
                            삭제
                          </button>
                        </>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* 댓글 내용 */}
          {!isEditOpen ? (
            <p className="text-text-primary text-sm leading-relaxed mb-3">{data.content}</p>
          ) : (
            <div className="flex gap-2">
              <Input value={value} onChange={onChange} className="w-80" />
              <button
                onClick={onEditConfirm}
                className="px-4 py-2 bg-success hover:bg-success-hover text-white text-sm font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
              >
                수정
              </button>
              <button
                onClick={handleEditMode}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white text-sm font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                취소
              </button>
            </div>
          )}
        </div>
      </div>
      <ConfirmModal
        isOpen={isModalOpen}
        title="댓글을 삭제하시겠습니까?"
        text="삭제 이력은 복구할 수 없습니다."
        onCancel={onCancel}
        onConfirm={onDeleteConfirm}
      />
    </div>
  );
};

export default CommentItem;
