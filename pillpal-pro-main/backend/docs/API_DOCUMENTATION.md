# PillPal Pro API Documentation

Base URL: `http://localhost:5000/api`

## Authentication & User

### 1. Register User
- **Endpoint**: `POST /users`
- **Body**:
  ```json
  {
    "name": "Anshika",
    "email": "anshika@example.com",
    "password": "password123",
    "timezone": "Asia/Kolkata" 
  }
  ```
- **Response**:
  ```json
  {
    "_id": "65b...",
    "name": "Anshika",
    "email": "anshika@example.com",
    "timezone": "Asia/Kolkata",
    "token": "eyJ...",
    "greeting": "Good Afternoon Anshika"
  }
  ```

### 2. Login User
- **Endpoint**: `POST /users/login`
- **Body**:
  ```json
  {
    "email": "anshika@example.com",
    "password": "password123"
  }
  ```
- **Response**: Similar to Register. Includes `greeting` and triggers login email notification.

### 3. Get / Update Profile
- **Endpoint**: `GET /users/profile` | `PUT /users/profile`
- **Headers**: `Authorization: Bearer <token>`
- **Body (PUT)**:
  ```json
  {
    "name": "Anshika Updated",
    "preferences": { "notifications": false }
  }
  ```

## Medicines & Schedule

### 1. Get All Medicines
- **Endpoint**: `GET /medicines`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: List of all user's medicines.

### 2. Get Full Schedule
- **Endpoint**: `GET /medicines/schedule?date=2023-12-25`
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```json
  [
    {
      "medicine": { "name": "Paracetamol", "dosage": "500mg", ... },
      "scheduledTime": "2023-12-25T08:00:00.000Z",
      "status": "Upcoming" // or "Taken", "Missed"
    }
  ]
  ```

### 3. Add Medicine
- **Endpoint**: `POST /medicines`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "name": "Vitamin C",
    "dosage": "1 tablet",
    "frequency": "Daily",
    "times": ["08:00", "20:00"],
    "startDate": "2023-12-01",
    "currentStock": 30
  }
  ```
- **Notes**: Automatically syncs to Google Calendar if `googleCalendarId` is set for user.

### 4. Update Medicine
- **Endpoint**: `PUT /medicines/:id`
- **Headers**: `Authorization: Bearer <token>`

### 5. Delete Medicine
- **Endpoint**: `DELETE /medicines/:id`
- **Headers**: `Authorization: Bearer <token>`

## Caregivers

### 1. Add Caregiver
- **Endpoint**: `POST /caregivers`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "name": "Mom",
    "email": "mom@example.com",
    "relationship": "Parent"
  }
  ```
- **Notes**: Caregivers receive emails when doses are missed.

## Notifications (Internal Logic)
- **Login Alert**: Sent immediately on login.
- **Missed Dose**: Cron job checks every minute. If a dose is >30 mins late, emails User & Caregivers.
- **Refill Alert**: Checked daily at 9:00 AM.
