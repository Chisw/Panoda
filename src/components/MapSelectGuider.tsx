import React from 'react'
import { ButtonGroup, Button } from '@blueprintjs/core'

export default function MapSelectGuider() {
  return (
    <div className="map-select-guider p-2 absolute top-0 bottom-0 left-50 shadow">
      <div className="text-center">
        <ButtonGroup fill>
          <Button
            icon="locate"
            active
          >
            Point
          </Button>
          <Button
            icon="square"
          >
            Area
          </Button>
        </ButtonGroup>
      </div>
    </div>
  )
}