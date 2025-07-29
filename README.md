
<img width="1738" height="1079" alt="image (40)" src="https://github.com/user-attachments/assets/7752d10d-0b07-4430-bdb3-bf749b090751" />

# KOCO (코코) - 코딩 교육 플랫폼

카카오테크 부트캠프 교육생을 위한 코딩테스트 교육 플랫폼입니다.

## 📋 프로젝트 개요

KOCO는 알고리즘 문제 해설, 사용자 학습 통계, 커뮤니티 기능을 제공하는 웹 애플리케이션입니다.  
교육생들이 효율적으로 코딩테스트를 준비할 수 있도록 돕는 것이 목표입니다.

## 🛠 기술 스택

### Frontend

- **React 19** - UI 라이브러리  
- **TypeScript** - 타입 안전성  
- **Vite** - 빠른 빌드 도구  
- **TailwindCSS 4** - 유틸리티 기반 스타일링  
- **React Router 7** - 클라이언트 사이드 라우팅  
- **React Query** - 서버 상태 관리  
- **Zustand** - 전역 상태 관리  

### Libraries & Tools

- **Axios** - HTTP 클라이언트  
- **Chart.js** - 데이터 시각화  
- **MathJax** - 수식 렌더링  
- **MDEditor** - 마크다운 에디터  
- **ESLint & Prettier** - 코드 포매팅 및 린팅  
- **Vitest** - 유닛 테스트 프레임워크  

## 🚀 주요 기능

### 인증 시스템

- 카카오 소셜 로그인  
- JWT 기반 인증  
- 자동 토큰 갱신  

### 문제 해설 시스템

- 일별 출제 문제 조회  
- 백준 티어 시스템 연동  
- 상세 문제 해설 제공  
- 수식 렌더링 지원 (MathJax)  

### 학습 관리

- 문제 풀이 설문 시스템  
- 개인 학습 통계 시각화 (레이더 차트)  

### 커뮤니티

- 게시글 CRUD (마크다운 지원)  
- 댓글 시스템  
- 좋아요 기능  
- 알고리즘 유형별 필터링  
- 검색 기능  
- 인기 게시글 조회  

### 알림 시스템

- 실시간 알림  
- 댓글/좋아요 알림  
- 알림 목록 관리  
- 커서 기반 페이지네이션  

### 사용자 관리

- 프로필 이미지/닉네임/상태메시지 수정  
- S3 Presigned URL 방식 업로드  
- 내 게시글 목록 관리  

### 🎮 부가 기능

- 춘식이 키우기 게임  


## 🏗 아키텍처 특징

### Feature-Based Architecture

기능 단위로 폴더를 구성하여 유지보수성과 확장성 확보

### Custom Hooks 패턴

비즈니스 로직을 커스텀 훅으로 분리하여 재사용성 강화


## 🎨 디자인 시스템

### 컬러 팔레트

| 이름      | HEX       |
|-----------|-----------|
| Primary   | `#FF993A` |
| Secondary| `#3AB0FF` |
| Background| `#FFFFFF` |
| Text     | `#111827` |
| Success  | `#22C55E` |
| Error    | `#EF4444` |

### 타이포그래피

- 기본 폰트: **Pretendard**  
- 로고 폰트: **Jua**

## 📱 주요 페이지

- **로그인 페이지** - 카카오 소셜 로그인  
- **메인 페이지** - 오늘의 문제, 학습 통계, 프로필  
- **문제 해설 페이지** - 일별 문제 목록 및 상세 해설  
- **설문 페이지** - 문제 풀이 난이도 설문  
- **커뮤니티 페이지** - 게시글 목록, 검색, 필터링  
- **게시글 상세 페이지** - 댓글, 좋아요, 수정/삭제  
- **게시글 작성/수정 페이지** - 마크다운 에디터  
- **프로필 페이지** - 사용자 정보 관리  
- **알림 페이지** - 알림 목록 관리  

## 🔧 개발 환경 설정

### 필수 요구사항

- Node.js 18+  
- npm 또는 yarn

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 테스트 실행
npm run test

# 린트 검사
npm run lint

# 번들 분석
npm run analyze
```

## 🔐 환경 변수 설정
.env 파일에 다음 내용을 설정하세요:

```env
VITE_API_BASE_URL=your_api_base_url
VITE_KAKAO_CLIENT_ID=your_kakao_client_id
VITE_REDIRECT_URL=your_redirect_url
```

## 👥 기여 가이드
- 이슈 등록
- 브랜치 생성 (feature/이슈번호-작업내용)
- 코드 작성 및 테스트
- ESLint / Prettier 규칙 준수
- PR 생성
- 코드 리뷰 후 병합

자세한 컨벤션은 내부 문서를 참고해주세요 🙏🏻
[컨벤션](https://github.com/100-hours-a-week/21-iceT-wiki/wiki/%5BFE%5D-%EA%B0%9C%EB%B0%9C-%ED%99%98%EA%B2%BD-%EB%B0%8F-%EC%BD%94%EB%94%A9-%EC%BB%A8%EB%B2%A4%EC%85%98)
