export const convertDeleteString = (set: Set<unknown>): string => {
  return Array.from(set).join(', ');
};
