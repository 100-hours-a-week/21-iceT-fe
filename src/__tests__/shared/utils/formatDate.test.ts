import { formatDate } from '@/utils/formatDate';
import { vi } from 'vitest';

describe('formatDate', () => {
  const fixedNow = new Date('2025-06-17T12:00:00+09:00');

  beforeAll(() => {
    vi.useFakeTimers();
    vi.setSystemTime(fixedNow);
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  it('1분 미만이면 "방금 전"을 반환해야 한다', () => {
    const date = new Date(fixedNow.getTime() - 30 * 1000); // 30초 전
    expect(formatDate(date.toISOString())).toBe('방금 전');
  });

  it('20분 전이면 "20분 전"을 반환해야 한다', () => {
    const date = new Date(fixedNow.getTime() - 20 * 60 * 1000); // 20분 전
    expect(formatDate(date.toISOString())).toBe('20분 전');
  });

  it('3시간 전이면 "3시간 전"을 반환해야 한다', () => {
    const date = new Date(fixedNow.getTime() - 3 * 60 * 60 * 1000); // 3시간 전
    expect(formatDate(date.toISOString())).toBe('3시간 전');
  });

  it('2일 전이면 "2일 전"을 반환해야 한다', () => {
    const date = new Date(fixedNow.getTime() - 2 * 24 * 60 * 60 * 1000); // 2일 전
    expect(formatDate(date.toISOString())).toBe('2일 전');
  });

  it('7일 초과이면 "6월 10일" 형식을 반환해야 한다', () => {
    const date = new Date('2025-06-10T08:00:00+09:00');
    expect(formatDate(date.toISOString())).toBe('6월 10일');
  });

  it('1년 전이면 "2024년 6월 17일" 형식을 반환해야 한다', () => {
    const date = new Date('2024-06-17T08:00:00+09:00');
    expect(formatDate(date.toISOString())).toBe('2024년 6월 17일');
  });

  it('DB 포맷 "2024-06-10T08:31:21.895803" 도 정상 처리되어야 한다', () => {
    const dateStr = '2024-06-10T08:31:21.895803'; // 실제 DB 포맷
    expect(formatDate(dateStr)).toBe('2024년 6월 10일');
  });
});
