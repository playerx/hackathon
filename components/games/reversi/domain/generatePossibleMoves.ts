import { getReversedDisks } from './getReversedDisks'
import { Point } from './types'

export function generatePossibleMoves(
  cells: (string | null)[][],
  activeUserId: string
): Point[] {
  const result: Point[] = []

  for (let x = 0; x < cells.length; x++) {
    for (let y = 0; y < cells[0].length; y++) {
      if (cells[y][x]) {
        continue
      }

      const point = <Point>{ x, y }

      if (getReversedDisks(cells, point, activeUserId).length) {
        result.push(point)
      }
    }
  }

  return result
}
