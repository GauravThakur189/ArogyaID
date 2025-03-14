# Claims Management Platform

A full-stack MERN (MongoDB, Express, React, Node.js) application that allows patients to submit claims and view their status, while insurers can review, update, and manage claims.

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [User Credentials](#user-credentials)
- [Project Structure](#project-structure)
- [Screenshots / Demo](#screenshots--demo)
- [License](#license)

## Overview
This project is a simple claims management platform with two user roles:

- **Patient:** Can submit new claims and view the status of previously submitted claims.
- **Insurer:** Can view, filter, and update claim statuses (approve/reject claims, set approved amounts, and leave comments).

The platform uses JWT-based authentication and role-based access control for secure API interactions.

## Features

- **Patient Side:**
  - Register/Login as a patient.
  - Submit a claim with details and file upload (receipt/prescription).
  - View a dashboard of submitted claims with status, submission date, and details.
  - Click on a claim to view detailed insurer updates (status, approved amount, and comments).

- **Insurer Side:**
  - Register/Login as an insurer.
  - View and filter all claims by status, date, and claim amount.
  - Review individual claim details and update claim status (Approve/Reject), add approved amount, and leave comments.

- **Shared:**
  - RESTful API endpoints for authentication and claim management.
  - Responsive UI built with React.
  - Role-based protected routes.

## Tech Stack

- **Frontend:** React, React Router, Axios, Tailwind CSS (optional for styling)
- **Backend:** Node.js, Express, JWT, Multer (for file uploads)
- **Database:** MongoDB with Mongoose ODM

## Installation

### Backend
1. Navigate to the backend directory:
   ```bash
   cd backend
Install dependencies:
npm install
Create a .env file with the following variables:
env
Copy
Edit
MONGO_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>
PORT=3000
Start the backend server:
The backend will run on http://localhost:3000.

### Frontend
Navigate to the frontend directory:
cd frontend
Install dependencies:
npm install
Start the frontend development server:
npm run dev
The frontend will run on http://localhost:3001 (or another port if 3000 is in use).
Configuration
File Uploads: Ensure that the uploads/ directory exists in your backend root.
Environment Variables: Adjust your .env file as needed for your MongoDB connection and JWT secret.
Usage
Patient Flow
Register/Login:
### Use the provided patient credentials (or register a new patient).
Patient Email: gaurav@example.com
Password: gaurav123
Submit a Claim:

Navigate to "Submit New Claim" and fill in the form.
The patient’s email is pre-filled using the authenticated user's email.
View Claims:

On the Patient Dashboard, view your submitted claims.
Click the View button next to a claim to see detailed status and insurer updates.
Insurer Flow
Register/Login:
### Use the provided insurer credentials (or register a new insurer).
Insurer Email: rajan@example.com
Password: rajan123
View All Claims:

Navigate to the Insurer Dashboard to see and filter all claims.
Review and Update Claims:

Click on a claim to review its details.
Update the claim's status, approved amount, and add comments.
API Endpoints
Authentication
POST /api/auth/register
Registers a new user (patient or insurer).

POST /api/auth/login
Logs in a user and returns a JWT token.

Claims Management
POST /api/claims
Patients submit a new claim (with file upload).

GET /api/claims
Returns a list of claims:

For patients: Only their own claims.
For insurers: All claims with optional filters (status, date, claim amount).
GET /api/claims/:id
Returns detailed information for a specific claim (accessible to both patients and insurers with role-based restrictions).

PUT /api/claims/:id
Insurers update a claim (change status, add approved amount, and insurer comments).

User Credentials
Patient:
Email: gaurav@example.com
Password: gaurav123
Insurer:

Email: rajan@example.com
Password: rajan123
### Project Structure
-/backend
  -├── config/
  -├── middleware/
  -├── models/
  -├── routes/
  -├── uploads/
  -└── server.js
-/frontend
  -├── public/
  -├── src/
  -│    ├── components/
  -│    │    └── ProtectedRoute.jsx
  -│    ├── pages/
  -│    │    ├── LoginPage.jsx
  -│    │    ├── PatientDashboard.jsx
  -│    │    ├── ClaimSubmission.jsx
  -│    │    ├── PatientClaimDetail.jsx
  -│    │    ├── InsurerDashboard.jsx
  -│    │    └── ClaimDetail.jsx
  -│    ├── AuthContext.jsx
  -│    ├── App.jsx
  -│    └── index.jsx
  -└── package.json
