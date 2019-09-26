import React, { useState } from 'react'
import { Drawer } from '@blueprintjs/core'
import CodeButton from '../CodeButon'
import { IPoint } from '../../ts/type'

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
  const lv = zoomLevel

  const steps = [
    'Compute points..',
  ]

  const lvOffset = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
    0.01024,  // 13
    0.00512,  // 14
    0.00256,  // 15
    0.00128,  // 16
    0.00064,  // 17
    0.00032,  // 18
    0.00016,  // 19
  ]
  const _lvOffset = lvOffset[lv]
  const _lvOffsetCorner = _lvOffset * 2.5
  
  const [step, setStep] = useState(0)
  const [cancelConfirm, setCancelConfirm] = useState(false)

  return (
    <div>
      <Drawer
        position="bottom"
        style={{ 
          background: 'rgba(0,0,0, .8)',
          right: '50%',
          marginRight: -200,
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
            {steps[step]}
            <span className="float-right">
              {
                cancelConfirm
                  ? (
                    <span>
                      <span>Are you sure to cancel?</span>
                      <CodeButton
                        className="mx-2"
                        content="Yes"
                        onClick={() => {
                          onClose()
                          setCancelConfirm(false)
                        }}
                      />
                      <CodeButton
                        content="No"
                        onClick={
                          () => {
                            setCancelConfirm(false)
                          }
                        }
                      />
                    </span>

                  )
                  : (
                    <CodeButton 
                      content = "cancel"
                      onClick = {
                        () => {
                          setCancelConfirm(true)
                        }
                      }
                    />
                  )
              }
            </span>
          </h3>

          <div 
            className="absolute py-6 border border-dashed border-green-900"
            style={{
              top: 40,
              right: 20,
              bottom: 20,
              left: 20
            }}
          >
            <div>
<pre>
<p>     Area Center Point:  {lng + ', ' + lat}</p>
<p>        Map Zoom Level:  {lv}</p>
<p>          Level Offect:  {lvOffset[lv]}</p>
<br/>
<p>        Top Left Point:  {( lng - _lvOffsetCorner ) + ', ' + ( lat + _lvOffsetCorner )}</p>
<p>    Bottom Right Point:  {( lng + _lvOffsetCorner ) + ', ' + ( lat - _lvOffsetCorner )}</p>
</pre>
            </div>
          </div>
        </div>
      </Drawer>
    </div>
  )
}