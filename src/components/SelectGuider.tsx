import React from 'react'
import { ButtonGroup, Button, Tooltip } from '@blueprintjs/core'
import MAP from '../ts/map'

interface SelectGuiderProps {
  setPanoFrom(val: string): void
  selectWith: string
  setSelectWith(val: string): void
}

export default function SelectGuider(props: SelectGuiderProps) {

  const { setPanoFrom, selectWith, setSelectWith } = props

  return (
    <div className="map-select-guider p-2 absolute left-50">
      <div className="text-center">
        <ButtonGroup className="shadow-xl">
          <Tooltip content="Locate your position">
            <Button
              icon="locate"
              onClick={() => {
                MAP.locate()
              }}
            />
          </Tooltip>
          <Tooltip content="Click the blue line">
            <Button
              className="px-4"
              icon="map-marker"
              active={selectWith === 'point'}
              onClick={() => {
                setSelectWith('point')
              }}
            >
              Point
            </Button>
          </Tooltip>
          <Tooltip content="Select an area">
            <Button
              className="px-4"
              icon="square"
              active={selectWith === 'area'}
              onClick={() => {
                setSelectWith('area')
              }}
            >
              Area
            </Button>
          </Tooltip>
          <Tooltip content="Quit">
            <Button
              icon="cross"
              intent="danger"
              onClick={() => {
                setPanoFrom('')
              }}
            >
            </Button>
          </Tooltip>
        </ButtonGroup>
      </div>
    </div>
  )
}