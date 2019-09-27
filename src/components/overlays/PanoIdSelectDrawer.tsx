import React, { useState, useEffect } from 'react'
import { Drawer } from '@blueprintjs/core'
import { DateTime } from 'luxon'
import CodeButton from '../CodeButon'
import { IPoint } from '../../ts/type'
import { CMD } from '../../ts/util'
import { LEVEL_OFFSETS } from '../../ts/constant'

interface PanoIdSelectDrawerProps {
  isOpen: boolean
  onClose(): void
  areaCenter: IPoint
  zoomLevel: number
}

export default function PanoIdSelectDrawer(props: PanoIdSelectDrawerProps) {

  const {
    isOpen,
    onClose,
    areaCenter,
    zoomLevel,
  } = props

  const { lng, lat } = areaCenter

  const lvOffset       = LEVEL_OFFSETS[zoomLevel]
  const lvOffsetCenter = lvOffset * 2.5

  const topLeftLng     = lng - lvOffsetCenter
  const topLeftLat     = lat + lvOffsetCenter
  const bottomRightLng = lng + lvOffsetCenter
  const bottomRightLat = lat - lvOffsetCenter
  
  const [closeConfirm, setCloseConfirm] = useState(false)

  useEffect(() => {
    if ( isOpen ) {
      setTimeout(() => {
        const points: IPoint[] = []

        for ( let row = 0, len = 6; row < len; row++ ) {
          for ( let col = 0, lon = 6; col < lon; col++ ) {
            points.push({
              lng: topLeftLng + lvOffset * row, 
              lat: topLeftLat - lvOffset * col
            })
          }
        }

        CMD.echo('br')
        
        let index = 0
        const _recursive = () => {
          setTimeout(() => {
            const point = points[index]
            CMD.echo(
              'Point ' + (index + 1),
              point.lng.toFixed(14) + ', ' + point.lat.toFixed(14)
            )

            index++

            if ( index === 36 ) {
              CMD.echo('br')

            } else {
              _recursive()
            }
          }, 100)
        }

        _recursive()

      }, 100)
    }
  }, [isOpen])

  return (
    <div>
      <Drawer
        position="bottom"
        style={{ 
          background: 'rgba(0,0,0, .8)',
          right: '50%',
          marginRight: -200,
          minWidth: 800
        }}
        isOpen={isOpen}
        canOutsideClickClose={false}
        backdropProps={{
          style: {
            background: 'rgba(0,0,0, .2)',
            cursor: 'not-allowed',
          }
        }}
      >
        <div 
          className="absolute top-0 right-0 bottom-0 left-0 text-green-code font-mono text-xs"
        >
          <h3 className="px-5 py-3">
            <span>Scanner</span>
            <span className="float-right">
              {
                closeConfirm
                  ? (
                    <span>
                      <span>Are you sure to close?</span>
                      <CodeButton
                        className="mx-2"
                        content="Yes"
                        onClick={() => {
                          onClose()
                          setCloseConfirm(false)
                        }}
                      />
                      <CodeButton
                        content="No"
                        onClick={
                          () => {
                            setCloseConfirm(false)
                          }
                        }
                      />
                    </span>

                  )
                  : (
                    <CodeButton 
                      content = "Close"
                      onClick = {
                        () => {
                          setCloseConfirm(true)
                        }
                      }
                    />
                  )
              }
            </span>
          </h3>

          <div
            id="cmd-scroll"
            className="absolute py-6 border border-dashed border-green-900 overflow-y-scroll"
            style={{
              top: 40,
              right: 20,
              bottom: 20,
              left: 20
            }}
          >
            <div>
              <pre id="cmd" className="font-mono">
                <p>          Scan Datetime:  {DateTime.local().toFormat('yyyy/MM/dd hh:mm:ss')}</p>
                <p>      Area Center Point:  {lng + ', ' + lat}</p>
                <p>         Map Zoom Level:  {zoomLevel}</p>
                <p>           Level Offect:  {lvOffset}</p>
                <br />
                <p>         Top Left Point:  {topLeftLng + ', ' + topLeftLat}</p>
                <p>     Bottom Right Point:  {bottomRightLng + ', ' + bottomRightLat}</p>
              </pre>
            </div>
          </div>
        </div>
      </Drawer>
    </div>
  )
}