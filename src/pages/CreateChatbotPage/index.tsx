import useStartSession from '@/features/chatbot/hooks/useStartSession';
import useInput from '@/shared/hooks/useInput';
import useSubmitButton from '@/shared/hooks/useSubmitButton';
import BottomNav from '@/shared/layout/BottomNav';
import PageHeader from '@/shared/layout/PageHeader';
import Button from '@/shared/ui/Button';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateChatbotPage = () => {
  const navigate = useNavigate();
  const { value: problemNumber, onChange: onChangeProblemNumber } = useInput();
  const [selectedLanguage, setSelectedLanguage] = useState('C++');
  const [selectedMode, setSelectedMode] = useState('라이브 코딩 면접 대비');
  const { value: code, onChange: onChangeCode } = useInput('');
  const startSessionMutation = useStartSession();

  const [isLoading, setIsLoading] = useState(false);

  // 문제 번호 유효성 검사
  const problemNumberError = useMemo(() => {
    if (!problemNumber) return null;

    if (!/^\d+$/.test(problemNumber)) {
      return '문제 번호는 숫자만 작성 가능합니다.';
    }

    if (problemNumber.length < 1 || problemNumber.length > 6) {
      return '문제 번호는 1-6자리만 작성 가능합니다.';
    }

    return null;
  }, [problemNumber]);

  // 코드 유효성 검사
  const codeError = useMemo(() => {
    if (!code) return '코드를 입력해주세요.';

    if (code.length > 10000) {
      return '최대 10000자까지 입력가능합니다.';
    }

    return null;
  }, [code]);

  // 전체 제출 에러
  const submitErr = problemNumberError || codeError;
  const { isDisabled, buttonText } = useSubmitButton({ isLoading, submitErr });

  // 챗봇 모드 데이터 처리
  const convertModeText = (mode: string | undefined) => {
    if (mode === '내 코드 피드백') return 'feedback';
    if (mode === '라이브 코딩 면접 대비') return 'interview';

    return '';
  };

  const handleSubmit = async () => {
    if (submitErr) return;

    console.log({
      problemNumber: Number(problemNumber),
      language: selectedLanguage,
      mode: convertModeText(selectedMode),
      userCode: code,
    });

    setIsLoading(true);
    try {
      //1. api 호출
      await startSessionMutation.mutate(
        {
          problemNumber: Number(problemNumber),
          language: selectedLanguage,
          mode: convertModeText(selectedMode),
          userCode: code,
        },
        {
          onSuccess: data =>
            navigate(`/chatbot/${data.sessionId}`, { state: { mode: selectedMode, code: code } }),
        }
      );
      // 2. SSE 연결
    } catch {
      alert('백준에 존재하지 않는 문제 번호입니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-background min-h-screen relative">
      <PageHeader title="챗봇" />
      <div className="px-4 space-y-6 mb-6">
        {/* 문제 번호 섹션 */}
        <div>
          <div className="flex items-center gap-3 mb-3">
            <label className="text-lg font-medium text-gray-900">문제 번호</label>
          </div>
          <input
            type="text"
            value={problemNumber}
            onChange={onChangeProblemNumber}
            placeholder="문제 번호를 입력해주세요"
            className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-100'
            focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {problemNumberError && <p className="text-red-500 text-sm mt-1">{problemNumberError}</p>}
        </div>

        {/* 언어 선택 섹션 */}
        <div>
          <label className="block text-lg font-medium text-gray-900 mb-3">언어 선택</label>
          <div className="flex gap-3">
            {['c++', 'java', 'python'].map(lang => (
              <button
                key={lang}
                onClick={() => setSelectedLanguage(lang)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedLanguage === lang
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        {/* 챗봇 모드 섹션 */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <label className="text-lg font-medium text-gray-900">챗봇 모드</label>
            <span className="text-red-500">*</span>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setSelectedMode('내 코드 피드백')}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg border transition-colors ${
                selectedMode === '내 코드 피드백'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white hover:bg-gray-50'
              }`}
            >
              <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">📖</div>
              <span className="text-sm font-medium">내 코드 피드백</span>
            </button>

            <button
              onClick={() => setSelectedMode('라이브 코딩 면접 대비')}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg border transition-colors ${
                selectedMode === '라이브 코딩 면접 대비'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white hover:bg-gray-50'
              }`}
            >
              <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
                👥
              </div>
              <span className="text-sm font-medium">라이브 코딩 면접 대비</span>
            </button>
          </div>
        </div>

        {/* 내 코드 입력 섹션 */}
        <div>
          <label className="block text-lg font-medium text-gray-900 mb-3">내 코드 입력</label>
          <textarea
            value={code}
            onChange={onChangeCode}
            placeholder="코드를 입력해주세요"
            className="w-full h-80 px-4 py-3 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm resize-none"
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-gray-500">{code.length}/10000</span>
          </div>
        </div>

        {/* AI 채팅 시작하기 버튼 */}
        <div className="pb-20 text-center">
          <Button onClick={handleSubmit} disabled={isDisabled}>
            {buttonText}
          </Button>
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default CreateChatbotPage;
