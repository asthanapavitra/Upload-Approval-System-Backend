# Social Media Upload Approval System

## Description

A privacy-focused social media platform that uses facial recognition to detect people in photos and requires their approval before the image can be posted. This ensures user privacy and consent in photo sharing.

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Face Recognition**: face-api.js
- **Image Processing**: node-canvas
- **File Handling**: Multer
- **Password Security**: bcrypt

## Features

- Face detection and recognition
- User registration with facial data
- Secure login system
- Upload approval workflow
- Dashboard for managing pending approvals
- Auto-approve option for users

## API Endpoints

### User Management

#### 1. Register User

```
POST /users/register
Content-Type: multipart/form-data

Payload:
- name: string
- email: string
- password: string
- profilePicture: File

Response:
- Success: Redirects to login page
- Error: { message: string }
```

#### 2. Login

```
POST /users/login
Content-Type: application/json

Payload:
{
  "email": string,
  "password": string
}

Response:
- Success: Redirects to dashboard
- Error: "Email or password incorrect"
```

#### 3. Dashboard

```
GET /users/dashboard
Headers:
  Authorization: Bearer <token>

Response:
- Success: Renders dashboard with user data
- Error: { message: string }
```

### Upload Management

#### 1. Upload Image

```
POST /upload/upload
Headers:
  Authorization: Bearer <token>
Content-Type: multipart/form-data

Payload:
- img: File
- description: string

Response:
{
  "message": string,
  "uploadId": string
}
```

#### 2. Approve Upload

```
POST /upload/:uploadId/approve
Headers:
  Authorization: Bearer <token>

Payload:
{
  "userId": string
}

Response:
{
  "message": string,
  "finalStatus": string
}
```

#### 3. Reject Upload

```
POST /upload/:uploadId/reject
Headers:
  Authorization: Bearer <token>

Payload:
{
  "userId": string
}

Response:
{
  "message": string,
  "finalStatus": string
}
```

#### 4. Check Upload Status

```
GET /upload/:uploadId/status
Headers:
  Authorization: Bearer <token>

Response:
{
  "finalStatus": string,
  "detectedUsers": Array
}
```

#### 5. Get Pending Uploads

```
GET /upload/pending/:userId
Headers:
  Authorization: Bearer <token>

Response:
Array of pending uploads
```

## Installation & Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables in `.env`:
   ```
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   ```
4. Start the server:
   ```bash
   npm start
   ```

## Security Features

- Password hashing using bcrypt
- JWT-based authentication
- Secure file upload handling
- Face detection validation
- Privacy-first approach with approval system

## Contributing

Feel free to submit issues and pull requests to improve the system.
