export type ShapeType = 'circle' | 'rect';

export interface BaseShape {
  id: string;
  type: ShapeType;
  color: string;
  strokeWidth: number;
}

export interface CircleShape extends BaseShape {
  type: 'circle';
  cx: number;
  cy: number;
  r: number;
}

export interface RectShape extends BaseShape {
  type: 'rect';
  x: number;
  y: number;
  width: number;
  height: number;
}

export type Shape = CircleShape | RectShape;

export interface ServerToClientEvents {
  history: (shapes: Shape[]) => void;
  'shape:add': (shape: Shape) => void;
  'shape:update': (shape: Shape) => void;
  'shape:delete': (id: string) => void;
  'shapes:clear': () => void;  
}

export interface ClientToServerEvents {
  'shape:add': (shape: Shape) => void;
  'shape:update': (shape: Shape) => void;
  'shape:delete': (id: string) => void;
  'get:history': () => void;
  'shapes:clear': () => void;  
}