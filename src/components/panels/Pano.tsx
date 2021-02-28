import React, { useState, useEffect } from 'react'
import { ButtonGroup, Button, Popover, Menu, MenuDivider, MenuItem, Divider } from '@blueprintjs/core'
import { EmptyPano } from '../EmptySkeleton'
import PanoBar from './PanoBar'
import PanoCard from './PanoCard'
import InputIdsDialog from '../overlays/InputIdsDialog'
import DeleteCheckedPanosAlert from '../overlays/DeleteCheckedPanosAlert'
import Fetcher from '../overlays/Fetcher'
import { IPano } from '../../ts/type'
import MAP from '../../ts/map'
import TOAST from '../overlays/EasyToast'
import { copyStr } from '../../ts/util'

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
          <Button
            icon="sort-numerical"
            className="px-4"
            disabled={panos.length === 0}
            onClick={() => {
              if (panos.length <= 1) return
              const _panos = [...panos]
              setPanos(_panos.sort((a, b) => a.id > b.id ? 1 : -1))
              TOAST.success('Sorted')
            }}
          />
          <Button active style={{ minWidth: 80, background: '#fff' }} className="text-xs">
            {checkedIds.length} / {panos.length}
          </Button>
          <Popover
            position="bottom"
            content={
              <Menu key="menu">
                <MenuDivider title="From" />
                <Divider />
                <MenuItem
                  icon="map-create"
                  text="Map"
                  onClick={() => setPanoFrom('map')}
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
            <Button icon="plus">
              Import
            </Button>
          </Popover>
        </ButtonGroup>

        <ButtonGroup className="mx-4">
          <Button
            icon="play"
            intent="success"
            disabled={checkedIds.length === 0}
            onClick={() => {
              setPanoFrom('')
              setFetcherDialogOpen(true)
              MAP.parent.fetcherRunning = true
            }}
          >
            Fetch
          </Button>
          <Button
            icon="duplicate"
            className="px-4"
            disabled={checkedIds.length === 0}
            onClick={() => {
              copyStr(checkedIds.join(','))
              TOAST.success('Copy successfully')
            }}
          />
          <Button
            icon="map-marker"
            className="px-4"
            disabled={checkedIds.length === 0}
            onClick={() => {
              MAP.markPoints(
                panos.filter(pano => checkedIds.includes(pano.id))
              )
            }}
          />
          <Button
            icon="trash"
            className="px-4"
            disabled={checkedIds.length === 0}
            intent="danger"
            onClick={() => setDeleteDialogOpen(true)}
          />
        </ButtonGroup>

        <ButtonGroup className="float-right">
          <Button
            icon="list"
            active={panoView === 'list'}
            onClick={() => setPanoView('list')}
          />
          <Button
            icon="grid-view"
            active={panoView === 'grid'}
            onClick={() => setPanoView('grid')}
          />
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
        {panos.map( (pano, index) => {
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
        })}
      </div>
      
      <InputIdsDialog 
        isOpen={inputDialogOpen}
        onClose={() => setInputDialogOpen(false)}
        setTabId={setTabId}
      />

      <DeleteCheckedPanosAlert 
        checkedIds={checkedIds}
        panos={panos}
        setPanos={setPanos}
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      />

      <Fetcher
        panos={panos}
        checkedIds={checkedIds}
        fetchResList={fetchResList}
        setFetchResList={setFetchResList}
        isOpen={fetcherDialogOpen}
        onClose={() => setFetcherDialogOpen(false)}
      />

    </div>
  )
}