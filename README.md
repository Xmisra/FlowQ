# FlowQ

> A real-time virtual queue management platform built with the MERN stack and Socket.IO that enables businesses to digitize customer queues, reduce physical waiting, and provide live queue updates through QR-code based check-in.

---

## ✨ Features

### 👨‍💼 Admin

- Secure JWT Authentication (HTTP-only cookies)
- Create, edit and delete queues
- Open / Close queues
- Generate QR code for customer check-in
- Call Next Customer
- Complete Customer
- Skip Customer
- Live Queue Dashboard
- Queue Analytics
- Real-time updates using Socket.IO

### 👥 Customer

- Join queue by scanning QR code
- Automatic token generation
- Live queue position
- Estimated waiting time
- Real-time status updates
- Refresh persistence using Local Storage
- Mobile-friendly interface

---

# Tech Stack

## Frontend

- React
- React Router
- Tailwind CSS
- Axios
- Socket.IO Client
- React Hot Toast
- React QR Code

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- Socket.IO
- JWT Authentication
- Cookie Parser
- CORS

---

# Architecture

```
Customer
    │
    ▼
React Frontend
    │
Axios API Calls
    │
Express Backend
    │
MongoDB
    │
Socket.IO
    │
Real-time Updates
```

---

# Project Workflow

```
Admin creates queue
        │
        ▼
QR Code generated
        │
        ▼
Customer scans QR
        │
        ▼
Customer joins queue
        │
        ▼
Atomic token generated
        │
        ▼
Customer joins Socket.IO room
        │
        ▼
Admin calls next customer
        │
        ▼
Socket event emitted
        │
        ▼
Customer UI updates instantly
```

---

# Folder Structure

```
FlowQ
│
├── frontend
│   ├── src
│   │   ├── api
│   │   ├── components
│   │   ├── context
│   │   ├── pages
│   │   ├── routes
│   │   ├── socket
│   │   └── App.jsx
│
├── backend
│   ├── src
│   │   ├── config
│   │   ├── controllers
│   │   ├── middlewares
│   │   ├── models
│   │   ├── routes
│   │   ├── socket
│   │   └── utils
│   │
│   └── index.js
│
└── README.md
```

---

# API Overview

## Authentication

```
POST /admin/signup

POST /admin/login

GET /admin/me

POST /admin/logout
```

---

## Queue Management

```
POST /queue/create

GET /queue

GET /queue/:queueId

PUT /queue/:queueId

DELETE /queue/:queueId

PATCH /queue/:queueId/open

PATCH /queue/:queueId/close
```

---

## Queue Operations

```
POST /queueJoin/:queueId/join

POST /queueJoin/:queueId/call_next

POST /queueJoin/:queueId/completed

POST /queueJoin/:queueId/skipped

GET /queueJoin/:queueId/stats

GET /queueJoin/:queueId/analytics

GET /queueJoin/:queueId/position/:tokenNumber
```

---

# Real-Time Communication

FlowQ uses **Socket.IO** for live synchronization.

Customers join queue-specific Socket.IO rooms.

Whenever an administrator performs an action:

- Call Next
- Complete
- Skip

the backend emits an event only to the corresponding queue room.

This ensures customers receive instant updates without polling the server.

---

# Concurrency Handling

One challenge in queue systems is simultaneous customer registrations.

To guarantee unique token numbers even when multiple customers join at the same time, FlowQ uses MongoDB's atomic `$inc` operator.

```javascript
const updatedQueue = await Queue.findByIdAndUpdate(
    queueId,
    {
        $inc: {
            lastTokenNumber: 1
        }
    },
    {
        new: true
    }
);
```

This prevents duplicate token allocation during concurrent requests.

---

# Refresh Persistence

Customer queue sessions are preserved using Local Storage.

After joining a queue:

- Token number is stored locally.
- On refresh, the application restores the token.
- Queue status is fetched from the backend.
- Customer rejoins the Socket.IO room.
- Real-time updates continue without requiring another registration.

---

# Authentication

FlowQ uses

- JWT
- HTTP-only Cookies

instead of storing tokens in Local Storage.

Advantages:

- Better protection against XSS attacks
- Automatic cookie handling by the browser
- Stateless authentication

---

# Analytics

Each queue provides live analytics including:

- Total Customers
- Waiting Customers
- Called Customers
- Completed Customers
- Skipped Customers

---

# Deployment

Frontend

- Vercel

Backend

- Render

Database

- MongoDB Atlas

---

# Local Setup

## Clone repository

```bash
git clone https://github.com/Xmisra/FlowQ.git
```

---

## Install dependencies

Frontend

```bash
cd frontend
npm install
```

Backend

```bash
cd backend
npm install
```

---

## Environment Variables

### Backend

```
PORT=

MONGO_URI=

JWT_SECRET=

CLIENT_URL=
```

---

### Frontend

```
VITE_API_URL=
```

---

## Start Backend

```bash
npm run dev
```

---

## Start Frontend

```bash
npm run dev
```

---

# Future Improvements

- Email/SMS notifications
- Appointment scheduling
- Multi-branch organization support
- Queue priority management
- Estimated waiting time using historical analytics
- Admin activity logs
- Queue history reports
- Dashboard charts
- Offline reconnection support

---

# Key Learnings

Building FlowQ helped strengthen my understanding of

- REST API Design
- JWT Authentication
- HTTP-only Cookies
- Socket.IO
- Real-time Systems
- MongoDB Atomic Operations
- State Management in React
- Protected Routes
- Deployment using Vercel and Render
- Full-stack application architecture

---

# Author

**Soumik Misra**

GitHub

https://github.com/Xmisra

LinkedIn

www.linkedin.com/in/soumik-misra-91731a1b4


## ⭐ If you found this project useful, consider giving it a star.
