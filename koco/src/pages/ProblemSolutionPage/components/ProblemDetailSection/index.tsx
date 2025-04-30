const ProblemDetailSection = () => {
  return (
    <section className="p-6 sh">
      {/* 문제 제목 */}
      <div className="flex justify-between items-center mb-4 text-sm text-gray-500">
        <span>&lt; 이전 문제</span>
        <span>다음 문제 &gt;</span>
      </div>
      <h1 className="text-xl font-bold">1978번 소수찾기</h1>

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
            <td className="border-border px-3 py-2">1초</td>
            <td className="border-border px-3 py-2">128 MB</td>
            <td className="border-border px-3 py-2">100</td>
            <td className="border-border px-3 py-2">50</td>
            <td className="border-border px-3 py-2">50</td>
            <td className="border-border px-3 py-2">50%</td>
          </tr>
        </tbody>
      </table>

      {/* 문제 설명 */}
      <div className="mb-6 text-sm leading-relaxed text-gray-800">
        <h2 className="font-semibold text-base mb-2">문제</h2>
        <p>주어진 수 N개 중에서 소수가 몇 개인지 찾아서 출력하는 프로그램을 작성하세요.</p>
      </div>

      {/* 입력 */}
      <div className="mb-6 text-sm leading-relaxed text-gray-800">
        <h2 className="font-semibold text-base mb-2">입력</h2>
        <p>
          첫 줄에 수의 개수 N이 주어진다. N은 100이하이다. 다음으로 N개의 수가 주어지는데 수는 1,000
          이하의 자연수이다.
        </p>
      </div>

      {/* 출력 */}
      <div className="mb-6 text-sm leading-relaxed text-gray-800">
        <h2 className="font-semibold text-base mb-2">출력</h2>
        <p>주어진 수들 중 소수의 개수를 출력한다.</p>
      </div>

      {/* 예시 */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <h3 className="font-semibold mb-1">예시 입력</h3>
          <pre className="bg-gray-100 p-3 rounded whitespace-pre-line">4 1 3 5 7</pre>
        </div>
        <div>
          <h3 className="font-semibold mb-1">예시 출력</h3>
          <pre className="bg-gray-100 p-3 rounded">3</pre>
        </div>
      </div>
    </section>
  );
};

export default ProblemDetailSection;
