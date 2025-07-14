import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

declare global {
  // eslint-disable-next-line
  interface Window {
    gtag: (
      command: string,
      action: string,
      params?: {
        page_path?: string;
        page_title?: string;
        [key: string]: any;
      }
    ) => void;
  }
}

// GA4 이벤트 추적 유틸리티 함수들
export const trackEvent = (eventName: string, params?: Record<string, any>) => {
  window.gtag('event', eventName, params);
};

export const trackPageView = (path: string, title: string) => {
  window.gtag('config', 'G-F65YSR8RB6', {
    page_path: path,
    page_title: title,
  });
};

export const trackTimeSpent = (page: string, timeSpent: number) => {
  trackEvent('time_spent', {
    page,
    time_spent_seconds: timeSpent,
  });
};

export const trackButtonClick = (buttonName: string, page: string) => {
  trackEvent('button_click', {
    button_name: buttonName,
    page,
  });
};

export const trackProblemInteraction = (
  action: 'view' | 'solve' | 'submit',
  problemId: number,
  problemTitle: string
) => {
  trackEvent('problem_interaction', {
    action,
    problem_id: problemId,
    problem_title: problemTitle,
  });
};

// 자동 이벤트 추적을 위한 함수들
const trackScrollDepth = () => {
  const scrollPercent = Math.round(
    ((window.scrollY + window.innerHeight) / document.documentElement.scrollHeight) * 100
  );

  if (
    scrollPercent === 25 ||
    scrollPercent === 50 ||
    scrollPercent === 75 ||
    scrollPercent === 100
  ) {
    trackEvent('scroll_depth', {
      depth: scrollPercent,
      page: window.location.pathname,
    });
  }
};

const trackUserInteraction = () => {
  // 클릭 이벤트 추적
  document.addEventListener('click', e => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'BUTTON' || target.tagName === 'A') {
      trackEvent('element_click', {
        element_type: target.tagName.toLowerCase(),
        element_text: target.textContent?.trim(),
        element_id: target.id,
        element_class: target.className,
        page: window.location.pathname,
      });
    }
  });

  // 폼 제출 이벤트 추적
  document.addEventListener('submit', e => {
    const form = e.target as HTMLFormElement;
    trackEvent('form_submit', {
      form_id: form.id,
      form_action: form.action,
      page: window.location.pathname,
    });
  });
};

const GoogleAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    // 페이지 뷰 추적
    trackPageView(location.pathname + location.search, document.title);

    // 스크롤 깊이 추적
    window.addEventListener('scroll', trackScrollDepth);

    // 사용자 상호작용 추적
    trackUserInteraction();

    // 페이지 체류 시간 추적
    const startTime = Date.now();

    return () => {
      const endTime = Date.now();
      const timeSpent = Math.round((endTime - startTime) / 1000);
      trackTimeSpent(location.pathname, timeSpent);

      // 이벤트 리스너 제거
      window.removeEventListener('scroll', trackScrollDepth);
    };
  }, [location]);

  return null;
};

export default GoogleAnalytics;
