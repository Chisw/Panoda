import React, { useState, useEffect } from 'react'
import { Dialog, ProgressBar, Tag, Callout, Button, Alert } from '@blueprintjs/core'
import FileSaver from 'file-saver'
import JSZip from 'jszip'
import TableGrid from '../TableGrid'

import { getPanoTileSrc, getBaseSize, getExifedBase64, getDateStamp, fillWatermark } from '../../ts/util'
import { IPano } from '../../ts/type'
import store from '../../ts/store'
import TOAST from './EasyToast'

interface FetcherProps {
  panos: IPano[] | []
  fetchResList: any[]
  setFetchResList(list: any): void 
  checkedIds: string[]
  isOpen: boolean
  onClose(): void
}

export default function Fetcher(props: FetcherProps) {

  const { panos, fetchResList, setFetchResList, checkedIds, isOpen, onClose } = props

  const [fetching, setFetching] = useState(false)
  const [error, setError] = useState(false)
  const [tileIndex, setTileIndex] = useState(0)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [confirmAlertOpen, setConfirmAlertOpen] = useState(false)

  // init
  useEffect(() => {
    if ( isOpen ) {
      setTimeout(() => {
        setFetching(true)
        fillTiles(checkedIds[currentIndex])
      }, 1)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, currentIndex])  // next pano

  // show res
  useEffect(() => {
    if (currentIndex === checkedIds.length ) {
      setTimeout(() => {
        setFetching(false)  
      }, 20)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

    const _recursion = () => {
      
      setTileIndex(handleTimes)
      handleTimes++
      
      if (tiles.length) {  // filling
        const tile = tiles.shift()
        const { src, row, col } = tile

        const img: any = document.createElement('img')
        img.src = src
        img.setAttribute('row', row)
        img.setAttribute('col', col)
        img.setAttribute('crossOrigin', 'Anonymous')

        pool!.appendChild(img)

        img.onload = () => {
          _recursion()
        }

        img.onerror = () => {
          setFetching(false)
          setError(true)
          TOAST.danger('Something wrong, please check network and fetch again', 0)
        }
      } else {  // filled
        const imgs = pool.querySelectorAll('img')
        imgs.forEach(img => {
          const row = Number(img.getAttribute('row'));
          const col = Number(img.getAttribute('col'));
          ctx!.drawImage(img, 512 * col, 512 * row, 512, 512);
        })

        const pano = panos.find( pano => pano.id === id )

        fillWatermark(ctx, pano!)

        const base64 = (canvas! as any).toDataURL(
          'image/jpeg',
          +store.get('PANO_SETTING_IMAGEQUALITY')
        )
        const _fetchResList = [...fetchResList]
        _fetchResList.push(
          store.get('PANO_SETTING_INSERTEXIF')
            ? getExifedBase64(base64, pano!)
            : base64
        )
        setFetchResList(_fetchResList)

        setTimeout(() => {
          pool!.innerHTML = ''
          if (currentIndex < checkedIds.length) {
            setCurrentIndex(currentIndex + 1)
          }
        }, 10)
      }
    }
    _recursion()
  }

  const handleClose = () => {
    setTileIndex(0)
    setCurrentIndex(0)
    setFetching(false)
    setError(false)
    setFetchResList([])
    onClose()
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
          handleClose()
          setTimeout(() => {
            setConfirmAlertOpen(false)
          }, 100)
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
          if ( fetching && !error ) {
            TOAST.primary('The program is running..')
          } else {
            if ( store.get('PANO_SETTING_USEALERT')) {
              setConfirmAlertOpen(true)
            } else {
              handleClose()
            }
          }
        }}
      >
        <div className="fetcher-container w-full">
          {
            fetching && ( fetchResList.length !== checkedIds.length )
              ? (  // process
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
              : (  // result
                <div className="p-4 pb-0 font-mono">
                  <Callout
                    icon="tick"
                    intent="success"
                    title="Fetching completed!"
                    className="mb-4"
                  >
                    <div className="text-right">
                      <Button
                        icon="compressed"
                        intent="success"
                        onClick={() => {
                          const name = 'Panoda_' + getDateStamp()
                          const zip = new JSZip()
                          const currDate = new Date()
                          const dateWithOffset = new Date(currDate.getTime() - currDate.getTimezoneOffset() * 60000)
                          const panodaFolder = zip.folder(name)

                          fetchResList.forEach( (res, index) => {
                            panodaFolder
                              .file(
                                `PANODA_${checkedIds[index]}.jpg`, 
                                res.replace('data:image/jpeg;base64,', ''), 
                                { base64: true, date: dateWithOffset })
                          })

                          zip
                            .generateAsync({ type: 'blob' })
                            .then(function (content) {
                              saveAs(content, name + '.zip');
                            });
                        }}
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
                                FileSaver.saveAs(fetchResList[index], `PANODA_${id}.jpg`)
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