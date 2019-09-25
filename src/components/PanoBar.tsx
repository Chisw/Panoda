import React from 'react'
import { ButtonGroup, Button, Popover, Classes, Checkbox, Toaster } from '@blueprintjs/core'

import { IPano } from '../ts/type'
import MAP from '../ts/map'
import { getPreviewSrc } from '../ts/util'

const toaster = Toaster.create({ position: 'top-left' })

interface PanoBarProps {
  index: number
  pano: IPano
  panos: IPano[] | []
  setPanos(panos: IPano[] | []): void
  checkedIds: string[]
  setCheckedIds(list: any): void
}

export default function PanoBar(props: PanoBarProps) {

  const { 
    index, 
    pano: { id, lng, lat, date, rname }, 
    panos, 
    setPanos,
    checkedIds,
    setCheckedIds,
  } = props

  const checked = checkedIds.includes(id)

  return (
    <Checkbox 
      className="pano-pano-bar py-3 border-b flex hover:bg-gray-100 m-0 font-mono"
      checked={checked}
      onChange={() => {
        let _checkedIds: string[]
        if (checked) {
          const index = checkedIds.findIndex( _id => _id === id)
          checkedIds.splice(index, 1)
          _checkedIds = [...checkedIds]
        } else {
          checkedIds.push(id)
          _checkedIds = [...checkedIds]
        }
        setCheckedIds(_checkedIds)
      }}
    >
      <div className="w-8 flex items-center">
        <span className="text-xs text-gray-700">{index + 1}</span>
      </div>
      <div className="text-none">
        <Popover
          position="top-left"
          interactionKind="hover"
          content={
            <img
              alt={id}
              style={{width: 300, height: 150}}
              src={getPreviewSrc(id)}
            />
          }
        >
          <img
            alt={id}
            className="pano-preview rounded-sm"
            src={getPreviewSrc(id)}
          />
        </Popover>
      </div>
      <div className="px-3 leading-snug" style={{ width: 380 }}>
        <p className="text-xs">
          ID: {id}
        </p>
        <p className="text-xs text-gray-500">
          Date: {date}
          {
            rname
              ? <span className="ml-4">Road: {rname}</span>
              : ''
          }
        </p>
        <p className="text-xs text-gray-500">
          Pin: {lng + ',' + lat}
        </p>
      </div>
      <div className="pano-operation px-2 text-right self-center flex-grow">
        <ButtonGroup minimal>
          <Button
            icon="map-marker"
            onClick={() => {
              MAP.panToPoint({ lng, lat })
            }}
          />
          <Popover
            position="left"
            content={
              <div className="px-4 py-2">
                <p>
                  Delete this pano?
                  <Button
                    className={`${Classes.POPOVER_DISMISS} ml-4`}
                    intent="danger"
                    onClick={() => {
                      const index = panos.findIndex(pano => pano.id === id)
                      if (index === -1) return
                      panos.splice(index, 1).reverse()
                      const _panos = [...panos]
                      setPanos(_panos)
                      toaster.show({
                        message: `Pano deleted`,
                        intent: 'success',
                        timeout: 2000,
                        icon: 'tick'
                      })
                    }}
                  >
                    Yes
                  </Button>
                </p>
              </div>
            }
          >
            <Button
              icon="trash"
              intent="danger"
            />
          </Popover>
        </ButtonGroup>
      </div>
    </Checkbox>
  )
}