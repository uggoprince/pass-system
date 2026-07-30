CREATE TYPE pass_status AS ENUM ('PENDING','USED','EXPIRED');
  CREATE TABLE passes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    host TEXT,
    valid_date DATE NOT NULL,
    status pass_status NOT NULL DEFAULT 'PENDING',
    used_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
  );