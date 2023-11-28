# Advanced Authentication System with TypeScript and MongoDB

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Configuration](#configuration)
- [Usage](#usage)
  - [Registering a User](#registering-a-user)
  - [Logging In](#logging-in)
  - [Refreshing Tokens](#refreshing-tokens)
  - [Protected Routes](#protected-routes)
- [Advanced Configuration](#advanced-configuration)
- [Contributing](#contributing)
- [License](#license)

## Introduction

This project provides a comprehensive example of implementing an advanced authentication system using TypeScript, Express, MongoDB, and JSON Web Tokens (JWT). The system includes features such as user registration, login, token refresh, and protection of routes using JWT.

## Features

- Secure user registration and authentication
- Token-based authentication with JWT
- Automatic token refresh mechanism
- Protection of routes using middleware
- MongoDB for persistent storage
- CORS (Cross-Origin Resource Sharing)
- Helmet is used to set various HTTP headers
- Express Rate Limit

## Getting Started

### Installation

1. Ensure you have [Node.js](https://nodejs.org/) and [MongoDB](https://www.mongodb.com/try/download/community) installed.

2. Clone the repository:

   ```bash
   git clone https://github.com/koetee/advanced-auth-ts.git
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

### Configuration

Create a `.env` file in the root of the project with the following content:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/yourdatabase
SECRET_KEY=yoursecretkey
```

Replace yourdatabase and yoursecretkey with your preferred values.

## Getting Started

### Registering a User

```bash
curl -X POST http://localhost:3000/register -H "Content-Type: application/json" -d '{"username": "yourusername", "password": "yourpassword"}'
```

### Logging In

```bash
curl -X POST http://localhost:3000/login -H "Content-Type: application/json" -d '{"username": "yourusername", "password": "yourpassword"}'
```

You will receive a token in the response.

### Refreshing Tokens

```bash
curl -X POST http://localhost:3000/refresh -H "Content-Type: application/json" -d '{"refreshToken": "yourrefreshtoken"}'
```

You will receive a new token in the response.

### Protected Routes

To test protected routes, add the obtained token to the Authorization header:

```bash
curl http://localhost:3000/protected -H "Authorization: Bearer youraccesstoken"
```

If Authorization is not specified, the system will check for the presence of cookies and attempt to use the access token

## Advanced Configuration

- In the file `src/config/constants.ts`, you can adjust login attempt limits and account lockout time.
- The project uses [Express Rate Limit](https://www.npmjs.com/package/express-rate-limit) for rate limiting. You can configure rate limits in the `src/middleware/rateLimiter.ts` file.
- [CORS (Cross-Origin Resource Sharing)](https://www.npmjs.com/package/cors) is implemented to control which domains can access your resources. CORS settings can be adjusted in the `src/middleware/cors.ts` file.
- [Helmet](https://www.npmjs.com/package/helmet) is used to set various HTTP headers for improved security. Configuration for Helmet can be found in the `src/middleware/helmet.ts` file.

## Contributing

If you have any suggestions for improvement or you find a bug, please create an issue or submit a pull request. Contributions are welcome!

## License

This project is licensed under the [MIT License](LICENSE).
