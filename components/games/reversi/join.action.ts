import {
  ActionOf,
  ReducedResult,
  ReversiRoomEvent,
  ReversiRoomState,
} from '../domain/types'

export function joinAction(
  room: ReversiRoomState,
  props: ActionOf<'JOIN'>
): ReducedResult<ReversiRoomState, ReversiRoomEvent> {
  const { userId, sessionId } = props

  const events: ReversiRoomEvent[] = []

  const now = new Date()

  const session = room.sessions.find((x) => x.userId === userId)
  if (session) {
    // when another session connected from the same user
    if (session.isOnline && session.sessionId !== sessionId) {
      // move old session to viewers
      room.sessions.push({
        ...session,
        type: 'VIEWER',
        joinedAt: now,
      })

      // let old session know that he's a viewer now
      events.push({
        type: 'USER_SESSION_TYPE_UPDATED',
        userId,
        sessionId,
        sessionType: 'VIEWER',
      })

      // let the room know about viewers update
      events.push({
        type: 'VIEWRS_UPDATED',
        viewersCount: room.sessions.filter((x) => x.type === 'VIEWER').length,

        added: [
          {
            userId: session.userId,
            sessionId: session.sessionId!,
          },
        ],
        removed: [],
      })
    }

    session.isOnline = true
    session.joinedAt = now
    session.sessionId = sessionId

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
  } else {
    room.sessions.push({
      type: 'VIEWER',
      userId,
      sessionId,
      isOnline: true,
      joinedAt: now,
      leftAt: null,
    })

    events.push({
      type: 'VIEWRS_UPDATED',
      viewersCount: room.sessions.filter((x) => x.type === 'VIEWER').length,

      added: [
        {
          userId,
          sessionId,
        },
      ],
      removed: [],
    })
  }

  return [room, events]
}
