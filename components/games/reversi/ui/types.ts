export type DiskItemType = 'LIGHT' | 'DARK'

export type DiskItem = {
  type: DiskItemType
  isPreview: boolean
  x: number
  y: number

  flipAnimation: Animation | null
}
