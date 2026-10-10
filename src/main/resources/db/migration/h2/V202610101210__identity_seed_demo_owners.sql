INSERT INTO users (full_name, email, password_hash, role, account_status, created_at, updated_at)
SELECT 'Nola Demo Owner', 'demo-owner-nola@senvia.local',
       '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
       'USER', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM users WHERE LOWER(email) = 'demo-owner-nola@senvia.local');

INSERT INTO users (full_name, email, password_hash, role, account_status, created_at, updated_at)
SELECT 'Mori Demo Owner', 'demo-owner-mori@senvia.local',
       '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
       'USER', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM users WHERE LOWER(email) = 'demo-owner-mori@senvia.local');

INSERT INTO users (full_name, email, password_hash, role, account_status, created_at, updated_at)
SELECT 'Kanso Demo Owner', 'demo-owner-kanso@senvia.local',
       '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
       'USER', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM users WHERE LOWER(email) = 'demo-owner-kanso@senvia.local');

INSERT INTO users (full_name, email, password_hash, role, account_status, created_at, updated_at)
SELECT 'Maison Demo Owner', 'demo-owner-maison@senvia.local',
       '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
       'USER', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM users WHERE LOWER(email) = 'demo-owner-maison@senvia.local');

INSERT INTO users (full_name, email, password_hash, role, account_status, created_at, updated_at)
SELECT 'Form Demo Owner', 'demo-owner-form@senvia.local',
       '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
       'USER', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM users WHERE LOWER(email) = 'demo-owner-form@senvia.local');

INSERT INTO users (full_name, email, password_hash, role, account_status, created_at, updated_at)
SELECT 'Aster Demo Owner', 'demo-owner-aster@senvia.local',
       '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
       'USER', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM users WHERE LOWER(email) = 'demo-owner-aster@senvia.local');
