export interface point {
  x: number;
  y: number;
}

export interface chartData {
  points: point[],
  unitsX: string,
  unitsY: string,
  calcPoint: point | null,
}