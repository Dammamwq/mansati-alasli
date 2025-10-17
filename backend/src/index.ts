import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import http from 'http';
import { Server as IoServer } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';

const app = express();

// ✅ السماح بالاتصال من واجهتك فقط
app.use(cors({
  origin: ['https://mansati-frontend-ra8q.onrender.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

// ✅ الاتصال بقاعدة البيانات فقط إذا تم توفيرها من Render
const MONGO_URL = process.env.MONGO_URL;

if (MONGO_URL) {
  mongoose.connect(MONGO_URL)
    .then(() => console.log('✅ MongoDB connected'))
    .catch(e => console.error('❌ Mongo connection error', e));
} else {
  console.log('⚠️ No MongoDB URL provided — skipping database connection');
}

// ✅ مسارات API
app.get('/api', (req, res) => {
  res.json({ message: 'مرحباً بك في واجهة منصّتي الخلفية!' });
});

app.get('/api/services', (req, res) => {
  res.json({
    items: [
      { id: 's1', title: 'تصميم شعار احترافي', description: 'شعار مميز لعلامتك التجارية', price: 20 },
      { id: 's2', title: 'كتابة محتوى عربي', description: 'مقالات ومحتوى تسويقي', price: 15 }
    ]
  });
});

// ✅ تفعيل Socket.io
const server = http.createServer(app);
const io = new IoServer(server, {
  cors: {
    origin: ['https://mansati-frontend-ra8q.onrender.com'],
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log('🟢 Socket connected:', socket.id);
  socket.on('join', (room) => socket.join(room));
  socket.on('leave', (room) => socket.leave(room));
  socket.on('chat', (data) => {
    io.to(data.room).emit('chat', data);
  });
});

// ✅ تشغيل الخادم على Render
const PORT = process.env.PORT || 4000;
server.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`🚀 Server running and listening on port ${PORT}`);
});
