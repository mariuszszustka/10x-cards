# REST API Plan

## 1. Resources

### Users
- Maps to `users` table
- Represents registered users of the application
- Contains authentication and profile information

### Flashcards
- Maps to `flashcards` table
- Represents individual flashcards created manually or via AI generation
- Contains front/back content and metadata

### Generations
- Maps to `generations` table
- Represents AI generation sessions
- Tracks statistics and metadata about generation process

### Generation Error Logs
- Maps to `generation_error_logs` table
- Records errors during AI generation process
- Used for monitoring and debugging

## 2. Endpoints

### Authentication

#### Register User
- Method: POST
- Path: /api/auth/register
- Description: Register a new user account
- Request Body:
```json
{
  "email": "string",
  "password": "string"
}
```
- Response Body:
```json
{
  "id": "uuid",
  "email": "string",
  "created_at": "timestamp"
}
```
- Success: 201 Created
- Errors:
  - 400 Bad Request (Invalid input)
  - 409 Conflict (Email already exists)

#### Login
- Method: POST
- Path: /api/auth/login
- Description: Authenticate user and get JWT token
- Request Body:
```json
{
  "email": "string",
  "password": "string"
}
```
- Response Body:
```json
{
  "token": "string",
  "user": {
    "id": "uuid",
    "email": "string"
  }
}
```
- Success: 200 OK
- Errors:
  - 400 Bad Request (Invalid credentials)
  - 401 Unauthorized

### Flashcards

#### List Flashcards
- Method: GET
- Path: /api/flashcards
- Description: Get user's flashcards with pagination and filtering
- Query Parameters:
  - page: integer (default: 1)
  - per_page: integer (default: 20, max: 100)
  - source: string (optional, one of: 'ai-full', 'ai-edited', 'manual')
  - search: string (optional, searches front and back text)
  - generation_id: integer (optional)
- Response Body:
```json
{
  "items": [
    {
      "id": "integer",
      "front": "string",
      "back": "string",
      "source": "string",
      "generation_id": "integer|null",
      "created_at": "timestamp",
      "updated_at": "timestamp"
    }
  ],
  "total": "integer",
  "page": "integer",
  "per_page": "integer",
  "total_pages": "integer"
}
```
- Success: 200 OK
- Errors:
  - 400 Bad Request (Invalid parameters)
  - 401 Unauthorized

#### Create Flashcard
- Method: POST
- Path: /api/flashcards
- Description: Create a new flashcard manually
- Request Body:
```json
{
  "front": "string",
  "back": "string"
}
```
- Response Body:
```json
{
  "id": "integer",
  "front": "string",
  "back": "string",
  "source": "manual",
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```
- Success: 201 Created
- Errors:
  - 400 Bad Request (Invalid input)
  - 401 Unauthorized

#### Update Flashcard
- Method: PUT
- Path: /api/flashcards/{id}
- Description: Update existing flashcard
- Request Body:
```json
{
  "front": "string",
  "back": "string"
}
```
- Response Body:
```json
{
  "id": "integer",
  "front": "string",
  "back": "string",
  "source": "string",
  "generation_id": "integer|null",
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```
- Success: 200 OK
- Errors:
  - 400 Bad Request (Invalid input)
  - 401 Unauthorized
  - 404 Not Found

#### Delete Flashcard
- Method: DELETE
- Path: /api/flashcards/{id}
- Description: Delete existing flashcard
- Success: 204 No Content
- Errors:
  - 401 Unauthorized
  - 404 Not Found

### Generations

#### Create Generation
- Method: POST
- Path: /api/generations
- Description: Start new AI generation process
- Request Body:
```json
{
  "source_text": "string",
  "model": "string"
}
```
- Response Body:
```json
{
  "id": "integer",
  "status": "processing",
  "generated_count": 0,
  "source_text_hash": "string",
  "source_text_length": "integer",
  "created_at": "timestamp"
}
```
- Success: 202 Accepted
- Errors:
  - 400 Bad Request (Invalid input)
  - 401 Unauthorized

#### Get Generation Status
- Method: GET
- Path: /api/generations/{id}
- Description: Check generation status and get generated flashcards
- Response Body:
```json
{
  "id": "integer",
  "status": "processing" | "completed" | "error",
  "generated_count": "integer",
  "accepted_unedited_count": "integer",
  "accepted_edited_count": "integer",
  "source_text_hash": "string",
  "source_text_length": "integer",
  "created_at": "timestamp",
  "updated_at": "timestamp",
  "generation_duration": "integer",
  "flashcards": [
    {
      "id": "integer",
      "front": "string",
      "back": "string",
      "source": "ai-full"
    }
  ]
}
```
- Success: 200 OK
- Errors:
  - 401 Unauthorized
  - 404 Not Found

#### Accept Generated Flashcards
- Method: PUT
- Path: /api/generations/{id}/accept
- Description: Accept and save generated flashcards
- Request Body:
```json
{
  "flashcards": [
    {
      "id": "integer",
      "front": "string",
      "back": "string",
      "edited": "boolean"
    }
  ]
}
```
- Response Body:
```json
{
  "accepted_count": "integer",
  "flashcards": [
    {
      "id": "integer",
      "front": "string",
      "back": "string",
      "source": "string"
    }
  ]
}
```
- Success: 200 OK
- Errors:
  - 400 Bad Request (Invalid input)
  - 401 Unauthorized
  - 404 Not Found

## 3. Authentication and Authorization

### Authentication Mechanism
- JWT (JSON Web Tokens) based authentication
- Token included in Authorization header: `Authorization: Bearer <token>`
- Token expiration: 24 hours
- Refresh token mechanism for extending sessions

### Authorization Rules
- All endpoints except registration and login require authentication
- Users can only access their own resources (flashcards, generations)
- Row Level Security (RLS) implemented at database level
- Rate limiting applied to generation endpoints

## 4. Validation and Business Logic

### User Resource
- Email must be valid format (e.g., "user@example.com")
- Password must meet minimum security requirements (min. 8 characters, at least one uppercase letter, one lowercase letter, one number)
- Email must be unique

### Flashcard Resource
- Front text limited to 200 characters
- Back text limited to 500 characters
- Source must be one of: 'ai-full', 'ai-edited', 'manual'

### Generation Resource
- Source text length must be between 1000 and 10000 characters
- Model must be one of supported AI models (e.g., 'gpt-3.5-turbo', 'gpt-4')
- Generation process timeout after 5 minutes
- Maximum 50 flashcards per generation

### Data Formats
- Timestamps use ISO 8601 format: `YYYY-MM-DDTHH:mm:ss.sssZ` (e.g., "2023-07-15T14:30:45.123Z")
- UUIDs use standard format: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` (e.g., "123e4567-e89b-12d3-a456-426614174000")
- Boolean values represented as `true` or `false`
- Numeric IDs represented as integers without quotation marks

### Error Handling
- Standardized error response format:
  ```json
  {
    "error": {
      "code": "string",
      "message": "string",
      "details": [
        {
          "field": "string",
          "message": "string"
        }
      ]
    }
  }
  ```
- Error codes:
  - `validation_error`: Invalid input data
  - `not_found`: Resource not found
  - `unauthorized`: Authentication required
  - `forbidden`: Permission denied
  - `conflict`: Resource conflict (e.g., duplicate email)
  - `server_error`: Internal server error
- Detailed validation error messages
- Proper HTTP status codes
- Error logging for debugging

### Rate Limiting
- Generation endpoints: 10 requests per hour per user
- Authentication endpoints: 5 attempts per minute per IP
- General API endpoints: 100 requests per minute per user 