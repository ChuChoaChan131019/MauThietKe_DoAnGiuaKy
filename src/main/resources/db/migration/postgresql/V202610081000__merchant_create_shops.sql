CREATE TABLE shops (
    id BIGSERIAL PRIMARY KEY,
    owner_id BIGINT NOT NULL UNIQUE REFERENCES users(id),
    shop_name VARCHAR(150) NOT NULL,
    description TEXT,
    logo_url TEXT,
    logo_public_id VARCHAR(255),
    phone VARCHAR(20) NOT NULL,
    address TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING'
        CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'LOCKED')),
    rejection_reason TEXT,
    approved_by BIGINT REFERENCES users(id),
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    approved_at TIMESTAMPTZ,
    lock_reason VARCHAR(500),
    locked_by BIGINT REFERENCES users(id),
    locked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
