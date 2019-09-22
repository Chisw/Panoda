import React, { useState } from 'react'
import { ButtonGroup, Button, Popover, Menu, MenuDivider, MenuItem, Classes, Divider } from '@blueprintjs/core'

import { EmptyPano } from '../EmptySkeleton'
import PanoBar from '../PanoBar'
import PanoCard from '../PanoCard'
import InputIdsDialog from '../overlays/InputIdsDialog'
import DeleteCheckedPanosAlert from '../overlays/DeleteCheckedPanosAlert'

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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const optionalPanoIds = panos.map( pano => pano.id )

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
              icon="small-plus"
              intent="success"
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
          <Button intent="primary" active style={{minWidth: 80}}>
            {checkedIds.length} / {panos.length}
          </Button>
          <Button
            icon="insert"
            intent="primary"
            disabled={checkedIds.length === 0}
          >
            Fetch
          </Button>
          <Popover minimal
            disabled={checkedIds.length === 0}
            position="bottom-right"
            content={
              <Button
                icon="trash"
                intent="danger"
                className={Classes.POPOVER_DISMISS}
                onClick={() => {
                  setDeleteDialogOpen(true)
                }}
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
        className={`pano-wrapper absolute bottom-0 w-full border-t pb-4 ${
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
      
      <InputIdsDialog 
        isOpen={inputDialogOpen}
        onClose={() => {
          setInputDialogOpen(false)
        }}
      />

      <DeleteCheckedPanosAlert 
        checkedIds={checkedIds}
        panos={panos}
        setPanos={setPanos}
        isOpen={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false)
        }}
      />

    </div>
  )
}