import MDEditor from '@uiw/react-md-editor';
import { useState } from 'react';

interface ISolutionProps {
  problemCheck?: string;
  problemSolving?: string;
  algorithm?: string;
  solutionCode?: { cpp?: string; java?: string; python?: string };
}

// 줄바꿈 처리를 위한 포맷 함수
const formatCode = (code: string | undefined) => {
  if (!code) return '';

  return code.replace(/\\n/g, '\n');
};

// problemSolving 전용 포맷 함수
const formatProblemSolving = (text: string | undefined) => {
  if (!text) return '';

  let formattedText = text;

  // 줄바꿈이 없는 경우 "다. "를 기준으로 줄바꿈 추가
  if (!text.includes('\n')) {
    formattedText = formattedText.replace(/다\.\s+/g, '다.\n');
  }

  return formattedText;
};

const ProblemSolutionSection = ({
  solutionCode,
  problemCheck,
  problemSolving,
  algorithm,
}: ISolutionProps) => {
  const [selectedLanguage, setSelectedLanguage] = useState('cpp');
  const getLanguageExtension = (language: string) => {
    switch (language) {
      case 'cpp':
        return 'cpp';
      case 'java':
        return 'java';
      case 'python':
        return 'python';
      default:
        return 'text';
    }
  };

  // 마크다운 형식으로 코드 블록 생성
  const getMarkdownCode = () => {
    const code = getCode();
    const extension = getLanguageExtension(selectedLanguage);

    return `\`\`\`${extension}\n${code}\n\`\`\``;
  };

  // 현재 선택된 언어에 따라 코드 반환
  const getCode = () => {
    switch (selectedLanguage) {
      case 'cpp':
        return formatCode(solutionCode?.cpp);
      case 'java':
        return formatCode(solutionCode?.java);
      case 'python':
        return formatCode(solutionCode?.python);
      default:
        return '';
    }
  };

  // 복사 버튼 클릭 시 처리 함수
  const handleCopyClick = () => {
    const code = getCode();
    navigator.clipboard.writeText(code);
  };

  return (
    <section className="max-w-2xl mx-auto p-6 bg-surface rounded-lg shadow-md space-y-6 mb-30">
      <h2 className="text-xl font-bold mb-4">| 문제 요약</h2>
      <p className="whitespace-pre-line break-words overflow-wrap-anywhere  leading-loose">
        <MDEditor.Markdown source={problemCheck} />
      </p>
      <h2 className="text-xl font-bold mb-4 ">| 알고리즘</h2>
      <p className="whitespace-pre-line break-words overflow-wrap-anywhere  leading-loose">
        <MDEditor.Markdown source={formatProblemSolving(algorithm)} />
      </p>
      <h2 className="text-xl font-bold mb-4">| 풀이</h2>
      <p className="whitespace-pre-line break-words overflow-wrap-anywhere leading-loose">
        <MDEditor.Markdown source={formatProblemSolving(problemSolving)} />
      </p>
      <div>
        <h2 className="text-xl font-bold mb-4">| 솔루션 코드</h2>
        <div className="flex justify-between items-center mb-2">
          <select
            value={selectedLanguage}
            onChange={e => setSelectedLanguage(e.currentTarget.value)}
            className="text-sm bg-gray-200 text-black px-2 py-1 rounded"
          >
            <option value="cpp">C++</option>
            <option value="java">Java</option>
            <option value="python">Python</option>
          </select>

          <button
            onClick={handleCopyClick}
            className="text-sm  hover:bg-gray-300 text-black px-3 py-1 rounded flex items-center transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            복사
          </button>
        </div>
        <div className="rounded-lg overflow-hidden">
          <div className="bg-[#2d2d30] px-4 py-2 flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full" />
            <div className="w-3 h-3 bg-yellow-500 rounded-full" />
            <div className="w-3 h-3 bg-green-500 rounded-full" />
            <span className="text-gray-400 text-sm ml-4">solution.{selectedLanguage}</span>
          </div>

          <MDEditor.Markdown
            source={getMarkdownCode()}
            style={{
              backgroundColor: 'transparent',
              color: 'inherit',
            }}
            data-color-mode="dark"
          />
        </div>
      </div>
    </section>
  );
};

export default ProblemSolutionSection;
