import pytest
from app.utils import calculate_tfidf_match_score, calculate_match_score

def test_calculate_match_score_exact_overlap():
    candidate_text = "I have 5 years of experience in Python and FastAPI."
    job_skills = ["Python", "FastAPI"]
    score = calculate_match_score(candidate_text, job_skills)
    assert score == 100

def test_calculate_match_score_partial_overlap():
    candidate_text = "I know Python."
    job_skills = ["Python", "Docker"]
    score = calculate_match_score(candidate_text, job_skills)
    assert score == 50

def test_calculate_match_score_no_overlap():
    candidate_text = "I know JavaScript and React."
    job_skills = ["Python", "FastAPI"]
    score = calculate_match_score(candidate_text, job_skills)
    assert score == 0

def test_calculate_tfidf_match_score():
    candidate_text = "Experienced Python developer with a strong background in Machine Learning and SQL databases."
    job_description = "We are looking for a backend engineer who knows Python and SQL."
    job_skills = ["Python", "SQL", "Machine Learning"]
    
    score = calculate_tfidf_match_score(candidate_text, job_description, job_skills)
    # The score should be > 0 since they share many keywords
    assert score > 0
    assert score <= 100

def test_calculate_tfidf_match_score_empty_text():
    job_description = "Backend dev"
    job_skills = ["Python"]
    
    score = calculate_tfidf_match_score("", job_description, job_skills)
    assert score == 0

def test_calculate_tfidf_match_score_mismatch():
    candidate_text = "Front-end developer skilled in HTML, CSS, and React."
    job_description = "Database administrator managing PostgreSQL servers."
    job_skills = ["PostgreSQL", "Linux"]
    
    score = calculate_tfidf_match_score(candidate_text, job_description, job_skills)
    # TF-IDF might pick up common english words if not filtered properly, 
    # but since we use stop_words='english', it should be very low or 0.
    assert score < 20 # Allowing some leeway just in case of weird vectorization, but usually 0.
