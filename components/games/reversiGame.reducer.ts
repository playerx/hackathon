import {
  ReducedResult,
  ReversiRoomAction,
  ReversiRoomEvent,
  ReversiRoomState,
} from './reversi/domain/types'
import { initAction } from './reversi/init.action'
import { moveAction } from './reversi/move.action'

export function reversiGameReducer(
  state: ReversiRoomState,
  action: ReversiRoomAction
): ReducedResult<ReversiRoomState, ReversiRoomEvent> {
  switch (action.type) {
    case 'INIT':
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return initAction(null as any, action)

    case 'MOVE':
      return moveAction(state, action)
  }
}
