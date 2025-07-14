/**
 * 티어만 추출하는 함수
 * @param tier
 * @returns 'Bronze', 'Silver', ...
 */
export const getTierRank = (tier: string): string => {
  if (!tier) return 'unrated';
  const [rank] = tier.split(' ');

  return rank || 'unrated';
};
