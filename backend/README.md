# Editor de Música Cifrada - Backend API

Backend REST API for the Editor de Música Cifrada application.

## Features

- RESTful API architecture
- TypeScript for type safety
- Express.js framework
- SQL Server database integration
- Multi-tenancy support
- Comprehensive error handling
- Request validation with Zod
- CORS and security middleware

## Prerequisites

- Node.js 18+ 
- SQL Server 2019+
- npm or yarn

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and configure:
   ```bash
   cp .env.example .env
   ```
4. Update database credentials in `.env`

## Development

Start the development server:
```bash
npm run dev
```

The API will be available at `http://localhost:3000/api/v1`

## Build

Build for production:
```bash
npm run build
```

## Production

Start production server:
```bash
npm start
```

## Project Structure

```
src/
├── api/              # API controllers
├── routes/           # Route definitions
├── middleware/       # Express middleware
├── services/         # Business logic
├── utils/            # Utility functions
├── constants/        # Application constants
├── instances/        # Service instances
├── config/           # Configuration
└── server.ts         # Application entry point
```

## API Endpoints

### Health Check
- `GET /health` - API health status

### External Routes (Public)
- `/api/v1/external/*` - Public endpoints

### Internal Routes (Authenticated)
- `/api/v1/internal/*` - Authenticated endpoints

## Environment Variables

See `.env.example` for all available configuration options.

## License

ISC
