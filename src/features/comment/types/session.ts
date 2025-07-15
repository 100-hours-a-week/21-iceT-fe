// 세션 히스토리 데이터 타입 정의
export type SessionHistoryRecord = {
  role: string;
  content: string;
  createdAt: string;
};

export type SessionHistoryData = {
  sessionId: string;
  title: string;
  date: string;
  type: string;
  records: SessionHistoryRecord[];
};
