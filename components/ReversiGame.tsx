import React from 'react'

/* eslint-disable @typescript-eslint/no-explicit-any */
type Props = {
  actions: string[]
  onSend: (action: string) => void
}

export const ReversiGame: React.FC<Props> = ({ actions }) => {
  const state = React.useMemo(() => actions.reduce(reducer, {}), [actions])

  return <>Reversi Game State</>
}

interface State {
  t?: any
}

function reducer(state: State, action: any): State {
  switch (action.type) {
    default:
      return state
  }
}
