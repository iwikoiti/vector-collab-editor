import { useRef, useState } from "react";
import type { Shape } from "@shared/types";
import { clientToSvg } from "../lib/svgCoords";
import { ShapeNode } from "./ShapeNode";

export type Tool = "circle" | "rect";

interface Props {
  shapes: Shape[];
  tool: Tool;
  color: string;
  strokeWidth: number;
  onAddShape: (shape: Shape) => void;
}

interface Draft {
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
}

const VIEWBOX_SIZE = 1000;
const MIN_SIZE = 2; // миссклик

export function SvgCanvas({
  shapes,
  tool,
  color,
  strokeWidth,
  onAddShape,
}: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [draft, setDraft] = useState<Draft | null>(null);

  const point = (e: React.PointerEvent) => {
    if (!svgRef.current) return null;
    return clientToSvg(svgRef.current, e.clientX, e.clientY);
  };

  const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    if (e.button !== 0) return;
    const pt = point(e);
    if (!pt) return;
    svgRef.current?.setPointerCapture(e.pointerId); //если пользователь вывел курсор за пределы SVG во время рисования, события всё равно придут
    setDraft({ startX: pt.x, startY: pt.y, currentX: pt.x, currentY: pt.y });
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!draft) return;
    const pt = point(e);
    if (!pt) return;
    setDraft((d) => (d ? { ...d, currentX: pt.x, currentY: pt.y } : d));
  };

  const handlePointerUp = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!draft) return;
    const pt = point(e) ?? { x: draft.currentX, y: draft.currentY };
    setDraft(null);
    const shape = buildShape(
      draft.startX,
      draft.startY,
      pt.x,
      pt.y,
      tool,
      color,
      strokeWidth,
    );
    if (shape) onAddShape(shape);
  };

  const preview = draft
    ? buildShape(
        draft.startX,
        draft.startY,
        draft.currentX,
        draft.currentY,
        tool,
        color,
        strokeWidth,
        "preview",
      )
    : null;

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}`}
      preserveAspectRatio="xMidYMid meet"
      style={{
        width: "100%",
        height: "100%",
        background: "#fff",
        cursor: "crosshair",
        touchAction: "none",
        display: "block",
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {shapes.map((s) => (
        <ShapeNode key={s.id} shape={s} />
      ))}
      {preview && <ShapeNode shape={preview} preview />}
    </svg>
  );
}

function buildShape(
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  tool: Tool,
  color: string,
  strokeWidth: number,
  id: string = crypto.randomUUID(),
): Shape | null {
  if (tool === "rect") {
    const x = Math.min(x0, x1);
    const y = Math.min(y0, y1);
    const width = Math.abs(x1 - x0);
    const height = Math.abs(y1 - y0);
    if (width < MIN_SIZE && height < MIN_SIZE) return null;
    return { id, type: "rect", x, y, width, height, color, strokeWidth };
  }
  const r = Math.hypot(x1 - x0, y1 - y0);
  if (r < MIN_SIZE) return null;
  return { id, type: "circle", cx: x0, cy: y0, r, color, strokeWidth };
}
