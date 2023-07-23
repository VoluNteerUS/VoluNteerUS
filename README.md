# NUS Orbital 2023: VoluNteerUS
## About
The aim of this project is to develop a web-based volunteering management system that allows undergraduate students to browse volunteering opportunities and sign up for them. The system will also allow committee members from different clubs and organizations within the university to create volunteering events and post them on the platform.

## Features
- User Registration and Login
- Event Listings
    - Event Sign Ups
- Organization Listings
- User Dashboard
    - User Profile
    - Event Sign Up History
    - Volunteering History
- Committee Member Dashboard
    - Create and Edit Events
        - View volunteers who have signed up
        - Group volunteers
        - Mark volunteer attendance and award community service hours
    - Edit Organizational Profile
- Admin Dashboard
    - Create Organizations

## Project Set Up
1. Clone the repository:

```shell
git clone "https://github.com/VoluNteerUS/VoluNteerUS.git"
```

2. Navigate to volunteerus-client directory and install dependencies:
```shell
cd volunteerus-client
npm install
```

3. Navigate back to the project root directory:
```shell
cd ..
```

4. Navigate to volunteerus-server directory and install dependencies:
```shell
cd volunteerus-server
npm install
```

5. Set up environment variables in volunteerus-server:
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

# Client URL
CLIENT_URL=
```

6. Open a second terminal window and type the following commands:
```shell
cd volunteerus-client
npm start
```

7. In the main terminal window (currently in volunteerus-server) type the following commands:
```shell
npm start
```


## Team Members
- Celestine Tan [@CelestineTan03](https://github.com/CelestineTan03)
- Kevin Toh [@ktzy0305](https://github.com/ktzy0305)
