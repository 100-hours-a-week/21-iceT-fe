/**
 *
 * @param rank
 * @returns 티어에 해당하는 색상
 */
export const getTierColor = (rank: string): string => {
  switch (rank) {
    case 'Bronze':
      return '#AD5600';
    case 'Silver':
      return '#435F7A';
    case 'Gold':
      return '#EC9A00';
    case 'Platinum':
      return '#27E2A4';
    case 'Diamond':
      return '#00B4FC';
    case 'Ruby':
      return '#FF0062';
    case 'Master':
      return '#9D0191';
    default:
      return '#777777'; // unrated
  }
};
