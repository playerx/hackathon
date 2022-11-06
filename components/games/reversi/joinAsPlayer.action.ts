import {
  ActionOf,
  ReducedResult,
  ReversiRoomEvent,
  ReversiRoomState,
} from '../domain/types'

export function joinAsPlayerAction(
  room: ReversiRoomState,
  props: ActionOf<'JOIN_AS_PLAYER'>
): ReducedResult<ReversiRoomState, ReversiRoomEvent> {
  const { userId, sessionId } = props

  const events: ReversiRoomEvent[] = []

  const session = room.sessions.find(
    (x) => x.userId === userId && x.sessionId === sessionId
  )
  if (!session) {
    return [room, events]
  }

  if (session.type === 'PLAYER') {
    return [room, events]
  }

  const now = new Date()

  if (session.type === 'VIEWER') {
    const playerSession = room.sessions.find(
      (x) => x.type === 'PLAYER' && x.userId === userId
    )
    if (playerSession?.isOnline) {
      playerSession.type = 'VIEWER'
      playerSession.joinedAt = now

      // let the room know about viewers update
      events.push({
        type: 'VIEWRS_UPDATED',
        viewersCount: room.sessions.filter((x) => x.type === 'VIEWER').length,
        added: [
          {
            userId: playerSession.userId,
            sessionId: playerSession.sessionId!,
          },
        ],
        removed: [],
      })
    } else {
      room.sessions = room.sessions.filter((x) => x !== playerSession)
    }

    session.type = 'PLAYER'
    session.joinedAt = now
    session.isOnline = true

    // let the room know about players update
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

  return [room, events]
}
