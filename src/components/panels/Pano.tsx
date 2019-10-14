import React, { useState, useEffect } from 'react'
import { ButtonGroup, Button, Popover, Menu, MenuDivider, MenuItem, Classes, Divider, Tooltip } from '@blueprintjs/core'

import { EmptyPano } from '../EmptySkeleton'
import PanoBar from './PanoBar'
import PanoCard from './PanoCard'
import InputIdsDialog from '../overlays/InputIdsDialog'
import DeleteCheckedPanosAlert from '../overlays/DeleteCheckedPanosAlert'
import Fetcher from '../overlays/Fetcher'

import { IPano } from '../../ts/type'
import MAP from '../../ts/map'
import TOAST from '../overlays/EasyToast'

interface PanoProps {
  panoView: string
  setPanoView(view: string): void
  panos: IPano[]
  setPanos(panos: IPano[] | []): void
  setPanoFrom: (val: string) => void
  checkedIds: string[]
  setCheckedIds(list: any): void
  setTabId(id: string): void
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
    setTabId,
  } = props

  const [inputDialogOpen, setInputDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [fetcherDialogOpen, setFetcherDialogOpen] = useState(false)
  const [fetchResList, setFetchResList] = useState([])
  const [shift1, setShift1] = useState(-1)
  const [shift2, setShift2] = useState(-1)

  useEffect(() => {
    if (shift2 !== -1) {
      const start = Math.min(shift1, shift2)
      const end = Math.max(shift1, shift2)
      setCheckedIds(
        panos
          .filter((pano, index) => start <= index && index <= end)
          .map( pano => pano.id )
      )
      setShift1(-1)
      setShift2(-1)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shift1, shift2])

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
          <Tooltip content="Sort by id">
            <Button
              icon="sort-numerical"
              disabled={panos.length <= 1}
              onClick={() => {
                const _panos = [...panos]
                setPanos(_panos.sort((a, b) => a.id > b.id ? 1 : -1))
                TOAST.success('Sorted')
              }}
            />
          </Tooltip>
          <Popover
            position="bottom"
            content={
              <Menu key="menu">
                <MenuDivider title="From" />
                <Divider />
                <MenuItem
                  icon="map-create"
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
              setPanoFrom('')
              setFetcherDialogOpen(true)
              MAP.parent.fetcherRunning = true
            }}
          >
            Fetch
          </Button>
          <Popover
            disabled={checkedIds.length === 0}
            position="bottom"
            content={
              <div className="p-1">
                <Button
                  fill
                  icon="map-marker"
                  className={Classes.POPOVER_DISMISS + ' mb-1'}
                  onClick={() => {
                    MAP.markPoints(
                      panos.filter( pano => checkedIds.includes(pano.id))
                    )
                  }}
                >
                  Mark
                </Button>
                <Button
                  fill
                  icon="trash"
                  intent="danger"
                  className={Classes.POPOVER_DISMISS}
                  onClick={() => {
                    setDeleteDialogOpen(true)
                  }}
                >
                  Delete
                </Button>
              </div>
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
                  shift1={shift1}
                  shift2={shift2}
                  setShift1={setShift1}
                  setShift2={setShift2}
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
                  shift1={shift1}
                  shift2={shift2}
                  setShift1={setShift1}
                  setShift2={setShift2}
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
        setTabId={setTabId}
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