# Library Management System

A comprehensive library management application developed to manage members and the borrowing of books by members. The system is designed for library staff to manage book lending and returns efficiently.

## Technologies Used

### Frontend
- React.js (v19.0.0)
- TypeScript
- Material UI (v6.4.5)
- Redux Toolkit for state management
- Axios for API calls
- SCSS for styling
- React Router DOM (v7.2.0)

### Backend
- Node.js (v14 or higher)
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL
- RESTful API architecture

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm (usually comes with Node.js)
- Git

## Installation & Setup

### 1. Clone the Repository
```bash
git clone [repository-url]
cd library-borrowing-book
```

### 2. Database Setup
1. Install PostgreSQL if not already installed:
   - Windows: Download and install from [PostgreSQL Official Website](https://www.postgresql.org/download/windows/)
   - Mac: `brew install postgresql`
   - Linux: `sudo apt-get install postgresql`

2. Start PostgreSQL service:
   - Windows: PostgreSQL service should start automatically
   - Mac: `brew services start postgresql`
   - Linux: `sudo service postgresql start`

3. Create a PostgreSQL database named 'library':
```bash
psql -U postgres
CREATE DATABASE library;
\q
```

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
```env
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/library"
PORT=3000
```
Replace 'your_password' with your PostgreSQL password.

4. Generate Prisma Client:
```bash
npx prisma generate
```

5. Run database migrations:
```bash
npx prisma migrate dev
```
This command will:
- Apply all migrations
- Generate Prisma Client
- Seed the database with initial data

6. Start the backend server:
```bash
npm run dev
```
The server will start on http://localhost:3000

### 4. Frontend Setup
1. Open a new terminal and navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create a .env file in the client directory (if needed):
```env
REACT_APP_API_URL=http://localhost:3000
```

4. Start the frontend application:
```bash
npm start
```
The application will open in your browser at http://localhost:3001

## Features

### User Management
- List all registered users
- View user details and borrowing history
- Add, edit, and delete users
- View user ratings for books

### Book Management
- List all available books
- View book details (author, year, current borrowers, ratings)
- Add, edit, and delete books
- Track book availability
- View book borrowing history

### Borrowing System
- Borrow books for users
- Return books with ratings
- Track borrowing history
- Multiple copies support
- Rating system (1-5 stars, with decimals)

## API Endpoints

### Users
- GET `/users` - Get user names
- GET `/users/getAllUsers` - Get all users with full details
- GET `/users/:id` - Get user by ID
- POST `/users` - Create new user
- PUT `/users/:id` - Update user
- DELETE `/users/:id` - Delete user
- GET `/users/:id/borrowings` - Get user's borrowing history

### Books
- GET `/books` - Get all books
- GET `/books/:id` - Get book by ID
- POST `/books` - Create new book
- PUT `/books/:id` - Update book
- DELETE `/books/:id` - Delete book
- GET `/books/:id/borrowings` - Get book's borrowing history
- POST `/books/:id/borrow` - Borrow a book
- POST `/books/:id/return` - Return a book

## Common Issues & Troubleshooting

1. **Database Connection Error**
   - Verify PostgreSQL is running
   - Check your database credentials in .env file
   - Ensure the database 'library' exists
   - Make sure your PostgreSQL password is correct in the DATABASE_URL

2. **Port Already in Use**
   - Backend: Change PORT in .env file
   - Frontend: The application is configured to run on port 3001

3. **Prisma Migration Error**
   - Try resetting the database: `npx prisma migrate reset`
   - Ensure your PostgreSQL user has the necessary permissions
   - If issues persist, delete the migrations folder and run `npx prisma migrate dev` again

4. **Frontend Can't Connect to Backend**
   - Verify both frontend and backend are running
   - Check if the backend URL in the frontend's .env file is correct
   - Ensure CORS is properly configured

## Project Structure

```
library-borrowing-book/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/        # Page components
│   │   ├── redux/        # Redux store and slices
│   │   ├── services/     # API services
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

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.
