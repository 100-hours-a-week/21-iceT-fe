interface IChatbotSystemMessage {
  mode: string;
}

const ChatbotSystemMessage = ({ mode }: IChatbotSystemMessage) => {
  const getMessage = (currentMode: string) => {
    if (currentMode === '라이브 코딩 면접 대비') {
      return `코코 챗봇 서비스입니다.
코딩테스트 모의 면접을 시작하겠습니다.`;
    } else if (currentMode === '내 코드 피드백') {
      return `코코 챗봇 서비스입니다.
코드 피드백을 시작하겠습니다.`;
    }

    return '코코 챗봇 서비스입니다.';
  };

  return (
    <div className="animate-fadeInUp bg-slate-50 border border-slate-200 text-slate-700 p-2 rounded-lg shadow-md max-w-md mx-auto">
      <div className="text-center">
        <div className="mb-2">
          <div className="inline-block p-2 bg-slate-100 rounded-full">
            <svg className="w-6 h-6 text-slate-600" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
        <div className="whitespace-pre-line text-base leading-normal">{getMessage(mode)}</div>
      </div>
    </div>
  );
};

export default ChatbotSystemMessage;
