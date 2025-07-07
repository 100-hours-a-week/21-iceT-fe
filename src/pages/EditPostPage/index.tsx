import PostForm, { IPostFormData } from '@/features/post/components/PostForm';
import useEditPost from '@/features/post/hooks/useEditPost';
import PageHeader from '@/shared/layout/PageHeader';
import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

const EditPostPage = () => {
  const { id } = useParams();
  const numericId = id ? parseInt(id, 10) : undefined;
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const initialData = location.state.initialData;
  const editPostMutation = useEditPost();

  if (!initialData) {
    alert('잘못된 접근입니다.');
    navigate('/');
  }

  const handleUpdatePost = (postFormData: IPostFormData) => {
    setIsLoading(true);

    if (!numericId) return;

    editPostMutation.mutate(
      {
        postId: numericId,
        post: postFormData.post,
      },
      {
        onSuccess: () => navigate(`/post/${numericId}`),
        onError: () => alert('수정 요청이 실패하였습니다.'),
      }
    );
  };

  return (
    <div className="bg-background min-h-screen relative">
      <PageHeader title="게시글 수정" />
      <PostForm
        initialData={initialData}
        onSubmit={handleUpdatePost}
        submitButtonText="수정하기"
        isLoading={isLoading}
      />
    </div>
  );
};

export default EditPostPage;
