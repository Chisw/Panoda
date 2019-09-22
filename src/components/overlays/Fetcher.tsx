import React, { useState, useEffect } from 'react'
import { Dialog, ProgressBar } from '@blueprintjs/core'
import TableGrid from '../TableGrid'

import { getPanoTileSrc } from '../../data'

interface FetcherProps {
  checkedIds: string[]
  isOpen: boolean
  onClose(): void
}

export default function Fetcher(props: FetcherProps) {

  const { checkedIds, isOpen, onClose } = props
  const [fetching, setFetching] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [totalIndex, setTotalIndex] = useState(0)

  useEffect(() => {
    if ( isOpen ) {
      setTimeout(() => {

        fillTile(checkedIds[0])

      }, 1000)
    }
  }, [isOpen])

  const fillTile = (id: string) => {

    if ( !id ) return

    let tiles: any = []
    for (let row = 0, rows = 4; row < rows; row++) {
      for (let col = 0, cols = 8; col < cols; col++) {
        tiles.push({
          src: getPanoTileSrc(id, row, col),
          row,
          col
        });
      }
    }

    const pool = document.getElementById('fetcher-pool')
    console.log(pool)
    if ( !pool ) return
    pool!.innerHTML = ''

    let handleTimes = 0;

    const _recursive = () => {

      setCurrentIndex(handleTimes)
      handleTimes++
      
      if ( tiles.length ) {
        const tile = tiles.shift()
        const { src, row, col } = tile

        const img: any = document.createElement('img')
        img.src = src
        img.row = row
        img.col = col

        pool!.appendChild(img)

        img.onload = () => {
          setTimeout(() => {
            _recursive()
          }, 100)
        }
      } else {

      }
    }
    _recursive()
  }

  return (
    <Dialog
      title="Fetcher"
      isOpen={isOpen}
      className="bg-white"
      style={{ width: 512 }}
      onClose={() => {
        onClose()
        setCurrentIndex(0)
      }}
    >
      <div className="fetcher-container w-full">

        <div 
          className="fetcher-canvas-container relative w-full overflow-hidden text-none"
        >
          {/* <canvas 
            id="fetcher-canvas"
            className="absolute top-0 left-0"
            width="4096" 
            height="2048"
          >
          </canvas> */}
          <TableGrid />
          <div 
            id="fetcher-pool"
            className="relative z-10"
            style={{width: 512, height: 256}}
          />
        </div>

        <div className="px-8 py-4">
          <p className="text-xs text-gray-600 font-mono mb-2 mt-4">
            Current: {'09000100121706071442595086S'}
            <span className="float-right">[{currentIndex}/32]</span>
          </p>
          <ProgressBar value={currentIndex / 32} intent="success" animate={fetching} />
          
          <p className="text-xs text-gray-600 font-mono mb-2 mt-4">
            Total:
            <span className="float-right">[{totalIndex}/{checkedIds.length}]</span>
          </p>
          <ProgressBar value={totalIndex / checkedIds.length} intent="success" animate={fetching} />
        </div>

      </div>
    </Dialog>
  )
}