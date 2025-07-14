/**
 * 백준 티어 숫자 값을 사람이 읽기 쉬운 형식으로 변환합니다.
 * 예: "0" -> "Unrated", "5.0" -> "Bronze 1", "30.0" -> "Ruby 1" 등
 *
 * @param tierValue 백준에서 제공하는 티어 값 (문자열)
 * @returns 읽기 쉬운 티어 이름 (예: "Silver 1")
 */

export const formatBaekjoonTier = (tierValue: string): string => {
  // 입력값이 없거나 "0"인 경우 Unrated 반환
  if (!tierValue || tierValue === '0' || tierValue === '0.0') return 'Unrated';

  try {
    // 소수점으로 분리
    const [level] = tierValue.split('.').map(Number);

    // 티어 및 서브레벨 결정
    let tier: string;
    let subLevel: number;

    if (level <= 5) {
      tier = 'Bronze';
      subLevel = 5 - ((level - 1) % 5);
    } else if (level <= 10) {
      tier = 'Silver';
      subLevel = 5 - ((level - 6) % 5);
    } else if (level <= 15) {
      tier = 'Gold';
      subLevel = 5 - ((level - 11) % 5);
    } else if (level <= 20) {
      tier = 'Platinum';
      subLevel = 5 - ((level - 16) % 5);
    } else if (level <= 25) {
      tier = 'Diamond';
      subLevel = 5 - ((level - 21) % 5);
    } else if (level <= 30) {
      tier = 'Ruby';
      subLevel = 5 - ((level - 26) % 5);
    } else if (level <= 35) {
      tier = 'Master';
      subLevel = 5 - ((level - 31) % 5);
    } else {
      return 'Unrated'; // 알 수 없는 레벨
    }

    return `${tier} ${subLevel}`;
  } catch (error) {
    console.error('티어 변환 중 오류 발생:', error);

    return 'Unrated';
  }
};
