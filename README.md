# Piazza System App

This is a Node.js and Express-based backend API for a Piazza-like discussion system. It allows users to register, log in, create posts, comment, like/dislike posts, and interact with topics.

This was an app developed during the Cloud Computing course at Birkbeck University.

## Features

- **User Authentication:** Register and log in with JWT-based authentication.
- **Posts:** Create, update, and retrieve posts. Posts can expire after a set time.
- **Comments:** Add and view comments on posts.
- **Likes/Dislikes:** Like or dislike posts (except your own).
- **Topics:** Posts are organized by topics.
- **Interactions:** All likes, dislikes, and comments are tracked as interactions.

## Project Structure

```
piazza-system-app/
  app.js                # Main application entry point
  models/               # Mongoose models for User, Post, Comment, Topic, Action, Interaction
  routes/               # Express routes for posts, comments, likes, dislikes, authentication
  validations/          # Input validation and token authentication
  package.json          # Project dependencies and scripts
```

## Getting Started

1. **Install dependencies:**
   ```sh
   npm install
   ```

2. **Set up environment variables:**
   - Create a `.env` file in `piazza-system-app/` with:
     ```
     DB_CONNECTOR=<your-m-connection-string>
     TOKEN_SECRET=<your-jwt-secret>
     ```

3. **Start the server:**
   ```sh
   npm start
   ```

   The server runs on port `3002`.

## API Endpoints

- `POST /user/register` — Register a new user
- `POST /user/login` — Log in and receive an auth token
- `POST /posts` — Create a new post (auth required)
- `GET /posts` — Get posts (auth required)
- `PATCH /posts/:postId` — Update a post (auth required)
- `POST /comments` — Add a comment to a post (auth required)
- `GET /comments` — Get comments for a post (auth required)
- `POST /likes` — Like a post (auth required)
- `POST /dislikes` — Dislike a post (auth required)

## Technologies Used

- Node.js
- Express
- MongoDB & Mongoose
- Joi (validation)
- bcryptjs (password hashing)
- jsonwebtoken (JWT authentication)