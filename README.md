# Smart College Education Platform

A comprehensive education platform with secure authentication, smart routines, lab assignments, secure exams, AI mentoring, and more.

## Features

### Core Features
- **Secure Authentication** - College email + birthdate password via Auth0
- **Role Management** - Student/Teacher/Admin/HOD with persistent roles
- **Smart Routine** - Weekly + dynamic scheduling with class swaps
- **Lab Assignments** - In-browser code editor with auto-grading
- **Secure Exams** - Auto-fullscreen, immediate auto-submit on tab switch
- **Calendar** - Holidays, special days (green), exam dates
- **AI Mentor** - ChatGPT-style + real-time web search
- **Central Library** - Files + links, Auth0 protected

### Auth0 Features Implemented
- Universal Login with Social Connections
- Role-Based Access Control (RBAC)
- Multi-Factor Authentication (MFA)
- Adaptive Risk-Based Authentication
- JWT Validation on all API endpoints
- Custom Claims for roles and permissions
- Ephemeral Sessions for exams
- Auth0 Actions for custom logic

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React + Vite + Tailwind CSS |
| Backend | Node.js + Express |
| Database | MongoDB |
| Auth | Auth0 |
| AI | OpenAI GPT-4 + SerpAPI |
| Code Execution | Piston API |

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Auth0 account
- OpenAI API key

### Installation

1. **Clone and install dependencies**
```bash
cd D:\Diversion
npm install
npm run install:all
```

2. **Configure environment variables**

Copy `.env.example` files to `.env` in both `client/` and `server/` directories.

3. **Set up Auth0**

Follow the guide in `AUTH0_SETUP.md`

4. **Start MongoDB**
```bash
mongod
```

5. **Start the application**
```bash
npm run dev
```

- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Project Structure

```
D:\Diversion\
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── hooks/           # Custom hooks
│   │   ├── context/         # React context
│   │   └── utils/           # Utilities
│   └── package.json
├── server/                  # Node.js backend
│   ├── src/
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Express middleware
│   │   ├── services/        # Business logic
│   │   └── models/          # Mongoose models
│   └── package.json
├── auth0-actions/           # Auth0 action scripts
├── AUTH0_SETUP.md          # Auth0 setup guide
└── README.md               # This file
```

## API Endpoints

### Authentication
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/me` | GET | Get current user |
| `/api/auth/change-password` | POST | Change password |

### Routine
| Endpoint | Method | Role | Description |
|----------|--------|------|-------------|
| `/api/routine` | GET | All | Get routine |
| `/api/routine/mark-unavailable` | POST | Teacher | Mark class unavailable |
| `/api/routine/swap-requests` | GET | Teacher | View open swaps |
| `/api/routine/claim-swap/:id` | POST | Teacher | Claim a swap |

### Lab Assignments
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/lab` | GET | List labs |
| `/api/lab/:id` | GET | Get lab details |
| `/api/lab/:id/run` | POST | Run test cases |
| `/api/lab/:id/submit` | POST | Submit solution |

### Exams
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/exam` | GET | List exams |
| `/api/exam/:id` | GET | Get exam |
| `/api/exam/:id/start` | POST | Start exam |
| `/api/exam/:id/submit` | POST | Submit exam |
| `/api/exam/:id/auto-submit` | POST | Auto-submit |

### Other
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/calendar` | GET/POST | Calendar events |
| `/api/ai-mentor/chat` | POST | AI chat |
| `/api/library` | GET/POST | Library resources |
| `/api/admin/*` | * | Admin operations |

## User Provisioning

Users are created via CSV upload with the format:
```csv
firstName,lastName,dateOfBirth,batchYear,role,department
John,Doe,2001-05-15,2023,student,Computer Science
```

Email format: `firstname.lastname.23@institution.edu`
Password format: `DDMMYYYY` (birthdate)

## Demo Script

1. **Login** - Show Auth0 Universal Login with Google option
2. **Dashboard** - View stats and today's schedule
3. **Smart Routine** - Show weekly grid, mark unavailable
4. **Lab Assignment** - Code in Monaco editor, run tests
5. **Secure Exam** - Show fullscreen, tab switch auto-submit
6. **AI Mentor** - Chat with real-time web search
7. **Library** - Browse and download resources
8. **Admin Panel** - User provisioning, re-approvals

## Security Features

- JWT validation on all API endpoints
- Role-based route protection
- MFA for sensitive operations
- Ephemeral sessions for exams
- Tab switch detection
- Code execution sandboxing
- Rate limiting

## License

MIT
