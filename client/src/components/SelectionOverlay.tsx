import type { Shape } from "@shared/types";

export function SelectionOverlay({ shape }: { shape: Shape }) {
  const pad = 6;
  let x, y, w, h;

  if (shape.type === "circle") {
    x = shape.cx - shape.r - pad;
    y = shape.cy - shape.r - pad;
    w = (shape.r + pad) * 2;
    h = (shape.r + pad) * 2;
  } else {
    x = shape.x - pad;
    y = shape.y - pad;
    w = shape.width + pad * 2;
    h = shape.height + pad * 2;
  }

  return (
    <rect
      x={x}
      y={y}
      width={w}
      height={h}
      fill="none"
      stroke="#2563eb"
      strokeWidth={1}
      strokeDasharray="4 4"
      pointerEvents="none"
      vectorEffect="non-scaling-stroke"
    />
  );
}
