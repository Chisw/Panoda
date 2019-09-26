import React from 'react'
import { ButtonGroup, Button, Popover, Classes, Checkbox } from '@blueprintjs/core'

import { IPano } from '../../ts/type'
import MAP from '../../ts/map'
import { getPreviewSrc } from '../../ts/util'
import TOAST from '../overlays/EasyToast'

interface PanoCardProps {
  index: number
  pano: IPano
  panos: IPano[] | []
  setPanos(panos: IPano[] | []): void
  checkedIds: string[]
  setCheckedIds(list: any): void
}

export default function PanoCard(props: PanoCardProps) {

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
      className="pano-pano-card border mt-6 mr-6 mb-0 ml-0 rounded border-none font-mono"
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
      <img
        alt={id + index}
        className="pano-preview absolute top-0 right-0 bottom-0 left-0 rounded z-0 hover:shadow-lg"
        src={getPreviewSrc(id)}
      />
      <div 
        className="px-1 leading-tight absolute right-0 bottom-0 left-0 break-words" 
        style={{ textShadow: '0 0 2px rgba(0,0,0, 1),0 0 1px rgba(0,0,0, 1)'}}
      >
        <p className="text-xs text-white text-right">
          {rname} {date}<br />
          {id}   
          {/* <br /> {lng + ', ' + lat} */}
        </p>
      </div>
      <div className="pano-operation text-right absolute top-0 right-0 left-0">
        <ButtonGroup>
          <Button
            icon="map-marker"
            onClick={() => {
              MAP.panToPoint({ lng, lat })
            }}
          />
          <Popover
            position="top"
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
                      TOAST.success(`Pano deleted.`)
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