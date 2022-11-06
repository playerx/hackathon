import {
  ActionOf,
  ReducedResult,
  ReversiRoomEvent,
  ReversiRoomState,
} from '../domain/types'

export function leaveAction(
  room: ReversiRoomState,
  props: ActionOf<'LEAVE'>
): ReducedResult<ReversiRoomState, ReversiRoomEvent> {
  const { userId, sessionId } = props

  const events: ReversiRoomEvent[] = []

  const now = new Date()

  const session = room.sessions.find(
    (x) => x.userId === userId && x.sessionId === sessionId
  )
  if (!session) {
    // it seems user is not in the room, nevermind
    return [room, events]
  }

  switch (session.type) {
    case 'VIEWER':
      {
        room.sessions = room.sessions.filter((x) => x !== session)

        // let the room know about it
        events.push({
          type: 'VIEWRS_UPDATED',
          viewersCount: room.sessions.filter((x) => x.type === 'VIEWER').length,

          added: [],
          removed: [
            {
              userId: session.userId,
              sessionId: session.sessionId!,
            },
          ],
        })
      }
      break

    case 'PLAYER':
      {
        session.isOnline = false
        session.leftAt = now
        session.sessionId = null

        events.push({
          type: 'PLAYERS_UPDATED',
          users: room.sessions
            .filter((x) => x.type === 'PLAYER')
            .map((x) => ({
              userId: x.userId,
              sessionId: x.sessionId!,
              isOnline: x.isOnline,
            })),
        })
      }
      break
  }

  return [room, events]
}
