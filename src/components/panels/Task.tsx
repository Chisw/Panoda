import React, { useState } from 'react'
import { Card, ButtonGroup, Button, Popover, Menu, MenuDivider, MenuItem, Dialog, Classes, TextArea } from '@blueprintjs/core'

interface TaskProps {
  setTaskFrom: (val: string) => void
}

export default function Task(props: TaskProps) {

  const { setTaskFrom } = props

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