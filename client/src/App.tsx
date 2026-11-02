import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io(); // Подключение через прокси Vite

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    socket.on("connect", () => setIsConnected(true));
    socket.on("disconnect", () => setIsConnected(false));

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  return (
    <div>
      <h1>Vector Collab Editor</h1>
      <p>Статус: {isConnected ? "Подключено" : "Отключено"}</p>
    </div>
  );
}

export default App;
