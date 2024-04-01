# Alura API

This API provides public endpoints for accessing m3u8 videos and playlist segments, along with an endpoint for obtaining a JWT token for authenticating to private routes.

## Private Routes (Require JWT Token)

### 1. Get List of Courses

`GET /courses`

Returns a list of available courses.

### 2. Get List of Course Modules

`POST /course/modules`

Returns a list of available courses modules.

Parameters in the request body:

```json
{
  "courseId": "...",
  /**
  * Indicates whether videos should be included in modules
  * default: false
  */
  "videos": true | false
}
```

### 3. Get List of Categories

`POST /categories`

Returns a list of available categories.

Parameters in the request body:

```json
{
  /**
  * Indicates whether modules should be included in categories
  * default: false
  */
  "modules": true | false
}
```

Returns a list of available categories.

### 4. Get List of Categery Modules

`POST /category/modules`

Returns a list of available category modules.

Parameters in the request body:

```json
{
  "category": "..."
}
```

Returns a list of modules for the specified category.

## Public Routes

### 1. Get Video

`GET /video/:courseId/:module/:video/`

Returns name and url(mp4) for the specified video.

### 2. Get JWT Token

`GET /jwt-token`

Returns a JWT token for authentication in private routes.

## Notes

- Ensure to include the JWT token in requests for private routes.
- Manage refresh and token expiration appropriately on the client side.

