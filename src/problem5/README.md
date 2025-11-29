# Express MongoDB CRUD API

A RESTful API built with Express.js, TypeScript, and MongoDB for managing resources with full CRUD operations.

## Features

- **RESTful API** with CRUD operations for resources
- **TypeScript** for type safety
- **MongoDB** database with Mongoose ODM
- **Express Validator** for request validation
- **Docker Compose** for easy MongoDB setup
- **Jest** testing framework with coverage reports
- **Automatic data seeding** on first connection

## Prerequisites

- **Node.js** >= 20.0.0
- **npm** or **yarn**
- **Docker** and **Docker Compose** (for running MongoDB)

## Configuration

### Environment Variables

Create a `.env` file in the root directory (`src/problem5/`) with the following variables:

```env
# MongoDB Connection URI
MONGO_URI=mongodb://localhost:27017/resource-db

# Server Port (optional, defaults to 3000)
PORT=3000
```

### MongoDB Setup

The application uses Docker Compose to run MongoDB. The MongoDB container will:
- Run on port `27017`
- Store data in a persistent volume (`mongo-data`)
- Use the default MongoDB 7.0 image

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create environment file:**
   ```bash
   cp .env.example .env
   ```
   Or manually create `.env` with the configuration above.

3. **Start MongoDB using Docker Compose:**
   ```bash
   docker-compose up -d
   ```

## Running the Application

### Development Mode

Run the application in development mode with hot reload:

```bash
npm run dev
```

The server will start on `http://localhost:3000` (or the port specified in your `.env` file).

## API Endpoints

All endpoints are prefixed with `/api/resources`.

### Create Resource
- **POST** `/api/resources`
- **Body:**
  ```json
  {
    "name": "Resource Name",
    "description": "Optional description",
    "value": 100
  }
  ```
- **Response:** 201 Created with the created resource

### List Resources
- **GET** `/api/resources`
- **Query Parameters:**
  - `name` (optional): Filter by name (case-insensitive partial match)
  - `minValue` (optional): Minimum value filter
  - `maxValue` (optional): Maximum value filter
- **Example:** `GET /api/resources?name=API&minValue=100&maxValue=1000`
- **Response:** 200 OK with array of resources

### Get Resource by ID
- **GET** `/api/resources/:id`
- **Response:** 200 OK with resource details, or 404 if not found

### Update Resource
- **PUT** `/api/resources/:id`
- **Body:**
  ```json
  {
    "name": "Updated Name",
    "description": "Updated description",
    "value": 200
  }
  ```
- **Response:** 200 OK with updated resource, or 404 if not found

### Delete Resource
- **DELETE** `/api/resources/:id`
- **Response:** 200 OK with success message, or 404 if not found

## Testing

Run the test suite with coverage:

```bash
npm test
```

This will:
- Run all tests in the `src/__tests__/` directory
- Generate coverage reports in the `coverage/` directory
- Display coverage summary in the terminal

View detailed coverage reports:
- Open `coverage/lcov-report/index.html` in your browser

## Project Structure

```
src/problem5/
├── src/
│   ├── __tests__/          # Test files
│   ├── config/             # Configuration files
│   │   └── database.ts     # MongoDB connection
│   ├── controllers/        # Request handlers
│   │   └── resourceController.ts
│   ├── middleware/         # Express middleware
│   │   └── validate.ts     # Validation middleware
│   ├── models/             # Mongoose models
│   │   └── Resource.ts
│   ├── routes/             # API routes
│   │   └── resourceRoutes.ts
│   ├── utils/              # Utility functions
│   │   └── errorHandler.ts # Error handling
│   ├── app.ts              # Express app setup
│   ├── server.ts           # Server entry point
│   └── seed.ts             # Database seeding
├── coverage/               # Test coverage reports
├── docker-compose.yml      # MongoDB Docker setup
├── jest.config.ts          # Jest configuration
├── package.json            # Dependencies and scripts
└── tsconfig.json           # TypeScript configuration
```
