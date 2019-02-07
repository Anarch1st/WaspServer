CREATE TABLE IF NOT EXISTS login_history (
  sessionId varchar primary key,
  userId uuid,
  ip char(50),
  login_at timestamp with time zone,
  logout_at timestamp with time zone
)

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
