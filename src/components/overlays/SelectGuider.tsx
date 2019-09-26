import React from 'react'
import { ButtonGroup, Button, Tooltip, Tag } from '@blueprintjs/core'
import MAP from '../../ts/map'

interface SelectGuiderProps {
  panoFrom: string
  setPanoFrom(val: string): void
  selectWith: string
  setSelectWith(val: string): void
  selectAreaCenter: {
    lng: number
    lat: number
  }
  zoomLevel: number
}

export default function SelectGuider(props: SelectGuiderProps) {

  const { 
    panoFrom,
    setPanoFrom,
    selectWith,
    setSelectWith,
    selectAreaCenter,
    zoomLevel,
  } = props

  const isArea = panoFrom === 'map' && selectWith === 'area';

  return (
    <div className="map-select-guider absolute left-50">

      <div 
        className={`guider-top w-full h-8 rounded-sm bg-white overflow-hidden
          ${isArea ? ' expand' : ''}`
        }
      >
        <div className="px-1 w-full h-full flex items-center">
          <div className="text-xs font-mono flex items-center flex-grow leading-none">
            <p className="text-gray-500 text-center">
              Area<br/>Center
            </p>
            <p className="mx-2" style={{minWidth: 138}}>
              {selectAreaCenter.lng}<br />{selectAreaCenter.lat}
            </p>
            <p className="text-gray-500 text-center ml-4">
              Zoom<br/>Level
            </p>
            <p className="mx-2">
              {zoomLevel}
            </p>
          </div>
          <Tag
            round
            interactive
          >
            Select
          </Tag>
        </div>

      </div>

      <ButtonGroup className="shadow-large" fill>
        <Tooltip content="Locate your position">
          <Button
            icon="locate"
            onClick={() => {
              MAP.locate()
            }}
          />
        </Tooltip>
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
        <Button
          className="px-4"
          icon="trending-up"
          active={selectWith === 'line'}
          onClick={() => {
            setSelectWith('line')
          }}
        >
          Line
        </Button>
        <Button
          className="px-4"
          icon="widget"
          active={selectWith === 'area'}
          onClick={() => {
            setSelectWith('area')
          }}
        >
          Area
        </Button>
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
  )
}