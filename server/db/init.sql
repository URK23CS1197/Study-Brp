-- server/db/init.sql

-- Users Table (Minimal)
CREATE TABLE IF NOT EXISTS users (
    user_id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    current_streak INTEGER DEFAULT 0,
    last_activity_date TIMESTAMP WITH TIME ZONE
);

-- Learning Paths Table (Courses)
CREATE TABLE IF NOT EXISTS learning_paths (
    path_id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(user_id),
    topic VARCHAR(255) NOT NULL,
    overall_progress NUMERIC(5, 2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activities Table (Tasks, Videos, Quizzes)
CREATE TABLE IF NOT EXISTS activities (
    activity_id SERIAL PRIMARY KEY,
    path_id INTEGER REFERENCES learning_paths(path_id) ON DELETE CASCADE,
    title VARCHAR(512) NOT NULL,
    type VARCHAR(50), -- e.g., 'video', 'quiz', 'article', 'AFL_suggested'
    status VARCHAR(50) DEFAULT 'TO_DO', -- 'TO_DO', 'IN_PROGRESS', 'COMPLETED'
    url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ensure indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_activities_path_id ON activities (path_id);
CREATE INDEX IF NOT EXISTS idx_users_streak ON users (current_streak);

-- You would add tables for modules, peer collaboration chats, and badges here.