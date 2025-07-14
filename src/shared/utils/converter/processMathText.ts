/**
 * 수식 앞쪽의 문자열을 처리하는 함수
 * 수식 부분($...$)은 그대로 남기고, 수식 바로 앞의 텍스트는 공백 전까지 지웁니다.
 *
 * @param {string} text - 처리할 텍스트
 * @returns {string} - 처리된 텍스트
 */
// 수식 처리 함수
export const processMathText = (text: string) => {
  // 비공백 문자들(최소 탐욕적) + $ + 수식 내용 + $ 패턴을 찾음
  return text.replace(/(\S+?)(\$[^$]*?(?:\\\\\\$[^$]*?)*?\$)/g, (match, prefix, formula) => {
    // prefix는 수식 바로 앞의 단어, formula는 수식 부분
    return formula;
  });
};
