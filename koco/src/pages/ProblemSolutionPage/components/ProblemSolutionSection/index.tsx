import React from 'react';

const ProblemSolutionSection = () => {
  return (
    <section className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md space-y-6 mb-30">
      {/* 해설 제목 */}
      <h2 className="text-2xl font-bold">| 해설</h2>
      <br />

      {/* Problem checking */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Problem checking</h3>
        <ul className="list-disc list-inside text-sm text-gray-800 mb-4">
          <li>N개의 물품의 품명과 가격이 주어집니다.</li>
          <li>이 중에서 가장 비싼 물품과 가장 저렴한 물품을 찾아야 합니다.</li>
        </ul>

        <p className="font-semibold text-sm mb-2">알고리즘 정리</p>
        <ul className="list-disc list-inside text-sm text-gray-800">
          <li>
            N개의 물품을 하나씩 훑으면서 가장 낮은 가격과 높은 가격의 물품을 점점 업데이트하는 구현
            문제입니다.
          </li>
          <li>시간복잡도는 O(N)입니다.</li>
        </ul>
      </div>

      {/* Problem solving */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Problem solving</h3>
        <p className="text-sm text-gray-800 leading-relaxed">
          N개의 물품의 품명과 가격을 순서에 맞게 처리해줍니다.
          <br />
          <br />
          먼저 가장 비싼 물품을 찾아냅니다. 우리는 첫 번째 물품부터 N번째 물품까지 중에서 가장 비싼
          물품을 찾아야 합니다. 이 과정에서 모든 물품의 가격을 비교합니다. x→2번째 물품부터 시작하여
          현재까지의 가장 비싼 물품과 가격을 비교하여 갱신해줍니다. 이와 반대로 가장 저렴한 물품도
          마찬가지입니다.
          <br />
          <br />
          만약 품명과 가격을 묶어서 관리하지 않으면, 품명과 가격의 순서가 섞이지 않도록 주의해야
          합니다.
        </p>
      </div>

      {/* Solution code */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Solution Code</h3>
        <div className="bg-black text-white text-sm rounded-md overflow-x-auto p-4 font-mono">
          <pre>
            {`#include <iostream>
using namespace std;
int main()
{
    int n, check[1001] = {0}, m, i, j;
    int cnt = 0;
    scanf("%d", &n);
    for(i = 2; i <= 1000; i++) {
        if(check[i] == 0) {
            for(j = i + i; j <= 1000; j += i)
                check[j] = 1;
        }
    }
    while(n--) {
        scanf("%d", &m);
        if(check[m] == 0) cnt++;
    }
    printf("%d", cnt);
    return 0;
}`}
          </pre>
        </div>
      </div>
    </section>
  );
};

export default ProblemSolutionSection;
