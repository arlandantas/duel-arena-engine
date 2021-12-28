function degreeToRad(degree) {
  if (!degree) return null;
  
  return Math.PI * degree / 180;
}

export {
  degreeToRad
}