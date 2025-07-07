import CommentInputBox from '@/features/comment/components/commentInputBox';
import CommentItem from '@/features/comment/components/commentItem';
import useGetCommentList from '@/features/comment/hooks/useGetCommentList';
import CommentCountBox from '@/features/post/components/CommentCountBox';
import LikeBoxWithActions from '@/features/post/components/LikeBoxWithActions';
import PostContent from '@/features/post/components/PostContent';
import PostMeta from '@/features/post/components/PostMeta';
import useGetPostDetail from '@/features/post/hooks/useGetPostDetail';
import { useUserProfile } from '@/features/user/hooks/useUserProfile';
import { useInfiniteScroll } from '@/shared/hooks/useInfiniteScroll';
import BottomNav from '@/shared/layout/BottomNav';
import PageHeader from '@/shared/layout/PageHeader';
import { useNavigate, useParams } from 'react-router-dom';

const PostDetailPage = () => {
  const { id } = useParams();
  const numericId = id ? parseInt(id, 10) : undefined;
  const navigate = useNavigate();
  const { data: postDetailData, isLoading, isError } = useGetPostDetail(numericId as number);
  const { data: userProfileData } = useUserProfile();
  const {
    data: commentListData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isCommentsLoading,
  } = useGetCommentList(numericId as number);

  const lastCommentRef = useInfiniteScroll({
    isLoading: isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  });

  // 로딩 중이거나 데이터가 없는 경우 로딩 표시
  if (isLoading) {
    return (
      <div>
        <PageHeader title="게시글 상세" />
        <div className="flex justify-center items-center h-[60vh]">
          <p>로딩 중...</p>
        </div>
        <BottomNav />
      </div>
    );
  }

  // 모든 페이지의 댓글을 하나의 배열로 변환
  const allComments = commentListData?.pages?.flatMap(page => page.comments) || [];

  if (isError || !postDetailData) {
    return (
      <div>
        <PageHeader title="게시글 상세" />
        <div className="flex justify-center items-center h-[60vh]">
          <p>게시글 정보가 없습니다</p>
        </div>
        <BottomNav />
      </div>
    );
  }

  // 편집 페이지 이동
  const onEditConfirm = () => {
    navigate(`/post/${id}/edit`, {
      state: {
        initialData: {
          postId: id,
          post: {
            problemNumber: postDetailData.problemNumber,
            title: postDetailData.title,
            content: postDetailData.content,
            category: postDetailData.categories,
          },
        },
      },
    });
  };

  return (
    <div className="bg-background min-h-screen relative">
      <PageHeader title="게시글 상세" />
      <main className="px-6">
        <article className="border-b-[2px] border-border">
          <PostMeta
            problemNumber={postDetailData.problemNumber}
            postId={postDetailData.postId}
            categories={postDetailData.categories}
            title={postDetailData.title}
            author={postDetailData.author}
            createdAt={postDetailData.createdAt}
            isOwner={userProfileData?.userId === postDetailData.author.userId}
            onEditConfirm={onEditConfirm}
          />
          <PostContent content={postDetailData.content} />
          <div className=" flex gap-2 justify-end mt-4 mb-4">
            <LikeBoxWithActions
              postId={postDetailData.postId}
              liked={postDetailData.liked}
              likeCount={postDetailData.likeCount}
            />
            <CommentCountBox commentCount={postDetailData.commentCount} />
          </div>
        </article>
        <section className="pb-20">
          <CommentInputBox postId={postDetailData.postId} />
          {/* 댓글 목록 */}
          {allComments.length > 0
            ? allComments.map((comment, index) => {
                const isLastComment = index === allComments.length - 1;
                // 마지막 댓글에 ref 추가하여 무한스크롤 트리거

                return (
                  <div key={comment.id} ref={isLastComment ? lastCommentRef : null}>
                    <CommentItem
                      postId={postDetailData.postId}
                      commentId={comment.id}
                      content={comment.comment}
                      author={comment.author}
                      createdAt={comment.createdAt}
                      isOwner={userProfileData?.userId === comment.author.userId}
                    />
                  </div>
                );
              })
            : !isCommentsLoading && <div className="py-8 text-center">댓글이 없습니다.</div>}

          {/* 댓글 로딩 상태 */}
          {isCommentsLoading && allComments.length === 0 && (
            <div className="py-8 text-center">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
              <p className="mt-2 text-sm text-gray-500">댓글을 불러오는 중...</p>
            </div>
          )}

          {/* 추가 댓글 로딩 상태 */}
          {isFetchingNextPage && (
            <div className="py-4 text-center">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
              <p className="mt-2 text-sm text-gray-500">더 많은 댓글을 불러오는 중...</p>
            </div>
          )}
        </section>
        <div />
      </main>
      <BottomNav />
    </div>
  );
};

export default PostDetailPage;
