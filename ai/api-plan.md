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

### System Error Logs

- Maps to `system_error_logs` table
- Records system-wide errors and exceptions
- Used for monitoring and debugging by administrators

### Leitner System

- Maps to `flashcard_learning_progress`, `review_history`, and `review_sessions` tables
- Tracks learning progress for flashcards using Leitner system
- Contains information about review history and learning sessions

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

### Leitner System

#### Get Leitner Flashcards

- Method: GET
- Path: /api/leitner/flashcards
- Description: Get flashcards for learning based on Leitner box and due date
- Query Parameters:
  - box: integer (optional, 1-3, if not provided returns cards from all boxes due for review)
  - limit: integer (optional, max number of cards to return, default: 10)
- Response Body:

```json
{
  "items": [
    {
      "id": "integer",
      "front": "string",
      "back": "string",
      "leitner_box": "integer",
      "next_review_at": "timestamp",
      "consecutive_correct_answers": "integer"
    }
  ],
  "total": "integer",
  "counts_by_box": {
    "box_1": "integer",
    "box_2": "integer",
    "box_3": "integer"
  }
}
```

- Success: 200 OK
- Errors:
  - 400 Bad Request (Invalid parameters)
  - 401 Unauthorized

#### Record Flashcard Review

- Method: POST
- Path: /api/leitner/reviews
- Description: Record the result of a flashcard review and update its Leitner box
- Request Body:

```json
{
  "flashcard_id": "integer",
  "is_correct": "boolean",
  "review_time_ms": "integer"
}
```

- Response Body:

```json
{
  "id": "integer",
  "flashcard_id": "integer",
  "previous_box": "integer",
  "new_box": "integer",
  "next_review_at": "timestamp",
  "consecutive_correct_answers": "integer",
  "created_at": "timestamp"
}
```

- Success: 201 Created
- Errors:
  - 400 Bad Request (Invalid input)
  - 401 Unauthorized
  - 404 Not Found (Flashcard not found)

#### Start Learning Session

- Method: POST
- Path: /api/leitner/sessions
- Description: Start a new learning session with cards from a specific Leitner box
- Request Body:

```json
{
  "box": "integer",
  "limit": "integer"
}
```

- Response Body:

```json
{
  "id": "integer",
  "started_at": "timestamp",
  "flashcards": [
    {
      "id": "integer",
      "front": "string",
      "back": "string",
      "leitner_box": "integer"
    }
  ],
  "total_cards": "integer"
}
```

- Success: 201 Created
- Errors:
  - 400 Bad Request (Invalid input)
  - 401 Unauthorized

#### Complete Learning Session

- Method: PUT
- Path: /api/leitner/sessions/{id}/complete
- Description: Complete a learning session and record statistics
- Request Body:

```json
{
  "correct_answers": "integer",
  "incorrect_answers": "integer",
  "total_review_time_ms": "integer"
}
```

- Response Body:

```json
{
  "id": "integer",
  "started_at": "timestamp",
  "completed_at": "timestamp",
  "cards_reviewed": "integer",
  "correct_answers": "integer",
  "incorrect_answers": "integer",
  "total_review_time_ms": "integer",
  "summary": {
    "moved_up": "integer",
    "moved_down": "integer",
    "remained": "integer"
  }
}
```

- Success: 200 OK
- Errors:
  - 400 Bad Request (Invalid input)
  - 401 Unauthorized
  - 404 Not Found (Session not found)

### User Management

#### Change Password

- Method: PUT
- Path: /api/users/password
- Description: Change user's password
- Request Body:

```json
{
  "current_password": "string",
  "new_password": "string"
}
```

- Response Body:

```json
{
  "success": "boolean",
  "message": "string"
}
```

- Success: 200 OK
- Errors:
  - 400 Bad Request (Invalid input or incorrect current password)
  - 401 Unauthorized

#### Delete Account

- Method: DELETE
- Path: /api/users/me
- Description: Delete user's account and all associated data
- Request Body:

```json
{
  "password": "string"
}
```

- Success: 204 No Content
- Errors:
  - 400 Bad Request (Invalid input or incorrect password)
  - 401 Unauthorized

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

### Leitner System

- Three Leitner boxes (1, 2, 3) for spaced repetition
- Box 1: Cards reviewed daily
- Box 2: Cards reviewed every 3 days
- Box 3: Cards reviewed every 7 days
- Cards move up to next box on correct answer, back to box 1 on incorrect answer
- Learning sessions limited to maximum 10 cards by default
- Review history tracked for analytics and progress monitoring

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

## 5. MVP Implementation Notes

### Authentication and Authorization

- Email verification will not be implemented in MVP (users can register with any valid email format)
- JWT refresh token mechanism will be simplified in MVP, details to be specified in later development phases
- Token expiration of 24 hours will be implemented in MVP

### Rate Limiting

- Rate limiting may be omitted in MVP phase
- If implemented, will focus only on critical endpoints like generation to prevent abuse
- Simple in-memory implementation may be used instead of distributed rate limiting

### Error Logging

- All system errors will be logged in the `system_error_logs` table
- Generation-specific errors will be logged in `generation_error_logs` table
- Both tables will have appropriate RLS policies to protect sensitive information

### System Leitnera

- MVP używa uproszczonego wariantu z 3 pudełkami zamiast standardowych 5:
  - Poziom 1: Fiszki nowe lub często niepoprawnie odpowiadane (powtarzane codziennie)
  - Poziom 2: Fiszki z podstawową znajomością (powtarzane co 3 dni)
  - Poziom 3: Fiszki dobrze opanowane (powtarzane co 7 dni)
