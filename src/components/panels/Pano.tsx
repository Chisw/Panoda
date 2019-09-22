import React, { useState } from 'react'
import { ButtonGroup, Button, Popover, Menu, MenuDivider, MenuItem, Dialog, Classes, TextArea, Divider } from '@blueprintjs/core'
import { EmptyPano } from '../EmptySkeleton'
import PanoBar from '../PanoBar'
import PanoCard from '../PanoCard'

import { IPano } from '../../type'

interface PanoProps {
  panoView: string
  setPanoView(view: string): void
  panos: IPano[]
  setPanos(panos: IPano[] | []): void
  setPanoFrom: (val: string) => void
  checkedIds: string[]
  setCheckedIds(list: any): void
}

export default function Pano(props: PanoProps) {

  const { 
    panoView,
    setPanoView,
    panos, 
    setPanos, 
    setPanoFrom, 
    checkedIds, 
    setCheckedIds 
  } = props

  const [inputDialogOpen, setInputDialogOpen] = useState(false)
  const [inputIds, setInputIds] = useState('')

  const optionalPanoIds = panos.map( pano => pano.id )

  const renderInputDialogView = () => {
    return (
      <Dialog
        title="New Pano"
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
            onChange={(value: any) => {setInputIds(value.target.value)}}
            value={inputIds}
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
    <div>
      <div className="mb-4">
        <ButtonGroup>
          <Popover 
            position="bottom-left"
            content={
              <Menu key="menu">
                <MenuDivider title="From" />
                <Divider />
                <MenuItem 
                  icon="map" 
                  text="Map"
                  onClick={() => {
                    setPanoFrom('map')
                  }}
                />
                <MenuItem 
                  icon="text-highlight" 
                  text="Input" 
                  onClick={() => {
                    setPanoFrom('input')
                    setInputDialogOpen(true)
                  }}
                />
            </Menu>
            }
          >
            <Button
              icon="plus"
            >
              New Pano
            </Button>
          </Popover>
        </ButtonGroup>
        <ButtonGroup className="ml-4">
          <Button 
            icon="list"
            active={panoView === 'list'}
            onClick={() => { setPanoView('list') }}
          />
          <Button 
            icon="grid-view"
            active={panoView === 'grid'}
            onClick={() => { setPanoView('grid') }}
          />
        </ButtonGroup>

        <ButtonGroup className="float-right">
          <Button
            icon="small-tick"
            intent="primary"
            disabled={panos.length === 0}
            onClick={() => {
              setCheckedIds(
                checkedIds.length < optionalPanoIds.length
                  ? optionalPanoIds
                  : []
              )
            }}
          />
          <Button className="w-16" intent="primary" active>
            ({checkedIds.length}/{panos.length})
          </Button>
          <Button
            icon="insert"
            intent="primary"
            disabled={checkedIds.length === 0}
          >
            Fetch
          </Button>
          <Popover minimal
            position="bottom-right"
            content={
              <Button
                icon="trash"
                intent="danger"
              >
                Delete
              </Button>
            }
          >
            <Button 
              icon="caret-down" 
              intent="primary" 
              disabled={checkedIds.length === 0}
            />
          </Popover>
        </ButtonGroup>
      </div>
      <div 
        className={`pano-wrapper absolute bottom-0 w-full border-t ${
          panoView === 'grid'
            ? `flex flex-wrap content-start`
            : ''
        }`}
      >
        {panos.length === 0 && (<EmptyPano />)}
        {
          panos.map( (pano, index) => {
            return panoView === 'list'
              ? (
                <PanoBar
                  key={index}
                  index={index}
                  pano={pano}
                  panos={panos}
                  setPanos={setPanos}
                  checkedIds={checkedIds}
                  setCheckedIds={setCheckedIds}
                />
              )
              : (
                <PanoCard
                  key={index}
                  index={index}
                  pano={pano}
                  panos={panos}
                  setPanos={setPanos}
                  checkedIds={checkedIds}
                  setCheckedIds={setCheckedIds}
                />
              )
          })
        }
      </div>
      
      {renderInputDialogView()}

    </div>
  )
}