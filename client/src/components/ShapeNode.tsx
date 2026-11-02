import type { Shape } from "@shared/types";

interface Props {
  shape: Shape;
  preview?: boolean;
  onPointerDown?: (e: React.PointerEvent, shape: Shape) => void;
}

export function ShapeNode({ shape, preview, onPointerDown }: Props) {
  const pointerEvents: "none" | "all" = preview ? "none" : "all";
  const common = {
    fill: preview ? "rgba(0,0,0,0.05)" : "transparent",
    stroke: shape.color,
    strokeWidth: shape.strokeWidth,
    strokeDasharray: preview ? "6 4" : undefined,
    pointerEvents,
    onPointerDown: (e: React.PointerEvent) => {
      if (!preview && onPointerDown) onPointerDown(e, shape);
    },
  };

  if (shape.type === "circle") {
    return <circle cx={shape.cx} cy={shape.cy} r={shape.r} {...common} />;
  }

  return (
    <rect
      x={shape.x}
      y={shape.y}
      width={shape.width}
      height={shape.height}
      {...common}
    />
  );
}
