import SessionItem from '@/features/session/components/SessionList';
import useDeleteSession from '@/features/session/hooks/useDeleteSession';
import useGetSessionList from '@/features/session/hooks/useGetSessionList';
import { convertDeleteString } from '@/features/session/utils/convertDeleteString';
import { useInfiniteScroll } from '@/shared/hooks/useInfiniteScroll';
import useModal from '@/shared/hooks/useModal';
import PageHeader from '@/shared/layout/PageHeader';
import ConfirmModal from '@/shared/ui/ConfirmModal';
import { useState } from 'react';

const SessionPage = () => {
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedSessions, setSelectedSessions] = useState(new Set());
  const {
    data: SessionListData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isSessionsLoading,
  } = useGetSessionList();
  const deleteSessionMutation = useDeleteSession();

  const lastSessionRef = useInfiniteScroll({
    isLoading: isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  });
  const { isModalOpen, handleModalOpen } = useModal();

  const allSessions = SessionListData?.pages?.flatMap(page => page.chatSessions) || [];

  // 단일 선택
  const handleSelectSession = (sessionId: number) => {
    const newSelected = new Set(selectedSessions);
    if (newSelected.has(sessionId)) {
      newSelected.delete(sessionId);
    } else {
      newSelected.add(sessionId);
    }
    setSelectedSessions(newSelected);
  };

  // 전체 선택
  const handleSelectAll = () => {
    if (selectedSessions.size === allSessions.length) {
      setSelectedSessions(new Set());
    } else {
      setSelectedSessions(new Set(allSessions.map(s => s.sessionId)));
    }
  };

  // 삭제
  const handleDeleteSelected = async () => {
    try {
      const ids = convertDeleteString(selectedSessions);
      await deleteSessionMutation.mutate(ids);
      console.log(ids);
    } catch {
      alert('삭제에 실패하였습니다.');
    }

    handleModalOpen(false);
    // api 호출

    // 삭제 완료
    setSelectedSessions(new Set());
    setIsSelectionMode(false);
  };

  return (
    <div className="bg-background min-h-screen relative">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <PageHeader title="대화 이력" />
        <button
          onClick={() => setIsSelectionMode(!isSelectionMode)}
          className="px-8 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
        >
          {isSelectionMode ? '취소' : '선택하기'}
        </button>
      </div>

      {/* 선택 모드 헤더 */}
      {isSelectionMode && (
        <div className="bg-white border-b border-gray-200">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-4">
              <button
                onClick={handleSelectAll}
                className="flex items-center gap-2 text-sm text-blue-600 hover:bg-blue-50 px-2 py-1 rounded-md"
              >
                <div
                  className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                    selectedSessions.size === allSessions.length
                      ? 'bg-blue-500 border-blue-500'
                      : 'border-gray-300'
                  }`}
                >
                  {selectedSessions.size === allSessions.length && (
                    <span className="text-white text-xs">&#10003;</span>
                  )}
                </div>
                전체 선택
              </button>
              <span className="text-sm text-gray-600">{selectedSessions.size}개 선택됨</span>
            </div>

            {selectedSessions.size > 0 && (
              <button
                onClick={() => handleModalOpen(true)}
                className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
              >
                삭제하기
              </button>
            )}
          </div>
        </div>
      )}

      {/* 세션 목록 */}
      <div className="px-4 py-2">
        {isSessionsLoading ? (
          <div className="text-center py-12">
            <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">대화 기록을 불러오는 중...</p>
          </div>
        ) : !isSessionsLoading && allSessions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">대화 기록이 없습니다</p>
          </div>
        ) : (
          <div className="space-y-1">
            {allSessions.map((session, index) => {
              const isLastSession = index === allSessions.length - 1;

              return (
                <div key={session.sessionId} ref={isLastSession ? lastSessionRef : null}>
                  <SessionItem
                    session={session}
                    isSelected={selectedSessions.has(session.sessionId)}
                    onSelect={handleSelectSession}
                    isSelectionMode={isSelectionMode}
                  />
                </div>
              );
            })}
          </div>
        )}

        {/* 추가 로딩 인디케이터 */}
        {isFetchingNextPage && (
          <div className="py-4 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-600">
              <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
              추가 기록을 불러오는 중...
            </div>
          </div>
        )}
      </div>

      {/* 하단 고정 메시지 */}
      {!isSelectionMode && allSessions.length > 0 && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-gray-800 text-white text-sm rounded-lg shadow-lg">
          대화 내용은 최대 30일까지 저장되며 그 이후 기록은 자동으로 삭제됩니다.
        </div>
      )}

      {/* 삭제 확인 모달 */}
      <ConfirmModal
        isOpen={isModalOpen}
        title="정말 삭제하시겠습니까?"
        onConfirm={handleDeleteSelected}
        onCancel={() => handleModalOpen(false)}
        text="삭제한 이력은 복구할 수 없습니다."
      />
    </div>
  );
};

export default SessionPage;
