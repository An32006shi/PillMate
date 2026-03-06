# 🚀 PillMate – Smart Medicine Reminder & Health Companion

PillMate is a full-stack healthcare assistant designed to help users manage their medications effectively. The platform provides smart reminders, medicine tracking, and health insights to ensure users never miss their doses and maintain a consistent medication routine.

The goal of PillMate is to improve medication adherence, reduce missed doses, and support users in maintaining better health through simple and intelligent digital assistance.

---

## ✨ Key Features

### 💊 Smart Medicine Reminder
Automatically schedules and sends reminders for medicines based on dosage time and frequency.

### 📅 Daily Medication Tracker
Allows users to track which medicines have been taken and which are pending.

### 👤 User Authentication
Secure login and registration system for personalized medication tracking.

### 📋 Medicine Management
Users can add, edit, and delete medicines with details like dosage, time, and frequency.

### 🔔 Notification System
Alerts users at the correct time so they never miss a dose.

### 📊 Health Monitoring Dashboard
Displays medication schedules and adherence statistics for better health management.

---

## 🛠️ Tech Stack

### Frontend
- React.js
- HTML5
- CSS3
- JavaScript

### Backend
- Node.js
- Express.js

### Database
- MongoDB

### Authentication
- JSON Web Token (JWT)

---

## 📂 Project Structure

pillmate/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── server.js
│
├── frontend/
│   ├── public/
│   └── src/
│
└── README.md

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

git clone https://github.com/An32006shi/PillMate.git  
cd PillMate

---

### 2️⃣ Backend Setup

cd backend  
npm install  

Create a `.env` file inside the backend folder:

MONGODB_URI=mongodb://127.0.0.1:27017/pillmate  
JWT_SECRET=secret  
PORT=5000  

Run the backend server:

npm start

---

### 3️⃣ Frontend Setup

cd frontend  
npm install  
npm start  

Frontend runs on:  
http://localhost:3000  

Backend runs on:  
http://localhost:5000  

---

## 📊 Example Workflow

1. User registers or logs into the platform.  
2. User adds medicines with dosage time and frequency.  
3. The system schedules reminders for the medicines.  
4. Notifications remind the user to take the medication.  
5. User marks medicine as taken, and the dashboard tracks adherence.

---

## 👩‍💻 Author

Anshika Gupta  

GitHub  
https://github.com/An32006shi

---

## ⭐ Future Improvements

- AI-based health recommendations  
- Doctor integration for prescriptions  
- Mobile app version  
- Cloud deployment with Docker and CI/CD
