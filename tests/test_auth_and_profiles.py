def create_candidate_user(client):
    payload = {
        "user_name": "candidate_user",
        "user_email": "candidate@example.com",
        "user_password": "password123",
        "user_type": "candidate",
    }
    response = client.post("/user/", json=payload)
    assert response.status_code == 201
    return payload


def create_employer_user(client):
    payload = {
        "user_name": "employer_user",
        "user_email": "employer@example.com",
        "user_password": "password123",
        "user_type": "employer",
    }
    response = client.post("/user/", json=payload)
    assert response.status_code == 201
    return payload


def login_and_get_headers(client, username, password):
    response = client.post("/login", json={"user_name": username, "user_password": password})
    assert response.status_code == 200
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_candidate_profile_flow(client):
    candidate = create_candidate_user(client)
    headers = login_and_get_headers(client, candidate["user_name"], candidate["user_password"])

    update_response = client.patch("/candidate/update-profile", json={"resume_text": "Python FastAPI SQL"}, headers=headers)
    assert update_response.status_code == 201
    body = update_response.json()
    assert body["user_type"] == "candidate"
    assert isinstance(body["candidate_id"], int)
    assert body["resume_text"] == "Python FastAPI SQL"

    profile_response = client.get("/candidate/my-profile", headers=headers)
    assert profile_response.status_code == 200
    profile = profile_response.json()
    assert profile["candidate_id"] == body["candidate_id"]
    assert profile["user_email"] == candidate["user_email"]


def test_employer_profile_flow(client):
    employer = create_employer_user(client)
    headers = login_and_get_headers(client, employer["user_name"], employer["user_password"])

    update_response = client.patch(
        "/employer/update-profile",
        json={"company_name": "Acme", "company_description": "Hiring backend engineers"},
        headers=headers,
    )
    assert update_response.status_code == 201
    body = update_response.json()
    assert body["user_type"] == "employer"
    assert body["company_name"] == "Acme"

    profile_response = client.get("/employer/my-profile", headers=headers)
    assert profile_response.status_code == 200
    profile = profile_response.json()
    assert profile["company_description"] == "Hiring backend engineers"
    assert profile["user_email"] == employer["user_email"]
