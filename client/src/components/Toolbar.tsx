import type { Tool } from "./SvgCanvas";

interface Props {
  tool: Tool;
  color: string;
  strokeWidth: number;
  onToolChange: (t: Tool) => void;
  onColorChange: (c: string) => void;
  onStrokeWidthChange: (w: number) => void;
}

export function Toolbar({
  tool,
  color,
  strokeWidth,
  onToolChange,
  onColorChange,
  onStrokeWidthChange,
}: Props) {
  return (
    <div
      style={{
        display: "flex",
        gap: 16,
        alignItems: "center",
        padding: 12,
        borderBottom: "1px solid #ddd",
        background: "#fafafa",
      }}
    >
      <button
        onClick={() => onToolChange("rect")}
        style={{ fontWeight: tool === "rect" ? 700 : 400 }}
      >
        Прямоугольник
      </button>
      <button
        onClick={() => onToolChange("circle")}
        style={{ fontWeight: tool === "circle" ? 700 : 400 }}
      >
        Круг
      </button>
      <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
        Цвет
        <input
          type="color"
          value={color}
          onChange={(e) => onColorChange(e.target.value)}
        />
      </label>
      <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
        Толщина
        <input
          type="range"
          min={1}
          max={12}
          value={strokeWidth}
          onChange={(e) => onStrokeWidthChange(Number(e.target.value))}
        />
        <span>{strokeWidth}</span>
      </label>
    </div>
  );
}
