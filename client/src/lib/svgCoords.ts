export function clientToSvg(
  svg: SVGSVGElement,
  clientX: number,
  clientY: number,
): { x: number; y: number } {
  const pt = svg.createSVGPoint();
  pt.x = clientX;
  pt.y = clientY;
  //svg.getScreenCTM() получает матрицу преобразвоания из пикселей в коорд svg
  const ctm = svg.getScreenCTM(); //учитывает viewBox, CSS-размеры, любые трансформации. Работает при ресайзе окна.
  if (!ctm) return { x: 0, y: 0 };
  const { x, y } = pt.matrixTransform(ctm.inverse()); //откат преобразования, чтоб в пикселях узнать место точки в сист коорд svg
  return { x, y };
}
