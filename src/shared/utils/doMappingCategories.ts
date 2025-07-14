import { ALGORITHM_CATEGORY_MAPPING } from '@/constants/algorithmCategoriesMapping';

// 한글 → 영어 역매핑
export const KOREAN_TO_ENGLISH_MAPPING: Record<string, string> = Object.fromEntries(
  Object.entries(ALGORITHM_CATEGORY_MAPPING).map(([english, korean]) => [korean, english])
);

// 한글 카테고리 목록 (UI에서 사용)
export const KOREAN_ALGORITHM_CATEGORIES = Object.values(ALGORITHM_CATEGORY_MAPPING).sort();

// 영어 카테고리 목록 (DB 저장용)
export const ENGLISH_ALGORITHM_CATEGORIES = Object.keys(ALGORITHM_CATEGORY_MAPPING).sort();

/**
 * 한글 카테고리를 영어로 변환
 */
export const convertKoreanToEnglish = (koreanCategories: string[]): string[] => {
  return koreanCategories.map(korean => KOREAN_TO_ENGLISH_MAPPING[korean]).filter(Boolean); // undefined 제거
};

/**
 * 영어 카테고리 배열을 한글로 변환
 */
export const convertEnglishToKorean = (englishCategories: string[]): string[] => {
  return englishCategories.map(english => ALGORITHM_CATEGORY_MAPPING[english]).filter(Boolean); // undefined 제거
};

/**
 * 영어 카테고리를 한글로 변환
 */
export const convertEnglishCategoryToKorean = (englishCategory: string): string => {
  return ALGORITHM_CATEGORY_MAPPING[englishCategory]; // undefined 제거
};
