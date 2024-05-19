# User Management API

This repository contains the code for a user management API built using Node.js and Express. The API supports importing users from a CSV file, sending emails to users, creating lists, and unsubscribing users from emails.

## Table of Contents
1. [Installation](#installation)
2. [Usage](#usage)
3. [API Endpoints](#api-endpoints)
4. [Project Structure](#project-structure)
5. [Environment Variables](#environment-variables)
6. [Error Handling](#error-handling)
7. [Contributing](#contributing)
8. [License](#license)

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/user-management-api.git
    cd user-management-api
    ```

2. Install the dependencies:
    ```bash
    npm install
    ```

3. Set up environment variables. Create a `.env` file in the root directory and add the following:
    ```env
    ADMIN_MAIL=youradminemail@gmail.com
    ADMIN_PASSWORD=youradminpassword
    ```

4. Start the server:
    ```bash
    npm start
    ```

## Usage

1. **Import Users**: Import users from a CSV file by uploading the file to the specified endpoint.
2. **Send Emails**: Automatically send welcome emails to users who have opted in.
3. **Create Lists**: Create custom lists to categorize users.
4. **Unsubscribe Users**: Allow users to unsubscribe from emails.

## API Endpoints

### Import Users
- **Endpoint**: `/api/users/import`
- **Method**: `POST`
- **Description**: Imports users from a CSV file.
- **Request**: FormData containing the CSV file.
- **Response**:
    ```json
    {
        "status": 200,
        "success": true,
        "message": "User import completed",
        "successfullyAdded": 10,
        "failedToAdd": 2,
        "totalUsersInDatabase": 100,
        "errorLogFile": "path/to/error_log.csv"
    }
    ```

### Send User Emails
- **Endpoint**: `/api/users/sendEmails`
- **Method**: `POST`
- **Description**: Sends welcome emails to users.
- **Response**: `"All email sent successfully"`

### Create List
- **Endpoint**: `/api/lists/create`
- **Method**: `POST`
- **Description**: Creates a new list.
- **Request**: JSON object containing list details.
- **Response**:
    ```json
    {
        "title": "Sample List",
        "customProperties": []
    }
    ```

### Unsubscribe User
- **Endpoint**: `/api/users/unsubscribe/:id`
- **Method**: `GET`
- **Description**: Unsubscribes a user from emails.
- **Response**: `"Unsubscribed"`

## Project Structure

```plaintext
user-management-api/
├── controllers/
│   ├── importController.js    # Handles importing users from CSV
│   ├── emailController.js     # Handles sending emails to users
│   ├── listController.js      # Handles creating lists
│   └── unsubscribeController.js # Handles user unsubscription
├── models/
│   ├── userModel.js           # User model schema
│   └── userListModel.js       # User list model schema
├── routes/
│   ├── userRoutes.js          # Routes for user-related endpoints
│   └── listRoutes.js          # Routes for list-related endpoints
├── .env                       # Environment variables
├── package.json               # Project dependencies and scripts
└── README.md                  # Project documentation
```

## Environment Variables

The application uses the following environment variables:

- `ADMIN_MAIL`: The email address used for sending emails.
- `ADMIN_PASSWORD`: The password for the email account used for sending emails.

## Error Handling

- Errors during the user import process are logged to a CSV file (`error_log.csv`).
- If there is an error while creating a list or unsubscribing a user, appropriate error messages are sent in the response.

Further Possible Enhancements

While the current implementation provides basic functionality for user management, there are several enhancements that could be considered to improve the application:

User Authentication and Authorization:
Implement authentication mechanisms such as JWT (JSON Web Tokens) or OAuth to secure the API endpoints and ensure that only authorized users can access them.

Input Validation:
Enhance input validation to ensure that the data imported from CSV files or received in API requests meets the required criteria. Libraries like express-validator can be used for robust validation.

Pagination and Filtering:
Implement pagination and filtering mechanisms for endpoints that return a large number of results. This would improve performance and user experience, especially for endpoints that list users or lists.

Email Templates:
Create customizable email templates for different scenarios like welcome emails, password reset emails, etc. This allows for better branding and personalization of communication with users.

Error Logging and Monitoring:
Set up comprehensive error logging and monitoring using tools like Sentry or Loggly to track application errors in real-time and receive alerts for critical issues.

Database Indexing:
Analyze query performance and add appropriate indexes to database fields frequently used in queries to optimize database operations.

Unit and Integration Testing:
Write unit tests using testing frameworks like Jest or Mocha to ensure the reliability and correctness of the application. Also, implement integration tests to verify the interactions between different components of the system.

Refactoring and Code Cleanup:
Review the existing codebase for opportunities to refactor and improve code quality. This may involve splitting large functions into smaller, more manageable ones, removing duplicate code, or adhering to best practices and design patterns.

Caching Strategies:
Implement caching mechanisms, either at the application level (using libraries like Redis) or through a CDN (Content Delivery Network), to cache frequently accessed data and reduce latency.

Rate Limiting and Throttling:
Implement rate limiting and request throttling to prevent abuse and protect the API from denial-of-service attacks. Libraries like express-rate-limit can be used for this purpose.

API Documentation:
Generate comprehensive API documentation using tools like Swagger or Postman to provide developers with clear guidelines on how to use the API endpoints, including request parameters, response formats, and error codes.

Monitoring and Alerting:
Set up monitoring and alerting systems to track the health and performance of the application in production environments. This includes monitoring server metrics, database performance, and application logs.

Implementing these enhancements would not only improve the functionality and reliability of the user management API but also contribute to its scalability, security, and maintainability in the long run.
