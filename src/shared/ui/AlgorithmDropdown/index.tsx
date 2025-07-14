// src/shared/ui/AlgorithmDropdown/index.tsx

import { KOREAN_ALGORITHM_CATEGORIES } from '@/shared/utils/doMappingCategories';
import { useState, useRef, useEffect } from 'react';

interface IAlgorithmDropdownProps {
  selectedTypes: string[];
  onToggleType: (type: string) => void;
  onClearAll: () => void;
}

const AlgorithmDropdown = ({
  selectedTypes,
  onToggleType,
  onClearAll,
}: IAlgorithmDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="flex items-center gap-2 mt-3">
      {/* 드롭다운 버튼 */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors 
               bg-gray-100 text-text-primary hover:bg-gray-200
          }`}
        >
          문제 유형
          {selectedTypes.length > 0 && (
            <span className="bg-white text-secondary px-1.5 py-0.5 rounded-full text-xs font-bold">
              {selectedTypes.length}
            </span>
          )}
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
          >
            <path
              d="M6 9L12 15L18 9"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* 드롭다운 메뉴 */}
        {isOpen && (
          <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-border rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
            <div className="p-3">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium text-gray-700">알고리즘 유형 선택</span>
                {selectedTypes.length > 0 && (
                  <button
                    onClick={onClearAll}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    전체 해제
                  </button>
                )}
              </div>
              <div className="space-y-1">
                {KOREAN_ALGORITHM_CATEGORIES.map(type => (
                  <button
                    key={type}
                    onClick={() => onToggleType(type)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      selectedTypes.includes(type)
                        ? 'bg-secondary text-white'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{type}</span>
                      {selectedTypes.includes(type) && (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path
                            d="M20 6L9 17L4 12"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 선택된 유형들 가로 스크롤 */}
      {selectedTypes.length > 0 && (
        <div className="flex-1 overflow-x-auto">
          <div className="flex gap-2 pb-1" style={{ width: 'max-content' }}>
            {selectedTypes.map(type => (
              <div
                key={type}
                className="flex items-center gap-1 bg-secondary text-white px-3 py-1 rounded-full text-sm whitespace-nowrap"
              >
                <span>{type}</span>
                <button
                  onClick={() => onToggleType(type)}
                  className="hover:bg-secondary-hover rounded-full p-0.5 transition-colors"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M18 6L6 18M6 6L18 18"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AlgorithmDropdown;
