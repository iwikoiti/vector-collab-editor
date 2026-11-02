import { useRef, useState } from "react";
import type { Shape } from "@shared/types";
import { clientToSvg } from "../lib/svgCoords";
import { ShapeNode } from "./ShapeNode";
import { SelectionOverlay } from "./SelectionOverlay";

export type Tool = "circle" | "rect";

interface Props {
  shapes: Shape[];
  tool: Tool;
  color: string;
  strokeWidth: number;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onAddShape: (shape: Shape) => void;
  onUpdateShape: (shape: Shape) => void;
}

interface Draft {
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
}

interface DragState {
  id: string;
  startX: number;
  startY: number;
  originalShape: Shape;
  moved: boolean;
}

const VIEWBOX_SIZE = 1000;
const MIN_SIZE = 2; // миссклик
const MOVE_THRESHOLD = 3;

export function SvgCanvas({
  shapes,
  tool,
  color,
  strokeWidth,
  selectedId,
  onSelect,
  onAddShape,
  onUpdateShape,
}: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [drag, setDrag] = useState<DragState | null>(null);
  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null);

  const point = (e: React.PointerEvent) => {
    if (!svgRef.current) return null;
    return clientToSvg(svgRef.current, e.clientX, e.clientY);
  };

  const handleCanvasPointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    if (e.button !== 0) return;
    // Клик по пустому месту — сбрасываем выделение и начинаем рисовать
    onSelect(null);
    const pt = point(e);
    if (!pt) return;
    svgRef.current?.setPointerCapture(e.pointerId);
    setDraft({ startX: pt.x, startY: pt.y, currentX: pt.x, currentY: pt.y });
  };

  const handleShapePointerDown = (e: React.PointerEvent, shape: Shape) => {
    if (e.button !== 0) return;
    e.stopPropagation(); // не даём канвасу начать новую фигуру
    const pt = point(e);
    if (!pt) return;
    onSelect(shape.id);
    svgRef.current?.setPointerCapture(e.pointerId);
    setDrag({
      id: shape.id,
      startX: pt.x,
      startY: pt.y,
      originalShape: shape,
      moved: false,
    });
    setDragPos({
      x: shape.type === "circle" ? shape.cx : shape.x,
      y: shape.type === "circle" ? shape.cy : shape.y,
    });
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const pt = point(e);
    if (!pt) return;

    if (draft) {
      setDraft({ ...draft, currentX: pt.x, currentY: pt.y });
      return;
    }

    if (drag) {
      const dx = pt.x - drag.startX;
      const dy = pt.y - drag.startY;

      if (!drag.moved && Math.hypot(dx, dy) < MOVE_THRESHOLD) return; //клик - выделение, а не перемещение
      if (!drag.moved) setDrag({ ...drag, moved: true });

      const orig = drag.originalShape;
      setDragPos({
        x: (orig.type === "circle" ? orig.cx : orig.x) + dx,
        y: (orig.type === "circle" ? orig.cy : orig.y) + dy,
      });
    }
  };

  const handlePointerUp = (e: React.PointerEvent<SVGSVGElement>) => {
    if (draft) {
      const pt = point(e) ?? { x: draft.currentX, y: draft.currentY };
      const shape = buildShape(
        draft.startX,
        draft.startY,
        pt.x,
        pt.y,
        tool,
        color,
        strokeWidth,
      );
      setDraft(null);
      if (shape) onAddShape(shape);
      return;
    }

    if (drag) {
      if (drag.moved && dragPos) {
        const orig = drag.originalShape;
        const updated: Shape =
          orig.type === "circle"
            ? { ...orig, cx: dragPos.x, cy: dragPos.y }
            : { ...orig, x: dragPos.x, y: dragPos.y };
        onUpdateShape(updated); // единственный emit за весь drag
      }
      setDrag(null);
      setDragPos(null);
    }
  };

  // Подменяем позицию фигуры во время drag — не трогая shapes
  const shapeToRender = (s: Shape): Shape => {
    if (drag && s.id === drag.id && dragPos) {
      return s.type === "circle"
        ? { ...s, cx: dragPos.x, cy: dragPos.y }
        : { ...s, x: dragPos.x, y: dragPos.y };
    }
    return s;
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

  const selectedShape = shapes.find((s) => s.id === selectedId);
  const displaySelected = selectedShape ? shapeToRender(selectedShape) : null;

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}`}
      preserveAspectRatio="xMidYMid meet"
      style={{
        width: "100%",
        height: "100%",
        background: "#fff",
        cursor: drag ? "grabbing" : "crosshair",
        touchAction: "none",
        display: "block",
      }}
      onPointerDown={handleCanvasPointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {shapes.map((s) => (
        <ShapeNode
          key={s.id}
          shape={shapeToRender(s)}
          onPointerDown={handleShapePointerDown}
        />
      ))}
      {displaySelected && <SelectionOverlay shape={displaySelected} />}
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
