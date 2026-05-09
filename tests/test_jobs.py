from app.db.models import candidate, employer


def create_user(client, user_name, user_email, user_type):
    payload = {
        "user_name": user_name,
        "user_email": user_email,
        "user_password": "password123",
        "user_type": user_type,
    }
    response = client.post("/user/", json=payload)
    assert response.status_code == 201
    return payload


def login_headers(client, username):
    response = client.post("/login", data={"username": username, "password": "password123"})
    assert response.status_code == 200
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_job_create_and_status_update(client):
    employer = create_user(client, "employer_jobs", "employer_jobs@example.com", "employer")
    headers = login_headers(client, employer["user_name"])

    profile_response = client.patch(
        "/employer/update-profile",
        json={"company_name": "TechCorp", "company_description": "Product company"},
        headers=headers,
    )
    assert profile_response.status_code == 201

    create_job_response = client.post(
        "/job/create-job",
        json={
            "job_title": "Backend Engineer",
            "job_description": "Build APIs using FastAPI",
            "job_location": "Remote",
            "skills_required": ["Python", "FastAPI"],
            "salary_range": "10-15 LPA",
            "job_type": "Full-time",
        },
        headers=headers,
    )
    assert create_job_response.status_code == 201
    job = create_job_response.json()
    assert job["job_status"] == "open"

    update_status_response = client.patch(
        f"/job/update-job-status/{job['job_id']}",
        json={"job_status": "closed"},
        headers=headers,
    )
    assert update_status_response.status_code == 200
    updated = update_status_response.json()
    assert updated["job_id"] == job["job_id"]
    assert updated["job_status"] == "closed"


def test_candidate_cannot_create_job(client):
    candidate = create_user(client, "candidate_jobs", "candidate_jobs@example.com", "candidate")
    headers = login_headers(client, candidate["user_name"])

    response = client.post(
        "/job/create-job",
        json={
            "job_title": "Should Fail",
            "job_description": "No access",
            "job_location": "Remote",
            "skills_required": ["Python"],
            "salary_range": "5-8 LPA",
            "job_type": "Intern",
        },
        headers=headers,
    )
    assert response.status_code == 403
    

def test_recommend_jobs(client):
    # create a candidate with resume
    candidate = create_user(client, "candidate_rec", "candidate_rec@example.com", "candidate")
    headers = login_headers(client, candidate["user_name"])
    
    # update candidate profile with resume text
    profile_response = client.patch(
        "/candidate/update-profile",
        json={"resume_text" : "Python FastAPI SQL machine learning data science"},
        headers = headers,
    )
    assert profile_response.status_code == 201
    
    # create employer and job
    employer = create_user(client, "employer_rec", "employer_rec@example.com", "employer")
    employer_headers = login_headers(client, employer["user_name"])
    
    client.patch(
        "/employer/update-profile",
        json={"company_name": "Tech Corp", "company_description": "AI company"},
        headers=employer_headers,
    )
    
    # create a matching job
    job_response = client.post(
        "/job/create-job",
        json={
            "job_title": "Data Scientist",
            "job_description": "Work with Python and machine learning",
            "job_location": "Remote",
            "skills_required": ["Python", "Machine Learning", "SQL"],
            "salary_range": "15-20 LPA",
            "job_type": "Full-time",
            
        },
        headers=employer_headers,
    )
    assert job_response.status_code == 201
    
    # Get Recommendations
    rec_response = client.get(
        "/candidate/recommend-jobs",
        headers=headers,
    )
    assert rec_response.status_code == 200
    recommendations = rec_response.json()
    
    # Verify we got recommendations with match scores
    assert len(recommendations) > 0
    assert "match_score" in recommendations[0]
    assert recommendations[0]["match_score"] > 0
