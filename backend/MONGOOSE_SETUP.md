# Mongoose Database Setup Guide

## Configuration in server.js

All Mongoose configuration and models are now centralized in `server.js`:

### Database Connection
```javascript
const connectDatabase = async () => {
  // Connects to MongoDB using MONGODB_URL from .env
};
```

### All Models Available
- `User` - User accounts with roles and workspaces
- `Workspace` - Team workspaces with members
- `Meeting` - Meeting recordings and transcripts
- `Review` - Meeting reviews and approvals
- `AiOutput` - AI-generated summaries and action items
- `AuditLog` - Activity logging
- `Integration` - Third-party integrations
- `Invite` - Workspace invitations

## Using Models in Controllers

Import models from server.js:
```javascript
const { User, Meeting, Workspace, Review, AiOutput, AuditLog, Integration, Invite } = require('../server.js');

// Use in controller
const users = await User.find();
const meetings = await Meeting.find().populate('workspaceId', 'createdBy');
```

## Starting the Server

```bash
# Development with auto-reload
npm run dev

# Production
npm start
```

## Environment Variables

```
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/database
PORT=5000
NODE_ENV=development
```

## Database Operations Examples

### Create
```javascript
const user = await User.create({ email: 'user@example.com', name: 'John' });
```

### Read
```javascript
const users = await User.find().limit(10);
const user = await User.findById(id);
```

### Update
```javascript
await User.findByIdAndUpdate(id, { name: 'Jane' });
```

### Delete
```javascript
await User.findByIdAndDelete(id);
```

### Populate References
```javascript
const workspace = await Workspace.findById(id).populate('ownerId');
```

## Features

✓ All models mapped to Mongoose schemas
✓ Proper timestamps (createdAt, updatedAt)
✓ References between collections
✓ Mongoose validation
✓ Graceful shutdown handling
✓ Error handling on startup/shutdown
