import PostForm, { IPostFormData } from '@/features/post/components/PostForm';
import { useCreatePost } from '@/features/post/hooks/useCreatePost';
import PageHeader from '@/shared/layout/PageHeader';
import { AxiosError } from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreatePostPage = () => {
  const [isLoading, setIsLoading] = useState(false);

  const createPostMutation = useCreatePost();
  const navigate = useNavigate();

  const handleCreatePost = async (data: IPostFormData) => {
    setIsLoading(true);

    createPostMutation.mutate(
      {
        problemNumber: data.post.problemNumber,
        title: data.post.title,
        content: data.post.content,
        category: data.post.category,
      },
      {
        onSuccess: response => {
          setIsLoading(false);
          if (response?.postId) {
            navigate(`/post/${response.postId}`);
          } else {
            navigate('/posts');
          }
        },
        onError: (error: unknown) => {
          setIsLoading(false);
          let message = '게시글 등록에 실패했습니다.';

          if (error instanceof AxiosError) {
            message = error.response?.data?.message;
          }

          alert(message);
        },
      }
    );
  };

  return (
    <div className="bg-background min-h-screen relative">
      <PageHeader title="게시글 작성" />
      <PostForm onSubmit={handleCreatePost} submitButtonText="등록하기" isLoading={isLoading} />
    </div>
  );
};

export default CreatePostPage;
