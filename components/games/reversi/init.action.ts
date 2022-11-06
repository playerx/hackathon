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
  const { roomId, width, height, userIds } = props

  const events: ReversiRoomEvent[] = []

  const room = {
    id: roomId,

    status: 'ACTIVE',

    sessions: userIds.map((x) => ({
      type: 'PLAYER',
      userId: x,
      sessionId: null,
      isOnline: false,
      joinedAt: null,
      leftAt: null,
    })),

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

  return [room, events]
}
