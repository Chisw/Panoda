import React from 'react'
import { ButtonGroup, Button, Tooltip } from '@blueprintjs/core'

interface SelectGuiderProps {
  setTaskFrom(val: string): void
  selectWith: string
  setSelectWith(val: string): void
}

export default function SelectGuider(props: SelectGuiderProps) {

  const { setTaskFrom, selectWith, setSelectWith } = props

  return (
    <div className="map-select-guider p-2 absolute left-50">
      <div className="text-center">
        <ButtonGroup fill className="shadow-xl">
          <Tooltip content="Click the blue line">
            <Button
              icon="locate"
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
              onClick={() => {
                setTaskFrom('')
              }}
            >
            </Button>
          </Tooltip>
        </ButtonGroup>
      </div>
    </div>
  )
}