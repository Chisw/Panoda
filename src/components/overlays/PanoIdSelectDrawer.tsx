import React, { useState } from 'react'
import { Drawer } from '@blueprintjs/core'
import CodeButton from '../CodeButon'

interface PanoIdSelectDrawerProps {
  isOpen: boolean
  onClose(): void
}

export default function PanoIdSelectDrawer(props: PanoIdSelectDrawerProps) {

  const {
    isOpen,
    onClose,
  } = props

  const steps = [
    'Compute points..',
  ]
  
  const [title, setTitle] = useState(steps[0])
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
          className="absolute top-0 right-0 bottom-0 left-0 px-4 py-2 text-green-code font-mono text-xs"
        >
          <h3 className="pb-2 border-b border-green-900">
            {title}
            <span className="float-right">
              {
                cancelConfirm
                  ? (
                    <span>
                      <span>Are you sure to cancel?</span>
                      <CodeButton
                        className="mx-2"
                        content="Yes"
                        onClick={onClose}
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
        </div>
      </Drawer>
    </div>
  )
}