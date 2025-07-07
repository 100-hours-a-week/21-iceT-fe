import useModal from '@/shared/hooks/useModal';
import { CategoryBox } from '@/shared/ui/CategoryBox';
import ConfirmModal from '@/shared/ui/ConfirmModal';
import { formatDate } from '@/utils/formatDate';
import { useState } from 'react';
import useDeletePost from '../hooks/useDeletePost';
import { useNavigate } from 'react-router-dom';
import defaultProfileImage from '@/assets/defaultProfileImage.png';
import { Category } from '../types/Category';
import { Author } from '../types/author';

interface IPostMetaProps {
  isOwner: boolean;
  title: string;
  createdAt: string;
  categories: Category[];
  author: Author;
  postId: number;
  onEditConfirm: () => void;
  problemNumber: number;
}

const PostMeta = (data: IPostMetaProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isModalOpen, handleModalOpen } = useModal();
  const deletePostMutation = useDeletePost();
  const navigate = useNavigate();

  const onDeleteConfirm = () => {
    // 삭제
    try {
      deletePostMutation.mutateAsync(
        { postId: data.postId },
        {
          onSuccess: () => {
            navigate('/posts');
          },
        }
      );
    } catch {
      alert('게시글 삭제에 실패했습니다.');
    }
  };

  const onCancel = () => {
    handleModalOpen(false);
  };

  return (
    <div className="border-b-[2px] border-border">
      <p className="text-sm mb-1">| 백준 {data.problemNumber}번</p>
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold text-text-primary mb-4">{data.title}</h2>
        <div className="relative">
          {data.isOwner && (
            <button
              onClick={() => setIsMenuOpen(prev => !prev)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
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
          )}
          {isMenuOpen && (
            <>
              {/* 백드롭 */}
              <div className="fixed inset-0 z-10" onClick={() => setIsMenuOpen(false)} />

              {/* 메뉴 */}
              <div className="absolute right-0 top-8 z-20 bg-white border border-border rounded-lg shadow-lg py-1 min-w-[100px]">
                {data.isOwner && (
                  <>
                    <button
                      onClick={data.onEditConfirm}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 transition-colors text-text-primary"
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
      </div>

      <div className="flex items-center gap-3 mb-4">
        <img
          src={data.author.imgUrl ? data.author.imgUrl : defaultProfileImage}
          alt={data.author.nickname}
          className="w-8 h-8 rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-text-primary">{data.author.nickname}</span>
            <span className="text-text-secondary text-sm">•</span>
            <span className="text-text-secondary text-sm">{formatDate(data.createdAt)}</span>
          </div>
        </div>
      </div>
      {/* 알고리즘 유형 */}
      {data.categories && data.categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {data.categories.map(category => (
            <CategoryBox key={category.categoryId} name={category.categoryName} />
          ))}
        </div>
      )}
      <ConfirmModal
        isOpen={isModalOpen}
        title="게시글을 삭제하시겠습니까?"
        text="삭제한 이력은 복구할 수 없습니다."
        onConfirm={onDeleteConfirm}
        onCancel={onCancel}
        isLoading={false}
      />
    </div>
  );
};

export default PostMeta;
