# FlatFinder-BackEnd
BackEnd of the previous project FlatFinder's Front-end

## Tech Stack
- Node.js
- Express
- MongoDB/ Mongoose
- JWT Authentication

## Features
- Message APIs require authentication.
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
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=3000
```

4. Start the server
```bash
npm start
```