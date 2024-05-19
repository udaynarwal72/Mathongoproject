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

## Contributing

Contributions are welcome! Please submit a pull request or open an issue to discuss your changes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

Feel free to modify this README file according to your project's specific details and requirements.
