# BecauseSheCan

A comprehensive system for the "Because She Can" initiative - empowering women in tech. This application includes a registration form, avatar generation, and raffle system built with the MERN stack (MongoDB, Express, React, Node.js).

## Features

- 📝 **Dynamic Registration Form**: Admin-configurable form fields for gathering demographic data
- 🎨 **Avatar Generation**: Bitmoji-style avatar generation using DiceBear (free)
- 🎁 **Raffle System**: Automated raffle system with customizable prizes and winner selection
- 📱 **QR Code**: Easy registration access via QR code
- 👑 **Admin Dashboard**: Protected management console with login-only access and admin user management
- 🛡️ **Superadmin Controls**: Only the seeded superadmin can create/manage/delete admin accounts

## Tech Stack

- **Frontend**: React, React Router, Axios
- **Backend**: Node.js, Express
- **Database**: MongoDB with Mongoose
- **Additional Libraries**: DiceBear API (avatars), QRCode.react (QR codes), JWT (admin auth)

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/MaxVSCJP/BecauseSheCan.git
cd BecauseSheCan
```

### 2. Backend Setup

```bash
cd backend
npm install

# Create a .env file based on .env.example
cp .env.example .env

# Edit .env with your MongoDB connection string and JWT secret
# MONGODB_URI=mongodb://localhost:27017/becauseshecan
# JWT_SECRET=change-me-to-a-long-random-secret
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install

# Create a .env file based on .env.example
cp .env.example .env

# Edit .env with your backend API URL (default is http://localhost:5000/api)
# VITE_API_URL=http://localhost:5000/api
```

## Running the Application

### Start MongoDB

Make sure MongoDB is running on your system:

```bash
# On macOS with Homebrew
brew services start mongodb-community

# On Linux
sudo systemctl start mongod

# Or use Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### Start the Backend

```bash
cd backend
npm start
```

The backend server will run on `http://localhost:5000`

### Start the Frontend

```bash
cd frontend
npm start
```

The frontend will run on `http://localhost:3000`

## Usage

### For Participants

1. Navigate to `http://localhost:3000`
2. Scan the QR code or click "Register Now"
3. Fill out the registration form
4. Receive your unique avatar
5. You're automatically entered into the raffle!

### For Administrators

1. Navigate to `http://localhost:3000/admin/login`
2. Create your superadmin account from the backend folder:
   - `npm run create-admin -- admin_username strong_password_here`
3. Sign in with that account
4. Create additional admin users in the **Admin Users** tab (superadmin only)
4. **Form Fields Tab**: 
   - Add, edit, or remove form fields
   - Configure field types (text, email, number, select, textarea)
   - Mark fields as required or optional
5. **Raffle Settings Tab**:
   - Set prize name and description
   - Configure number of winners
   - Draw winners randomly
   - View current winners
6. **Participants Tab**:
   - View all registered participants
   - See participant details and avatars
   - Identify raffle winners

## API Endpoints

### Participant Endpoints

- `POST /api/participants/submit` - Submit registration form
- `GET /api/participants` - Get all participants (public view)
- `GET /api/participants/count` - Get participant count

### Auth Endpoints

- `POST /api/auth/login` - Admin login
- `GET /api/auth/me` - Get current authenticated admin
- `POST /api/auth/logout` - Logout admin

### Admin Endpoints

- `GET /api/admin/fields` - Get all form fields
- `POST /api/admin/fields` - Create a new form field
- `PUT /api/admin/fields/:id` - Update a form field
- `DELETE /api/admin/fields/:id` - Delete a form field
- `GET /api/admin/raffle` - Get raffle settings
- `PUT /api/admin/raffle` - Update raffle settings
- `GET /api/admin/participants` - Get all participants (admin view)
- `GET /api/admin/users` - Get all admin users
- `POST /api/admin/users` - Create an admin user (superadmin only)
- `DELETE /api/admin/users/:id` - Delete an admin user (superadmin only)

### Raffle Endpoints

- `GET /api/raffle/info` - Get raffle information
- `POST /api/raffle/draw` - Draw raffle winners (admin auth required)
- `GET /api/raffle/winners` - Get all winners

## Avatar Generation

The system generates avatar URLs using DiceBear's free API:
- Style: `adventurer` (cartoon/Bitmoji-like)
- Endpoint: `https://api.dicebear.com/9.x/adventurer/svg?seed=...`
- API key: **not required**

## Project Structure

```
BecauseSheCan/
├── backend/
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── utils/           # Utility functions (avatar generation)
│   ├── server.js        # Main server file
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API service
│   │   └── App.js       # Main app component
│   └── package.json
└── README.md
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For questions or issues, please open an issue on GitHub or contact the maintainers.

---

Built with ❤️ for the Because She Can initiative