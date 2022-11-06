import styled from 'styled-components'
import { DiskItem } from '../types'
import { Disk } from './Disk'

interface Props {
  width: number
  height: number
  items: DiskItem[]
  isAllowed: boolean

  onSelect: (x: number, y: number) => void
}

export function Board({ width, height, items, isAllowed, onSelect }: Props) {
  const rows = new Array(height).fill(0)
  const columns = new Array(width).fill(0)

  const itemsMap = items.reduce(
    (r, x) => r.set(buildKey(x.x, x.y), x),
    new Map<string, DiskItem>()
  )

  return (
    <View className="Board">
      {rows.map((_, i) => (
        <Row key={i}>
          {columns.map((_, j) => {
            const key = buildKey(j, i)
            const item = itemsMap.get(key)

            return (
              <Cell
                key={j}
                className={`${item?.isPreview ? 'active' : ''}`}
                onClick={() => {
                  if (!item?.isPreview) {
                    return
                  }

                  onSelect(j, i)
                }}
              >
                {item && (isAllowed || !item.isPreview) && (
                  <Disk
                    // ref={ref => {
                    //   // if (ref) {
                    //   console.log('ref', ref)
                    //   item.flipAnimation = createAnimation()
                    //     .addElement(ref!.current)
                    //     .duration(200)
                    //     .iterations(1)
                    //     .fromTo('width', '0', '50px')

                    //   item.flipAnimation.play()
                    //   // }
                    // }}
                    key={key}
                    type={itemsMap.get(key)!.type}
                    isPreview={item.isPreview}
                  ></Disk>
                )}
              </Cell>
            )
          })}
        </Row>
      ))}
    </View>
  )
}

function buildKey(x: number, y: number) {
  return [x, y].join('_')
}

const Cell = styled.div`
  &.active {
    cursor: pointer;

    &:hover {
      background: rgba(0, 0, 0, 0.1);
    }
  }
`

const Row = styled.section``

const View = styled.main`
  display: flex;
  flex-direction: column;
  background: rgba(0, 0, 0, 0.04);
  border-radius: 6px;
  background: white;

  ${Row} {
    display: flex;
    flex-direction: row;
    justify-content: center;

    ${Cell} {
      width: 50px;
      height: 50px;
      display: flex;
      padding: 4px;
      border-right: 1px solid silver;
      border-bottom: 1px solid silver;
      justify-content: center;

      &:last-of-type {
        border-right-width: 0;
      }
    }

    &:last-of-type {
      ${Cell} {
        border-bottom-width: 0;
      }
    }
  }
`
