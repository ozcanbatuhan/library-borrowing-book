# Library Management System

A comprehensive library management application developed to manage members and the borrowing of books by members. The system is designed for library staff to manage book lending and returns efficiently.

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm (usually comes with Node.js)

## Installation & Setup

### 1. Clone the Repository
```bash
git clone [repository-url]
cd library-borrowing-book
```

### 2. Database Setup
1. Create a PostgreSQL database named 'library':
```bash
psql -U postgres -c "CREATE DATABASE library"
```
Note: You'll be prompted for your PostgreSQL password.

### 3. Backend Setup
1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a .env file in the server directory:
```bash
# server/.env
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/library"
PORT=3001
```
Replace 'your_password' with your PostgreSQL password.

4. Run database migrations:
```bash
npx prisma migrate dev --name init
```

5. Start the backend server:
```bash
npm run dev
```
The server will start on http://localhost:3001

### 4. Frontend Setup
1. Open a new terminal and navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start the frontend application:
```bash
npm start
```
The application will open in your browser at http://localhost:3000

## Features

- User Management
  - List all registered users
  - View user details and borrowing history
  - View user ratings for books
- Book Management
  - List all available books
  - View book details (author, year, current owner, ratings)
  - Lend books to users
  - Process book returns

## Tech Stack

### Frontend
- React.js with TypeScript
- Material UI for components
- Redux for state management
- SCSS for styling
- React Router for navigation

### Backend
- Node.js with Express
- TypeScript
- Prisma ORM
- PostgreSQL database
- RESTful API

## API Endpoints

### Users
- GET `/api/users` - Get all users
- GET `/api/users/:id` - Get user by ID
- POST `/api/users` - Create new user
- PUT `/api/users/:id` - Update user
- DELETE `/api/users/:id` - Delete user
- GET `/api/users/:id/borrowings` - Get user's borrowing history

### Books
- GET `/api/books` - Get all books
- GET `/api/books/:id` - Get book by ID
- POST `/api/books` - Create new book
- PUT `/api/books/:id` - Update book
- DELETE `/api/books/:id` - Delete book
- GET `/api/books/:id/borrowings` - Get book's borrowing history
- POST `/api/books/:id/borrow` - Borrow a book
- POST `/api/books/:id/return` - Return a book

## Project Structure

```
library-borrowing-book/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/        # Page components
│   │   ├── redux/        # Redux store and slices
│   │   ├── styles/       # SCSS styles
│   │   └── types/        # TypeScript types
│   └── public/           # Static assets
└── server/               # Backend Node.js application
    ├── src/
    │   ├── controllers/  # Route controllers
    │   ├── routes/       # API routes
    │   ├── middleware/   # Custom middleware
    │   └── types/        # TypeScript types
    └── prisma/          # Database schema and migrations
```

## Common Issues & Troubleshooting

1. **Database Connection Error**
   - Verify PostgreSQL is running
   - Check your database credentials in .env file
   - Ensure the database 'library' exists

2. **Port Already in Use**
   - Backend: Change PORT in .env file
   - Frontend: Use `PORT=3001 npm start` to run on a different port

3. **Prisma Migration Error**
   - Delete the migrations folder and run `npx prisma migrate dev` again
   - Ensure your PostgreSQL user has the necessary permissions

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
