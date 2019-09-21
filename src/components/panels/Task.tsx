import React, { useState } from 'react'
import { Card, ButtonGroup, Button, Popover, Menu, MenuDivider, MenuItem, Dialog, Classes, TextArea, Icon } from '@blueprintjs/core'
import MAP from '../../map'

interface TaskProps {
  panos: any[]
  setTaskFrom: (val: string) => void
}

export default function Task(props: TaskProps) {

  const { panos, setTaskFrom } = props

  const [inputDialogOpen, setInputDialogOpen] = useState(false)
  const [panoIds, setPanoIds] = useState('')

  const renderInputDialogView = () => {
    return (
      <Dialog
        title="New Task"
        icon="text-highlight"
        canEscapeKeyClose={false}
        canOutsideClickClose={false}
        isOpen={inputDialogOpen}
        onClose={() => {setInputDialogOpen(false)}}
      >
        <div className={Classes.DIALOG_BODY}>
          <TextArea
            className="w-full"
            style={{height: '8rem', resize: 'none'}}
            intent="primary"
            placeholder="Input pano id(s) here, multiple ids separated by commas"
            onChange={(value: any) => {setPanoIds(value.target.value)}}
            value={panoIds}
          />
        </div>
        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button minimal className="text-xs">How to get pano id(s)?</Button>
            <Button onClick={() => {setInputDialogOpen(false)}}>Cancel</Button>
            <Button intent="primary" onClick={() => {}}>Finish</Button>
          </div>
        </div>
      </Dialog>
    )
  }


  return (
    <>
      <div className="mb-4">
        <ButtonGroup>
          <Button
            icon="tick"
            disabled={panos.length === 0}
          >
            Select All
          </Button>
          <Popover 
            position="bottom"
            content={
              <Menu key="menu">
                <MenuDivider title="From" />
                <MenuItem 
                  icon="map" 
                  text="Map"
                  onClick={() => {
                    setTaskFrom('map')
                  }}
                />
                <MenuItem 
                  icon="text-highlight" 
                  text="Input" 
                  onClick={() => {
                    setTaskFrom('input')
                    setInputDialogOpen(true)
                  }}
                />
            </Menu>
            }
          >
            <Button
              icon="plus"
            >
              New Task
            </Button>
          </Popover>
          <Button
            icon="cog"
          >
            Setting
          </Button>
        </ButtonGroup>
        <ButtonGroup className="ml-4">
          <Button 
            icon="list"
            active
          />
          <Button 
            icon="grid-view"
          />
        </ButtonGroup>
        <Button
          minimal
          className="float-right text-xs"
        >
          What does task mean?
        </Button>
      </div>
      <div className="task-wrapper absolute bottom-0 w-full">
        {
          panos.map( (pano, index) => {

            const { id, lng, lat, Date, Rname } = pano
            return (
              <div className="pano-task py-3 border-b flex" key={index}>
                <div>
                  <img 
                    className="task-preview rounded-sm" 
                    src={`https://mapsv1.bdimg.com/?qt=pdata&sid=${id}&pos=0_0&z=1`} 
                  />
                </div>
                <div className="px-3 leading-snug" style={{width: 380}}>
                  <p className="text-xs">
                    PanoID: {id}
                  </p>
                  <p className="text-xs text-gray-500">
                    ShotIn: {Date} 
                    {
                      Rname 
                        ? <span className="ml-4">RoadName: {Rname}</span> 
                        : ''
                    }
                  </p>
                  <p className="text-xs text-gray-500">
                    Position: {lng + ',' + lat}
                  </p>
                </div>
                <div className="px-2 text-right self-center flex-grow">
                  <ButtonGroup minimal>
                    <Button 
                      icon="map-marker"
                      onClick={() => {
                        MAP.panToPoint({lng, lat})
                      }}
                    />
                    <Button
                      icon="trash"
                      intent="danger"
                    />
                  </ButtonGroup>
                </div>
              </div>
            )
          }).reverse()
        }
      </div>
      
      {renderInputDialogView()}

    </>
  )
}