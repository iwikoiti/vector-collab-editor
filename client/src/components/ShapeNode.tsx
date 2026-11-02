import type { Shape } from "@shared/types";

interface Props {
  shape: Shape;
  preview?: boolean;
}

export function ShapeNode({ shape, preview }: Props) {
  const common = {
    fill: preview ? "rgba(0,0,0,0.05)" : "none",
    stroke: shape.color,
    strokeWidth: shape.strokeWidth,
    strokeDasharray: preview ? "6 4" : undefined,
    pointerEvents: "none" as const,
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
