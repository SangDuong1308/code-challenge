# Scoreboard API Module - Implementation Specification

## Overview

This module handles real-time scoreboard functionality for a website. It manages user scores, displays the top 10 users, provides live updates, and prevents unauthorized score manipulation.

## Requirements

1. **Scoreboard Display**: Show top 10 users' scores
2. **Live Updates**: Real-time updates when scores change
3. **Score Updates**: Users complete actions that increase their score
4. **API Integration**: Actions dispatch API calls to update scores
5. **Security**: Prevent malicious users from unauthorized score increases

---

## API Endpoints

### 1. Update Score

**Endpoint**: `POST /api/scores/update`

**Description**: Updates a user's score when they complete an action.

**Authentication**: Required (JWT Bearer token)

**Request Headers**:
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Request Body**:
```json
{
  "actionId": "actionID-123",
  "actionType": "TASK_COMPLETE",
  "scoreIncrement": 10,
  "timestamp": "2025-01-17T10:30:00.000Z"
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "userId": "user-123",
    "previousScore": 1240,
    "newScore": 1250,
    "rank": 5,
    "updatedAt": "2025-01-17T10:30:01.000Z"
  }
}
```

**Error Responses**:
- `400 Bad Request`: Invalid request format or validation failed
- `401 Unauthorized`: Missing or invalid JWT token
- `403 Forbidden`: Security validation failed
- `409 Conflict`: Duplicate action ID
- `500 Internal Server Error`: Server error

### 2. Get Leaderboard

**Endpoint**: `GET /api/scores/leaderboard`

**Description**: Retrieves the current top 10 users.

**Query Parameters**:
- `limit` (optional): Number of users to return (default: 10, max: 100)

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "leaderboard": [
      {
        "rank": 1,
        "userId": "user-456",
        "username": "TopPlayer",
        "score": 5000,
        "lastUpdated": "2025-01-17T10:25:00.000Z"
      }
    ],
    "timestamp": "2025-01-17T10:30:00.000Z"
  }
}
```

## Database Schema

### Scores Table
```sql
CREATE TABLE scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  score BIGINT DEFAULT 0 NOT NULL CHECK (score >= 0),
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id)
);

CREATE INDEX idx_scores_score_desc ON scores(score DESC, last_updated ASC);
```

### Score Updates Table (Audit Trail)
```sql
CREATE TABLE score_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  action_id UUID NOT NULL UNIQUE,
  action_type VARCHAR(50) NOT NULL,
  score_increment INTEGER NOT NULL,
  score_before BIGINT NOT NULL,
  score_after BIGINT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_score_updates_action_id ON score_updates(action_id);
```

---

## Security Implementation

### 1. Authentication
- All score update requests require a valid JWT token
- JWT validation happens first in the request flow
- Invalid tokens return 401 Unauthorized immediately

### 2. Action Validation
- **Action ID Deduplication**: Check Redis to prevent duplicate action processing
- **Action Type Validation**: Validate against whitelist of allowed action types
- **Score Increment Validation**: Ensure increment is within allowed range
- **Timestamp Validation**: Verify timestamp is within ±5 minutes of server time

### 3. Database Transaction
- Use row-level locking (`SELECT ... FOR UPDATE`) to prevent race conditions
- Atomic transaction: BEGIN → UPDATE → INSERT (audit) → COMMIT

---

## Live Update Implementation

### WebSocket Flow
1. Clients connect via WebSocket
2. On score update, publish event to Redis Pub/Sub
3. WebSocket Server broadcasts to all connected clients

### WebSocket Event
```javascript
{
  "event": "leaderboard:update",
  "data": {
    "leaderboard": [...top10Users],
    "timestamp": "2025-01-17T10:30:01.000Z"
  }
}
```

### Flow Summary

1. **Client** sends POST request with JWT and action details
2. **Auth Middleware** validates JWT (return 401 if invalid)
3. **Score Service** checks for duplicate actionId in Redis (return 409 if duplicate)
4. **Score Service** validates action type, score increment, and timestamp (return 400/403 if invalid)
5. **Database Transaction**: Lock row, update score, insert audit record, commit
6. **Cache Updates**: Store actionId, update leaderboard cache, invalidate user cache
7. **Real-time Broadcast**: Publish to Redis Pub/Sub, WebSocket Server broadcasts to all clients
8. **Response**: Return 200 OK with new score and rank

---

## Technology Stack

- **Backend**: Node.js with Express.js
- **Database**: PostgreSQL (primary storage)
- **Cache/PubSub**: Redis (caching and real-time updates)
- **Real-time**: WebSocket (Socket.IO)
- **Authentication**: JWT (JSON Web Tokens)

---

## Improvement Suggestions

### 1. Performance Optimizations

- **Caching**: Cache top 10 leaderboard in Redis with 30-second TTL
- **Database Indexes**: Ensure indexes on `score` (DESC) and `action_id` for fast queries
- **Connection Pooling**: Use connection pooling for database (recommended: 20 connections)
- **Read Replicas**: Consider PostgreSQL read replicas for leaderboard queries

### 2. Scalability Enhancements

- **Horizontal Scaling**: Design stateless API servers for easy scaling
- **Redis Pub/Sub**: Use Redis Pub/Sub to sync WebSocket broadcasts across multiple server instances
- **Load Balancer**: Use load balancer (NGINX, AWS ALB) to distribute traffic

### 3. Enhanced Security

- **Rate Limiting**: Implement rate limiting (e.g., 10 requests per minute per user)
- **HTTPS Only**: Enforce TLS 1.3 for all endpoints
- **Input Validation**: Sanitize and validate all input parameters
- **Anomaly Detection**: Monitor for abnormal score growth patterns

### 4. Monitoring & Observability

- **Logging**: Log all score updates with user ID, action type, and score change
- **Metrics**: Track API response times, database query latency, WebSocket connections
- **Alerting**: Set up alerts for error rates, response time degradation, and suspicious activity

### 5. Testing Recommendations

- **Unit Tests**: Test validation logic, authentication middleware (target: 80%+ coverage)
- **Integration Tests**: Test complete score update flow, duplicate rejection, WebSocket broadcasts
- **Load Testing**: Test with 1000+ concurrent users, measure P95 response time (target: <200ms)

### 6. Future Enhancements

- **Time-Based Leaderboards**: Daily, weekly, monthly leaderboards
- **Pagination**: Support fetching top 100, 1000 users
- **Admin Dashboard**: Monitor score updates and suspicious activity
- **Achievements**: Award badges for milestones
