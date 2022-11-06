/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/display-name */
import { forwardRef } from 'react'
import styled from 'styled-components'
import { DiskItem } from '../types'

interface Props {
  className?: string
  type: DiskItem['type']
  isPreview: boolean
}

export const Disk = forwardRef<{ current: HTMLElement }, Props>(
  ({ type, className, isPreview }, ref) => {
    return (
      <View
        ref={ref as any}
        className={`Disk ${className} ${isPreview ? 'preview' : ''}`}
        isLight={type === 'LIGHT'}
      ></View>
    )
  }
)

const View = styled.main<{ isLight: boolean }>`
  transition: 200ms;
  border-radius: 100%;
  border: 2px solid ${(x) => (x.isLight ? '#b71c1c' : '#0d47a1')};
  background: ${(x) => (x.isLight ? '#c62828' : '#1565c0')};
  width: 50px;

  &.preview {
    opacity: 0.5;
    transform: scale(0.7);
  }
`
