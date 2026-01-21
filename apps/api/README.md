# FlatFinder-BackEnd
BackEnd of the previous project FlatFinder's Front-end

## Tech Stack
- Node.js
- Express
- MongoDB/ Mongoose
- JWT Authentication

## API Responsibilities
- **User API & Auth API** :  Created by Michael  
  - User registration, login, and authentication
  - Admin-only actions like fetching all users and deleting a user

- **Flat API & Messages API** : Created by Asuka  
  - Flat creation, update, deletion, and retrieval
  - Message creation and retrieval per flat
  - Flat owners can access related to their own flats

  ## Project Structure
```
FlatFinder-BackEnd/
├── controllers/    # Handle route
├── middleware/     # Auth handling
├── models/         # Data models
├── routes/         # API routes
├── services/       # DB Connection
├── .env
└── index.js        # Start server
```

## Features
- Only flat owners can update or delete their own Flat data.
- Flat owners can access all messages related to their flat.
- Users can only access their own messages.

## How to run
1. Clone this repository
```bash
git clone https://github.com/Michos12/FlatFinder-BackEnd
cd FlatFinder-BackEnd
```

2. Install dependencies
```bash
npm install
```

3. Create a .env file
```bash 
MONGO_URL=your_mongodb_connection_string
SECRET_KEY=your_jwt_secret
PORT=3000
```

4. Start the server
```bash
npm start
```