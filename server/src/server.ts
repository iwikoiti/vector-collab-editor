import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log('Клиент подключен:', socket.id);

  // обработчики событий для фигур
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});