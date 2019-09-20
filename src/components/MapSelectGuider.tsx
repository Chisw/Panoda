import React from 'react'
import { ButtonGroup, Button, Tooltip } from '@blueprintjs/core'

interface MapSelectGuiderProps {
  selectWith: string
  setSelectWith: (val: string) => void
}

export default function MapSelectGuider(props: MapSelectGuiderProps) {

  const { selectWith, setSelectWith } = props

  return (
    <div className="map-select-guider p-2 absolute left-50">
      <div className="text-center">
        <ButtonGroup fill className="shadow-xl">
          <Tooltip content="Click the blue line on the map">
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
          <Tooltip content="Select an area on the map">
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
        </ButtonGroup>
      </div>
    </div>
  )
}