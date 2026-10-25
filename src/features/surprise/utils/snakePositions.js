// CSS uses the same responsive column count as the measured grid.
export function snakePosition(index, columns) {
  const row = Math.floor(index / columns)
  const offset = index % columns
  return { gridRow: row + 1, gridColumn: row % 2 === 0 ? offset + 1 : columns - offset }
}
