import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import type {
    Shape,
    ClientToServerEvents,
    ServerToClientEvents,
} from '@shared/types.js'

const app = express();
app.use(cors());

const httpServer  = http.createServer(app);
const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

//Хранение истории сервером
const shapes: Shape[] = [];

io.on('connection', (socket) => {
  console.log('Клиент подключен:', socket.id);

  //новому клиенту - вся история сразу
  socket.emit('history', shapes);

  socket.on('shape:add', (shape) =>{
    shapes.push(shape);
    // Рассылается всем, кроме отправителя: свой shape он уже добавил локально.
    socket.broadcast.emit("shape:add", shape);
  });

  socket.on('shape:update', (updated) =>{
    const idx = shapes.findIndex((s) => s.id === updated.id);
    if (idx === -1) return;
    shapes[idx] = updated;
    socket.broadcast.emit("shape:update", updated);
  });

  socket.on('shape:delete', (id) =>{
    const idx = shapes.findIndex((s) => s.id === id);
    if (idx === -1) return;
    shapes.splice(idx, 1);
    socket.broadcast.emit("shape:delete", id);
  });
});

const PORT = 3001;
httpServer.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});