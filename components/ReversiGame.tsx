import React, { useContext } from 'react'
import { WalletContext } from '../contexts/wallet'
import type {
  ReversiRoomAction,
  ReversiRoomState,
} from './games/reversi/domain/types'
import { Board } from './games/reversi/ui/components/Board'
import { DiskItem } from './games/reversi/ui/types'
import { reversiGameReducer } from './games/reversiGame.reducer'
/* eslint-disable @typescript-eslint/no-explicit-any */
type Props = {
  userIds: string[]
  actions: string[]
  onSend: (action: string) => void
}

const WIDTH = 6
const HEIGHT = 6

export const getInitialAction = (userId: string, userIds: string[]) =>
  ({
    type: 'INIT',
    width: WIDTH,
    height: HEIGHT,
    protocolVersion: 'v1',
    userId,
    userIds,
  } as ReversiRoomAction)

export const ReversiGame: React.FC<Props> = ({ userIds, actions, onSend }) => {
  const { address } = useContext(WalletContext)

  const state = React.useMemo(() => {
    let lastGameActions = actions
      .map((x) => {
        try {
          return JSON.parse(x) as any
        } catch {
          return null
        }
      })
      .filter((x) => !!x)

    if (!lastGameActions.length) {
      lastGameActions.push(getInitialAction(address!, userIds))
    }

    const startIndex = lastGameActions.map((x) => x.type).lastIndexOf('INIT')
    lastGameActions = lastGameActions.slice(startIndex)

    console.log('actions3', lastGameActions)

    return lastGameActions.reduce(
      (r, x) => {
        const t = reversiGameReducer(r, x)

        return t[0]
      },
      [{} as any]
    )
  }, [actions, userIds, address]) as ReversiRoomState

  const items = React.useMemo(() => {
    const flatItems = (state.cells ?? [])
      .map((rows, i) =>
        rows
          .map((item, j) =>
            item
              ? {
                  userId: item as string,
                  x: j,
                  y: i,
                }
              : null
          )
          .filter((x) => x)
          .map((x) => x!)
      )
      .flat()

    const userColorMap = new Map()
    userColorMap.set(state.players[0].userId, 'LIGHT')
    userColorMap.set(state.players[1].userId, 'DARK')

    return flatItems
      .map(
        (item) =>
          ({
            type: userColorMap.get(item.userId),
            isPreview: false,
            x: item.x,
            y: item.y,
            flipAnimation: null,
          } as DiskItem)
      )
      .concat(
        state.possibleMoves.map(
          (x) =>
            ({
              ...x,
              type: userColorMap.get(address),
              isPreview: true,
            } as DiskItem)
        )
      )
  }, [state, address])

  console.log(state)

  return (
    <Board
      width={WIDTH}
      height={HEIGHT}
      items={items}
      onSelect={(x, y) => {
        if (!state.moves.length) {
          onSend(`Let's play Reversi at: ${process.env.NEXT_PUBLIC_URL}`)

          onSend(JSON.stringify(getInitialAction(address!, userIds), null, 2))

          setTimeout(() => {
            onSend(
              JSON.stringify(
                {
                  type: 'MOVE',
                  userId: address,
                  point: { x, y },
                } as ReversiRoomAction,
                null,
                2
              )
            )
          }, 100)

          return
        }

        onSend(
          JSON.stringify(
            {
              type: 'MOVE',
              userId: address,
              point: { x, y },
            } as ReversiRoomAction,
            null,
            2
          )
        )
      }}
    />
  )
}
