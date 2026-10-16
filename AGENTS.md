# 당충전 프론트엔드

국내 충전소를 찾고 충전기를 예약하는 웹 앱입니다. 현재는 화면 경로만 연결되어 있으며, 인증·예약 API와 충전소 데이터 계약은 확정되지 않았습니다.

## 기술 스택

- React 19, TypeScript, Vite 8
- React Router 8 선언형 라우팅
- pnpm, ESLint, Tailwind CSS 4, shadcn/ui
- `src/index.css`는 Tailwind 진입점과 전역 디자인 토큰·기본 스타일입니다. 화면별 CSS 파일은 만들지 않습니다.
- 백엔드 연동 시 서버 상태는 TanStack Query, HTTP 요청은 Axios를 사용합니다. API 계약 전까지 두 라이브러리를 미리 설치하거나 가짜 요청 계층을 만들지 않습니다. 검색 입력처럼 화면 안에서만 쓰는 상태는 React 상태로 다룹니다.

## 명령어

```bash
pnpm install  # 의존성 설치
pnpm dev      # 개발 서버
pnpm lint     # ESLint 검사
pnpm build    # TypeScript 검사와 배포용 빌드
```

`package.json`의 의존성을 바꿀 때는 pnpm을 사용하고 `pnpm-lock.yaml`도 함께 갱신합니다. 코드 변경 후 `pnpm lint`와 `pnpm build`를 실행합니다.

## 폴더 구조

```text
src/
├── app/
│   └── App.tsx          # 라우트 정의와 공통 레이아웃
├── assets/              # 피그마에서 받은 정적 이미지·아이콘
├── components/
│   ├── layout/          # 헤더 등 레이아웃 컴포넌트
│   ├── main/            # 메인 화면의 검색·지도·목록·카드
│   └── ui/              # shadcn/ui 기반 공통 컴포넌트
├── constants/           # 화면 예시 데이터 등 상수
├── hooks/               # 화면 동작을 묶는 훅
├── lib/                 # shadcn/ui 유틸리티
├── pages/               # 경로별 얇은 페이지 컴포넌트
├── types/               # 공유 타입
├── index.css            # Tailwind와 전역 스타일
└── main.tsx             # 앱 진입점과 BrowserRouter
```

페이지 파일은 컴포넌트 조합만 담당하게 간결하게 유지합니다. 관련 컴포넌트는 기능별 폴더에 둡니다. 필요한 파일이 생길 때만 폴더를 추가합니다.

## 이름과 코드 작성

- 컴포넌트 파일과 컴포넌트 이름은 PascalCase를 사용합니다. 예: `StationDetailPage.tsx`, `StationDetailPage`.
- 훅은 `use`로 시작하고, 일반 함수와 변수는 camelCase를 사용합니다.
- 페이지는 이름 있는 함수 선언과 named export를 사용합니다. 메인 화면은 `MainPage.tsx`입니다.
- 프로젝트 내부 import는 `@/` 절대경로를 사용합니다. 폴더 밖에서 가져오는 공개 모듈은 해당 폴더의 `index.ts` barrel을 거칩니다. 폴더 내부 형제 파일은 순환 참조를 피하도록 직접 가져올 수 있습니다.
- 일반 화면 스타일은 Tailwind 유틸리티로 작성하고, 색상·글꼴 같은 전역 기준은 `src/index.css`에 둡니다. shadcn/ui 컴포넌트를 우선 재사용합니다.
- TypeScript 타입을 명확히 유지하고, 불필요한 `any`를 쓰지 않습니다.
- 주석은 코드만으로 알 수 없는 제약이나 계약을 설명할 때만 남깁니다.

## 라우팅

라우트는 `src/app/App.tsx`에서 관리합니다. 경로를 바꾸면 `README.md`의 화면 경로도 함께 수정합니다.

| 화면 | 경로 |
| --- | --- |
| 메인 | `/` |
| 로그인 | `/login` |
| 회원가입 | `/signup` |
| 마이페이지 | `/mypage` |
| 충전 내역 | `/history` |
| 충전소 상세 | `/stations/:stationId` |
| 충전기 예약 | `/reservation/:chargerId` |
| 예약 완료 | `/reservation/complete` |

고유 ID는 경로 매개변수로, 검색·필터 같은 선택 상태는 쿼리 매개변수로 표현합니다. `/reservation/complete`는 완료 화면으로 예약하며 `complete`를 충전기 ID로 사용하지 않습니다.

## 데이터와 기능 범위

- 백엔드 계약이 정해지기 전에는 API 주소, 인증 방식, 예약 상태, 충전소 데이터 형식을 임의로 확정하지 않습니다.
- 예약 가능 여부와 예약 성공 여부는 백엔드 응답을 기준으로 구현합니다.
- 메인 화면의 충전소 목록과 지도는 피그마의 예시 데이터입니다. 실제 지도·충전소 정보·예약 가능 여부는 API 계약 후 교체합니다.
- 메인 외 현재 페이지의 제목은 경로 확인용입니다. 실제 기능을 구현할 때 임시 표시를 제거합니다.
