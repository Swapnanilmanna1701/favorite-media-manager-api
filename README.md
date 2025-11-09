# Movie & TV Show Management API

A RESTful backend service built with Next.js 15 that allows users to manage their favorite movies and TV shows. Features full CRUD operations with pagination, search functionality, and interactive API testing interface.

## 🚀 Features

### Core Features
- ✅ **Add New Entries** - Create movie or TV show entries with complete details
- ✅ **View Entries** - List all entries with pagination (page & limit parameters)
- ✅ **Edit Entries** - Update existing entries by ID (partial updates supported)
- ✅ **Delete Entries** - Remove entries by ID
- ✅ **Search Functionality** - Filter entries by title or director (bonus feature)
- ✅ **Interactive UI** - Web interface to test all API endpoints

### Technical Features
- **Input Validation** - Zod schema validation for all endpoints
- **Database ORM** - Drizzle ORM for type-safe database access
- **Seeded Data** - Pre-populated with 4 sample entries (2 movies, 2 TV shows)
- **Error Handling** - Comprehensive error responses with detailed messages
- **RESTful Design** - Follows REST conventions and best practices

## 🛠️ Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: Turso (SQLite)
- **ORM**: Drizzle ORM
- **Validation**: Zod
- **UI**: React + Shadcn/UI
- **TypeScript**: Full type safety
- **Runtime**: Bun

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ or Bun 1.0+
- Git

### 1. Clone the Repository
```bash
git clone <repository-url>
cd <project-folder>
```

### 2. Install Dependencies
```bash
npm install
# or
bun install
```

### 3. Environment Variables
The project comes pre-configured with a Turso database. Environment variables are already set in `.env`:

```env
TURSO_CONNECTION_URL=<connection-url>
TURSO_AUTH_TOKEN=<auth-token>
```

### 4. Run Database Migrations
```bash
npm run db:push
# or
bun run db:push
```

### 5. Seed the Database
```bash
npm run db:seed
# or
bun run db:seed
```

### 6. Start the Development Server
```bash
npm run dev
# or
bun dev
```

The application will be available at `http://localhost:3000`

## 📊 Database Schema

### Entry Table
| Field | Type | Description |
|-------|------|-------------|
| id | INTEGER | Primary key (auto-increment) |
| title | TEXT | Movie/TV show title (required) |
| type | TEXT | "Movie" or "TV Show" (required) |
| director | TEXT | Director name (required) |
| budget | REAL | Production budget in USD (required) |
| location | TEXT | Filming location (required) |
| duration | TEXT | Runtime or episode length (required) |
| year | INTEGER | Release year (required) |
| createdAt | TEXT | ISO timestamp of creation |
| updatedAt | TEXT | ISO timestamp of last update |

### Sample Seed Data
The database is pre-seeded with 4 entries:

**Movies:**
1. The Shawshank Redemption (1994)
   - Director: Frank Darabont
   - Budget: $25,000,000
   - Location: Ohio, USA
   - Duration: 142 min

2. Inception (2010)
   - Director: Christopher Nolan
   - Budget: $160,000,000
   - Location: Los Angeles, USA
   - Duration: 148 min

**TV Shows:**
3. Breaking Bad (2008)
   - Director: Vince Gilligan
   - Budget: $3,000,000
   - Location: Albuquerque, USA
   - Duration: 47 min per episode

4. Stranger Things (2016)
   - Director: The Duffer Brothers
   - Budget: $8,000,000
   - Location: Atlanta, USA
   - Duration: 50 min per episode

## 🔌 API Endpoints

### 1. List Entries (with Pagination & Search)
**GET** `/api/entries`

Query Parameters:
- `page` (optional, default: 1) - Page number
- `limit` (optional, default: 10, max: 100) - Items per page
- `search` (optional) - Search by title or director
- `sortBy` (optional, default: createdAt) - Sort field (year, title, createdAt)
- `sortOrder` (optional, default: desc) - Sort order (asc, desc)

**Example Request:**
```bash
curl "http://localhost:3000/api/entries?page=1&limit=10&search=inception"
```

**Example Response:**
```json
{
  "data": [
    {
      "id": 2,
      "title": "Inception",
      "type": "Movie",
      "director": "Christopher Nolan",
      "budget": 160000000,
      "location": "Los Angeles, USA",
      "duration": "148 min",
      "year": 2010,
      "createdAt": "2024-01-09T12:00:00.000Z",
      "updatedAt": "2024-01-09T12:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1,
    "hasNextPage": false,
    "hasPrevPage": false
  }
}
```

### 2. Get Single Entry
**GET** `/api/entries/:id`

**Example Request:**
```bash
curl "http://localhost:3000/api/entries/1"
```

**Example Response:**
```json
{
  "data": {
    "id": 1,
    "title": "The Shawshank Redemption",
    "type": "Movie",
    "director": "Frank Darabont",
    "budget": 25000000,
    "location": "Ohio, USA",
    "duration": "142 min",
    "year": 1994,
    "createdAt": "2024-01-09T12:00:00.000Z",
    "updatedAt": "2024-01-09T12:00:00.000Z"
  }
}
```

### 3. Create New Entry
**POST** `/api/entries`

**Request Body:**
```json
{
  "title": "The Dark Knight",
  "type": "Movie",
  "director": "Christopher Nolan",
  "budget": 185000000,
  "location": "Chicago, USA",
  "duration": "152 min",
  "year": 2008
}
```

**Example Request:**
```bash
curl -X POST "http://localhost:3000/api/entries" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "The Dark Knight",
    "type": "Movie",
    "director": "Christopher Nolan",
    "budget": 185000000,
    "location": "Chicago, USA",
    "duration": "152 min",
    "year": 2008
  }'
```

**Success Response (201):**
```json
{
  "message": "Entry created successfully",
  "data": {
    "id": 5,
    "title": "The Dark Knight",
    "type": "Movie",
    "director": "Christopher Nolan",
    "budget": 185000000,
    "location": "Chicago, USA",
    "duration": "152 min",
    "year": 2008,
    "createdAt": "2024-01-09T12:30:00.000Z",
    "updatedAt": "2024-01-09T12:30:00.000Z"
  }
}
```

**Validation Error Response (400):**
```json
{
  "error": "Validation failed",
  "details": {
    "title": ["Title is required"],
    "budget": ["Budget must be a positive number"]
  }
}
```

### 4. Update Entry
**PUT** `/api/entries/:id`

Supports partial updates - only include fields you want to change.

**Request Body (partial update):**
```json
{
  "budget": 200000000,
  "year": 2009
}
```

**Example Request:**
```bash
curl -X PUT "http://localhost:3000/api/entries/1" \
  -H "Content-Type: application/json" \
  -d '{
    "budget": 30000000
  }'
```

**Success Response:**
```json
{
  "message": "Entry updated successfully",
  "data": {
    "id": 1,
    "title": "The Shawshank Redemption",
    "type": "Movie",
    "director": "Frank Darabont",
    "budget": 30000000,
    "location": "Ohio, USA",
    "duration": "142 min",
    "year": 1994,
    "createdAt": "2024-01-09T12:00:00.000Z",
    "updatedAt": "2024-01-09T12:45:00.000Z"
  }
}
```

### 5. Delete Entry
**DELETE** `/api/entries/:id`

**Example Request:**
```bash
curl -X DELETE "http://localhost:3000/api/entries/1"
```

**Success Response:**
```json
{
  "message": "Entry deleted successfully"
}
```

**Not Found Response (404):**
```json
{
  "error": "Entry not found"
}
```

## 🎯 Validation Rules

All fields are validated using Zod schemas:

- **title**: String, minimum 1 character (required)
- **type**: Must be either "Movie" or "TV Show" (required)
- **director**: String, minimum 1 character (required)
- **budget**: Positive number (required)
- **location**: String, minimum 1 character (required)
- **duration**: String, minimum 1 character (required)
- **year**: Integer between 1800 and current year + 10 (required)

## 🖥️ Interactive UI

The project includes a web interface at `http://localhost:3000` with:

- **API Documentation** - Complete endpoint reference
- **Browse Entries** - View all entries with pagination and search
- **Add/Edit Form** - Interactive form to test POST and PUT endpoints
- **Delete Actions** - One-click delete with confirmation
- **Real-time Response Viewer** - See API responses in real-time

## 📁 Project Structure

```
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── entries/
│   │   │       ├── route.ts          # GET, POST /api/entries
│   │   │       └── [id]/
│   │   │           └── route.ts      # GET, PUT, DELETE /api/entries/:id
│   │   ├── layout.tsx                # Root layout
│   │   ├── page.tsx                  # Homepage with API docs
│   │   └── globals.css               # Global styles
│   ├── components/
│   │   ├── api-tester.tsx            # Interactive API testing UI
│   │   └── ui/                       # Shadcn UI components
│   ├── db/
│   │   ├── index.ts                  # Database client
│   │   ├── schema.ts                 # Drizzle schema
│   │   └── seeds/
│   │       └── entry.ts              # Database seeder
│   └── lib/
│       └── validations/
│           └── entry.ts              # Zod validation schemas
├── drizzle/
│   └── 0000_*.sql                    # Database migrations
├── .env                              # Environment variables
├── drizzle.config.ts                 # Drizzle configuration
└── package.json                      # Dependencies & scripts
```

## 🧪 Testing the API

### Using cURL

**Create an entry:**
```bash
curl -X POST http://localhost:3000/api/entries \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Interstellar",
    "type": "Movie",
    "director": "Christopher Nolan",
    "budget": 165000000,
    "location": "Calgary, Canada",
    "duration": "169 min",
    "year": 2014
  }'
```

**List entries:**
```bash
curl "http://localhost:3000/api/entries?page=1&limit=5"
```

**Search entries:**
```bash
curl "http://localhost:3000/api/entries?search=nolan"
```

**Update entry:**
```bash
curl -X PUT http://localhost:3000/api/entries/1 \
  -H "Content-Type: application/json" \
  -d '{"budget": 35000000}'
```

**Delete entry:**
```bash
curl -X DELETE http://localhost:3000/api/entries/1
```

### Using the Web Interface

1. Navigate to `http://localhost:3000`
2. Click "Browse Entries" to view all entries
3. Use the search bar to filter entries
4. Click "Add/Edit Entry" to create new entries
5. Click "Edit" on any entry to modify it
6. Click "Delete" to remove an entry

## 🔧 Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Database operations
npm run db:push      # Push schema changes
npm run db:seed      # Seed the database
npm run db:studio    # Open Drizzle Studio

# Linting
npm run lint
```

## ✨ Code Quality

- **TypeScript**: Full type safety throughout the codebase
- **Validation**: Zod schemas for runtime type checking
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Code Organization**: Clear separation of concerns (routes, schemas, components)
- **Modern Practices**: Uses Next.js 15 App Router and Server Actions patterns

## 🎨 Bonus Features Implemented

✅ **Search Functionality** - Filter entries by title or director  
✅ **Advanced Pagination** - Full pagination metadata with hasNext/hasPrev  
✅ **Sorting** - Sort entries by year, title, or creation date  
✅ **Interactive UI** - Complete web interface for testing  
✅ **Partial Updates** - PUT endpoint supports partial updates  
✅ **Real-time Feedback** - Live API response viewer  

## 📝 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

Built as a demonstration of RESTful API design and modern web development practices.
Built by Swapnanil.
