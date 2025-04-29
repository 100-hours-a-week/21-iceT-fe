/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Pretendard', ...defaultTheme.fontFamily.sans],
      },
      fontSize: {
        'regular-12': ['12px', { lineHeight: '18px', fontWeight: '400' }],
        'regular-14': ['14px', { lineHeight: '22px', fontWeight: '400' }],
        'regular-16': ['16px', { lineHeight: '24px', fontWeight: '400' }],

        'semibold-12': ['12px', { lineHeight: '18px', fontWeight: '600' }],
        'semibold-14': ['14px', { lineHeight: '22px', fontWeight: '600' }],
        'semibold-16': ['16px', { lineHeight: '24px', fontWeight: '600' }],

        'bold-12': ['12px', { lineHeight: '18px', fontWeight: '700' }],
        'bold-14': ['20px', { lineHeight: '22px', fontWeight: '700' }],
        'bold-16': ['16px', { lineHeight: '24px', fontWeight: '700' }],
      },
      colors: {
        background: '#FFFFFF', // 전체 배경, 피그마:#F9FAFB
        surface: '#FFFFFF', // 카드 배경, 피그마: #FFFFFF
        input: '#F9F9F6', // input 배경

        primary: {
          DEFAULT: '#FF993A', // 메인 주색 (오렌지)
          hover: '#FF8000', // Primary hover (조금 더 진한 오렌지)
          disabled: '#9CA3AF',
        },

        secondary: {
          DEFAULT: '#3AB0FF', // 서브 강조색 (파랑) = 버튼 색
          hover: '#3298E6', // Secondary hover (조금 더 진한 파랑)
          disabled: '#9CA3AF',
        },

        text: {
          primary: '#111827', // 본문 텍스트 (짙은 회색)
          secondary: '#6B7280', // 서브 텍스트
          disabled: '#9CA3AF', // 비활성화 텍스트
          helper: '#6B7280', // Helper 텍스트
          error: '#EF4444', // 에러 텍스트
        },

        success: {
          DEFAULT: '#22C55E', // 성공 색
          hover: '#16A34A',
        },
        warning: {
          DEFAULT: '#FACC15', // 경고 색
          hover: '#EAB308',
        },
        error: {
          DEFAULT: '#EF4444', // 에러 색
          hover: '#DC2626',
        },

        border: {
          DEFAULT: '#EBEBEB', // 기본 테두리
          focused: '#3AB0FF', // 포커스시 테두리 (secondary 색 사용)
        },
      },
    },
  },
  plugins: [],
};
