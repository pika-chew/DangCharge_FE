# 당충전 프론트엔드

국내 충전소를 찾고 충전기를 예약하는 웹 앱입니다. 화면은 피그마 디자인을 기준으로 구현되어 있습니다. 로그인은 실제 API에 연결되어 있고, 나머지 화면은 아직 예시 데이터와 데모 동작을 사용합니다. API 계약은 `openapi/`의 명세를 기준으로 확인합니다.

## 기술 스택

- React 19, TypeScript, Vite 8
- React Router 8 선언형 라우팅
- pnpm, ESLint, Tailwind CSS 4, shadcn/ui, lucide-react 아이콘
- 폼은 React Hook Form과 Zod(`@hookform/resolvers/zod`)로 입력값을 검증합니다. 스키마는 해당 폼 훅(`useLoginForm`, `useSignupForm`)에 둡니다.
- `src/index.css`는 Tailwind 진입점과 전역 디자인 토큰·기본 스타일입니다. 화면별 CSS 파일은 만들지 않습니다.
- 백엔드 연동 시 서버 상태는 TanStack Query, HTTP 요청은 Axios를 사용하고 Orval로 요청 함수·타입·훅을 생성합니다. 선택·입력처럼 화면 안에서만 쓰는 상태는 React 상태나 훅으로 다룹니다.

## 명령어

```bash
pnpm install  # 의존성 설치
pnpm dev      # 개발 서버
pnpm lint     # ESLint 검사
pnpm build    # TypeScript 검사와 배포용 빌드
pnpm test     # 로그인·인증 세션 테스트
pnpm api:generate # 저장된 OpenAPI 명세로 코드 생성
pnpm api:sync     # 서버 명세 갱신 후 코드 생성
```

Orval 설정은 `orval.config.ts`, 원본 명세는 `openapi/`, 생성 결과는 `src/api/generated/`에 둡니다. GET은 query, POST·PATCH·DELETE는 command만 사용하며 command의 테스트용 GET은 생성하지 않습니다. 생성 파일은 직접 수정하지 않고 명세와 함께 커밋합니다. 생성 파일 내부의 상대 import는 Orval이 관리합니다. 공통 Axios 설정은 `src/api/client/`에서 관리하고 외부에서는 `@/api` barrel을 사용합니다. 로그인은 실제 API를 사용하며, 인증 토큰은 `src/lib/auth/`에서 관리합니다. 토큰 자동 재발급과 서버 로그아웃은 아직 연결하지 않았습니다.

`package.json`의 의존성을 바꿀 때는 pnpm을 사용하고 `pnpm-lock.yaml`도 함께 갱신합니다. shadcn/ui 컴포넌트는 `pnpm exec shadcn add <이름>`으로 추가하고, 기존 `src/components/ui` 파일을 덮어쓰지 않습니다. API 연동 작업 중에는 테스트·lint·build를 사용자가 직접 수행하므로 에이전트는 실행하지 않습니다. 그 외 코드 변경 후에는 `pnpm lint`와 `pnpm build`를 실행합니다.

## 폴더 구조

```text
src/
├── api/                 # Orval 생성 코드와 공통 Axios 설정
├── app/
│   └── App.tsx          # 라우트 정의와 공통 레이아웃
├── assets/              # 피그마에서 받은 정적 이미지·아이콘
├── components/
│   ├── auth/            # 로그인 상태 Provider, 라우트 가드, 로그인·회원가입 폼
│   ├── common/          # 여러 화면에서 쓰는 정보 칸, 확인 창(ConfirmDialog, StopChargingDialog)
│   ├── history/         # 충전 내역 카드(충전 중·충전 완료)
│   ├── layout/          # 헤더, 로고, 뒤로가기 링크
│   ├── main/            # 메인 화면의 검색·지도·목록·카드
│   ├── mypage/          # 마이페이지 요약 카드, 충전 내역 링크, 로그아웃
│   ├── reservation/     # 예약 날짜·시간 선택, 예약 확정, 예약 완료
│   ├── station/         # 충전소 상세 요약, 충전기 선택
│   └── ui/              # shadcn/ui 기반 공통 컴포넌트
├── constants/           # 디자인 토큰, 화면 예시 데이터
├── hooks/               # 화면 동작과 폼을 묶는 훅
├── lib/                 # shadcn/ui 유틸리티(utils.ts), 날짜 유틸리티(date.ts)
├── pages/               # 경로별 얇은 페이지 컴포넌트
├── types/               # 공유 타입
├── index.css            # Tailwind와 전역 스타일·디자인 토큰
└── main.tsx             # 앱 진입점, BrowserRouter와 AuthProvider
```

페이지 파일은 데이터 조회와 컴포넌트 조합만 담당하게 간결하게 유지합니다. 관련 컴포넌트는 기능별 폴더에 두고, 두 개 이상의 기능에서 쓰는 컴포넌트는 `common/`이나 `layout/`으로 옮깁니다. 필요한 파일이 생길 때만 폴더를 추가합니다.

## 디자인 토큰

피그마 Variables를 한 번 내보내 저장해 두었습니다. 피그마를 다시 열지 않고 아래 파일을 기준으로 작업합니다.

- `src/constants/design-tokens.json`: 피그마에서 내보낸 원본입니다. 다시 내보내면 이 파일을 교체하고 아래 두 곳을 맞춥니다.
- `src/index.css`: Primitive 색은 `:root`의 `--dc-*`, Semantic 토큰은 `@theme inline`에 있습니다.
- `src/constants/tokens.ts`: 같은 값을 TypeScript 상수로 둔 것입니다.

화면에서는 토큰 유틸리티를 우선 사용하고, 토큰에 없는 값만 임의 값(`text-[30px]` 등)으로 씁니다.

| 종류 | 유틸리티 |
| --- | --- |
| 배경 | `bg-canvas`, `bg-surface`, `bg-brand`, `bg-brand-subtle`, `bg-success-subtle` |
| 글자색 | `text-fg-primary`, `text-fg-secondary`, `text-fg-tertiary`, `text-fg-on-brand`, `text-brand`, `text-success` |
| 테두리 | `border-line`, `border-brand` |
| 글자 | `text-display-36`, `text-heading-24`, `text-heading-20`, `text-body-14`, `text-body-14-strong`, `text-label-12`, `text-caption-12` |
| radius | `rounded-14`, `rounded-18`, `rounded-26` |
| 그림자 | `shadow-card` |

간격 토큰(4·8·12·16·20·24·40px)은 Tailwind 기본 단위와 같아서 `1`·`2`·`3`·`4`·`5`·`6`·`10`을 씁니다. `brand-hover`는 피그마에 없는 값입니다. 브레이크포인트는 피그마에 없어서 아직 정하지 않았습니다.

## 이름과 코드 작성

- 컴포넌트 파일과 컴포넌트 이름은 PascalCase를 사용합니다. 예: `StationDetailPage.tsx`, `StationDetailPage`.
- 훅은 `use`로 시작하고, 일반 함수와 변수는 camelCase를 사용합니다.
- 페이지는 이름 있는 함수 선언과 named export를 사용합니다. 메인 화면은 `MainPage.tsx`입니다.
- 프로젝트 내부 import는 `@/` 절대경로를 사용합니다. 폴더 밖에서 가져오는 공개 모듈은 해당 폴더의 `index.ts` barrel을 거칩니다. 폴더 내부 형제 파일은 순환 참조를 피하도록 직접 가져올 수 있습니다.
- 일반 화면 스타일은 Tailwind 유틸리티로 작성하고, 색상·글꼴 같은 전역 기준은 `src/index.css`에 둡니다. shadcn/ui 컴포넌트를 우선 재사용합니다.
- 예시 데이터 타입은 `Sample` 접두사를 붙입니다. 예: `SampleStation`, `SampleCharger`.
- TypeScript 타입을 명확히 유지하고, 불필요한 `any`를 쓰지 않습니다.
- 주석은 코드만으로 알 수 없는 제약이나 계약을 설명할 때만 남깁니다.

## 라우팅

라우트는 `src/app/App.tsx`에서 관리합니다. 경로를 바꾸면 `README.md`의 화면 경로도 함께 수정합니다.

| 화면 | 경로 | 레이아웃 |
| --- | --- | --- |
| 메인 | `/` | 헤더(마이페이지 버튼) |
| 로그인 | `/login` | 헤더 없음 |
| 회원가입 | `/signup` | 헤더 없음 |
| 마이페이지 | `/mypage` | 헤더(로고만) |
| 충전 내역 | `/history` | 헤더 없음 |
| 충전소 상세 | `/stations/:stationId` | 헤더(마이페이지 버튼) |
| 충전기 예약 | `/reservation/:chargerId` | 헤더 없음 |
| 예약 완료 | `/reservation/complete` | 헤더 없음 |

헤더가 있는 화면은 `PageLayout`, 없는 화면은 `HeaderlessLayout` 아래에 둡니다.

로그인과 회원가입은 `GuestOnly` 아래에 두어 로그인한 사용자는 항상 메인(`/`)으로 보냅니다. 나머지 화면과 없는 경로(`*`)는 `RequireAuth` 아래에 두어, 로그인하지 않은 사용자는 로그인 화면으로 보냅니다. 로그인 후에도 이전 경로로 복귀하지 않고 항상 메인으로 이동합니다. 로그인한 사용자가 없는 경로에 들어오면 `NotFoundPage`를 보여줍니다. 새 화면을 추가할 때도 이 두 가드 중 하나 아래에 둡니다. 이 가드는 화면 이동만 막으며, 실제 접근 제어는 백엔드 인증이 맡습니다.

고유 ID는 경로 매개변수로, 검색·필터 같은 선택 상태는 쿼리 매개변수로 표현합니다. `/reservation/complete`는 완료 화면으로 예약하며 `complete`를 충전기 ID로 사용하지 않습니다. 지금은 예약 화면이 `?chargerId=&date=YYYY-MM-DD&time=HH:mm` 쿼리로 완료 화면에 예약 정보를 넘깁니다.

## 데이터와 기능 범위

- 백엔드 계약이 정해지기 전에는 API 주소, 인증 방식, 예약 상태, 충전소 데이터 형식을 임의로 확정하지 않습니다.
- 예약 가능 여부와 예약 성공 여부는 백엔드 응답을 기준으로 구현합니다.
- 화면의 충전소·충전기·예약 시간·차종·충전 내역·마이페이지 정보는 `src/constants`의 예시 데이터입니다. API 계약 후 응답으로 교체합니다.
- 아래 동작은 API 연결 전 데모용이며, 코드에 같은 내용의 주석이 있습니다. API를 연결할 때 백엔드 응답 기준으로 바꿉니다.
  - 로그아웃: 마이페이지 맨 아래 버튼을 누르고 확인 창에서 확정하면 브라우저의 토큰·Query 캐시를 비우고 로그인 화면으로 이동합니다. 서버 로그아웃 API는 아직 연결하지 않았습니다.
  - 회원가입: 입력값이 유효하면 로그인 화면으로 이동합니다. 가입 정보는 저장하지 않습니다.
  - 예약 확정: 확인 창에서 확정하면 선택한 날짜·시간으로 완료 화면으로 이동합니다.
  - 충전 완료: 예약 완료 화면과 충전 내역의 충전 중 카드에서 확인 창(`StopChargingDialog`)으로 확정하면 해당 화면 상태만 충전 완료로 바뀝니다. 두 화면의 상태는 서로 공유되지 않고, 새로고침하면 초기화됩니다.
- 예약 날짜는 오늘부터 7일을 화면에서 만들고, 시작 시간은 예시 데이터입니다.
- 로그인은 command의 실제 API를 호출하고, 성공 응답의 access·refresh 토큰을 `sessionStorage`에 보관합니다. `AuthProvider`가 로그인 상태를 제공하고 화면에서는 `useAuth`로 읽습니다. 두 서비스의 Axios 요청에 access 토큰을 첨부합니다. 자동 재발급은 아직 구현하지 않았습니다.
- 예약 상세·차량 정보 수정·영수증 화면은 경로가 정해지지 않아 해당 버튼이 동작하지 않습니다.
