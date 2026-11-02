import { useEffect, useState } from "react";
import type { Shape } from "@shared/types";
import { socket } from "../socket";

export function useShapes() {
  const [shapes, setShapes] = useState<Shape[]>([]);

  useEffect(() => {
    const onHistory = (h: Shape[]) => setShapes(h);
    const onAdd = (s: Shape) => setShapes((prev) => [...prev, s]);
    const onUpdate = (u: Shape) =>
      setShapes((prev) => prev.map((s) => (s.id === u.id ? u : s)));
    const onDelete = (id: String) =>
      setShapes((prev) => prev.filter((s) => s.id !== id));

    socket.on("history", onHistory);
    socket.on("shape:add", onAdd);
    socket.on("shape:update", onUpdate);
    socket.on("shape:delete", onDelete);

    socket.emit("get:history");

    return () => {
      socket.off("history", onHistory);
      socket.off("shape:add", onAdd);
      socket.off("shape:update", onUpdate);
      socket.off("shape:delete", onDelete);
    };
  }, []);

  const addShape = (shape: Shape) => {
    setShapes((prev) => [...prev, shape]);
    socket.emit("shape:add", shape);
  };

  const updateShape = (shape: Shape) => {
    setShapes((prev) => prev.map((s) => (s.id === shape.id ? shape : s)));
    socket.emit('shape:update', shape);
  };

  const deleteShape = (id: string) => {
    setShapes((prev) => prev.filter((s) => s.id !== id));
    socket.emit('shape:delete', id);
  };

  return { shapes, addShape, updateShape, deleteShape };
}
