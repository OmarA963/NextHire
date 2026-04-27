-- ============================================================
-- NextHire Database Initialization Script
-- PostgreSQL Compatible (pg v8.x)
-- 18 tables covering all NextHire features
-- ============================================================

-- Enable pgcrypto for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- DROP TABLES (safe ordering respects FK dependencies)
-- ============================================================
DROP TABLE IF EXISTS Notifications       CASCADE;
DROP TABLE IF EXISTS ChatHistories       CASCADE;
DROP TABLE IF EXISTS SkillResources      CASCADE;
DROP TABLE IF EXISTS OfferComparisons    CASCADE;
DROP TABLE IF EXISTS PivotPredictions    CASCADE;
DROP TABLE IF EXISTS CoverLetters        CASCADE;
DROP TABLE IF EXISTS InterviewSessions   CASCADE;
DROP TABLE IF EXISTS CareerRoadmaps      CASCADE;
DROP TABLE IF EXISTS ScoreReports        CASCADE;
DROP TABLE IF EXISTS MatchReports        CASCADE;
DROP TABLE IF EXISTS ApplicationNotes    CASCADE;
DROP TABLE IF EXISTS JobApplications     CASCADE;
DROP TABLE IF EXISTS CVs                 CASCADE;
DROP TABLE IF EXISTS SavedJobs           CASCADE;
DROP TABLE IF EXISTS JobPosts            CASCADE;
DROP TABLE IF EXISTS Employers           CASCADE;
DROP TABLE IF EXISTS Candidates          CASCADE;
DROP TABLE IF EXISTS Users               CASCADE;

-- ============================================================
-- ENUM TYPES
-- ============================================================
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS job_type CASCADE;
DROP TYPE IF EXISTS job_status CASCADE;
DROP TYPE IF EXISTS app_status CASCADE;
DROP TYPE IF EXISTS difficulty_level CASCADE;
DROP TYPE IF EXISTS cover_letter_tone CASCADE;

CREATE TYPE user_role AS ENUM ('CANDIDATE', 'EMPLOYER', 'ADMIN');
CREATE TYPE job_type AS ENUM ('FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'REMOTE');
CREATE TYPE job_status AS ENUM ('OPEN', 'CLOSED', 'DRAFT');
CREATE TYPE app_status AS ENUM ('APPLIED', 'IN_REVIEW', 'INTERVIEW_SCHEDULED', 'INTERVIEW_COMPLETED', 'OFFER_RECEIVED', 'ACCEPTED', 'REJECTED');
CREATE TYPE difficulty_level AS ENUM ('EASY', 'MEDIUM', 'HARD');
CREATE TYPE cover_letter_tone AS ENUM ('FORMAL', 'CREATIVE', 'CONCISE');

-- ============================================================
-- 1. Users
-- ============================================================
CREATE TABLE Users (
    user_id         UUID        NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(100) NOT NULL,
    email           VARCHAR(150) NOT NULL UNIQUE,
    password_hash   TEXT        NOT NULL,
    role            user_role   NOT NULL DEFAULT 'CANDIDATE',
    face_descriptor TEXT        NULL,   -- JSON array of numbers
    is_active       BOOLEAN     NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMP   NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP   NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 2. Candidates
-- ============================================================
CREATE TABLE Candidates (
    candidate_id    UUID        NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID        NOT NULL UNIQUE REFERENCES Users(user_id) ON DELETE CASCADE,
    candidate_role  VARCHAR(100),
    target_role     VARCHAR(100),
    skills          JSONB,
    linkedin_url    TEXT,
    summary         TEXT,
    created_at      TIMESTAMP   NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP   NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 3. Employers
-- ============================================================
CREATE TABLE Employers (
    employer_id     UUID        NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID        NOT NULL UNIQUE REFERENCES Users(user_id) ON DELETE CASCADE,
    company_name    VARCHAR(150),
    industry        VARCHAR(100),
    website_url     TEXT,
    logo_url        TEXT,
    description     TEXT,
    created_at      TIMESTAMP   NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP   NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 4. JobPosts
-- ============================================================
CREATE TABLE JobPosts (
    job_id          UUID        NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    employer_id     UUID        NOT NULL REFERENCES Employers(employer_id) ON DELETE CASCADE,
    title           VARCHAR(200) NOT NULL,
    description     TEXT,
    location        VARCHAR(150),
    job_type        job_type    NOT NULL DEFAULT 'FULL_TIME',
    salary_min      NUMERIC(12,2),
    salary_max      NUMERIC(12,2),
    currency        VARCHAR(10) DEFAULT 'USD',
    required_skills JSONB,
    status          job_status  NOT NULL DEFAULT 'OPEN',
    deadline        DATE,
    created_at      TIMESTAMP   NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP   NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 5. CVs
-- ============================================================
CREATE TABLE CVs (
    cv_id           UUID        NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id    UUID        NOT NULL REFERENCES Candidates(candidate_id) ON DELETE CASCADE,
    file_path       TEXT,
    personal_info   JSONB,
    experience      JSONB,
    education       JSONB,
    skills          JSONB,
    projects        JSONB,
    is_current      BOOLEAN     NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMP   NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP   NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 6. SavedJobs (Neural Bookmarks)
-- ============================================================
CREATE TABLE SavedJobs (
    save_id         UUID        NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id    UUID        NOT NULL REFERENCES Candidates(candidate_id) ON DELETE CASCADE,
    job_id          UUID        NOT NULL REFERENCES JobPosts(job_id) ON DELETE CASCADE,
    created_at      TIMESTAMP   NOT NULL DEFAULT NOW(),
    CONSTRAINT UQ_SavedJob UNIQUE (candidate_id, job_id)
);

-- ============================================================
-- 7. JobApplications
-- ============================================================
CREATE TABLE JobApplications (
    application_id  UUID        NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id    UUID        NOT NULL REFERENCES Candidates(candidate_id) ON DELETE CASCADE,
    job_id          UUID        NOT NULL REFERENCES JobPosts(job_id) ON DELETE CASCADE,
    cv_id           UUID        REFERENCES CVs(cv_id) ON DELETE SET NULL,
    status          app_status  NOT NULL DEFAULT 'APPLIED',
    cover_note      TEXT,
    applied_at      TIMESTAMP   NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP   NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 8. ApplicationNotes
-- ============================================================
CREATE TABLE ApplicationNotes (
    note_id         UUID        NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id  UUID        NOT NULL REFERENCES JobApplications(application_id) ON DELETE CASCADE,
    author_id       UUID        NOT NULL REFERENCES Users(user_id) ON DELETE CASCADE,
    content         TEXT        NOT NULL,
    created_at      TIMESTAMP   NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 9. ScoreReports (CV Scorer AI)
-- ============================================================
CREATE TABLE ScoreReports (
    score_id        UUID        NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id    UUID        NOT NULL REFERENCES Candidates(candidate_id) ON DELETE CASCADE,
    cv_id           UUID        REFERENCES CVs(cv_id) ON DELETE SET NULL,
    overall_score   NUMERIC(5,2),
    recommendations JSONB,
    generated_at    TIMESTAMP   NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 10. MatchReports (Resume Matcher AI)
-- ============================================================
CREATE TABLE MatchReports (
    report_id       UUID        NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id    UUID        NOT NULL REFERENCES Candidates(candidate_id) ON DELETE CASCADE,
    job_id          UUID        REFERENCES JobPosts(job_id) ON DELETE SET NULL,
    cv_id           UUID        REFERENCES CVs(cv_id) ON DELETE SET NULL,
    match_percentage NUMERIC(5,2),
    gap_analysis    JSONB,
    generated_at    TIMESTAMP   NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 11. CoverLetters (Cover Letter Architect AI)
-- ============================================================
CREATE TABLE CoverLetters (
    letter_id       UUID        NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id    UUID        NOT NULL REFERENCES Candidates(candidate_id) ON DELETE CASCADE,
    job_id          UUID        REFERENCES JobPosts(job_id) ON DELETE SET NULL,
    content         TEXT,
    tone            cover_letter_tone NOT NULL DEFAULT 'FORMAL',
    generated_at    TIMESTAMP   NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 12. CareerRoadmaps (Career Roadmap AI)
-- ============================================================
CREATE TABLE CareerRoadmaps (
    roadmap_id      UUID        NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id    UUID        NOT NULL REFERENCES Candidates(candidate_id) ON DELETE CASCADE,
    target_role     VARCHAR(150),
    phases          JSONB,
    current_phase   INT         DEFAULT 0,
    generated_at    TIMESTAMP   NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP   NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 13. InterviewSessions (Mock Interview AI)
-- ============================================================
CREATE TABLE InterviewSessions (
    session_id      UUID        NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id    UUID        NOT NULL REFERENCES Candidates(candidate_id) ON DELETE CASCADE,
    target_role     VARCHAR(150),
    difficulty      difficulty_level NOT NULL DEFAULT 'MEDIUM',
    questions       JSONB,
    overall_score   NUMERIC(5,2),
    created_at      TIMESTAMP   NOT NULL DEFAULT NOW(),
    completed_at    TIMESTAMP
);

-- ============================================================
-- 14. PivotPredictions (Pivot Predictor AI)
-- ============================================================
CREATE TABLE PivotPredictions (
    pivot_id        UUID        NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id    UUID        NOT NULL REFERENCES Candidates(candidate_id) ON DELETE CASCADE,
    from_role       VARCHAR(150),
    to_role         VARCHAR(150),
    probability_pct NUMERIC(5,2),
    timeline_weeks  INT,
    generated_at    TIMESTAMP   NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 15. OfferComparisons (Offer Weight Calculator AI)
-- ============================================================
CREATE TABLE OfferComparisons (
    comparison_id   UUID        NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id    UUID        NOT NULL REFERENCES Candidates(candidate_id) ON DELETE CASCADE,
    offers          JSONB,
    recommendation  TEXT,
    created_at      TIMESTAMP   NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 16. ChatHistories (AI Chat Widget)
-- ============================================================
CREATE TABLE ChatHistories (
    chat_id         UUID        NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID        NOT NULL REFERENCES Users(user_id) ON DELETE CASCADE,
    messages        JSONB       NOT NULL DEFAULT '[]',
    page_context    VARCHAR(100),
    session_start   TIMESTAMP   NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 17. SkillResources (Skill-Up Connector)
-- ============================================================
CREATE TABLE SkillResources (
    resource_id     UUID        NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    skill_name      VARCHAR(100) NOT NULL,
    resource_title  VARCHAR(200) NOT NULL,
    resource_url    TEXT        NOT NULL,
    resource_type   VARCHAR(50),
    platform_name   VARCHAR(100),
    estimated_hours NUMERIC(6,1),
    is_free         BOOLEAN     NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMP   NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 18. Notifications
-- ============================================================
CREATE TABLE Notifications (
    notification_id UUID        NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID        NOT NULL REFERENCES Users(user_id) ON DELETE CASCADE,
    title           VARCHAR(200) NOT NULL,
    message         TEXT,
    is_read         BOOLEAN     NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMP   NOT NULL DEFAULT NOW()
);

-- ============================================================
-- INDEXES for performance
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_jobposts_status       ON JobPosts(status);
CREATE INDEX IF NOT EXISTS idx_jobposts_employer     ON JobPosts(employer_id);
CREATE INDEX IF NOT EXISTS idx_applications_candidate ON JobApplications(candidate_id);
CREATE INDEX IF NOT EXISTS idx_applications_job      ON JobApplications(job_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user    ON Notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_cvs_candidate         ON CVs(candidate_id);

-- ============================================================
-- DONE
-- ============================================================
SELECT 'NextHire database initialized successfully! All 18 tables created.' AS status;
