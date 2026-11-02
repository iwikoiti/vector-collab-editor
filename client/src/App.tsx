import { useState, useEffect } from "react";
import { SvgCanvas, type Tool } from "./components/SvgCanvas";
import { Toolbar } from "./components/Toolbar";
import { useShapes } from "./hooks/useShapes";

export default function App() {
  const { shapes, addShape, updateShape, deleteShape } = useShapes();
  const [tool, setTool] = useState<Tool>("rect");
  const [color, setColor] = useState("#e11d48");
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedShape = shapes.find((s) => s.id === selectedId) ?? null;
  // Удаление клавишей, но не когда фокус в input
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!selectedId) return;
      const t = e.target as HTMLElement;
      if (t.tagName === "INPUT" || t.tagName === "TEXTAREA") return;
      if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault();
        deleteShape(selectedId);
        setSelectedId(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedId, deleteShape]);

  // Изменения цвета/толщины применяются к выделенной фигуре, иначе — к дефолту
  const handleColorChange = (c: string) => {
    if (selectedShape) updateShape({ ...selectedShape, color: c });
    else setColor(c);
  };

  const handleStrokeWidthChange = (w: number) => {
    if (selectedShape) updateShape({ ...selectedShape, strokeWidth: w });
    else setStrokeWidth(w);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Toolbar
        tool={tool}
        color={selectedShape?.color ?? color}
        strokeWidth={selectedShape?.strokeWidth ?? strokeWidth}
        hasSelection={!!selectedShape}
        onToolChange={setTool}
        onColorChange={handleColorChange}
        onStrokeWidthChange={handleStrokeWidthChange}
        onDelete={() => {
          if (selectedShape) {
            deleteShape(selectedShape.id);
            setSelectedId(null);
          }
        }}
      />
      <div style={{ flex: 1, minHeight: 0 }}>
        <SvgCanvas
          shapes={shapes}
          tool={tool}
          color={color}
          strokeWidth={strokeWidth}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onAddShape={addShape}
          onUpdateShape={updateShape}
        />
      </div>
    </div>
  );
}
