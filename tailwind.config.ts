/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Pretendard', ...defaultTheme.fontFamily.sans],
        jua: ['Jua', 'sans-serif'],
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
        background: '#FFFFFF', //rgb(247, 246, 246) 전체 배경, 피그마:#F9FAFBrgb(255, 255, 255) #f8f9fa #f8f9fa
        surface: '#FFFFFF', // 카드 배경, 피그마: #FFFFFF
        input: '#F9F9F6', // input 배경 #F9F9F6

        primary: {
          DEFAULT: '#FF993A', // 메인 주색 (오렌지) #FF993A
          hover: '#FF8000', // Primary hover (조금 더 진한 오렌지) #FF8000
          disabled: '#9CA3AF',
        },

        secondary: {
          DEFAULT: '#3AB0FF', // 서브 강조색 (파랑) = 버튼 색 #3AB0FF
          hover: '#3298E6', // Secondary hover (조금 더 진한 파랑)  #3298E6
          disabled: '#9CA3AF',
        },

        text: {
          primary: '#111827', // 본문 텍스트 (짙은 회색) #111827
          secondary: '#6B7280', // 서브 텍스트 #6B7280
          disabled: '#9CA3AF', // 비활성화 텍스트 #9CA3AF
          helper: '#6B7280', // Helper 텍스트 #6B7280
          error: '#EF4444', // 에러 텍스트 #EF4444
        },

        success: {
          DEFAULT: '#22C55E', // 성공 색 #22C55E
          hover: '#16A34A', // #16A34A
        },
        warning: {
          DEFAULT: '#EAB308', // #EAB308
        },
        error: {
          DEFAULT: '#EF4444', // 에러 색 #EF4444
          hover: '#DC2626', // #DC2626
        },

        border: {
          DEFAULT: '#EBEBEB', // 기본 테두리 #EBEBEB
          focused: '#3AB0FF', // 포커스시 테두리 (secondary 색 사용) #3AB0FF
        },
        tier: {
          bronze: '#AD5600', // 브론즈 #AD5600
          silver: '#435F7A', // 실버 #435F7A
          gold: '#EC9A00', // 골드 #EC9A00
          platinum: '#27E2A4', // 플래티넘 #27E2A4
          diamond: '#00B4FC', // 다이아몬드 #00B4FC
          ruby: '#FF0062', // 루비 #FF0062
          master: '#9D0191', // 마스터 #9D0191
          unrated: '#777777', // 무등급 #777777
        },
        category: '#7dd9fd', // #7dd9fd
        alarm: {
          unread: {
            bg: '#eff6ff', // #eff6ff
            border: '#bfdbfe', // #bfdbfe
          },
        },
      },
    },
  },
  plugins: [],
};
