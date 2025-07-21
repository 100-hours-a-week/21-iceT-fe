import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import useDebounce from '@/shared/hooks/useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('딜레이 시간 이전에는 이전 값을 유지해야 한다', () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: 'initial', delay: 500 },
    });

    expect(result.current).toBe('initial');

    // 값 변경
    rerender({ value: 'updated', delay: 500 });

    // 딜레이 시간 이전에는 이전 값 유지
    expect(result.current).toBe('initial');

    // 딜레이의 절반 시간만 진행
    act(() => {
      vi.advanceTimersByTime(250);
    });

    expect(result.current).toBe('initial');
  });

  it('딜레이 시간 후에 새로운 값으로 업데이트되어야 한다', () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: 'initial', delay: 500 },
    });

    // 값 변경
    rerender({ value: 'updated', delay: 500 });

    // 딜레이 시간 경과
    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current).toBe('updated');
  });

  it('연속적인 값 변경 시 마지막 값만 반영되어야 한다', () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: 'initial', delay: 500 },
    });

    // 연속적인 값 변경
    rerender({ value: 'first', delay: 500 });

    act(() => {
      vi.advanceTimersByTime(100);
    });

    rerender({ value: 'second', delay: 500 });

    act(() => {
      vi.advanceTimersByTime(100);
    });

    rerender({ value: 'final', delay: 500 });

    // 아직 딜레이 시간이 지나지 않았으므로 초기값 유지
    expect(result.current).toBe('initial');

    // 마지막 변경으로부터 딜레이 시간 경과
    act(() => {
      vi.advanceTimersByTime(500);
    });

    // 마지막 값만 반영되어야 함
    expect(result.current).toBe('final');
  });

  it('딜레이 값이 변경되어도 정상 동작해야 한다', () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: 'initial', delay: 500 },
    });

    // 값과 딜레이 동시 변경
    rerender({ value: 'updated', delay: 1000 });

    // 이전 딜레이 시간(500ms) 경과
    act(() => {
      vi.advanceTimersByTime(500);
    });

    // 아직 새로운 딜레이 시간이 지나지 않았으므로 이전 값 유지
    expect(result.current).toBe('initial');

    // 새로운 딜레이 시간(1000ms) 경과
    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current).toBe('updated');
  });

  it('딜레이가 0일 때 즉시 업데이트되어야 한다', () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: 'initial', delay: 0 },
    });

    rerender({ value: 'updated', delay: 0 });

    // 0ms 경과 (즉시)
    act(() => {
      vi.advanceTimersByTime(0);
    });

    expect(result.current).toBe('updated');
  });

  it('컴포넌트 언마운트 시 타이머가 정리되어야 한다', () => {
    const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');

    const { unmount, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: 'initial', delay: 500 },
    });

    // 값 변경으로 타이머 시작
    rerender({ value: 'updated', delay: 500 });

    // 컴포넌트 언마운트
    unmount();

    // clearTimeout이 호출되었는지 확인
    expect(clearTimeoutSpy).toHaveBeenCalled();

    clearTimeoutSpy.mockRestore();
  });

  it('빈 문자열도 정상적으로 디바운스되어야 한다', () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: 'initial', delay: 500 },
    });

    rerender({ value: '', delay: 500 });

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current).toBe('');
  });

  it('실제 타이핑 시나리오를 시뮬레이션해야 한다', () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: '', delay: 300 },
    });

    // 사용자가 "hello"를 타이핑하는 시나리오
    const typingSequence = ['h', 'he', 'hel', 'hell', 'hello'];

    typingSequence.forEach(char => {
      rerender({ value: char, delay: 300 });

      // 각 타이핑 사이에 100ms 간격
      act(() => {
        vi.advanceTimersByTime(100);
      });

      // 아직 딜레이 시간이 지나지 않았으므로 빈 문자열 유지
      expect(result.current).toBe('');
    });

    // 마지막 타이핑 후 딜레이 시간 경과
    act(() => {
      vi.advanceTimersByTime(300);
    });

    // 최종 값만 반영
    expect(result.current).toBe('hello');
  });
});
