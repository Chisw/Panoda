import React, { useState, useEffect } from 'react'
import { Drawer } from '@blueprintjs/core'
import { DateTime } from 'luxon'
import CodeButton from '../CodeButon'
import { IPoint } from '../../ts/type'
import { CMD } from '../../ts/util'
import { LEVEL_OFFSETS } from '../../ts/constant'
import _ from 'lodash'
import TOAST from './EasyToast'
import MAP from '../../ts/map'

interface IdScannerProps {
  isOpen: boolean
  onClose(): void
  areaCenter: IPoint
  zoomLevel: number
}

export default function IdScanner(props: IdScannerProps) {

  const {
    isOpen,
    onClose,
    areaCenter,
    zoomLevel,
  } = props

  const { lng, lat } = areaCenter

  const lvOffset = LEVEL_OFFSETS[zoomLevel]
  const lvOffsetCenter = lvOffset * 2.5

  const topLeftLng = lng - lvOffsetCenter
  const topLeftLat = lat + lvOffsetCenter
  
  const [closeConfirm, setCloseConfirm] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        MAP.parent.scannerRunning = true
        startComputingPoints()
      }, 100)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  // startComputingPoints
  const startComputingPoints = () => {

    CMD.echo('Scanning Datetime:', DateTime.local().toFormat('yyyy/MM/dd hh:mm:ss'))
    CMD.echo('Area Center Point:', lng.toFixed(14) + ', ' + lat.toFixed(14))
    CMD.echo('Map Zoom Level:', zoomLevel)
    CMD.echo('Level Offect:', lvOffset)
    CMD.echo('br')
    CMD.echo('Top Left Point:', topLeftLng.toFixed(14) + ', ' + topLeftLat.toFixed(14))

    const points: IPoint[] = []

    for (let row = 0, len = 6; row < len; row++) {
      for (let col = 0, lon = 6; col < lon; col++) {
        points.push({
          lng: topLeftLng + lvOffset * row,
          lat: topLeftLat - lvOffset * col,
        })
      }
    }

    CMD.echo('br')
    CMD.echo('>>', 'Start computing 6*6 points')
    CMD.echo('br')

    let index = 0
    const _recursion = () => {
      setTimeout(() => {
        const point = points[index]
        CMD.echo(
          'Point ' + (index + 1),
          point.lng.toFixed(14) + ', ' + point.lat.toFixed(14)
        )

        index++

        if (index < 36 ) {
          _recursion()
        } else {
          CMD.echo('br')
          CMD.echo('<<', 'Computing end')
          CMD.echo('br')
          startScanningPanos(points)
        }
      }, 50)
    }

    _recursion()
  }

  // startScanningPanos
  const startScanningPanos = (points: IPoint[]) => {

    CMD.echo('>>', 'Start scanning panos')
    CMD.echo('br')

    let ids: string[] = []

    // points = points.slice(1,5)  // test code
    
    MAP.scanIdsByPoints(
      points,
      // success
      (data, _index) => {

        ids.push(data.id)
        ids = ids.concat(data.links.map((link: any) => link.id))
        
        /* data
          {
            roads: {
              23: { id: '', ... },
              714: { id: '', ... }
            }
          }
        */
        let roadsList: any[] = []
        if ( data.roads ) {
          Object.values(data.roads).forEach((road: any) => {
            roadsList = roadsList.concat(road.map((node: any) => node.id ))
          })
        }

        ids = ids.concat(roadsList)

        CMD.echo(`Point ${_index}:`, `Scanned ${ 1 + data.links.length + roadsList.length } panos`)
      },
      // fail
      (_index) => {
        CMD.echo(`Point ${_index}:`, 'None')
      },
      // end
      () => {
        const uniquedIds = _.uniq(ids)
        const totalLen = ids.length
        const uniqueLen = uniquedIds.length
        const repeatedLen = totalLen - uniqueLen

        CMD.echo('br')
        CMD.echo('<<', 'Scanning end')
        CMD.echo('br')
        CMD.echo('>>', 'Start printing result')
        CMD.echo('br')
        setTimeout(() => {
          uniquedIds.forEach((id, index) => {
            CMD.echo('Pano ' + ( index + 1 ) + ':', id)
          })
          CMD.echo('br')
          CMD.echo('Scanned Result:', `${totalLen} total, ${repeatedLen} repeated, ${uniqueLen} remained.`)
          CMD.echo('br')
          CMD.echo('<<', 'Printing result end')
          CMD.echo('br')
          startImportingPanos(uniquedIds)
        }, 1000)
      }
    )
  }

  // startImportingPanos
  const startImportingPanos = (idList: string[]) => {
    CMD.echo('>>', 'Start importing')
    CMD.echo('br')
    CMD.echo('', 'Importing ...')
    CMD.echo('br')

    MAP.parent.setLoading(true)
    const _recursion = () => {
      if (idList.length) {
        setTimeout(() => {
          MAP.getPanoInfoByIdAndAppendDom(
            idList.shift() || '',
            _recursion,
            _recursion
          )
        }, 20)
      } else {
        MAP.parent.setLoading(false)
        TOAST.success('Finished')
        CMD.echo('<<', 'Importing end')
        CMD.echo('br')
        CMD.echo('br')
        CMD.echo('^_^', 'Congratulations')
      }
    }
    _recursion()
  }

  return (
    <div>
      <Drawer
        position="bottom"
        style={{ 
          background: 'rgba(0,0,0, .8)',
          right: '50%',
          marginRight: -200,
          minWidth: 800,
        }}
        isOpen={isOpen}
        canOutsideClickClose={false}
        backdropProps={{
          style: {
            background: 'rgba(0,0,0, .2)',
            cursor: 'not-allowed',
          },
        }}
      >
        <div className="absolute top-0 right-0 bottom-0 left-0 text-green-code font-mono text-xs">
          <h3 className="px-5 py-3">
            <span>Scanner</span>
            <span className="float-right">
              {closeConfirm ? (
                <span>
                  <span>Are you sure to close?</span>
                  <CodeButton
                    className="mx-2"
                    content="Yes"
                    onClick={() => {
                      MAP.parent.scannerRunning = false
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
              ) : (
                <CodeButton 
                  content="Close"
                  onClick={() => setCloseConfirm(true)}
                />
              )}
            </span>
          </h3>

          <div
            id="cmd-scroll"
            className="absolute py-6 border border-dashed border-green-900 overflow-y-scroll"
            style={{
              top: 40,
              right: 20,
              bottom: 20,
              left: 20,
            }}
          >
            <div>
              <pre id="cmd" className="font-mono"></pre>
            </div>
          </div>
        </div>
      </Drawer>
    </div>
  )
}