CREATE TABLE IF NOT EXISTS users (
  id uuid primary key default uuid_generate_v4(),
  username char(20) unique,
  password char(60),
  created_at timestamp with time zone default CURRENT_TIMESTAMP,
  modified_at timestamp with time zone default CURRENT_TIMESTAMP,
  permissions jsonb,
  is_deleted boolean default FALSE
);

CREATE TABLE IF NOT EXISTS user_sessions (
  sid varchar NOT NULL COLLATE "default" primary key,
	sess json NOT NULL,
	expire timestamp(6) NOT NULL
);

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE OR REPLACE FUNCTION update_modified() RETURNS TRIGGER
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.modified_at = now();
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS update_user_modtime ON users;
CREATE TRIGGER update_user_modtime
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE PROCEDURE  update_modified();
