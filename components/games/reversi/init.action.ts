import { generatePossibleMoves } from './domain/generatePossibleMoves'
import {
  ActionOf,
  ReducedResult,
  ReversiRoomEvent,
  ReversiRoomState,
} from './domain/types'

export function initAction(
  _: ReversiRoomState,
  props: ActionOf<'INIT'>
): ReducedResult<ReversiRoomState, ReversiRoomEvent> {
  const { width, height, userIds } = props

  const events: ReversiRoomEvent[] = []

  const room = {
    status: 'ACTIVE',
    width,
    height,
    activeUserId: userIds[0],
    winnerUserId: null,
    players: userIds.map((x) => ({ userId: x, disksCount: 2 })),
    moves: [],
    cells: new Array(width)
      .fill(0)
      .map(() => new Array(height).fill(0).map(() => null)),
    possibleMoves: [],
  } as ReversiRoomState

  room.cells[Math.ceil(width / 2)][Math.floor(height / 2) - 1] = userIds[0]
  room.cells[Math.ceil(width / 2) - 1][Math.floor(height / 2) - 1] = userIds[0]

  room.cells[Math.ceil(width / 2) - 1][Math.floor(height / 2)] = userIds[1]
  room.cells[Math.ceil(width / 2)][Math.floor(height / 2)] = userIds[1]

  room.possibleMoves = generatePossibleMoves(room.cells, room.activeUserId)

  return [room, events]
}
