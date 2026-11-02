# 에어컨 설치 업체 홈페이지 + 온라인 예약

Next.js 16 · Tailwind CSS v4 · Supabase

- `/` 홈페이지 (서비스, 가격, **예약 달력**, 진행 과정, FAQ)
- `/admin` 관리자 페이지 (예약 확인·확정·취소, 작업 일정/휴무 추가)
- `/privacy` 개인정보처리방침

## 1. 업체 정보 바꾸기

[`lib/site.ts`](lib/site.ts) 한 파일에 상호, 전화번호, 서비스 지역, 예약 시간대, 가격이 모여 있습니다. `○○`로 표시된 값을 실제 정보로 바꾸세요.
개인정보처리방침 내용은 [`app/privacy/page.tsx`](app/privacy/page.tsx)에서 확인·수정하세요.

## 2. 로컬 실행

```bash
npm install
cp .env.example .env.local   # 값 채우기
npm run dev                  # http://localhost:3000
```

`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`가 비어 있으면 **데모 모드**로 동작합니다 (예시 일정 표시, 예약은 서버 재시작 시 사라짐).

## 3. Supabase 연결 (예약 저장)

1. [supabase.com](https://supabase.com)에서 새 프로젝트 생성 (리전: Northeast Asia (Seoul))
2. **SQL Editor**에 [`supabase/schema.sql`](supabase/schema.sql) 내용을 붙여넣고 Run
3. **Project Settings → API**에서 값을 복사
   - Project URL → `SUPABASE_URL`
   - `service_role` 키 → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ 절대 공개하거나 깃에 올리지 마세요)

## 4. Vercel 배포

1. GitHub에 새 저장소를 만들고 푸시
2. Vercel → Add New → Project → 저장소 선택
3. **Environment Variables**에 `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_PASSWORD` 입력 후 Deploy
4. 환경 변수를 나중에 바꾸면 **Redeploy** 해야 반영됩니다.

## 예약 데이터 구조

| kind | 의미 | 고객 달력 표시 |
|---|---|---|
| `booking` | 고객 온라인 예약 | "예약 완료" (이름·연락처 비공개) |
| `job` | 사장님이 추가한 작업 일정 | "작업 일정 · 작업명" |
| `blocked` | 휴무 / 예약 막기 | "휴무" |

`slot`이 `all`이면 종일 일정이라 그날은 고객 예약이 막힙니다.
