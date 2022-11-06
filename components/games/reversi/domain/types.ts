export type RoomUserType = 'PLAYER' | 'VIEWER'

type RoomState = {
  // id: string

  status: 'ACTIVE' | 'FINISHED'
}

export type ReversiRoomState = RoomState & {
  width: number
  height: number
  activeUserId: string
  winnerUserId: string | null
  players: ReversiPlayer[]
  moves: ReversiMove[]
  /**
   * value will be userId
   *
   * default value: null
   */
  cells: (string | null)[][]
  possibleMoves: Point[]
}

export type ReversiPlayer = {
  userId: string
}

export type ReversiMove = {
  userId: string
  point: Point
  reversedDisks: Point[]
  timestamp: Date
}

export type Point = {
  x: number
  y: number
}

export type ReducedResult<TState, TEvent> = [
  reducedState: TState,
  events: TEvent[]
]

export type ReversiRoomAction =
  | {
      type: 'INIT'
      protocolVersion: string
      userIds: string[]
      width: number
      height: number
      userId: string
    }
  | {
      type: 'MOVE'
      userId: string
      point: Point
      index: number
    }

export type ReversiRoomEvent =
  | {
      type: 'USER_SESSION_TYPE_UPDATED'
      userId: string
      sessionId: string
      sessionType: RoomUserType
    }
  | {
      type: 'VIEWRS_UPDATED'
      viewersCount: number
      added: { userId: string; sessionId: string }[]
      removed: { userId: string; sessionId: string }[]
    }
  | {
      type: 'PLAYERS_UPDATED'
      users: {
        userId: string
        sessionId: string
        isOnline: boolean
      }[]
    }
  | {
      type: 'MOVE_ADDED'
      userId: string
      point: Point
      reversedDisks: Point[]
    }
  | {
      type: 'TURN_PASSED'
      userId: string
    }
  | {
      type: 'GAME_FINISHED'
      winnerUserId: string
    }
  | {
      type: 'USER_ACTIVE'
      userId: string
    }
  | {
      type: 'MOVE_REQUEST'
      userId: string
      possibleMoves: Point[]
    }

export type FindByType<Union, Type> = Union extends { type: Type }
  ? Union
  : never

export type ActionOf<Type extends ReversiRoomAction['type']> = FindByType<
  ReversiRoomAction,
  Type
>
