function degreeToRad(degree: number): number {
  return Math.PI * degree / 180;
}

function normalizeDegrees(degree: number): number {
  let angle = degree % 360;
  if (angle < 0) angle += 360;
  return angle;
}

export {
  degreeToRad,
  normalizeDegrees
}