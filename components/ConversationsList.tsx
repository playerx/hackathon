import { ChatIcon } from '@heroicons/react/outline'
import { Conversation, Message } from '@xmtp/xmtp-js'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useContext, useEffect } from 'react'
import { WalletContext } from '../contexts/wallet'
import XmtpContext from '../contexts/xmtp'
import {
  checkIfPathIsEns,
  checkPath,
  classNames,
  formatDate,
  truncate,
} from '../helpers'
import Address from './Address'
import Avatar from './Avatar'

type ConversationTileProps = {
  conversation: Conversation
  isSelected: boolean
  onClick?: () => void
}

const getLatestMessage = (messages: Message[]): Message | null =>
  messages?.length ? messages[messages.length - 1] : null

const ConversationTile = ({
  conversation,
  isSelected,
  onClick,
}: ConversationTileProps): JSX.Element | null => {
  const { address } = useContext(WalletContext)
  const { convoMessages, loadingConversations } = useContext(XmtpContext)

  const latestMessage = getLatestMessage(
    convoMessages.get(conversation.peerAddress) ?? []
  )

  const moveInfo = React.useMemo(() => {
    try {
      const action = JSON.parse(latestMessage?.content)

      if (action.userId === address) {
        return { message: `Opponent's move`, highlight: false }
      } else {
        return { message: `Your move`, highlight: false }
      }
    } catch (err) {
      return { message: 'New game', highlight: false }
    }
  }, [latestMessage?.content])

  if (!convoMessages.get(conversation.peerAddress)?.length) {
    return null
  }
  const path = `/dm/${conversation.peerAddress}`

  if (!latestMessage) {
    return null
  }

  return (
    <Link href={path} key={conversation.peerAddress}>
      <a onClick={onClick}>
        <div
          className={classNames(
            'h-20',
            'py-2',
            'px-4',
            'md:max-w-sm',
            'mx-auto',
            'bg-white',
            'space-y-2',
            'py-2',
            'flex',
            'items-center',
            'space-y-0',
            'space-x-4',
            'border-b-2',
            'border-gray-100',
            'hover:bg-bt-100',
            loadingConversations ? 'opacity-80' : 'opacity-100',
            isSelected ? 'bg-bt-200' : null
          )}
        >
          <Avatar peerAddress={conversation.peerAddress} />
          <div className="py-4 sm:text-left text w-full">
            <div className="grid-cols-2 grid">
              <Address
                address={conversation.peerAddress}
                className="text-black text-lg md:text-md font-bold place-self-start"
              />
              <span
                className={classNames(
                  'text-lg md:text-sm font-normal place-self-end',
                  isSelected ? 'text-n-500' : 'text-n-300',
                  loadingConversations ? 'animate-pulse' : ''
                )}
              >
                {formatDate(latestMessage?.sent)}
              </span>
            </div>
            <p
              className={classNames(
                'text-[13px] md:text-sm text-ellipsis mt-0',
                isSelected ? 'text-n-500' : 'text-n-300',
                loadingConversations ? 'animate-pulse' : '',
                moveInfo.highlight ? 'font-black' : 'font-normal'
              )}
            >
              {moveInfo.message && truncate(moveInfo.message, 75)}
            </p>
          </div>
        </div>
      </a>
    </Link>
  )
}

const ConversationsList = (): JSX.Element => {
  const router = useRouter()
  const { conversations, convoMessages } = useContext(XmtpContext)
  const { resolveName } = useContext(WalletContext)

  const orderByLatestMessage = (
    convoA: Conversation,
    convoB: Conversation
  ): number => {
    const convoAMessages = convoMessages.get(convoA.peerAddress) ?? []
    const convoBMessages = convoMessages.get(convoB.peerAddress) ?? []
    const convoALastMessageDate =
      getLatestMessage(convoAMessages)?.sent || new Date()
    const convoBLastMessageDate =
      getLatestMessage(convoBMessages)?.sent || new Date()
    return convoALastMessageDate < convoBLastMessageDate ? 1 : -1
  }

  const reloadIfQueryParamPresent = async () => {
    if (checkPath()) {
      let queryAddress = window.location.pathname.replace('/dm/', '')
      if (checkIfPathIsEns(queryAddress)) {
        queryAddress = (await resolveName(queryAddress)) ?? ''
      }
      if (queryAddress) {
        if (conversations && conversations.has(queryAddress)) {
          router.push(window.location.pathname)
        }
      }
    }
  }

  useEffect(() => {
    reloadIfQueryParamPresent()
  }, [window.location.pathname])

  if (!conversations || conversations.size == 0) {
    return <NoConversationsMessage />
  }

  return (
    <>
      {conversations &&
        conversations.size > 0 &&
        Array.from(conversations.values())
          .sort(orderByLatestMessage)
          .map((convo) => {
            const isSelected =
              router.query.recipientWalletAddr == convo.peerAddress
            return (
              <ConversationTile
                key={convo.peerAddress}
                conversation={convo}
                isSelected={isSelected}
              />
            )
          })}
    </>
  )
}

const NoConversationsMessage = (): JSX.Element => {
  return (
    <div className="flex flex-col flex-grow justify-center h-[100%]">
      <div className="flex flex-col items-center px-4 text-center">
        <ChatIcon
          className="h-8 w-8 mb-1 stroke-n-200 md:stroke-n-300"
          aria-hidden="true"
        />
        <p className="text-xl md:text-lg text-n-200 md:text-n-300 font-bold">
          Your message list is empty
        </p>
        <p className="text-lx md:text-md text-n-200 font-normal">
          There are no messages for this address
        </p>
      </div>
    </div>
  )
}

export default React.memo(ConversationsList)
