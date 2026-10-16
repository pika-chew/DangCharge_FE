# 당충전 프론트엔드

React, TypeScript, Vite, Tailwind CSS, shadcn/ui, React Hook Form, Zod, pnpm 기반 웹 앱입니다.

## 로컬 실행

```bash
pnpm install
pnpm dev
```

코드 검사와 배포용 빌드:

```bash
pnpm lint
pnpm build
```

## API 코드 생성

Orval로 OpenAPI 명세에서 Axios 요청 함수, TypeScript 타입, TanStack Query 훅을 생성합니다.

```bash
pnpm api:generate # 저장된 명세로 생성, 네트워크 불필요
pnpm api:sync     # 서버의 두 명세를 내려받고 다시 생성
```

Orval 8은 Node.js 22.18 이상이 필요합니다. 생성한 파일과 명세는 함께 커밋합니다.

- `orval.config.ts`: query는 GET만, command는 POST·PATCH·DELETE만 생성합니다. command의 테스트용 GET은 제외합니다.
- `openapi/query.json`, `openapi/command.json`: 서버에서 내려받은 원본 명세입니다.
- `src/api/generated/query.ts`, `src/api/generated/command.ts`: 생성 결과입니다. 직접 수정하지 않고 명세 갱신 후 다시 생성합니다. 생성 파일 내부의 상대 import는 Orval이 관리합니다.
- `src/api/client`: 서비스별 Axios 기본 주소와 응답 본문 반환을 담당합니다. `{ success, data, error }` 응답 구조는 그대로 유지합니다.
- 외부에서는 `import { queryApi, commandApi } from '@/api'`로 사용합니다.

명세 주소는 `https://api.dangcharge.cloud/query/v3/api-docs`와 `https://api.dangcharge.cloud/command/v3/api-docs`입니다. 실행 시 API 주소는 `.env.example`을 참고해 `.env.local`에서 바꿀 수 있습니다. 주소에는 `/query` 또는 `/command`까지 포함합니다.

현재는 생성 기반만 준비했습니다. 화면은 데모 상태이며, 인증 토큰 저장·첨부·재발급과 `QueryClientProvider` 연결은 실제 화면 연동 단계에서 추가합니다. 생성된 Query 훅을 사용하려면 먼저 `QueryClientProvider`가 필요합니다.

## 화면 경로

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

`stationId`와 `chargerId`는 실제 데이터의 고유 ID를 넣습니다. 지금은 예약 화면이 `/reservation/complete?chargerId=&date=&time=` 쿼리로 완료 화면에 예약 정보를 넘기며, 예약 ID를 전달하는 방식은 백엔드 계약이 정해질 때 확정합니다. 모든 화면은 피그마 디자인과 예시 데이터로 구성되어 있으며, 실제 데이터와 인증·예약 처리는 API 연결 후 교체합니다. 로그인과 회원가입을 뺀 모든 화면은 로그인해야 들어갈 수 있으며, 데모 로그인 계정은 `src/constants/auth.ts`에 있습니다.

## 폴더 구조

- `src/app`: 앱 라우팅과 공통 레이아웃
- `src/pages`: 간결한 경로별 페이지 컴포넌트
- `src/components`: 레이아웃·공용·기능별 화면·shadcn/ui 컴포넌트
- `src/constants`, `src/hooks`, `src/types`: 예시 데이터·디자인 토큰·화면 동작·공유 타입
- `src/lib`: shadcn/ui 유틸리티와 날짜 유틸리티
- `src/index.css`: Tailwind 진입점과 전역 디자인 토큰

프로젝트 내부 import는 `@/` 절대경로와 폴더별 `index.ts` barrel을 사용합니다. 백엔드 연동은 TanStack Query, Axios, Orval을 사용합니다.
