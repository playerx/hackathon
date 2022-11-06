/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import styled from 'styled-components'
import Loader from '../../components/Loader'
import { WalletContext } from '../../contexts/wallet'
import XmtpContext from '../../contexts/xmtp'
import useConversation from '../../hooks/useConversation'
import { getInitialAction, ReversiGame } from '../ReversiGame'
import MessageComposer from './MessageComposer'
import MessagesList from './MessagesList'

type ConversationProps = {
  recipientWalletAddr: string
}

const Conversation = ({
  recipientWalletAddr,
}: ConversationProps): JSX.Element => {
  const { address } = useContext(WalletContext)

  const messagesEndRef = useRef(null)

  const [isDebugMode, setDebugMode] = useState(false)

  const scrollToMessagesEndRef = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(messagesEndRef.current as any)?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  const { sendMessage } = useConversation(
    recipientWalletAddr,
    scrollToMessagesEndRef
  )

  const { convoMessages, loadingConversations } = useContext(XmtpContext)

  const messages = useMemo(
    () => convoMessages.get(recipientWalletAddr) ?? [],
    [convoMessages, recipientWalletAddr]
  )

  const plainMessages = useMemo(
    () =>
      (convoMessages.get(recipientWalletAddr) ?? [])
        .map((x) => x.content ?? '')
        .filter((x) => !!x),
    [convoMessages, recipientWalletAddr]
  )

  const hasMessages = messages.length > 0

  useEffect(() => {
    if (!messages || !messagesEndRef.current) return

    setTimeout(() => {
      scrollToMessagesEndRef()
    }, 1000)
  }, [recipientWalletAddr, scrollToMessagesEndRef, messages])

  if (!recipientWalletAddr) {
    return <div />
  }

  if (loadingConversations && !hasMessages) {
    return (
      <Loader
        headingText="Loading game..."
        subHeadingText="Please wait a moment"
        isLoading
      />
    )
  }

  return (
    <Root>
      <header>
        <label>
          <input
            type="checkbox"
            onChange={(e: any) => {
              setDebugMode(e.target.checked)

              if (e.target.checked) {
                setTimeout(() => {
                  scrollToMessagesEndRef()
                }, 0)
              }
            }}
          />
          Debug
        </label>
        <button
          className="inline-flex items-center h-7 md:h-6 px-4 py-1 my-1 bg-p-400 border border-p-300 hover:bg-p-300 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-n-100 focus-visible:ring-offset-p-600 focus-visible:border-n-100 focus-visible:outline-none active:bg-p-500 active:border-p-500 active:ring-0 text-sm md:text-xs md:font-semibold tracking-wide text-white rounded"
          onClick={() => {
            sendMessage(
              JSON.stringify(
                getInitialAction(address!, [address!, recipientWalletAddr]),
                null,
                2
              )
            )
          }}
        >
          New Game
        </button>
      </header>

      {!isDebugMode && (
        <section>
          <ReversiGame
            userIds={[address!, recipientWalletAddr]}
            actions={plainMessages}
            onSend={(action) => {
              console.log('sending', action)
              sendMessage(action)
            }}
          />
        </section>
      )}
      {isDebugMode && (
        <main className="flex flex-col flex-1 bg-white h-screen">
          <MessagesList messagesEndRef={messagesEndRef} messages={messages} />
          <MessageComposer onSend={sendMessage} />
        </main>
      )}
    </Root>
  )
}

const Root = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;

  > header {
    z-index: 100;
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
    flex-direction: column;

    position: fixed;
    right: 10px;
    top: 10px;

    label {
      cursor: pointer;
    }
  }

  > section {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-bottom: 50px;
  }
`

export default React.memo(Conversation)
