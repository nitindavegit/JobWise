import pytest

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
    response = client.post("/login", json={"user_name": username, "user_password": "password123"})
    assert response.status_code == 200
    return {"Authorization": f"Bearer {response.json()['access_token']}"}


def test_full_application_lifecycle(client):
    # 1. Create candidate and employer
    candidate = create_user(client, "app_candidate", "app_cand@example.com", "candidate")
    employer = create_user(client, "app_employer", "app_emp@example.com", "employer")
    
    cand_headers = login_headers(client, candidate["user_name"])
    emp_headers = login_headers(client, employer["user_name"])
    
    # 2. Employer posts a job
    client.patch("/employer/update-profile", json={"company_name": "ACME"}, headers=emp_headers)
    job_res = client.post("/job/create-job", json={
        "job_title": "Backend Dev", "job_description": "API stuff", "job_location": "Remote",
        "skills_required": ["Python"], "salary_range": "100k", "job_type": "Full-time"
    }, headers=emp_headers)
    job = job_res.json()
    job_id = job["job_id"]
    
    # 3. Candidate applies
    client.patch("/candidate/update-profile", json={"resume_text": "I know Python"}, headers=cand_headers)
    app_res = client.post(f"/application/apply/{job_id}", headers=cand_headers)
    assert app_res.status_code == 201
    application = app_res.json()
    app_id = application["application_id"]
    assert application["status"] == "applied"
    
    # 4. Candidate applies again (should fail)
    duplicate_res = client.post(f"/application/apply/{job_id}", headers=cand_headers)
    assert duplicate_res.status_code == 409
    
    # 5. Employer sees application
    applicants_res = client.get(f"/application/job/{job_id}/applicants", headers=emp_headers)
    assert applicants_res.status_code == 200
    applicants = applicants_res.json()
    assert len(applicants) == 1
    assert applicants[0]["candidate_name"] == "app_candidate"
    
    # 6. Employer updates status
    status_update = client.patch(f"/application/{app_id}/status", json={"status": "reviewing"}, headers=emp_headers)
    assert status_update.status_code == 200
    assert status_update.json()["status"] == "reviewing"
    
    # 7. Candidate sees status
    my_apps = client.get("/application/my-applications", headers=cand_headers)
    assert my_apps.status_code == 200
    assert len(my_apps.json()) == 1
    assert my_apps.json()[0]["status"] == "reviewing"
    
    # 8. Employer closes job
    client.patch(f"/job/update-job-status/{job_id}", json={"job_status": "closed"}, headers=emp_headers)
    
    # 9. Second candidate tries to apply to closed job
    candidate2 = create_user(client, "late_candidate", "late@example.com", "candidate")
    cand2_headers = login_headers(client, candidate2["user_name"])
    late_apply = client.post(f"/application/apply/{job_id}", headers=cand2_headers)
    assert late_apply.status_code == 400
