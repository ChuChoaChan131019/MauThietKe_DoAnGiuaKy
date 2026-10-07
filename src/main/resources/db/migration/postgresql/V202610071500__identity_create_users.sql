CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    avatar_url TEXT,
    avatar_public_id VARCHAR(255),
    role VARCHAR(20) NOT NULL DEFAULT 'USER'
        CHECK (role IN ('USER', 'ADMIN')),
    account_status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE'
        CHECK (account_status IN ('ACTIVE', 'LOCKED')),
    lock_reason VARCHAR(500),
    locked_by BIGINT REFERENCES users(id),
    locked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT ck_users_lock_metadata CHECK (
        (account_status = 'LOCKED'
            AND lock_reason IS NOT NULL
            AND length(trim(lock_reason)) > 0
            AND locked_by IS NOT NULL
            AND locked_at IS NOT NULL)
        OR
        (account_status = 'ACTIVE'
            AND lock_reason IS NULL
            AND locked_by IS NULL
            AND locked_at IS NULL)
    )
);

CREATE UNIQUE INDEX uk_users_email_lower ON users (LOWER(email));
