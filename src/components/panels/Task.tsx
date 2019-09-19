import React, { useState } from 'react'
import { Card, ButtonGroup, Button, Popover, Menu, MenuDivider, MenuItem, Dialog, Classes, TextArea } from '@blueprintjs/core'

export default function Task() {

  const [dialogOpen, setDialogOpen] = useState(false)
  const [panoIds, setPanoIds] = useState('')

  const renderInputDialogView = () => {
    return (
      <Dialog
        title="New Task"
        className={''}
        icon="text-highlight"
        canEscapeKeyClose={false}
        canOutsideClickClose={false}
        isOpen={dialogOpen}
        onClose={() => {setDialogOpen(false)}}
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
            <Button onClick={() => {setDialogOpen(false)}}>Cancel</Button>
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
                    console.log('map')
                  }}
                />
                <MenuItem 
                  icon="text-highlight" 
                  text="Input" 
                  onClick={() => {
                    setDialogOpen(true)
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
        <Button
            minimal
            className="float-right text-xs"
          >
            What does task mean?
          </Button>
      </div>
      <Card>
        a
      </Card>
      <Button intent="primary">
          Fetch
      </Button>

      {renderInputDialogView()}

    </>
  )
}