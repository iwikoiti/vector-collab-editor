import { useState } from "react";
import { SvgCanvas, type Tool } from "./components/SvgCanvas";
import { Toolbar } from "./components/Toolbar";
import { useShapes } from "./hooks/useShapes";

export default function App() {
  const { shapes, addShape } = useShapes();
  const [tool, setTool] = useState<Tool>("rect");
  const [color, setColor] = useState("#e11d48");
  const [strokeWidth, setStrokeWidth] = useState(2);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Toolbar
        tool={tool}
        color={color}
        strokeWidth={strokeWidth}
        onToolChange={setTool}
        onColorChange={setColor}
        onStrokeWidthChange={setStrokeWidth}
      />
      <div style={{ flex: 1, minHeight: 0 }}>
        <SvgCanvas
          shapes={shapes}
          tool={tool}
          color={color}
          strokeWidth={strokeWidth}
          onAddShape={addShape}
        />
      </div>
    </div>
  );
}
