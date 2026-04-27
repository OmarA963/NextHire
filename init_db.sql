-- ============================================================
-- NextHire Database Initialization Script
-- Compatible with SQL Server (T-SQL) / PostgreSQL (with minor tweaks)
-- Covers all 18 relational mappings for 15 NextHire features
-- ============================================================

-- ============================================================
-- DROP TABLES (safe ordering respects FK dependencies)
-- ============================================================
IF OBJECT_ID('Notifications',       'U') IS NOT NULL DROP TABLE Notifications;
IF OBJECT_ID('ChatHistories',        'U') IS NOT NULL DROP TABLE ChatHistories;
IF OBJECT_ID('SkillResources',       'U') IS NOT NULL DROP TABLE SkillResources;
IF OBJECT_ID('OfferMetrics',         'U') IS NOT NULL DROP TABLE OfferMetrics;
IF OBJECT_ID('OfferComparisons',     'U') IS NOT NULL DROP TABLE OfferComparisons;
IF OBJECT_ID('PivotPredictions',     'U') IS NOT NULL DROP TABLE PivotPredictions;
IF OBJECT_ID('CoverLetters',         'U') IS NOT NULL DROP TABLE CoverLetters;
IF OBJECT_ID('InterviewSessions',    'U') IS NOT NULL DROP TABLE InterviewSessions;
IF OBJECT_ID('CareerRoadmaps',       'U') IS NOT NULL DROP TABLE CareerRoadmaps;
IF OBJECT_ID('ScoreReports',         'U') IS NOT NULL DROP TABLE ScoreReports;
IF OBJECT_ID('MatchReports',         'U') IS NOT NULL DROP TABLE MatchReports;
IF OBJECT_ID('ApplicationNotes',     'U') IS NOT NULL DROP TABLE ApplicationNotes;
IF OBJECT_ID('JobApplications',      'U') IS NOT NULL DROP TABLE JobApplications;
IF OBJECT_ID('CVs',                  'U') IS NOT NULL DROP TABLE CVs;
IF OBJECT_ID('JobPosts',             'U') IS NOT NULL DROP TABLE JobPosts;
IF OBJECT_ID('SavedJobs',            'U') IS NOT NULL DROP TABLE SavedJobs;
IF OBJECT_ID('Employers',            'U') IS NOT NULL DROP TABLE Employers;
IF OBJECT_ID('Candidates',           'U') IS NOT NULL DROP TABLE Candidates;
IF OBJECT_ID('Users',                'U') IS NOT NULL DROP TABLE Users;

-- ============================================================
-- 1. USERS
--    Central identity store. Role determines Candidate/Employer.
-- ============================================================
CREATE TABLE Users (
    user_id           UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
    name              NVARCHAR(256)    NOT NULL,
    email             NVARCHAR(256)    NOT NULL UNIQUE,
    password_hash     NVARCHAR(512)    NOT NULL,
    role              NVARCHAR(20)     NOT NULL CHECK (role IN ('CANDIDATE','EMPLOYER','ADMIN')),
    face_descriptor   NVARCHAR(MAX)    NULL,   -- JSON array of numbers
    created_at        DATETIME2        NOT NULL DEFAULT GETUTCDATE(),
    updated_at        DATETIME2        NOT NULL DEFAULT GETUTCDATE()
);
CREATE UNIQUE INDEX IX_Users_Email ON Users (email);

-- ============================================================
-- 2. CANDIDATES
--    Extended profile for users with role = 'CANDIDATE'.
-- ============================================================
CREATE TABLE Candidates (
    candidate_id      UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
    user_id           UNIQUEIDENTIFIER NOT NULL UNIQUE
        REFERENCES Users(user_id) ON DELETE CASCADE,
    current_role      NVARCHAR(256)    NULL,
    target_role       NVARCHAR(256)    NULL,
    skills            NVARCHAR(MAX)    NULL,   -- JSON array of skill strings
    linkedin_url      NVARCHAR(512)    NULL,
    summary           NVARCHAR(MAX)    NULL,
    created_at        DATETIME2        NOT NULL DEFAULT GETUTCDATE()
);

-- ============================================================
-- 3. EMPLOYERS
--    Extended profile for users with role = 'EMPLOYER'.
-- ============================================================
CREATE TABLE Employers (
    employer_id       UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
    user_id           UNIQUEIDENTIFIER NOT NULL UNIQUE
        REFERENCES Users(user_id) ON DELETE CASCADE,
    company_name      NVARCHAR(256)    NOT NULL,
    industry          NVARCHAR(128)    NULL,
    website_url       NVARCHAR(512)    NULL,
    logo_url          NVARCHAR(512)    NULL,
    description       NVARCHAR(MAX)    NULL,
    created_at        DATETIME2        NOT NULL DEFAULT GETUTCDATE()
);

-- ============================================================
-- 4. CVs  (Feature: CV Creation / Resume Scorer)
--    Versioned CV documents stored per candidate.
-- ============================================================
CREATE TABLE CVs (
    cv_id             UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
    candidate_id      UNIQUEIDENTIFIER NOT NULL
        REFERENCES Candidates(candidate_id) ON DELETE CASCADE,
    personal_info     NVARCHAR(MAX)    NULL,   -- JSON
    experience        NVARCHAR(MAX)    NULL,   -- JSON array
    education         NVARCHAR(MAX)    NULL,   -- JSON array
    skills            NVARCHAR(MAX)    NULL,   -- JSON array
    projects          NVARCHAR(MAX)    NULL,   -- JSON array
    certifications    NVARCHAR(MAX)    NULL,   -- JSON array
    pdf_url           NVARCHAR(512)    NULL,
    ats_score         DECIMAL(5,2)     NULL,   -- 0.00 – 100.00
    version           INT              NOT NULL DEFAULT 1,
    is_current        BIT              NOT NULL DEFAULT 1,
    created_at        DATETIME2        NOT NULL DEFAULT GETUTCDATE(),
    updated_at        DATETIME2        NOT NULL DEFAULT GETUTCDATE()
);

-- ============================================================
-- 5. JOB_POSTS  (Feature: Post Jobs)
--    Job listings created by employers.
-- ============================================================
CREATE TABLE JobPosts (
    job_id            UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
    employer_id       UNIQUEIDENTIFIER NOT NULL
        REFERENCES Employers(employer_id) ON DELETE CASCADE,
    title             NVARCHAR(256)    NOT NULL,
    description       NVARCHAR(MAX)    NOT NULL,
    required_skills   NVARCHAR(MAX)    NULL,   -- JSON array
    salary_min        DECIMAL(12,2)    NULL,
    salary_max        DECIMAL(12,2)    NULL,
    currency          NVARCHAR(10)     NOT NULL DEFAULT 'EGP',
    job_type          NVARCHAR(30)     NOT NULL
        CHECK (job_type IN ('FULL_TIME','PART_TIME','CONTRACT','REMOTE','HYBRID')),
    location          NVARCHAR(256)    NULL,
    deadline          DATETIME2        NULL,
    is_active         BIT              NOT NULL DEFAULT 1,
    created_at        DATETIME2        NOT NULL DEFAULT GETUTCDATE(),
    updated_at        DATETIME2        NOT NULL DEFAULT GETUTCDATE()
);

-- ============================================================
-- 6. JOB_APPLICATIONS  (Feature: Apply for Job / Application Tracker)
--    Application linking candidates to job posts.
-- ============================================================
CREATE TABLE JobApplications (
    application_id    UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
    candidate_id      UNIQUEIDENTIFIER NOT NULL
        REFERENCES Candidates(candidate_id) ON DELETE NO ACTION,
    job_id            UNIQUEIDENTIFIER NOT NULL
        REFERENCES JobPosts(job_id) ON DELETE NO ACTION,
    cv_id             UNIQUEIDENTIFIER NULL
        REFERENCES CVs(cv_id) ON DELETE SET NULL,
    cover_letter_id   UNIQUEIDENTIFIER NULL,   -- FK added after CoverLetters created
    match_score       DECIMAL(5,2)     NULL,   -- 0.00 – 100.00
    status            NVARCHAR(30)     NOT NULL DEFAULT 'APPLIED'
        CHECK (status IN ('APPLIED','IN_REVIEW','INTERVIEW_SCHEDULED',
                          'INTERVIEW_COMPLETED','OFFER_RECEIVED','ACCEPTED','REJECTED')),
    applied_at        DATETIME2        NOT NULL DEFAULT GETUTCDATE(),
    last_updated      DATETIME2        NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT UQ_CandidateJob UNIQUE (candidate_id, job_id)
);

-- ============================================================
-- 6.5. SAVED_JOBS  (Feature: Neural Bookmarks)
-- ============================================================
CREATE TABLE SavedJobs (
    save_id           UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
    candidate_id      UNIQUEIDENTIFIER NOT NULL
        REFERENCES Candidates(candidate_id) ON DELETE CASCADE,
    job_id            UNIQUEIDENTIFIER NOT NULL
        REFERENCES JobPosts(job_id) ON DELETE CASCADE,
    created_at        DATETIME2        NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT UQ_SavedJob UNIQUE (candidate_id, job_id)
);

-- ============================================================
-- 7. APPLICATION_NOTES  (Feature: Application Tracker - notes)
-- ============================================================
CREATE TABLE ApplicationNotes (
    note_id           UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
    application_id    UNIQUEIDENTIFIER NOT NULL
        REFERENCES JobApplications(application_id) ON DELETE CASCADE,
    author_id         UNIQUEIDENTIFIER NOT NULL
        REFERENCES Users(user_id) ON DELETE NO ACTION,
    content           NVARCHAR(MAX)    NOT NULL,
    created_at        DATETIME2        NOT NULL DEFAULT GETUTCDATE()
);

-- ============================================================
-- 8. MATCH_REPORTS  (Feature: CV-Job Match Score)
-- ============================================================
CREATE TABLE MatchReports (
    report_id         UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
    candidate_id      UNIQUEIDENTIFIER NOT NULL
        REFERENCES Candidates(candidate_id) ON DELETE CASCADE,
    job_id            UNIQUEIDENTIFIER NOT NULL
        REFERENCES JobPosts(job_id) ON DELETE NO ACTION,
    cv_id             UNIQUEIDENTIFIER NULL
        REFERENCES CVs(cv_id) ON DELETE SET NULL,
    match_percentage  DECIMAL(5,2)     NOT NULL,
    matched_keywords  NVARCHAR(MAX)    NULL,   -- JSON array
    gap_keywords      NVARCHAR(MAX)    NULL,   -- JSON array
    suggestions       NVARCHAR(MAX)    NULL,   -- JSON array
    generated_at      DATETIME2        NOT NULL DEFAULT GETUTCDATE()
);

-- ============================================================
-- 9. SCORE_REPORTS  (Feature: Resume Scorer)
-- ============================================================
CREATE TABLE ScoreReports (
    score_id          UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
    candidate_id      UNIQUEIDENTIFIER NOT NULL
        REFERENCES Candidates(candidate_id) ON DELETE CASCADE,
    cv_id             UNIQUEIDENTIFIER NULL
        REFERENCES CVs(cv_id) ON DELETE SET NULL,
    overall_score     DECIMAL(5,2)     NOT NULL,
    formatting_score  DECIMAL(5,2)     NULL,
    keyword_score     DECIMAL(5,2)     NULL,
    impact_score      DECIMAL(5,2)     NULL,
    completeness_score DECIMAL(5,2)    NULL,
    ats_compat_score  DECIMAL(5,2)     NULL,
    recommendations   NVARCHAR(MAX)    NULL,   -- JSON array of improvement tips
    generated_at      DATETIME2        NOT NULL DEFAULT GETUTCDATE()
);

-- ============================================================
-- 10. CAREER_ROADMAPS  (Feature: AI Career Roadmap Generator)
-- ============================================================
CREATE TABLE CareerRoadmaps (
    roadmap_id        UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
    candidate_id      UNIQUEIDENTIFIER NOT NULL
        REFERENCES Candidates(candidate_id) ON DELETE CASCADE,
    target_role       NVARCHAR(256)    NOT NULL,
    phases            NVARCHAR(MAX)    NOT NULL,  -- JSON: [{name, skills[], duration, resources[]}]
    current_phase     INT              NOT NULL DEFAULT 0,
    generated_at      DATETIME2        NOT NULL DEFAULT GETUTCDATE(),
    updated_at        DATETIME2        NOT NULL DEFAULT GETUTCDATE()
);

-- ============================================================
-- 11. INTERVIEW_SESSIONS  (Feature: Interview Practice)
-- ============================================================
CREATE TABLE InterviewSessions (
    session_id        UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
    candidate_id      UNIQUEIDENTIFIER NOT NULL
        REFERENCES Candidates(candidate_id) ON DELETE CASCADE,
    target_role       NVARCHAR(256)    NOT NULL,
    difficulty        NVARCHAR(20)     NOT NULL DEFAULT 'MEDIUM'
        CHECK (difficulty IN ('EASY','MEDIUM','HARD')),
    questions         NVARCHAR(MAX)    NOT NULL,  -- JSON: [{text, response, score, feedback}]
    overall_score     DECIMAL(5,2)     NULL,
    completed_at      DATETIME2        NULL,
    created_at        DATETIME2        NOT NULL DEFAULT GETUTCDATE()
);

-- ============================================================
-- 12. COVER_LETTERS  (Feature: Cover Letter Architect)
-- ============================================================
CREATE TABLE CoverLetters (
    letter_id         UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
    candidate_id      UNIQUEIDENTIFIER NOT NULL
        REFERENCES Candidates(candidate_id) ON DELETE CASCADE,
    job_id            UNIQUEIDENTIFIER NULL
        REFERENCES JobPosts(job_id) ON DELETE SET NULL,
    content           NVARCHAR(MAX)    NOT NULL,
    tone              NVARCHAR(20)     NOT NULL DEFAULT 'FORMAL'
        CHECK (tone IN ('FORMAL','CONVERSATIONAL','ENTHUSIASTIC')),
    pdf_url           NVARCHAR(512)    NULL,
    generated_at      DATETIME2        NOT NULL DEFAULT GETUTCDATE()
);

-- Add deferred FK from JobApplications to CoverLetters
ALTER TABLE JobApplications
  ADD CONSTRAINT FK_Applications_CoverLetters
  FOREIGN KEY (cover_letter_id) REFERENCES CoverLetters(letter_id) ON DELETE SET NULL;

-- ============================================================
-- 13. PIVOT_PREDICTIONS  (Feature: Pivot Predictor)
-- ============================================================
CREATE TABLE PivotPredictions (
    pivot_id          UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
    candidate_id      UNIQUEIDENTIFIER NOT NULL
        REFERENCES Candidates(candidate_id) ON DELETE CASCADE,
    from_role         NVARCHAR(256)    NOT NULL,
    to_role           NVARCHAR(256)    NOT NULL,
    probability_pct   DECIMAL(5,2)     NOT NULL,
    timeline_weeks    INT              NULL,
    action_plan       NVARCHAR(MAX)    NULL,   -- JSON: [{step, description, resources[]}]
    generated_at      DATETIME2        NOT NULL DEFAULT GETUTCDATE()
);

-- ============================================================
-- 14. OFFER_COMPARISONS  (Feature: Offer Calculator)
-- ============================================================
CREATE TABLE OfferComparisons (
    comparison_id     UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
    candidate_id      UNIQUEIDENTIFIER NOT NULL
        REFERENCES Candidates(candidate_id) ON DELETE CASCADE,
    offers            NVARCHAR(MAX)    NOT NULL,  -- JSON array of offer objects
    recommendation    NVARCHAR(256)    NULL,
    created_at        DATETIME2        NOT NULL DEFAULT GETUTCDATE()
);

-- ============================================================
-- 15. OFFER_METRICS  (Feature: Offer Calculator - per-metric breakdown)
-- ============================================================
CREATE TABLE OfferMetrics (
    metric_id         UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
    comparison_id     UNIQUEIDENTIFIER NOT NULL
        REFERENCES OfferComparisons(comparison_id) ON DELETE CASCADE,
    offer_label       NVARCHAR(128)    NOT NULL,  -- e.g. "Company A"
    metric_name       NVARCHAR(64)     NOT NULL,  -- e.g. "salary", "equity", "growth"
    weight_pct        DECIMAL(5,2)     NOT NULL,  -- 0-100, weights sum to 100 per offer
    raw_value         NVARCHAR(256)    NULL,
    normalized_score  DECIMAL(5,2)     NULL        -- 0-100
);

-- ============================================================
-- 16. CHAT_HISTORIES  (Feature: AI Chat Widget)
-- ============================================================
CREATE TABLE ChatHistories (
    chat_id           UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
    user_id           UNIQUEIDENTIFIER NOT NULL
        REFERENCES Users(user_id) ON DELETE CASCADE,
    messages          NVARCHAR(MAX)    NOT NULL,  -- JSON: [{role, content, timestamp}]
    page_context      NVARCHAR(256)    NULL,      -- page URL the chat was opened on
    session_start     DATETIME2        NOT NULL DEFAULT GETUTCDATE(),
    session_end       DATETIME2        NULL
);

-- ============================================================
-- 17. SKILL_RESOURCES  (Feature: Skill-Up Connectors)
-- ============================================================
CREATE TABLE SkillResources (
    resource_id       UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
    skill_name        NVARCHAR(256)    NOT NULL,
    resource_title    NVARCHAR(512)    NOT NULL,
    resource_url      NVARCHAR(1024)   NOT NULL,
    resource_type     NVARCHAR(30)     NOT NULL
        CHECK (resource_type IN ('COURSE','VIDEO','ARTICLE','EXERCISE','BOOK')),
    platform_name     NVARCHAR(128)    NULL,
    estimated_hours   DECIMAL(6,2)     NULL,
    is_free           BIT              NOT NULL DEFAULT 1,
    created_at        DATETIME2        NOT NULL DEFAULT GETUTCDATE()
);
CREATE INDEX IX_SkillResources_SkillName ON SkillResources (skill_name);

-- ============================================================
-- 18. NOTIFICATIONS  (Platform-wide: Application Tracker alerts)
-- ============================================================
CREATE TABLE Notifications (
    notif_id          UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
    user_id           UNIQUEIDENTIFIER NOT NULL
        REFERENCES Users(user_id) ON DELETE CASCADE,
    message           NVARCHAR(512)    NOT NULL,
    notif_type        NVARCHAR(30)     NOT NULL
        CHECK (notif_type IN ('APPLICATION_UPDATE','MATCH_SCORE','INTERVIEW',
                              'OFFER','SYSTEM','ROADMAP','CHAT')),
    related_id        UNIQUEIDENTIFIER NULL,  -- FK to the triggering record
    is_read           BIT              NOT NULL DEFAULT 0,
    created_at        DATETIME2        NOT NULL DEFAULT GETUTCDATE()
);
CREATE INDEX IX_Notifications_UserId ON Notifications (user_id);

-- ============================================================
-- SEED DATA
-- ============================================================

-- Seed: Industries / Job Types (checked via JobPosts.job_type constraint)

-- Seed: Default Admin user
INSERT INTO Users (user_id, name, email, password_hash, role, face_id_verified, is_active)
VALUES (
    NEWID(),
    'NextHire Admin',
    'admin@nexthire.io',
    '$2b$10$examplehashedpassword1234567890abcdefgh',  -- bcrypt hash placeholder
    'ADMIN',
    0,
    1
);

-- Seed: Skill Resources (Skill-Up Connectors)
INSERT INTO SkillResources (skill_name, resource_title, resource_url, resource_type, platform_name, estimated_hours, is_free)
VALUES
    ('React',          'React - The Complete Guide',      'https://udemy.com/react-complete-guide', 'COURSE',    'Udemy',      40, 0),
    ('Node.js',        'Node.js Crash Course',            'https://youtube.com/nodejs-crash',       'VIDEO',     'YouTube',     3, 1),
    ('MongoDB',        'MongoDB University M001',         'https://university.mongodb.com/m001',    'COURSE',    'MongoDB Uni',12, 1),
    ('SQL',            'SQL for Beginners',               'https://w3schools.com/sql',              'ARTICLE',   'W3Schools',   5, 1),
    ('Python',         'Python Bootcamp 2024',            'https://udemy.com/python-bootcamp',      'COURSE',    'Udemy',      55, 0),
    ('Machine Learning','ML with Python - Coursera',     'https://coursera.org/ml-python',         'COURSE',    'Coursera',   60, 0),
    ('Docker',         'Docker Mastery',                  'https://udemy.com/docker-mastery',       'COURSE',    'Udemy',      20, 0),
    ('TypeScript',     'TypeScript Handbook',             'https://typescriptlang.org/docs',        'ARTICLE',   'Official',    8, 1),
    ('System Design',  'Grokking System Design',          'https://educative.io/system-design',     'COURSE',    'Educative',  30, 0),
    ('Data Structures','DSA by Abdul Bari',               'https://youtube.com/dsa-abdul-bari',     'VIDEO',     'YouTube',    25, 1),
    ('CSS',            'CSS Flexbox & Grid',              'https://css-tricks.com',                 'ARTICLE',   'CSS-Tricks',  4, 1),
    ('Git',            'Git & GitHub Crash Course',       'https://youtube.com/git-crash',          'VIDEO',     'YouTube',     2, 1),
    ('AWS',            'AWS Cloud Practitioner Essentials','https://aws.amazon.com/training',       'COURSE',    'AWS',        15, 0),
    ('Next.js',        'Next.js Docs – Getting Started',  'https://nextjs.org/docs',               'ARTICLE',   'Vercel',      6, 1),
    ('Interview Prep', 'LeetCode 75 Study Plan',          'https://leetcode.com/studyplan/75',      'EXERCISE',  'LeetCode',   30, 1);

-- ============================================================
-- INDEXES for performance (Filter By Search, Application Tracker)
-- ============================================================
CREATE INDEX IX_JobPosts_EmployerId   ON JobPosts         (employer_id);
CREATE INDEX IX_JobPosts_IsActive     ON JobPosts         (is_active);
CREATE INDEX IX_JobApps_CandidateId   ON JobApplications  (candidate_id);
CREATE INDEX IX_JobApps_JobId         ON JobApplications  (job_id);
CREATE INDEX IX_JobApps_Status        ON JobApplications  (status);
CREATE INDEX IX_MatchReports_CandId   ON MatchReports     (candidate_id);
CREATE INDEX IX_ScoreReports_CandId   ON ScoreReports     (candidate_id);
CREATE INDEX IX_CareerRoadmaps_CandId ON CareerRoadmaps   (candidate_id);
CREATE INDEX IX_InterviewSess_CandId  ON InterviewSessions(candidate_id);
CREATE INDEX IX_CoverLetters_CandId   ON CoverLetters     (candidate_id);
CREATE INDEX IX_PivotPred_CandId      ON PivotPredictions (candidate_id);
CREATE INDEX IX_OfferComp_CandId      ON OfferComparisons (candidate_id);
CREATE INDEX IX_ChatHist_UserId       ON ChatHistories    (user_id);

-- ============================================================
-- END OF SCRIPT
-- NextHire Database — 18 Tables, 15 Features
-- ============================================================
