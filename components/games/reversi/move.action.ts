import { analyzeWinner } from './domain/analyzeWinner'
import { generatePossibleMoves } from './domain/generatePossibleMoves'
import { getReversedDisks } from './domain/getReversedDisks'
import {
  ActionOf,
  ReducedResult,
  ReversiRoomEvent,
  ReversiRoomState,
} from './domain/types'

export function moveAction(
  room: ReversiRoomState,
  props: ActionOf<'MOVE'>
): ReducedResult<ReversiRoomState, ReversiRoomEvent> {
  const { userId, point } = props

  const events: ReversiRoomEvent[] = []

  // const roomId = room.id

  if (room.status !== 'ACTIVE') {
    throw new Error('ROOM_ALREADY_FINISHED')
  }

  // if (room.activeUserId === userId) {
  //   throw new Error('INVALID_USER')
  // }

  if (room.cells[point.y][point.x]) {
    throw new Error('CELL_ALREADY_USED')
  }

  if (!room.possibleMoves.find((x) => x.x === point.x && x.y === point.y)) {
    console.log('rr', room, props)
    throw new Error('INVALID_MOVE')
  }

  const now = new Date()

  // reverse disks
  const reversedDisks = getReversedDisks(room.cells, point, room.activeUserId)

  reversedDisks.forEach((x) => (room.cells[x.y][x.x] = userId))

  room.moves.push({
    userId,
    point,
    reversedDisks,
    timestamp: now,
  })

  room.cells[point.y][point.x] = userId

  events.push({
    type: 'MOVE_ADDED',
    userId,
    point,
    reversedDisks,
  })

  // analyzer winner
  const winner = analyzeWinner(room.cells)
  if (winner) {
    room.status = 'FINISHED'
    room.winnerUserId = winner

    events.push({
      type: 'GAME_FINISHED',
      winnerUserId: winner,
    })

    return [room, events]
  }

  // change active player on every move
  const userIds = room.players.map((x) => x.userId)

  const opponentUserId = userIds.filter((x) => x !== room.activeUserId)[0]

  room.activeUserId = opponentUserId

  room.possibleMoves = generatePossibleMoves(room.cells, room.activeUserId)

  // when player don't have any moves
  // switch to another player
  if (!room.possibleMoves.length) {
    events.push({
      type: 'TURN_PASSED',
      userId: room.activeUserId,
    })

    const opponentUserId = userIds.filter((x) => x !== room.activeUserId)[0]

    room.activeUserId = opponentUserId

    room.possibleMoves = generatePossibleMoves(room.cells, room.activeUserId)
  }

  events.push({
    type: 'USER_ACTIVE',
    userId: room.activeUserId,
  })

  events.push({
    type: 'MOVE_REQUEST',
    userId: room.activeUserId,
    possibleMoves: room.possibleMoves,
  })

  return [{ ...room }, events]
}
