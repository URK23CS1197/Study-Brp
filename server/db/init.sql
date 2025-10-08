-- server/db/init.sql - COMPLETE SCHEMA

-- ---------------------------------------------------------------------
-- CORE USER & GAMIFICATION TABLES
-- ---------------------------------------------------------------------

-- Users Table: Stores authentication metadata and streak data
CREATE TABLE IF NOT EXISTS users (
    user_id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL, -- Added for secure login
    display_name VARCHAR(100),
    current_streak INTEGER DEFAULT 0,
    highest_streak INTEGER DEFAULT 0,
    last_activity_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Badges Table: Stores all possible badges the system can award
CREATE TABLE IF NOT EXISTS badges (
    badge_id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon_emoji VARCHAR(10)
);

-- User_Badges Table: Tracks which users have earned which badges
CREATE TABLE IF NOT EXISTS user_badges (
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    badge_id INTEGER REFERENCES badges(badge_id) ON DELETE CASCADE,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (user_id, badge_id)
);


-- ---------------------------------------------------------------------
-- LEARNING PATH STRUCTURE TABLES
-- ---------------------------------------------------------------------

-- Learning Paths Table: Top-level course structure
CREATE TABLE IF NOT EXISTS learning_paths (
    path_id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    topic VARCHAR(255) NOT NULL,
    goal TEXT,
    overall_progress NUMERIC(5, 2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Modules Table: Sections within a learning path (e.g., Python Basics, Data Cleaning)
CREATE TABLE IF NOT EXISTS modules (
    module_id SERIAL PRIMARY KEY,
    path_id INTEGER REFERENCES learning_paths(path_id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    sequence_order INTEGER NOT NULL,
    progress NUMERIC(5, 2) DEFAULT 0.00,
    UNIQUE (path_id, sequence_order)
);

-- Activities Table: Individual tasks, lessons, or AFL insertions
CREATE TABLE IF NOT EXISTS activities (
    activity_id SERIAL PRIMARY KEY,
    module_id INTEGER REFERENCES modules(module_id) ON DELETE CASCADE, -- Linked to module
    path_id INTEGER REFERENCES learning_paths(path_id) ON DELETE CASCADE,
    title VARCHAR(512) NOT NULL,
    type VARCHAR(50), -- e.g., 'video', 'quiz', 'article', 'AFL_suggested'
    status VARCHAR(50) DEFAULT 'TO_DO', -- 'TO_DO', 'IN_PROGRESS', 'COMPLETED'
    url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- ---------------------------------------------------------------------
-- PEER COLLABORATION TABLES
-- ---------------------------------------------------------------------

-- Chat Messages Table: For persisting messages sent in the Peer Chat module
CREATE TABLE IF NOT EXISTS chat_messages (
    message_id SERIAL PRIMARY KEY,
    path_id INTEGER REFERENCES learning_paths(path_id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    user_name VARCHAR(100) NOT NULL,
    message_text TEXT NOT NULL,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- ---------------------------------------------------------------------
-- INDEXES & CONSTRAINTS
-- ---------------------------------------------------------------------

-- Ensure fast lookups for user and path data
CREATE INDEX IF NOT EXISTS idx_activities_module_id ON activities (module_id);
CREATE INDEX IF NOT EXISTS idx_messages_path_id ON chat_messages (path_id);
CREATE INDEX IF NOT EXISTS idx_users_streak ON users (current_streak);

-- Optional: You would add a small SQL script here to INSERT the default list of badges
-- (e.g., 7-Day Master, Deep Diver) into the 'badges' table upon initialization.
