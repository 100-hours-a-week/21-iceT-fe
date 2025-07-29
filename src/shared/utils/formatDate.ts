/**
 *
 * @param dateString
 * @returns '방금 전', '5분 전', '3시간 전', '2일 전', '6월 4일', '2025년 6월 4일' 형식
 */
export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) {
    return '방금 전';
  } else if (diffMinutes < 60) {
    return `${diffMinutes}분 전`;
  } else if (diffHours < 24) {
    return `${diffHours}시간 전`;
  } else if (diffDays < 7) {
    return `${diffDays}일 전`;
  } else {
    // 올해가 아니면 연도도 포함
    const isThisYear = date.getFullYear() === now.getFullYear();

    if (isThisYear) {
      return new Intl.DateTimeFormat('ko-KR', {
        month: 'long',
        day: 'numeric',
      }).format(date);
    } else {
      return new Intl.DateTimeFormat('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(date);
    }
  }
};
