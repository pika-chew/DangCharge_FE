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
pnpm test
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

명세 주소는 `https://api.dangcharge.cloud/query/v3/api-docs`와 `https://api.dangcharge.cloud/command/v3/api-docs`입니다. 실행 시 API 주소는 `.env.example`을 참고해 `.env.local`에서 바꿀 수 있습니다. 주소에는 `/query` 또는 `/command`까지 포함합니다. 로컬 개발의 기본값은 `/query`·`/command`이며 Vite 프록시가 API 서버로 전달합니다.

Vite 프록시는 개발 서버에서만 동작하며 끌 필요가 없습니다. 배포 환경에서도 API 주소 기본값은 `/query`·`/command`입니다. Cloudflare Workers에서는 `worker.ts`가 `functions/_middleware.ts`의 공통 프록시를 호출해 이 경로의 `/api/v1` 요청을 `https://api.dangcharge.cloud`로 전달합니다. 브라우저는 프론트엔드와 같은 출처에 요청하므로 API 서버의 브라우저 CORS 허용 설정에 의존하지 않습니다. 다른 호스팅에서는 동일한 프록시를 구성하거나 절대 API 주소와 백엔드 CORS 허용을 설정해야 합니다.

## Cloudflare Workers 배포

현재 서비스는 Workers Builds의 `npx wrangler deploy`로 배포합니다. Git 연동 프로젝트의 배포 브랜치를 `main`, 빌드 명령을 `pnpm run build`, 배포 명령을 `npx wrangler deploy`로 설정합니다. `wrangler.jsonc`가 Worker 이름(`dangcharge`), 진입 파일(`worker.ts`), 정적 파일 폴더(`dist`)를 지정하므로 Wrangler의 자동 프로젝트 설정에 의존하지 않습니다.

`assets.run_worker_first`는 `/query`·`/command` 경로를 정적 HTML보다 먼저 Worker에서 처리하게 합니다. 나머지 경로는 SPA 정적 파일로 제공합니다. API 도메인으로 이동시키는 Cloudflare Redirect Rule은 비활성화 상태로 유지합니다.

Workers Builds의 Settings > Build에 있는 빌드 환경변수를 아래처럼 설정합니다. Worker 런타임의 Variables and Secrets에만 넣으면 Vite 빌드에는 반영되지 않습니다. 환경변수 변경 후에는 다시 빌드·배포해야 합니다.

```dotenv
VITE_QUERY_API_URL=/query
VITE_COMMAND_API_URL=/command
VITE_NAVER_MAP_CLIENT_ID=네이버_Maps_애플리케이션_Client_ID
```

API 주소 두 개는 생략해도 같은 기본값을 사용합니다. 기존 환경변수가 절대 API 주소라면 위 상대 주소로 바꿔야 Worker 프록시를 거칩니다. API 호출에는 Cloudflare Workers의 이용 한도가 적용됩니다.

별도로 Pages에 배포할 경우 `functions/_middleware.ts`와 `public/_routes.json`을 사용합니다. 이 두 파일만으로는 `wrangler deploy`를 사용하는 Workers에 API 프록시가 배포되지 않습니다.

네이버 콘솔에서는 같은 애플리케이션에 Web Dynamic Map과 Geocoding을 활성화하고, 실제 배포 도메인을 Web 서비스 URL로 등록합니다. Preview 도메인에서도 지도를 사용하려면 해당 주소도 등록해야 합니다. Client Secret은 프론트엔드 환경변수에 넣지 않습니다.

충전소 검색 결과는 백엔드에서 가져오고 좌표가 없으면 주소를 네이버 Geocoding으로 변환해 지도에 표시합니다. 같은 주소의 결과는 Query 캐시로 재사용하고, 주소 변환 요청은 최대 4개씩 실행합니다. Geocoding에는 네이버의 별도 이용 한도와 요금이 적용됩니다.

`QueryClientProvider`는 앱 진입점에 연결되어 있습니다. 로그인·회원가입은 생성된 command 훅으로, 차종 목록은 query 훅으로 실제 API를 호출합니다. 나머지 화면 데이터는 아직 예시 데이터입니다.

## 로그인

로그인은 command의 `POST /api/v1/auth/login`에 `{ loginId, password }`를 전송합니다. 응답의 `success`가 `true`이고 access·refresh 토큰이 모두 유효한 문자열일 때만 로그인 상태로 전환합니다. 성공하면 이전 경로와 관계없이 항상 메인(`/`)으로 이동합니다. 실패·서버 연결 오류는 폼에 표시하고 요청 중에는 중복 제출을 막습니다.

토큰은 `src/lib/auth`에서 관리하고 `sessionStorage`에 보관해 같은 탭의 새로고침 후에도 복원합니다. 저장소 접근이 제한되면 메모리에서만 유지합니다. 공통 Axios 설정은 query·command 요청 모두에 `Authorization: Bearer <accessToken>`을 첨부합니다.

로그아웃은 현재 브라우저의 토큰과 Query 캐시를 비웁니다. 서버 로그아웃 API와 토큰 자동 재발급은 아직 연결하지 않았습니다.

`pnpm test`는 실제 계정을 사용하지 않고 로그인 성공·오류·중복 제출, 메인 이동, 세션 복원과 토큰 첨부를 검증합니다. API 연동 작업 중 테스트·lint·build는 사용자가 직접 실행합니다.

## 회원가입과 차종 목록

회원가입 페이지의 `useVehicleModels`는 query의 `GET /api/v1/vehicle-models`에서 받은 `code`와 `label`로 차종 선택 목록을 만듭니다. 목록을 불러오는 동안이나 요청 실패·빈 목록일 때는 차종 선택과 가입 버튼을 비활성화하고, 실패·빈 목록에는 다시 불러오기 버튼을 제공합니다. 예시 차종은 사용하지 않습니다.

회원가입은 command의 `POST /api/v1/auth/signup`에 `{ loginId, username, password, vehicleModel }`을 전송합니다. `vehicleModel`은 선택한 서버 차종 코드이며 비밀번호 확인 값은 전송하지 않습니다. `success: true` 응답일 때만 로그인 페이지로 이동하며 자동 로그인하지 않습니다. 실패 메시지를 폼에 표시하고 가입 요청 중에는 중복 제출을 막습니다.

아이디는 4~50자의 영문·숫자·`_`·`.`·`-`, 유저네임은 공백 제거 후 1~50자로 검증합니다. 비밀번호는 명세 설명에 맞게 영문과 숫자를 모두 포함하는 8~64자이고, 확인 값과 일치해야 합니다.

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

`stationId`와 `chargerId`는 실제 데이터의 고유 ID를 넣습니다. 지금은 예약 화면이 `/reservation/complete?chargerId=&date=&time=` 쿼리로 완료 화면에 예약 정보를 넘기며, 예약 ID를 전달하는 방식은 예약 API 연결 시 교체합니다. 로그인·회원가입·차종 목록은 실제 API를 사용하고, 나머지 화면 데이터와 예약 처리는 아직 예시 데이터 및 데모 동작입니다. 로그인과 회원가입을 뺀 모든 화면은 로그인해야 들어갈 수 있습니다.

## 폴더 구조

- `src/app`: 앱 라우팅과 공통 레이아웃
- `src/api`: Orval 생성 코드와 공통 Axios 설정
- `src/pages`: 간결한 경로별 페이지 컴포넌트
- `src/components`: 레이아웃·공용·기능별 화면·shadcn/ui 컴포넌트
- `src/constants`, `src/hooks`, `src/types`: 예시 데이터·디자인 토큰·화면 동작·공유 타입
- `src/lib`: shadcn/ui 유틸리티와 날짜 유틸리티
- `src/index.css`: Tailwind 진입점과 전역 디자인 토큰

프로젝트 내부 import는 `@/` 절대경로와 폴더별 `index.ts` barrel을 사용합니다. 백엔드 연동은 TanStack Query, Axios, Orval을 사용합니다.
