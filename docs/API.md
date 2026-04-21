# Backend API Reference

Base Endpoint URL for all requests: `http://localhost:5000/api`

## Security
All `/api/users/*`, `/api/match/*`, `/api/session/*`, and `/api/rating/*` POSTs require a Bearer Token supplied via the `Authorization` header.

```http
Authorization: Bearer <your_jwt_token_here>
```

---

## 1. Authentication Module (`/api/auth`)

### Register User
*   **URL:** `/register`
*   **Method:** `POST`
*   **Body:** 
    *   `name` (String, required)
    *   `email` (String, required)
    *   `password` (String, required)
*   **Success Response:** `201 Created` returning the `User` object and a `token`.

### Login User
*   **URL:** `/login`
*   **Method:** `POST`
*   **Body:** `email`, `password`
*   **Success Response:** `200 OK` returning the `User` object and a `token`.

### Get Current Session User
*   **URL:** `/me`
*   **Method:** `GET`
*   **Headers:** `Authorization: Bearer <token>`
*   **Success Response:** `200 OK` returning `User` object sans password.

---

## 2. User Profile Module (`/api/users`)

### Update Skill Profile
*   **URL:** `/profile`
*   **Method:** `PUT`
*   **Body:**
    *   `skillsToTeach` (Array of Strings)
    *   `skillsToLearn` (Array of Strings)
*   **Success Response:** `200 OK` returning updated schema.

---

## 3. Matching Engine (`/api/match`)

### Get Best Mutual Suggestions
*   **URL:** `/suggestions`
*   **Method:** `GET`
*   **Description:** Iterates through all users in the DB dynamically hashing skills against the internal Scoring Engine. Filters zeroes.
*   **Success Response:** `200 OK` with JSON array containing `{ user, score }` pairs.

---

## 4. Sessions Lifecycle (`/api/session`)

### Request a New Session
*   **URL:** `/request`
*   **Method:** `POST`
*   **Body:**
    *   `partnerId` (ObjectId)
    *   `skill` (String)
    *   `role` (Enum: "learner", "teacher" - sets relative state of connection)
*   **Success Response:** `201 Created`

### Accept / Complete / Reject
*   **URL:** `/update`
*   **Method:** `PUT`
*   **Body:** 
    *   `sessionId` (ObjectId)
    *   `status` (Enum: "ACCEPTED", "REJECTED", "COMPLETED")
*   **Success Response:** `200 OK`

### Retrieve User History
*   **URL:** `/my`
*   **Method:** `GET`
*   **Description:** Aggregates and populates Session objects associated with the JWT bearer across `teacherId` or `learnerId`.

---

## 5. Trust Systems (`/api/rating`)

### Leave Peer Feedback
*   **URL:** `/`
*   **Method:** `POST`
*   **Body:**
    *   `sessionId` (ObjectId)
    *   `toUserId` (ObjectId)
    *   `rating` (Number 1-5)
    *   `feedback` (String)
*   **Success Response:** `201 Created`. (Behind the scenes, triggers internal `trustScore` regeneration for the target).
