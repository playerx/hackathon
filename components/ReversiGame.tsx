import React from 'react'
import styled from 'styled-components'
import type { ReversiRoomState } from './games/reversi/domain/types'
import { Board } from './games/reversi/ui/components/Board'
import { reversiGameReducer } from './games/reversiGame.reducer'
/* eslint-disable @typescript-eslint/no-explicit-any */
type Props = {
  actions: string[]
  onSend: (action: string) => void
}

const Root = styled.main`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  padding-bottom: 50px;
`

export const ReversiGame: React.FC<Props> = ({ actions, onSend }) => {
  const state = React.useMemo(
    () =>
      actions
        .map((x) => {
          try {
            return JSON.parse(x) as any
          } catch {
            return null
          }
        })
        .filter((x) => !!x)
        .reduce(
          (r, x) => {
            const t = reversiGameReducer(r, x)

            return t[0]
          },
          [{}] as any
        ),
    [actions]
  ) as ReversiRoomState

  return (
    <Root>
      <Board
        width={5}
        height={5}
        items={[]}
        onSelect={(x, y) => onSend(`MOVE_${x}_${y}`)}
      />
    </Root>
  )
}
