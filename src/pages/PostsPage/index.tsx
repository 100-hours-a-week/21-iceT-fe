import HotPostItem from '@/features/post/components/HotPostItem';
import PostItem from '@/features/post/components/PostItem';
import useInput from '@/shared/hooks/useInput';
import BottomNav from '@/shared/layout/BottomNav';
import PageHeader from '@/shared/layout/PageHeader';
import FloatingButton from '@/shared/ui/FloatingButton';
import SearchInput from '@/shared/ui/SearchInput';
import AlgorithmDropdown from '@/shared/ui/AlgorithmDropdown';
import useAlgorithmDropdown from '@/shared/hooks/useAlgorithmDropdown';
import useGetPostList from '@/features/post/hooks/useGetPostList';
import { useInfiniteScroll } from '@/shared/hooks/useInfiniteScroll';
import { useMemo, useState } from 'react';
import { convertKoreanToEnglish } from '@/shared/utils/doMappingCategories';
import useGetHotPost from '@/features/post/hooks/useGetHotPost';

const PostsPage = () => {
  const [appliedKeyword, setAppliedKeyword] = useState('');
  const { onChange, value: searchValue, reset: resetInputValue } = useInput();
  const { selectedAlgorithmTypes, handleToggleAlgorithmType, handleClearAllTypes } =
    useAlgorithmDropdown();
  const { data: hotPostData } = useGetHotPost();

  // 한글 카테고리를 영어로 변환
  const englishCategories = useMemo(() => {
    return convertKoreanToEnglish(selectedAlgorithmTypes);
  }, [selectedAlgorithmTypes]);

  const {
    data: PostListData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isPostsLoading,
  } = useGetPostList({
    keyword: appliedKeyword || '',
    category: englishCategories.length > 0 ? englishCategories : [],
  });
  const lastCommentRef = useInfiniteScroll({
    isLoading: isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  });

  // 검색 시 스크롤 초기화
  const handleSearch = () => {
    setAppliedKeyword(searchValue.trim());
    resetInputValue();
  };

  // 모든 페이지의 게시글을 하나의 배열로 합치기
  const allPosts = PostListData?.pages?.flatMap(page => page.posts) || [];

  return (
    <div className="bg-background min-h-screen relative pb-20">
      <PageHeader title="커뮤니티" />
      <SearchInput
        className="mr-6 ml-6"
        value={searchValue}
        onChange={onChange}
        onSearch={handleSearch}
      />

      {/* 알고리즘 유형 드롭다운 */}
      <div className="px-4">
        <AlgorithmDropdown
          selectedTypes={selectedAlgorithmTypes}
          onToggleType={handleToggleAlgorithmType}
          onClearAll={handleClearAllTypes}
        />
      </div>

      {/* 인기 게시글*/}
      {hotPostData && <HotPostItem hotPostData={hotPostData} />}
      {/* 게시글 목록 */}
      {allPosts.length > 0
        ? allPosts.map((post, index) => {
            if (allPosts.length === index + 1) {
              return (
                <div key={post.postId} ref={lastCommentRef}>
                  <PostItem post={post} />
                </div>
              );
            } else {
              return <PostItem key={post.postId} post={post} />;
            }
          })
        : !isPostsLoading && <p className="text-center py-8">게시글이 없습니다.</p>}

      {/* 첫 로딩 */}
      {isPostsLoading && allPosts.length === 0 && (
        <div className="py-8 text-center">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
          <p className="mt-2 text-sm text-gray-500">게시글을 불러오는 중...</p>
        </div>
      )}

      {/* 추가 게시글 로딩 */}
      {isFetchingNextPage && (
        <div className="py-4 text-center">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
          <p className="mt-2 text-sm text-gray-500">더 많은 게시글을 불러오는 중...</p>
        </div>
      )}

      <FloatingButton to="/new-post" tooltip="💭 나만의 풀이를 공유해보세요!" />
      <BottomNav />
    </div>
  );
};

export default PostsPage;
