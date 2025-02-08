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

## Face Recognition Setup

### Installing Face Models

1. Create a directory for face models:

   ```bash
   mkdir -p Backend/models/face_models
   ```

2. Clone the face-api.js models:

   ```bash
   git clone https://github.com/justadudewhohacks/face-api.js-models.git Backend/models/face_models
   ```

3. Verify the following model files are present in Backend/models/face_models:
   - ssd_mobilenetv1
   - face_recognition
   - face_landmark_68

### Model Loading Configuration

The system automatically loads these models on startup through the `faceApiModelLoader.js` utility. Make sure:

- Models are in the correct directory structure
- Your application has read permissions for the model files
- You have sufficient RAM (approximately 200MB) for model loading

### Troubleshooting Face Recognition

If face recognition isn't working:

1. Check console logs for model loading success message
2. Ensure all model files are properly downloaded
3. Verify image quality for face detection
4. Check if the face detection threshold (0.5) needs adjustment in uploadRouter.js

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
