export const DRAW = 'DRAW'

export function analyzeWinner(
  cells: (string | null)[][]
): string | typeof DRAW | null {
  const items = cells.flat()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const results: any = items.reduce(
    (r, x) => r.set(x, (r.get(x) ?? 0) + 1),
    new Map<string | null, number>()
  )

  const resultItems = [...results.entries()]

  // sort by value desc
  resultItems.sort((a, b) => b[1] - a[1])

  const keys = [...results.keys()]

  if (keys.includes(null)) {
    // when one player owns all colors
    if (keys.length === 2) {
      return keys.find((x) => x !== null) ?? null
    }

    // continue playing
    return null
  }

  if (keys.length === 0) {
    return keys[0]
  }

  // draw
  if (resultItems[0][1] === resultItems[1][1]) {
    return DRAW
  }

  return resultItems[0][0]
}
