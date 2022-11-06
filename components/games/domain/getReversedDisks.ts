import { Point } from './types'

export function getReversedDisks(
  cells: (string | null)[][],
  point: Point,
  activeUserId: string
): Point[] {
  const result: Point[] = []

  if (!cells.length) {
    return []
  }

  const { x, y } = point

  // check all 8 direction
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      // zeros are not interesting
      if (!i && !j) {
        continue
      }

      const tempResult: Point[] = []

      let ti = i
      let tj = j

      while (isOpponentCell(cells, x + ti, y + tj, activeUserId)) {
        tempResult.push({ x: x + ti, y: y + tj })

        ti += i
        tj += j
      }

      if (
        isCurrentPlayerCell(cells, x + ti, y + tj, activeUserId) &&
        (i !== ti || j !== tj)
      ) {
        result.push(...tempResult)
      }
    }
  }

  return result
}

function isOpponentCell(
  cells: (string | null)[][],
  x: number,
  y: number,
  activeUserId: string
): boolean {
  if (!cells[y] || !cells[y][x]) {
    return false
  }

  return cells[y][x] !== activeUserId
}

function isCurrentPlayerCell(
  cells: (string | null)[][],
  x: number,
  y: number,
  activeUserId: string
): boolean {
  if (!cells[y] || !cells[y][x]) {
    return false
  }

  return cells[y][x] === activeUserId
}
