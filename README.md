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

`stationId`와 `chargerId`는 실제 데이터의 고유 ID를 넣습니다. 지금은 예약 화면이 `/reservation/complete?chargerId=&date=&time=` 쿼리로 완료 화면에 예약 정보를 넘기며, 예약 ID를 전달하는 방식은 백엔드 계약이 정해질 때 확정합니다. 모든 화면은 피그마 디자인과 예시 데이터로 구성되어 있으며, 실제 데이터와 인증·예약 처리는 API 연결 후 교체합니다. 데모 로그인 계정은 `src/constants/auth.ts`에 있습니다.

## 폴더 구조

- `src/app`: 앱 라우팅과 공통 레이아웃
- `src/pages`: 간결한 경로별 페이지 컴포넌트
- `src/components`: 레이아웃·공용·기능별 화면·shadcn/ui 컴포넌트
- `src/constants`, `src/hooks`, `src/types`: 예시 데이터·디자인 토큰·화면 동작·공유 타입
- `src/lib`: shadcn/ui 유틸리티와 날짜 유틸리티
- `src/index.css`: Tailwind 진입점과 전역 디자인 토큰

프로젝트 내부 import는 `@/` 절대경로와 폴더별 `index.ts` barrel을 사용합니다. 백엔드 연동 시 서버 상태는 TanStack Query, HTTP 요청은 Axios를 사용할 예정입니다.
