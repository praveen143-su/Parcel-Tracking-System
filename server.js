require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const authRoutes = require('./routes/authRoutes');
const parcelRoutes = require('./routes/parcelRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const server = http.createServer(app);

// Enable CORS for frontend
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

app.use(cors());
app.use(express.json());

// Pass io to req so controllers can use it
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Socket.io connection
io.on('connection', (socket) => {
  console.log('User connected via Socket:', socket.id);
  
  socket.on('joinRoom', (trackingId) => {
    socket.join(trackingId);
    console.log(`User joined room: ${trackingId}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/parcels', parcelRoutes);
app.use('/api/admin', adminRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server Error' });
});

// Database connection
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log('MongoDB Connected');
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => {
  console.error('Database connection failed', err);
});
