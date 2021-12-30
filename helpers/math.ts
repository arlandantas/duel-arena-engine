import { Position } from "..";

function degreeToRad(degree: number): number {
  return Math.PI * degree / 180;
}

function normalizeDegrees(degree: number): number {
  let angle = degree % 360;
  if (angle < 0) angle += 360;
  return angle;
}

function rotatePoint(point: Position, origin: Position, radAngle: number): Position {
  return {
      x: Math.cos(radAngle) * (point.x-origin.x) - Math.sin(radAngle) * (point.y-origin.y) + origin.x,
      y: Math.sin(radAngle) * (point.x-origin.x) + Math.cos(radAngle) * (point.y-origin.y) + origin.y
  };
}

function checkBoundariesOvelap(a: Array<Position>, b: Array<Position>): boolean {
  for (let i = 0; i < a.length; i++) {
    const lineA: Array<Position> = [
      a[i],
      (i < a.length - 1) ? a[i+1] : a[0]
    ];
    for (let j = 0; j < b.length; j++) {
      const lineB: Array<Position> = [
        b[j],
        (j < b.length - 1) ? b[j+1] : b[0]
      ];

      if (checkLineOverlap(lineA, lineB)) {
        return true;
      }
    }
  }
  return false;
}

function checkLineOverlap(a: Array<Position>, b: Array<Position>): boolean {
  if (a.length !== 2) throw new Error("a is not a valid line")
  if (b.length !== 2) throw new Error("b is not a valid line")
  
  const i: number = (a[1].y - a[0].y)/(a[1].x - a[0].x);
  const j: number = (a[1].x*a[0].y - a[0].x*a[1].y)/(a[1].x - a[0].x);
  const k: number = (b[1].y - b[0].y)/(b[1].x - b[0].x);
  const l: number = (b[1].x*b[0].y - b[0].x*b[1].y)/(b[1].x - b[0].x);
  
  const x: number = (l - j)/(i - k);
  const y: number = (i*l- j*k) /(i - k);

  const overlapPoint: Position = { x, y };

  return isPointInLine(overlapPoint, a[0], a[1]) && isPointInLine(overlapPoint, b[0], b[1]);
}

function isPointInLine(point: Position, lineA: Position, lineB: Position): boolean {
  return getPointDistance(lineA, lineB) == getPointDistance(lineA, point) + getPointDistance(lineB, point);
}

function getPointDistance(a: Position, b: Position): number {
  return Math.sqrt(Math.pow((a.x - b.x), 2) + Math.pow((a.y - b.y), 2));
}

export {
  degreeToRad,
  normalizeDegrees,
  rotatePoint,
  checkBoundariesOvelap,
}