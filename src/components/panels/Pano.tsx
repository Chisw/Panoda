import React, { useState } from 'react'
import { ButtonGroup, Button, Popover, Menu, MenuDivider, MenuItem, Classes, Divider } from '@blueprintjs/core'

import { EmptyPano } from '../EmptySkeleton'
import PanoBar from './PanoBar'
import PanoCard from './PanoCard'
import InputIdsDialog from '../overlays/InputIdsDialog'
import DeleteCheckedPanosAlert from '../overlays/DeleteCheckedPanosAlert'
import Fetcher from '../overlays/Fetcher'

import { IPano } from '../../ts/type'

interface PanoProps {
  panoView: string
  setPanoView(view: string): void
  panos: IPano[]
  setPanos(panos: IPano[] | []): void
  setPanoFrom: (val: string) => void
  checkedIds: string[]
  setCheckedIds(list: any): void
  setLoading(loading: boolean): void
}

export default function Pano(props: PanoProps) {

  const { 
    panoView,
    setPanoView,
    panos, 
    setPanos, 
    setPanoFrom, 
    checkedIds, 
    setCheckedIds,
    setLoading,
  } = props

  const [inputDialogOpen, setInputDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [fetcherDialogOpen, setFetcherDialogOpen] = useState(false)
  const [fetchResList, setFetchResList] = useState([])

  const optionalPanoIds = panos.map( pano => pano.id )

  return (
    <div className="pano-top-bar">
      <div className="mt-2">

        <ButtonGroup>
          <Button
            icon="small-tick"
            disabled={panos.length === 0}
            onClick={() => {
              setCheckedIds(
                checkedIds.length < optionalPanoIds.length
                  ? optionalPanoIds
                  : []
              )
            }}
          />
          <Button active style={{minWidth: 80 }} className="text-xs font-mono">
            {checkedIds.length}/{panos.length}
          </Button>
          <Popover
            position="bottom"
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
            >
              New Pano
            </Button>
          </Popover>
        </ButtonGroup>

        <ButtonGroup className="mx-4">
          <Button
            icon="play"
            intent="primary"
            disabled={checkedIds.length === 0}
            onClick={() => {
              setFetcherDialogOpen(true)
              setPanoFrom('')
            }}
          >
            Fetch
          </Button>
          <Popover minimal
            disabled={checkedIds.length === 0}
            position="right"
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
              icon="more"
              intent="primary"
              disabled={checkedIds.length === 0}
            />
          </Popover>
        </ButtonGroup>

        {/* view switch */}
        <ButtonGroup className="float-right">
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
      </div>{/* .pano-top-bar */}

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
      
      <InputIdsDialog 
        isOpen={inputDialogOpen}
        onClose={() => {
          setInputDialogOpen(false)
        }}
        setLoading={setLoading}
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

      <Fetcher
        panos={panos}
        checkedIds={checkedIds}
        fetchResList={fetchResList}
        setFetchResList={setFetchResList}
        isOpen={fetcherDialogOpen}
        onClose={() => {
          setFetcherDialogOpen(false)
        }}
      />

    </div>
  )
}