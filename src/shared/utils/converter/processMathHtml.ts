/**
 *
 * @param html
 * @returns processedHtml (중복 요소를 가공한 html)
 */
export const processMathHtml = (html: string) => {
  if (!html) return '';

  // 수식 추출
  const processedHtml = html.replace(
    /<mjx-container[^>]*>[\s\S]*?<span aria-hidden="true" class="no-mathjax mjx-copytext">([\s\S]*?)<\/span><\/mjx-container>/g,
    (match, latexContent) => {
      return latexContent;
    }
  );

  return processedHtml;
};
