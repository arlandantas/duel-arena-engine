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

export {
  degreeToRad,
  normalizeDegrees,
  rotatePoint,
}