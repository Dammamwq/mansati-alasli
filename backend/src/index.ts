import dotenv from 'dotenv'; dotenv.config();
import express from 'express';
import http from 'http';
import { Server as IoServer } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';

const app = express();
app.use(cors());
app.use(express.json());

const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/mansati';
mongoose.connect(MONGO_URL).then(()=>console.log('MongoDB connected')).catch(e=>console.error('Mongo connection error', e));

app.get('/api', (req,res)=>{
  res.json({ message: 'مرحباً بك في واجهة منصّتي الخلفية!' });
});

app.get('/api/services', (req,res)=>{
  res.json({ items: [
    { id: 's1', title: 'تصميم شعار احترافي', description: 'شعار مميز لعلامتك التجارية', price: 20 },
    { id: 's2', title: 'كتابة محتوى عربي', description: 'مقالات ومحتوى تسويقي', price: 15 }
  ]});
});

const server = http.createServer(app);
const io = new IoServer(server, { cors: { origin: '*' } });

io.on('connection', (socket) => {
  console.log('socket connected', socket.id);
  socket.on('join', (room) => socket.join(room));
  socket.on('leave', (room) => socket.leave(room));
  socket.on('chat', (data) => {
    io.to(data.room).emit('chat', data);
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, '0.0.0.0', () => console.log(`✅ Server running on port ${PORT}`));

