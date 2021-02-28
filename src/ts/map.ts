import SVG_PIN from '../images/pin.svg'
import SVG_RECT from '../images/rect.svg'
import { PANO_ID_REG } from './constant'
import { IPano, IPoint } from './type'
import { getDateStamp } from "./util"
import TOAST from "../components/overlays/EasyToast"
import store from './store'
import { DateTime } from 'luxon'

const G = window as any
const BMap = G.BMap
const PANO_COVER = new BMap.PanoramaCoverageLayer()
const PANO_SERVER = new BMap.PanoramaService()

let map: any
interface IMAP {
  parent: any
  init(): void
  clear(): void
  listen(selectWith: string): void
  unlisten(): void
  locate(): void
  getCenter(): string
  panTo(point: { lng: number, lat: number }): void
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
  importPanosByIdList(list: string[], end?: () => void): void
  importSelfExcludePanosByIdList(list: string[], end?: () => void): void
  markPoints(points: IPoint[]): void
  setAreaSelector(event: any): void
}

const MAP: IMAP = {
  parent: {
    scannerRunning: false,
    fetcherRunning: false,
  },
  init() {
    const storePoint = store.get('PANO_SETTING_CENTERPOINT') || ''
    const { lng, lat } = storePoint ? JSON.parse(storePoint) : { lng: 119.52, lat: 32.79}
    
    map = new BMap.Map('map', {enableMapClick: false})
    
    map.centerAndZoom(new BMap.Point(lng, lat), 13)
    map.enableScrollWheelZoom(true)
    map.setMinZoom(5)

    const navigationControl = new BMap.NavigationControl({
      anchor: G.BMAP_ANCHOR_TOP_LEFT,
      type: G.BMAP_NAVIGATION_CONTROL_LARGE,
    })
    map.addControl(navigationControl)

    map.addControl(new BMap.CityListControl({
      anchor: 1,
      offset: new BMap.Size(10, 10),
    }))

    map.addEventListener('tilesloaded', () => {
      const lv = map.getZoom()
      MAP.parent.setZoomLevel(lv)
    })
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

  getCenter() {
    return map.getCenter()
  },

  panTo(point) {
    const { lng, lat } = point
    map.panTo(new BMap.Point(lng, lat))
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
    })
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
          data => {
            const { position: { lng, lat } } = data
            const p = new BMap.Point(lng, lat)
            const marker = MAP.getPinMarker(p)
            map.panTo(p)
            map.addOverlay(marker)

            if (data.roads) {
              let list: any[] = []
              Object.values(data.roads).forEach((road: any) => {
                list = list.concat(road.map((node: any) => node.id))
              })
              list = list.filter(id => id !== data.id)
              MAP.parent.setSameRoadPanos(list)
            }

            MAP.parent.setLoading(false)
            TOAST.success(`Get pano successfully`)
          },
          id => {
            id && TOAST.warning(`Get pano ${id} info failed`)
            MAP.parent.setLoading(false)
          }
        )
      } else {
        MAP.parent.setLoading(false)
        MAP.parent.setSameRoadPanos([])
        TOAST.danger('No point matched, try again')
      }
    })
  },

  getPanoramaByPoint(point, cb) {
    const { lng, lat } = point
    PANO_SERVER.getPanoramaByLocation(new BMap.Point(lng, lat), (data: any) => {
      cb(data)
    })
  },

  getPanoInfoByIdAndAppendDom(id, success, failed) {

    if ( !id || !PANO_ID_REG.test(id) ) {
      TOAST.danger(`Invalid pano id ${id}`)
      return
    }

    const { panos, setPanos } = MAP.parent

    if (panos.map((pano: IPano) => pano.id).includes(id)) {
      TOAST.warning(`Pano ${id} already existed`)
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

          const start = store.get('PANO_SETTING_STARTDATE')
          const startDate = start ? new Date(start) : null
          const startDateStr = startDate ? DateTime.fromJSDate(startDate).toFormat('yyyy/MM/dd') : ''

          const end = store.get('PANO_SETTING_ENDDATE')
          const endDate = end ? new Date(end) : null
          const endDateStr = endDate ? DateTime.fromJSDate(endDate).toFormat('yyyy/MM/dd') : ''
          
          const current = DateTime.fromFormat(photoDate, 'yyyyMMdd')
          const currentDate = current.toJSDate()
          const currentDateStr = current.toFormat('yyyy/MM/dd')

          if (startDate && (currentDate < startDate)) {
            TOAST.warning(`Import pano ${id} failed, the date [${currentDateStr}] is earlier than StartDate[${startDateStr}] set in DateRangeLimit.`)
          } else if (endDate && (currentDate > endDate)) {
            TOAST.warning(`Import pano ${id} failed, the date [${currentDateStr}] is later than EndDate[${endDateStr}] set in DateRangeLimit.`)
          } else {
            panos.unshift({ id, lng, lat, date: getDateStamp(photoDate), rname: roadName || 'Unnamed Road' })
            setPanos([...panos])
          }

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
    if ( map.getZoom() < 16 ) {
      map.centerAndZoom(p, 16)
    } else {
      map.panTo(p)
    }
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

  importPanosByIdList(list, end) {
    MAP.parent.setLoading(true)
    const _recursion = () => {
      if (list.length) {
        setTimeout(() => {
          MAP.getPanoInfoByIdAndAppendDom(
            list.shift() || '',
            _recursion,
            id => {
              if (id) TOAST.warning(`Get ${id} info failed`)
              _recursion()
            }
          )
        }, 10)
      } else {
        MAP.parent.setLoading(false)
        TOAST.success('Importing finished')
        end && end()
      }
    }
    _recursion()
  },

  importSelfExcludePanosByIdList(list, end) {
    MAP.parent.setLoading(true)
    let historyIds: string[] = []
    const _recursion = () => {
      if (list.length) {
        setTimeout(() => {
          fetch(`https://mapsv0.bdimg.com/?qt=sdata&sid=${ list.shift() || ''}`)
            .then((response) => response.json())
            .then((res) => {
              const data = ( res ? res.content || [{}] : [{}] )[0]
              const { TimeLine } = data
              const ids = 
                TimeLine
                  ? TimeLine
                      .filter((item: any) => item.IsCurrent === 0 )
                      .map((item: any) => item.ID )
                  : []
              historyIds = historyIds.concat(ids)
              _recursion()
            })
        })
      } else {
        TOAST.success(historyIds.length + ` history pano${historyIds.length>1?'s':''} found`, 4000)
        MAP.parent.setLoading(true)
        MAP.importPanosByIdList(historyIds)
      }
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