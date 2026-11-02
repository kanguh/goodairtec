-- Supabase 대시보드 > SQL Editor 에 붙여넣고 Run 하세요.

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  slot text not null,                -- '09:00' 같은 슬롯 ID, 또는 'all'(종일)
  kind text not null default 'booking'
    check (kind in ('booking', 'job', 'blocked')),  -- 고객 예약 / 작업 일정 / 휴무
  status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'cancelled')),
  name text,
  phone text,
  address text,
  service text,
  memo text,
  created_at timestamptz not null default now()
);

-- 같은 날짜·시간에 유효한 일정은 하나만 (동시 예약 방지)
create unique index if not exists bookings_date_slot_active
  on public.bookings (date, slot)
  where status <> 'cancelled';

create index if not exists bookings_date_idx on public.bookings (date);

-- 공개 키로는 아무것도 읽거나 쓸 수 없게 막고, 서버(service role)에서만 접근
alter table public.bookings enable row level security;
