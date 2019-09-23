import React, { useState, useEffect } from 'react'
import { Dialog, ProgressBar, Tag, Callout, Button, Alert } from '@blueprintjs/core'
import TableGrid from '../TableGrid'

import { getPanoTileSrc, getBaseSize } from '../../data'

interface FetcherProps {
  fetchResList: any[]
  setFetchResList(list: any): void 
  checkedIds: string[]
  isOpen: boolean
  onClose(): void
}

export default function Fetcher(props: FetcherProps) {

  const { fetchResList, setFetchResList, checkedIds, isOpen, onClose } = props
  const [fetching, setFetching] = useState(true)
  const [tileIndex, setTileIndex] = useState(0)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [confirmAlertOpen, setConfirmAlertOpen] = useState(false)


  // init
  useEffect(() => {
    if ( isOpen ) {
      setTimeout(() => {
        fillTiles(checkedIds[currentIndex])
      }, 200)
    }
  }, [isOpen, currentIndex])

  // next pano
  useEffect(() => {
    if (currentIndex === checkedIds.length ) {
      setTimeout(() => {
        setFetching(false)  // show res
      }, 100)
    }
  }, [currentIndex])

  // generate pano
  const fillTiles = (id: string) => {

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
    if ( !pool ) return
    pool!.innerHTML = ''

    const canvas = document.getElementById('fetcher-canvas')
    const ctx = (canvas as any).getContext('2d')

    let handleTimes = 0;

    const _recursive = () => {

      setTileIndex(handleTimes)
      handleTimes++
      
      if ( tiles.length ) {
        const tile = tiles.shift()
        const { src, row, col } = tile

        const img: any = document.createElement('img')
        img.src = src
        img.setAttribute('row', row)
        img.setAttribute('col', col)
        img.setAttribute('crossOrigin', 'Anonymous')

        pool!.appendChild(img)

        img.onload = () => {
          setTimeout(() => {
            _recursive()
          }, 20)
        }
      } else {
        const imgs = pool.querySelectorAll('img')
        imgs.forEach(img => {
          const row = Number(img.getAttribute('row'));
          const col = Number(img.getAttribute('col'));
          ctx!.drawImage(img, 512 * col, 512 * row, 512, 512);
        })

        const base64 = (canvas! as any).toDataURL('image/jpeg', .92)
        const _fetchResList = Array.from(fetchResList)
        _fetchResList.push(base64)
        setFetchResList(_fetchResList)

        setTimeout(() => {
          pool!.innerHTML = ''
          if (currentIndex < checkedIds.length) {
            setCurrentIndex(currentIndex + 1)
          }
        }, 10)
      }
    }
    _recursive()

  }

  return (
    <>

      <Alert
        icon="error"
        intent="danger"
        isOpen={confirmAlertOpen}
        cancelButtonText="Cancel"
        onCancel={() => {
          setConfirmAlertOpen(false)
        }}
        confirmButtonText="Sure"
        onConfirm={() => {
          onClose()
          setTileIndex(0)
          setCurrentIndex(0)
          setFetching(true)
          setFetchResList([])
          setTimeout(() => {
            setConfirmAlertOpen(false)
          }, 500)
        }}
      >
        <div>
          <p>Are you sure to close?</p>
          <p className="text-gray-500 mt-2">When the Fetcher closed, the data fetched will be lost.</p>
        </div>
      </Alert>

      <Dialog
        title="Fetcher"
        canEscapeKeyClose={false}
        canOutsideClickClose={false}
        isOpen={isOpen}
        className="bg-white"
        style={{ width: 512 }}
        onClose={() => {
          setConfirmAlertOpen(true)
        }}
      >
        <div className="fetcher-container w-full">
          {
            fetching
              ? (
                <>
                  <div className="fetcher-canvas-container relative w-full overflow-hidden text-none">
                    <TableGrid />
                    <div
                      id="fetcher-pool"
                      className="relative z-10"
                      style={{ width: 512, height: 256 }}
                    />
                  </div>

                  <div className="px-8 py-4">
                    <p className="text-xs text-gray-600 font-mono mb-2 mt-4">
                      Current: {checkedIds[currentIndex]}
                      <span className="float-right">[{tileIndex}/32]</span>
                    </p>
                    <ProgressBar value={tileIndex / 32} intent="success" animate={fetching} />

                    <p className="text-xs text-gray-600 font-mono mb-2 mt-4">
                      Total:
                      <span className="float-right">[{currentIndex}/{checkedIds.length}]</span>
                    </p>
                    <ProgressBar value={(currentIndex) / checkedIds.length} intent="success" animate={fetching} />
                  </div>
                </>
              )
              : (
                <div className="p-4 pb-0 font-mono">
                  <Callout
                    icon="tick"
                    intent="success"
                    title="Fetching completed!"
                    className="mb-4"
                  >
                    <div className="text-right">
                      <Button
                        icon="download"
                        intent="success"
                      >
                        Download All
                      </Button>
                    </div>
                  </Callout>
                  {
                    checkedIds.map( (id, index) => {
                      return (
                        <div className="my-1 p-2 rounded flex hover:bg-gray-100" key={index}>
                          <div>
                            {id}
                          </div>
                          <div className="flex-grow text-right">
                            <span className="mr-4 text-gray-500">
                              {getBaseSize(fetchResList[index])}
                            </span>
                            <Tag 
                              minimal
                              interactive
                              intent="success"
                              onClick={() => {

                              }}
                            >
                              Download
                            </Tag>
                          </div>
                        </div>
                      )
                    })
                  }
                </div>
              )
          }
          <canvas id="fetcher-canvas" width="4096" height="2048" className="hidden"></canvas>
        </div>
      </Dialog>

    </>
  )
}