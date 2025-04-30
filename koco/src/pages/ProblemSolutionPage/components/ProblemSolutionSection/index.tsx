import React, { useState } from 'react';

interface ISolutionProps {
  explanation: string;
  solutionCode: { cpp: string; java: string; python: string };
}

const ProblemSolutionSection = ({ explanation, solutionCode }: ISolutionProps) => {
  const [selectedLanguage, setSelectedLanguage] = useState('cpp');

  return (
    <section className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md space-y-6 mb-30">
      <h2 className="text-xl font-bold mb-2">| 해설</h2>
      <div>{explanation}</div>

      <div>
        <h2 className="text-xl font-bold mb-2">| Solution Code</h2>
        <div className="mb-2">
          <select
            value={selectedLanguage}
            onChange={e => setSelectedLanguage(e.currentTarget.value)}
            className="text-sm bg-gray-200 text-black px-2 py-1 rounded"
          >
            <option value="cpp">C++</option>
            <option value="java">Java</option>
            <option value="python">Python</option>
          </select>
        </div>
        <div className="bg-black text-white text-sm rounded-md overflow-x-auto p-4 font-mono">
          {selectedLanguage === 'cpp'
            ? solutionCode.cpp
            : selectedLanguage === 'java'
              ? solutionCode.java
              : solutionCode.python}
        </div>
      </div>
    </section>
  );
};

export default ProblemSolutionSection;
