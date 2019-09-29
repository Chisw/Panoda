import React, { useState } from 'react'
import { ButtonGroup, Button, Tooltip, Tag } from '@blueprintjs/core'
import IdScanner from './IdScanner'

import MAP from '../../ts/map'
import TOAST from './EasyToast'
import { IPoint } from '../../ts/type'

interface SelectGuiderProps {
  panoFrom: string
  setPanoFrom(val: string): void
  selectWith: string
  setSelectWith(val: string): void
  sameRoadPanos: string[]
  setSameRoadPanos(list: []): void
  areaCenter: IPoint
  zoomLevel: number
}

export default function SelectGuider(props: SelectGuiderProps) {

  const { 
    panoFrom,
    setPanoFrom,
    selectWith,
    setSelectWith,
    sameRoadPanos,
    setSameRoadPanos,
    areaCenter,
    zoomLevel,
  } = props

  const otherLen = sameRoadPanos.length

  const [drawerOpen, setDrawerOpen] = useState(false)

  const isPoint = panoFrom === 'map' && selectWith === 'point'
  const isArea  = panoFrom === 'map' && selectWith === 'area'

  return (
    <div className="map-select-guider absolute left-50 shadow-lg">

      {/* point */}
      <div
        className={`guider-top w-full h-8 rounded bg-white overflow-hidden
          ${isPoint && otherLen  ? ' expand' : ''}`
        }
      >
        <div className="px-1 w-full h-full flex items-center">
          <div className="text-xs font-mono flex items-center flex-grow leading-none">
            <p className="pl-2">Annother {otherLen} pano{otherLen === 1 ? '' : 's'} on this road.</p>
          </div>
          <Tag
            interactive
            className="text-xs"
            intent="primary"
            onClick={() => {
              MAP.importPanosByIdList(
                sameRoadPanos,
                () => {
                  setSameRoadPanos([])
                }
              )
            }}
          >
            Import
          </Tag>
        </div>

      </div>{/* point */}

      {/* area */}
      <div
        className={`guider-top w-full h-8 rounded bg-white overflow-hidden
          ${isArea ? ' expand' : ''}`
        }
      >
        <div className="px-1 w-full h-full flex items-center">
          <div className="text-xs font-mono flex items-center flex-grow leading-none">
            <p className="text-gray-500 text-right">
              Area<br/>Center
            </p>
            <p className="mx-2" style={{minWidth: 128}}>
              {areaCenter.lng}<br />{areaCenter.lat}
            </p>
            <p className="text-gray-500 text-right ml-1">
              Zoom<br/>Level
            </p>
            <p className={`mx-2 ${zoomLevel < 17 ? 'text-red-600' : ''}`}>
              {zoomLevel}
            </p>
          </div>
          <Tag
            interactive
            className="text-xs"
            intent="primary"
            onClick={() => {
              if (areaCenter.lng === 0) {
                TOAST.danger('Invalid area center point.')
                return
              }
              if (zoomLevel < 17) {
                TOAST.danger('Zoom map to level 17-19.')
                return
              }
              setDrawerOpen(true)
            }}
          >
            Scan
          </Tag>
        </div>

      </div>{/* area */}

      <ButtonGroup fill>
        <Tooltip content="Locate your position" position="left">
          <Button
            icon="locate"
            onClick={() => {
              MAP.locate()
            }}
          />
        </Tooltip>
        <Button
          className="px-8"
          icon="map-marker"
          active={selectWith === 'point'}
          onClick={() => {
            setSelectWith('point')
          }}
        >
          Point
        </Button>
        <Button
          className="px-8"
          icon="widget"
          active={selectWith === 'area'}
          onClick={() => {
            setSelectWith('area')
          }}
        >
          Area
        </Button>
        <Tooltip content="Quit" position="right">
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

      <IdScanner
        isOpen={drawerOpen}
        onClose={() => {setDrawerOpen(false)}}
        areaCenter={areaCenter}
        zoomLevel={zoomLevel}
      />
    </div>
  )
}