-- ==============================================================================
-- JOBWISE LIVE SEEDER SCRIPT
-- ==============================================================================
-- INSTRUCTIONS:
-- 1. Sign up on your live site as Employer (jhonnykhanna@gmail.com)
-- 2. Sign up on your live site as Candidate (sofiasharma@gmail.com)
-- 3. Run this SQL query in your database console to inject profiles, jobs, and applications!
-- ==============================================================================

-- 1. Setup Employer Profile for Jhonny
WITH target_employer AS (
    SELECT user_id FROM users WHERE user_email = 'jhonnykhanna@gmail.com' LIMIT 1
),
inserted_employer_profile AS (
    INSERT INTO employers (user_id, company_name, company_description)
    SELECT user_id, 'Khanna Enterprises', 'A leading multinational company focusing on modern digital solutions and enterprise software.'
    FROM target_employer
    ON CONFLICT (user_id) DO UPDATE SET company_name = EXCLUDED.company_name
    RETURNING employer_id
),
-- 2. Setup 3 Jobs for Jhonny
inserted_jobs AS (
    INSERT INTO jobs (company_id, job_title, job_description, job_location, salary_range, job_type, skills_required, job_status)
    SELECT employer_id, 'Senior Software Engineer', 'We need an experienced software engineer to lead our core architecture team. You should be highly proficient in full-stack development and system design.', 'Remote / Mumbai', '₹20L - ₹30L INR', 'Full-time', '["React", "Node.js", "Python", "System Design"]'::json, 'open'::jobstatusenum
    FROM inserted_employer_profile
    UNION ALL
    SELECT employer_id, 'UI/UX Designer', 'Looking for a creative UI/UX designer to revamp our internal tools and public-facing SaaS applications.', 'Bangalore', '₹12L - ₹18L INR', 'Full-time', '["Figma", "UI/UX", "Prototyping", "CSS"]'::json, 'open'::jobstatusenum
    FROM inserted_employer_profile
    UNION ALL
    SELECT employer_id, 'Data Analyst', 'Join our data division to help interpret big data and build predictive models for our clients.', 'Delhi', '₹10L - ₹15L INR', 'Contract', '["SQL", "Python", "Tableau", "Data Modeling"]'::json, 'open'::jobstatusenum
    FROM inserted_employer_profile
    RETURNING job_id, job_title
),
-- 3. Setup Candidate Profile for Sofia
target_candidate AS (
    SELECT user_id FROM users WHERE user_email = 'sofiasharma@gmail.com' LIMIT 1
),
inserted_candidate_profile AS (
    INSERT INTO candidates (user_id, resume_text, skills)
    SELECT user_id, 'Highly motivated software developer with 4 years of experience. I specialize in building scalable web applications using React, Node.js, and Python. Passionate about clean code and UI/UX design principles.', '["React", "Node.js", "Python", "UI/UX", "SQL", "Figma"]'::json
    FROM target_candidate
    ON CONFLICT (user_id) DO UPDATE SET resume_text = EXCLUDED.resume_text
    RETURNING candidate_id
)
-- 4. Create Applications from Sofia to Jhonny's Jobs
INSERT INTO applications (job_id, candidate_id, status, match_score)
SELECT j.job_id, c.candidate_id, 
       CASE 
           WHEN j.job_title = 'Senior Software Engineer' THEN 'applied'::applicationstatusenum
           WHEN j.job_title = 'UI/UX Designer' THEN 'rejected'::applicationstatusenum
           ELSE 'reviewing'::applicationstatusenum
       END,
       CASE 
           WHEN j.job_title = 'Senior Software Engineer' THEN 92.5
           WHEN j.job_title = 'UI/UX Designer' THEN 45.0
           ELSE 80.0
       END
FROM inserted_jobs j
CROSS JOIN inserted_candidate_profile c;

-- 5. Mark profiles as completed
UPDATE users 
SET profile_completed = true 
WHERE user_email IN ('jhonnykhanna@gmail.com', 'sofiasharma@gmail.com');
