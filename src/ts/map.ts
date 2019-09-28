import SVG_PIN from '../images/pin.svg'
import SVG_RECT from '../images/rect.svg'

import { PANO_ID_REG, /*CUSTOM_MAP*/ } from './constant'
import { IPano, IPoint } from './type'
import { getDateStamp } from "./util"
import TOAST from "../components/overlays/EasyToast"

const G = window as any
const BMap = G.BMap
const PANO_COVER = new BMap.PanoramaCoverageLayer()
const PANO_SERVER = new BMap.PanoramaService()

let map: any

interface MAPState {
  parent: any
  init(): void
  clear(): void
  listen(selectWith: string): void
  unlisten(): void
  locate(): void
  getPinMarker(point: { lng: number, lat: number }): any
  getRectMarker(point: { lng: number, lat: number }): any
  getPanoIdByClicking(point: any, cb?: () => void): void
  getPanoramaByPoint(point: any, cb: (data: any) => void): void
  getPanoInfoByIdAndAppendDom(
    id: string,
    success?: (data: any) => void,
    failed?: (id?: string) => void,  // no id if repeat
  ): void
  panToPoint(point: {lng: number, lat: number}): void
  panoCover: {
    show: () => void
    hide: () => void
  },
  scanIdsByPoints(
    points: IPoint[],
    success: (data: any, index: number) => void,
    fail: (index: number) => void,
    end: () => void
  ): void
  markPoints(points: IPoint[]): void
  setAreaSelector(event: any): void
}

const MAP: MAPState = {
  parent: {
    scannerRunning: false,
    fetcherRunning: false,
  },
  init() {
    map = new BMap.Map('map', {enableMapClick: false})
    
    map.centerAndZoom(new BMap.Point(119.48, 32.79), 13)
    map.enableScrollWheelZoom(true)
    map.setMinZoom(5)

    const navigationControl = new BMap.NavigationControl({
      anchor: G.BMAP_ANCHOR_TOP_LEFT,
      type: G.BMAP_NAVIGATION_CONTROL_LARGE,
    })
    map.addControl(navigationControl)

    map.addEventListener('tilesloaded', () => {
      const lv = map.getZoom()
      MAP.parent.setZoomLevel(lv)
    })

    // map.setMapStyleV2({styleJson: CUSTOM_MAP})
  },

  clear() {
    map.clearOverlays();
  },

  listen(selectWith) {
    MAP.panoCover.show()
    map.clearOverlays()
    map.removeEventListener('click', MAP.getPanoIdByClicking)
    map.removeEventListener('click', MAP.setAreaSelector)

    if (selectWith === 'point') {
      map.addEventListener('click', MAP.getPanoIdByClicking)
    } else if (selectWith === 'area' ){
      map.addEventListener('click', MAP.setAreaSelector)
    }
  },

  unlisten() {
    MAP.panoCover.hide()
    map.clearOverlays();
    map.removeEventListener('click', MAP.getPanoIdByClicking)
    map.removeEventListener('click', MAP.setAreaSelector)
  },

  locate() {
    MAP.parent.setLoading(true)
    var geolocation = new BMap.Geolocation();
    geolocation.getCurrentPosition(
      (res: any) => {
        MAP.parent.setLoading(false)
        if (geolocation.getStatus() === 0) {
          map.panTo(res.point);
          TOAST.success('Locate successfully')
        } else {
          TOAST.danger('Locate failed, try later..')
        }
      },
      {
        enableHighAccuracy: true
      }
    )
  },

  getPinMarker(point) {
    const size = { width: 18, height: 24 }
    return new BMap.Marker(point, {
      offset: {
        width: 0,
        height: - size.height / 2
      },
      icon: new BMap.Icon(
        SVG_PIN,
        size,
        { imageSize: size }
      )
    });
  },

  getRectMarker(point) {
    const size = { width: 200, height: 200 }
    return new BMap.Marker(point, {
      draggingCursor: 'move',
      icon: new BMap.Icon(
        SVG_RECT,
        size,
        { imageSize: size }
      )
    });
  },
  
  getPanoIdByClicking(event: any) {
    const { point: { lng, lat } } = event

    MAP.parent.setLoading(true)
    PANO_SERVER.getPanoramaByLocation(new BMap.Point(lng, lat), (data: any) => {
      map.clearOverlays()
      if (data !== null) {
        MAP.getPanoInfoByIdAndAppendDom(
          data.id,
          (data) => {
            const { position: { lng, lat } } = data
            const p = new BMap.Point(lng, lat)
            map.panTo(p)
            map.addOverlay(MAP.getPinMarker(p))

            MAP.parent.setLoading(false)
            TOAST.success(`Get pano successfully`)
          },
          (id) => {
            if ( id ) {
              TOAST.warning(`Get pano ${id} info failed`)
            }
            MAP.parent.setLoading(false)
          }
        )
      } else {
        MAP.parent.setLoading(false)
        TOAST.danger('No point matched, try again')
      }
    });
  },

  getPanoramaByPoint(point, cb) {
    const { lng, lat } = point
    PANO_SERVER.getPanoramaByLocation(new BMap.Point(lng, lat), (data: any) => {
      cb(data)
    });
  },

  getPanoInfoByIdAndAppendDom(id, success, failed) {

    if ( !id || !PANO_ID_REG.test(id) ) {
      TOAST.danger(`Invalid pano id ${id}`)
      return
    }

    const { panos, setPanos } = MAP.parent

    if ( panos.map( (pano: IPano) => pano.id).includes(id) ) {
      TOAST.warning(`Pano ${id} already exist`)
      failed && failed()
    } else {
      PANO_SERVER.getPanoramaById(id, (data: any) => {

        if (data !== null) {
          const {
            id,
            position: {
              lng,
              lat
            },
            copyright: {
              photoDate,
              roadName
            }
          } = data

          panos.unshift({ id, lng, lat, date: getDateStamp(photoDate), rname: roadName || '无道路信息' })
          const _panos = [...panos]
          setPanos(_panos)

          success && success(data)
        } else {
          failed && failed(id)
        }
      })
    }
  },

  panToPoint(point) {
    const { lng, lat } = point
    const p = new BMap.Point(lng, lat)
    map.panTo(p)
    map.clearOverlays()
    map.addOverlay(MAP.getPinMarker(p))
  },

  panoCover: {
    show() {
      map.addTileLayer(PANO_COVER)
    },
    hide() {
      map.removeTileLayer(PANO_COVER)
    }
  },

  scanIdsByPoints(points, success, fail, end) {
    let index = 0
    const _recursion = () => {
      if (!MAP.parent.scannerRunning) return
      setTimeout(() => {
        if (index < points.length) {
          MAP.getPanoramaByPoint(points[index], (data: any) => {
            const no = index + 1
            data !== null ? success(data, no) : fail(no)
            index++
            _recursion()
          })
        } else {
          end()
        }
      }, 20)
    }
    _recursion()
  },

  markPoints(points: IPoint[]) {
    map.clearOverlays()
    points.forEach( point => {
      const { lng, lat } = point
      const p = new BMap.Point(lng, lat)
      const marker = MAP.getPinMarker(p)
      map.addOverlay(marker)
    })
  },

  setAreaSelector(event: any) {
    map.clearOverlays()

    MAP.parent.setAreaCenter(event.point)

    const marker = MAP.getRectMarker(event.point)
    map.addOverlay(marker)
    marker.enableDragging()

    marker.addEventListener('dragend', (event: any) => {
      MAP.parent.setAreaCenter(event.point)
    })

  },
}

export default MAP