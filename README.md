# Alura API

This API provides public endpoints for accessing m3u8 videos and playlist segments, along with an endpoint for obtaining a JWT token for authenticating to private routes.

## Private Routes (Require JWT Token)

### 1. Get List of Courses

`GET /courses`

Returns a list of available courses.

### 2. Get List of Modules

`GET /modules`

Parameters in the request body:

```json
{
  "courseId": "..."
}
```

Returns a list of modules for the specified course.

### 3. Get List of Videos

`GET /videos`

Parameters in the request body:

```json
{
  "courseId": "...",
  "module": "..."
}
```

Returns a list of videos for the specified course and module.

### 4. Get List of Categories

`GET /categories`

Returns a list of available categories.

### 5. Get List of Categery Modules

`POST /category/modules`

Parameters in the request body:

```json
{
  "category": "..."
}
```

Returns a list of modules for the specified category.

## Public Routes

### 1. Get M3U8 Playlist for a Video

`GET /video/:courseId/:module/:video/`

Returns an M3U8 playlist for the specified video.

### 2. Get Segment of an M3U8 Playlist

`GET /segment/:id/`

Returns a segment of the M3U8 playlist based on the specified ID.

### 3. Get JWT Token

`GET /jwt-token`

Returns a JWT token for authentication in private routes.

## Notes

- Ensure to include the JWT token in requests for private routes.
- Manage refresh and token expiration appropriately on the client side.
