import { IGetProblemSolutionResponse } from '@/features/problemSet/api/getProblemSolution';
import { processMathHtml } from '@/features/problemSet/utils/processMathHtml';
import { processMathText } from '@/features/problemSet/utils/processMathText';
import { MathJax, MathJaxContext } from 'better-react-mathjax';
import { useEffect } from 'react';
import { Fragment } from 'react/jsx-runtime';

const ProblemDetailSection = (data: IGetProblemSolutionResponse) => {
  // 수식 적용 위한 설정
  const config = {
    loader: { load: ['input/tex', 'output/svg'] }, // svg 렌더러 명시
    tex: {
      inlineMath: [['$', '$']], // 인라인 수학 표현식을 구분하는 기호를 정의
    },
    options: {
      renderActions: {
        addMenu: [], // UI에서 보여지는 컨텍스트 메뉴 제거
        checkLoading: [],
      },
    },
  };

  const divideExampleText = (text: string) => {
    if (!text) return [];

    // 두 줄 띄기를 기준으로 블록을 나누어 리턴
    return text.split(/\n\s*\n/).filter(block => block.trim() !== '');
  };

  const inputBlocks = divideExampleText(data.inputExample);
  const outputBlocks = divideExampleText(data.outputExample);
  const cleanedHtml = processMathHtml(data.description);

  useEffect(() => {
    if (window.MathJax?.typesetPromise) {
      window.MathJax.typesetPromise();
    }
  }, [data]);

  return (
    <MathJaxContext config={config}>
      <section className="p-6 sh bg-surface">
        {/* 문제 제목 */}

        <div className="flex justify-between mb-2">
          <h1 className="text-xl font-bold">
            {data?.problemNumber}번 {data.title}
          </h1>
          {data.bojUrl && (
            <a
              href={data.bojUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 px-3 bg-surface text-white rounded-md transition-colors text-sm font-medium"
            >
              백준 문제 바로가기 →
            </a>
          )}
        </div>

        {/* 제한 조건 테이블 */}
        <table className="w-full mt-4 mb-6 text-sm border border-border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border-border px-3 py-2">시간 제한</th>
              <th className="border-border px-3 py-2">메모리 제한</th>
              <th className="border-border px-3 py-2">제출</th>
              <th className="border-border px-3 py-2">정답</th>
              <th className="border-border px-3 py-2">맞힌 사람</th>
              <th className="border-border px-3 py-2">정답 비율</th>
            </tr>
          </thead>
          <tbody>
            <tr className="text-center">
              <td className="border-border px-3 py-2">{data.timeLimit} 초</td>
              <td className="border-border px-3 py-2">{data.memoryLimit} MB</td>
              <td className="border-border px-3 py-2">{data.submissionCnt} 개</td>
              <td className="border-border px-3 py-2">{data.answerCnt} 개</td>
              <td className="border-border px-3 py-2">{data.correctPplCnt} 명</td>
              <td className="border-border px-3 py-2">{data.correctRate} %</td>
            </tr>
          </tbody>
        </table>

        {/* 문제 설명 */}
        <div className="mb-6 text-sm leading-relaxed text-gray-800">
          <h2 className="font-semibold text-xl mb-2">문제</h2>

          <div
            className="text-base leading-loose"
            dangerouslySetInnerHTML={{ __html: cleanedHtml }}
          />
        </div>

        {/* 입력 */}
        <div className="mb-6 text-sm leading-relaxed text-gray-800">
          <h2 className="font-semibold text-xl mb-2">입력</h2>
          <MathJax> {processMathText(data.inputDescription)}</MathJax>
        </div>

        {/* 출력 */}
        <div className="mb-6 text-sm leading-relaxed text-gray-800">
          <h2 className="font-semibold text-xl mb-2">출력</h2>
          <MathJax> {processMathText(data.outputDescription)}</MathJax>
        </div>

        {/* 예시 */}

        <div className="space-y-4 text-sm">
          {inputBlocks.map((input, index) => (
            <Fragment key={`example-${index}`}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-base mb-1">예제 입력 {index + 1}</h3>
                  <pre className="bg-gray-100 p-3 rounded whitespace-pre-line">{input}</pre>
                </div>
                <div>
                  <h3 className="font-semibold text-base mb-1">예제 출력 {index + 1}</h3>
                  <pre className="bg-gray-100 p-3 rounded whitespace-pre-line ">
                    {outputBlocks[index] ?? ''}
                  </pre>
                </div>
              </div>
            </Fragment>
          ))}
        </div>
      </section>
    </MathJaxContext>
  );
};

export default ProblemDetailSection;
