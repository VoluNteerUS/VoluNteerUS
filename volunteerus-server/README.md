# VoluNteerUS Server

This is the server component of VoluNteerUS. It provides the backend functionality for managing organizations, events, user registrations and many more.

## Technologies Used
- Node.js
- Express.js
- MongoDB
- Mongoose
- NestJS

## Prerequisites
- Node.js installed
- MongoDB installed and running (either local or Atlas server)

## Getting Started

1. Clone the repository:

```shell
git clone "https://github.com/VoluNteerUS/VoluNteerUS.git"
```

2. Install dependencies:
```shell
cd volunteerus-server
npm install
```

3. Set up environment variables:
```bash
# MongoDB Config
MONGO_CLUSTER_URL=
MONGO_USER=
MONGO_PASSWORD=

# Firebase Config
PROJECT_ID=
PRIVATE_KEY=
CLIENT_EMAIL=
BUCKET_URL=

# SendGrid Config
SENDGRID_API_KEY=
SENDGRID_EMAIL=

# Client URL (For generating reset password link)
CLIENT_URL=
```

4. Start the server:
```shell
npm start
```

## Contributing
Contributions are welcome! If you find any issues or have suggestions for improvement, please submit an issue or pull request!
