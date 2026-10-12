# 당충전 프론트엔드

React, TypeScript, Vite, pnpm 기반 웹 앱입니다.

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

`stationId`와 `chargerId`는 실제 데이터의 고유 ID를 넣습니다. 예약 완료 화면에 예약 ID를 전달하는 방식은 백엔드 계약이 정해질 때 확정합니다. 현재 각 화면은 경로 확인용 뼈대입니다.

## 폴더 구조

- `src/app`: 앱 라우팅과 공통 레이아웃
- `src/pages`: 경로별 페이지 컴포넌트
- `src/index.css`: 현재 공통 스타일

기능별 코드가 늘어나면 해당 기능 폴더를 만들고, 여러 화면에서 쓰이는 코드만 `src/shared`로 옮깁니다.
